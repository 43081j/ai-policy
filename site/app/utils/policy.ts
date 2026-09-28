import { createContentClient } from 'comark-content/client';

export function policySlug(path: string) {
  return path.split('/').pop() ?? path;
}

export type RuleType = 'permits' | 'requires' | 'forbids';

export interface RuleQuestion {
  title: string;
  detail: string;
  yes: string;
  no: string;
}

export interface Rule {
  id: string;
  label: string;
  description: string;
  /** Quiz wording. Falls back to the description when omitted. */
  question?: RuleQuestion;
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
    question: {
      title: 'Can they submit AI-generated code?',
      detail:
        'Assume the contributor understands, tests, and takes responsibility for the code before submitting it.',
      yes: 'Yes, if they understand it',
      no: 'No, the submitted code must be their own',
    },
  },
  {
    id: 'ai-text',
    label: 'AI-written text',
    description: 'Issues, descriptions, and comments may be written with AI.',
    question: {
      title: 'Can AI write their public messages?',
      detail:
        'This includes issue reports, pull request descriptions, comments, and replies to review.',
      yes: 'Yes, AI-written messages are welcome',
      no: 'No, contributors should write in their own words',
    },
  },
  {
    id: 'agents',
    label: 'Agent submissions',
    description: 'Agents may open issues and pull requests.',
    question: {
      title: 'Can agents submit directly?',
      detail:
        'An agent could open an issue or pull request without a person writing and posting each action.',
      yes: 'Yes, agents may submit',
      no: 'No, a person must submit',
    },
  },
  {
    id: 'private-use',
    label: 'Private tooling',
    description: 'What contributors use on their own machine is not policed.',
    question: {
      title: 'Can contributors use AI privately?',
      detail:
        'Think of research, brainstorming, or drafting on their own machine, even when the submitted work must be their own.',
      yes: 'Yes, private use is their business',
      no: 'No, contributions must involve no AI assistance',
    },
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
