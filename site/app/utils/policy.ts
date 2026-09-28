import { createContentClient } from 'comark-content/client';

export function policySlug(path: string) {
  return path.split('/').pop() ?? path;
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
    description: 'Code written with the help of AI tools.',
  },
  {
    id: 'ai-text',
    label: 'AI-written text',
    description: 'Issues, descriptions, and comments written with AI.',
  },
  {
    id: 'ai-media',
    label: 'AI-generated media',
    description: 'Images, audio, video, and other media generated with AI.',
  },
  {
    id: 'agents',
    label: 'Agent submissions',
    description:
      'Agents and automated accounts opening issues, pull requests, or comments.',
  },
  {
    id: 'private-use',
    label: 'Private tooling',
    description: 'Whatever tools contributors use on their own machine.',
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
      'Issues, descriptions, and comments written by the contributor.',
  },
  {
    id: 'ownership',
    label: 'Full ownership',
    description:
      'Contributors test, understand, and take responsibility for every change themselves.',
  },
  {
    id: 'disclosure',
    label: 'AI disclosure',
    description:
      'Stating which AI tools were used and how much of the work they did.',
  },
  {
    id: 'provenance',
    label: 'Licensing rights',
    description:
      'Confirming the right to submit the work under the project’s license.',
  },
  {
    id: 'any-ai',
    label: 'Any AI assistance',
    description: 'Using AI tools for any part of a contribution.',
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
        .filter((file) => !policySlug(file.path).startsWith('_'))
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
