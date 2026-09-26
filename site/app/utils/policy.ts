import { createContentClient } from 'comark-content/client';

export function policySlug(path: string) {
  return path.split('/').pop() ?? path;
}

export function policyVersionPath(slug: string, version: string) {
  return `/versions/${slug}/${version}`;
}

export function policyPermalink(slug: string, version: string) {
  return `/policies/${slug}/${version}`;
}

export function policyReleaseUrl(slug: string, version: string) {
  return `https://github.com/43081j/ai-policy/releases/tag/${encodeURIComponent(`${slug}@${version}`)}`;
}

function compareVersions(a: string, b: string) {
  const partsA = a.split('.').map(Number);
  const partsB = b.split('.').map(Number);

  return partsA.map((part, i) => part - (partsB[i] ?? 0)).find(Boolean) ?? 0;
}

export type RuleType = 'permits' | 'requires' | 'forbids';

export interface Rule {
  id: string;
  label: string;
  description: string;
}

export const ruleTypes: { type: RuleType; label: string }[] = [
  { type: 'permits', label: 'Permits' },
  { type: 'requires', label: 'Requires' },
  { type: 'forbids', label: 'Forbids' },
];

export type RulesByType = Partial<Record<RuleType, Rule['id'][]>>;

export const rules: Rule[] = [
  {
    id: 'ai-code',
    label: 'AI-generated code',
    description: 'Code written with the help of AI tools is accepted.',
  },
  {
    id: 'ai-text',
    label: 'AI-written text',
    description: 'Issues, descriptions, and comments may be written with AI.',
  },
  {
    id: 'agents',
    label: 'Agent submissions',
    description: 'Agents may open issues and pull requests.',
  },
  {
    id: 'private-use',
    label: 'Private tooling',
    description: 'What contributors use on their own machine is not policed.',
  },
  {
    id: 'guidelines',
    label: 'Contribution guidelines',
    description: 'The project’s contribution guidelines must be followed.',
  },
  {
    id: 'human-authorship',
    label: 'Human authorship',
    description:
      'Issues, descriptions, and comments must be written by the contributor.',
  },
  {
    id: 'ownership',
    label: 'Full ownership',
    description:
      'Contributors test, understand, and take responsibility for every change themselves.',
  },
  {
    id: 'any-ai',
    label: 'Any AI assistance',
    description: 'No part of a contribution may be made with AI tools.',
  },
  {
    id: 'ai-disclosure',
    label: 'AI disclosure notes',
    description: 'Submissions must not carry notes about AI tools.',
  },
  {
    id: 'raw-ai-output',
    label: 'Unreviewed AI output',
    description:
      'AI output submitted as-is, without the contributor’s own understanding or words.',
  },
  {
    id: 'unverified',
    label: 'Unreproduced reports',
    description:
      'Reports and fixes for problems the contributor has not reproduced.',
  },
];

export const clientContent = createContentClient({
  fetch: $fetch,
});

export function usePolicies() {
  return useAsyncData(
    'policies',
    async () => {
      const files = await clientContent.list();

      return files
        .filter(
          (file) =>
            !file.path.startsWith('/versions/') &&
            !policySlug(file.path).startsWith('_'),
        )
        .map((file) => ({
          path: file.path,
          to: `/policies/${policySlug(file.path)}`,
          name: file.data.name,
          tagline: file.data.tagline ?? '',
          rules: (file.data.rules ?? {}) as RulesByType,
        }))
        .toSorted(
          (a, b) =>
            (b.rules.permits?.length ?? 0) - (a.rules.permits?.length ?? 0) ||
            (a.rules.forbids?.length ?? 0) - (b.rules.forbids?.length ?? 0) ||
            a.name.localeCompare(b.name),
        );
    },
    { default: () => [] },
  );
}

export function usePolicy(slug: string, version?: string) {
  const path = version ? policyVersionPath(slug, version) : `/${slug}`;

  return useAsyncData(`policy:${path}`, async () => {
    const [policy, files] = await Promise.all([
      clientContent.get(path),
      clientContent.list(),
    ]);

    if (!policy) {
      return null;
    }

    const versionsPrefix = policyVersionPath(slug, '');
    const versions = files
      .filter((file) => file.path.startsWith(versionsPrefix))
      .map((file) => policySlug(file.path))
      .toSorted((a, b) => compareVersions(b, a));

    return {
      policy,
      path,
      version: version ?? policy.data.version,
      versions,
    };
  });
}
