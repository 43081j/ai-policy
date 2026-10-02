#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import {
  compareVersions,
  listVersions,
  type Policy,
  policiesDir,
  readPolicies,
  snapshotPath,
} from './policy-versions.ts';

const siteUrl = 'https://ai-policy.dev';
const root = dirname(policiesDir);
const dryRun = process.argv.includes('--dry-run');
const tempDir = await mkdtemp(join(tmpdir(), 'policy-release-'));

function run(
  command: string,
  args: string[],
  { allowFailure = false }: { allowFailure?: boolean } = {},
): string {
  const result = spawnSync(command, args, { cwd: root, encoding: 'utf8' });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0 && !allowFailure) {
    throw new Error(
      `\`${command} ${args.join(' ')}\` failed:\n${result.stderr.trim()}`,
    );
  }

  return result.stdout;
}

function tagName(slug: string, version: string): string {
  return `${slug}@${version}`;
}

function policyName(source: string): string {
  return (
    source
      .match(/^name:\s*(.+)$/m)?.[1]
      ?.trim()
      .replace(/^(['"])(.*)\1$/, '$2') ?? ''
  );
}

function withoutReleaseFields(source: string): string {
  return source.replace(/^---\r?\n[\s\S]*?\r?\n---/, (frontmatter) =>
    frontmatter.replace(/^(version|updated):.*\r?\n/gm, ''),
  );
}

async function markdownDiff(before: string, after: string): Promise<string> {
  const fileBefore = join(tempDir, 'before.md');
  const fileAfter = join(tempDir, 'after.md');

  await writeFile(fileBefore, withoutReleaseFields(before));
  await writeFile(fileAfter, withoutReleaseFields(after));

  const diff = run(
    'git',
    ['diff', '--no-index', '--no-color', fileBefore, fileAfter],
    // `git diff --no-index` exits with 1 when the files differ.
    { allowFailure: true },
  );

  return diff.includes('\n@@')
    ? diff.slice(diff.indexOf('\n@@') + 1).trimEnd()
    : '';
}

async function releaseNotes(
  { slug, file, version }: Policy,
  previous: string | undefined,
): Promise<string> {
  const permalink = `${siteUrl}/policies/${slug}/${version}`;
  const notes = [`Permalink: ${permalink}`];

  if (!previous) {
    notes.push('', 'First release of this policy.');
    return notes.join('\n');
  }

  const before = await readFile(snapshotPath(slug, previous), 'utf8');
  const after = await readFile(snapshotPath(slug, version), 'utf8');
  const diff = await markdownDiff(before, after);

  notes.push(
    '',
    `## Changes since ${previous}`,
    '',
    ...(diff ? ['```diff', diff, '```'] : ['The policy text did not change.']),
    '',
  );

  const commits = run('git', [
    'log',
    '--format=- %s (%h)',
    `${tagName(slug, previous)}..HEAD`,
    '--',
    file,
  ]).trim();

  if (commits) {
    notes.push('## Commits', '', commits);
  }

  return notes.join('\n');
}

const tags = new Set(run('git', ['tag', '--list']).split('\n'));
const head = run('git', ['rev-parse', 'HEAD']).trim();

for (const policy of await readPolicies()) {
  const { slug, version } = policy;
  const tag = tagName(slug, version);

  if (tags.has(tag)) {
    continue;
  }

  const previous = (await listVersions(slug))
    .filter((v) => compareVersions(v, version) < 0)
    .findLast((v) => tags.has(tagName(slug, v)));
  const notes = await releaseNotes(policy, previous);
  const title = `${policyName(await readFile(snapshotPath(slug, version), 'utf8'))} ${version}`;

  if (dryRun) {
    console.log(`# ${tag}: ${title}\n\n${notes}\n`);
    continue;
  }

  const notesFile = join(tempDir, `${slug}.md`);
  await writeFile(notesFile, notes);

  run('gh', [
    'release',
    'create',
    tag,
    '--target',
    head,
    '--title',
    title,
    '--notes-file',
    notesFile,
    '--latest=false',
  ]);
  console.log(`Released ${tag}`);
}
