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

export type RuleType = 'permits' | 'requires' | 'forbids';

export interface Rule {
  id: string;
  label: string;
  /**
   * What the rule covers, without taking a side. It is read after the rule
   * type ("Permits", "Requires", "Forbids") and in quiz questions such as
   * "Should your policy forbid this?", so keep it a neutral noun phrase.
   */
  description: string;
}

type RuleTypeDefinition = {
  type: RuleType;
  label: string;
};

export const ruleTypes: RuleTypeDefinition[] = [
  { type: 'permits', label: 'Permits' },
  { type: 'requires', label: 'Requires' },
  { type: 'forbids', label: 'Forbids' },
];

export type RulesByType = Partial<Record<RuleType, Rule['id'][]>>;

export const rules: Rule[] = [
  {
    id: 'ai-code',
    label: 'AI-generated code',
    description: 'Code written with the help of AI tools.',
  },
  {
    id: 'ai-text',
    label: 'AI-written text',
    description:
      'Issues, pull request descriptions, and comments written with AI.',
  },
  {
    id: 'ai-media',
    label: 'AI-generated media',
    description: 'Images, audio, video, and other media generated with AI.',
  },
  {
    id: 'agents',
    label: 'Agent submissions',
    description: 'Issues and pull requests opened by AI agents on their own.',
  },
  {
    id: 'private-use',
    label: 'Private tooling',
    description:
      'Any tools, AI or not, that contributors use on their own machine.',
  },
  {
    id: 'guidelines',
    label: 'Contribution guidelines',
    description: 'Following the project’s contribution guidelines.',
  },
  {
    id: 'human-authorship',
    label: 'Human authorship',
    description:
      'Issues, descriptions, and comments written by the contributor in their own words.',
  },
  {
    id: 'ownership',
    label: 'Full ownership',
    description:
      'Testing, understanding, and taking responsibility for every change.',
  },
  {
    id: 'any-ai',
    label: 'Any AI assistance',
    description: 'AI tools used for any part of a contribution.',
  },
  {
    id: 'ai-disclosure',
    label: 'AI disclosure notes',
    description: 'Notes in a submission about which AI tools were used.',
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
  {
    id: 'ai-coauthor',
    label: 'AI co-author credits',
    description: 'Commits and pull requests listing AI tools as co-authors.',
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
