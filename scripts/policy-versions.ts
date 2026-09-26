#!/usr/bin/env node
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

export const policiesDir = fileURLToPath(
  new URL('../policies', import.meta.url),
);
const versionsDir = join(policiesDir, 'versions');

const semverPattern = /^(\d+)\.(\d+)\.(\d+)$/;

export interface Policy {
  slug: string;
  file: string;
  source: string;
  version: string;
}

export function compareVersions(a: string, b: string): number {
  const [, ...partsA] = a.match(semverPattern) ?? [];
  const [, ...partsB] = b.match(semverPattern) ?? [];

  for (let i = 0; i < 3; i++) {
    const diff = Number(partsA[i]) - Number(partsB[i]);

    if (diff !== 0) {
      return diff;
    }
  }

  return 0;
}

function policyVersion(source: string, file = 'policy'): string {
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
  const version = frontmatter.match(
    /^version:\s*['"]?([^'"\s]+)['"]?\s*$/m,
  )?.[1];

  if (!version || !semverPattern.test(version)) {
    throw new Error(
      `${file}: expected a \`version\` (MAJOR.MINOR.PATCH) in the frontmatter`,
    );
  }

  return version;
}

/** Every published policy, skipping templates such as `_template.md`. */
export async function readPolicies(): Promise<Policy[]> {
  const entries = await readdir(policiesDir, { withFileTypes: true });
  const policies: Policy[] = [];

  for (const entry of entries) {
    if (
      !entry.isFile() ||
      !entry.name.endsWith('.md') ||
      entry.name.startsWith('_')
    ) {
      continue;
    }

    const file = `policies/${entry.name}`;
    const source = await readFile(join(policiesDir, entry.name), 'utf8');

    policies.push({
      slug: entry.name.slice(0, -'.md'.length),
      file,
      source,
      version: policyVersion(source, file),
    });
  }

  return policies;
}

/** Snapshotted versions of a policy, oldest first. */
export async function listVersions(slug: string): Promise<string[]> {
  try {
    const files = await readdir(join(versionsDir, slug));

    return files
      .map((file) => file.slice(0, -'.md'.length))
      .filter((version) => semverPattern.test(version))
      .toSorted(compareVersions);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }

    throw error;
  }
}

export function snapshotPath(slug: string, version: string): string {
  return join(versionsDir, slug, `${version}.md`);
}

async function readSnapshot(path: string): Promise<string | undefined> {
  try {
    return await readFile(path, 'utf8');
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return undefined;
    }

    throw error;
  }
}

/**
 * Writes the snapshot of each policy's current version. With `check`, nothing is
 * written. Returns the snapshots that were (or, with `check`, would be) written.
 */
export async function syncPolicyVersions({
  check = false,
}: { check?: boolean } = {}): Promise<string[]> {
  const changed: string[] = [];

  for (const { slug, file, source, version } of await readPolicies()) {
    const newest = (await listVersions(slug)).at(-1);

    if (newest && compareVersions(version, newest) < 0) {
      throw new Error(
        `${file}: version ${version} is older than the existing snapshot ${newest}. Versions must only go up.`,
      );
    }

    const snapshot = snapshotPath(slug, version);

    if ((await readSnapshot(snapshot)) === source) {
      continue;
    }

    changed.push(snapshot);

    if (!check) {
      await mkdir(dirname(snapshot), { recursive: true });
      await writeFile(snapshot, source);
    }
  }

  return changed;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const check = process.argv.includes('--check');
  const root = dirname(policiesDir);

  try {
    const changed = await syncPolicyVersions({ check });
    const files = changed.map((file) => `  ${relative(root, file)}`).join('\n');

    if (check && changed.length) {
      console.error(
        `Policy version snapshots are out of date:\n${files}\n\nRun \`npm run policies:snapshot\` and commit the result.`,
      );
      process.exitCode = 1;
    } else if (changed.length) {
      console.log(`Wrote policy version snapshots:\n${files}`);
    } else {
      console.log('Policy version snapshots are up to date.');
    }
  } catch (error) {
    console.error((error as Error).message);
    process.exitCode = 1;
  }
}
