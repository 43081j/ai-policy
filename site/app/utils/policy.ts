import { createContentClient } from 'comark-content/client';

// Every policy shares the heading "AI Contribution Policy", so names come from
// the file name instead (e.g. "ai-allowed" -> "AI Allowed").
export function policyName(path: string) {
  return policySlug(path)
    .split('-')
    .map((word) =>
      word === 'ai' ? 'AI' : word[0]!.toUpperCase() + word.slice(1),
    )
    .join(' ');
}

export function policySlug(path: string) {
  return path.split('/').pop() ?? path;
}

export type RuleKind = 'permits' | 'requires' | 'forbids';

export interface Rule {
  id: string;
  kind: RuleKind;
  label: string;
  description: string;
}

export const ruleKinds: { kind: RuleKind; label: string }[] = [
  { kind: 'permits', label: 'Permits' },
  { kind: 'requires', label: 'Requires' },
  { kind: 'forbids', label: 'Forbids' },
];

export const rules: Rule[] = [
  {
    id: 'ai-code',
    kind: 'permits',
    label: 'AI-generated code',
    description: 'Code written with the help of AI tools is accepted.',
  },
  {
    id: 'ai-text',
    kind: 'permits',
    label: 'AI-written text',
    description: 'Issues, descriptions, and comments may be written with AI.',
  },
  {
    id: 'agents',
    kind: 'permits',
    label: 'Agent submissions',
    description: 'Agents may open issues and pull requests.',
  },
  {
    id: 'private-use',
    kind: 'permits',
    label: 'Private tooling',
    description: 'What contributors use on their own machine is not policed.',
  },
  {
    id: 'guidelines',
    kind: 'requires',
    label: 'Contribution guidelines',
    description: 'The project’s contribution guidelines must be followed.',
  },
  {
    id: 'human-authorship',
    kind: 'requires',
    label: 'Human authorship',
    description: 'Everything submitted must be written by the contributor.',
  },
  {
    id: 'ownership',
    kind: 'requires',
    label: 'Full ownership',
    description:
      'Contributors test, understand, and defend every change themselves.',
  },
  {
    id: 'abuse',
    kind: 'forbids',
    label: 'Spam and abuse',
    description: 'Spam, scams, and malicious content are not allowed.',
  },
  {
    id: 'any-ai',
    kind: 'forbids',
    label: 'Any AI assistance',
    description: 'No part of a contribution may be made with AI tools.',
  },
  {
    id: 'disclosure',
    kind: 'forbids',
    label: 'AI disclosure notes',
    description: 'Submissions must not carry notes about AI tools.',
  },
  {
    id: 'unverified',
    kind: 'forbids',
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
        .filter((file) => !policySlug(file.path).startsWith('_'))
        .map((file) => ({
          path: file.path,
          to: `/policies/${policySlug(file.path)}`,
          name: policyName(file.path),
          tagline: file.data.tagline ?? '',
          rules: (file.data.rules ?? []) as Rule['id'][],
        }))
        .toSorted((a, b) => a.name.localeCompare(b.name));
    },
    { default: () => [] },
  );
}
