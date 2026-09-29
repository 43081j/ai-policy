type QuizPolicy = {
  path: string;
  rules: RulesByType;
};

export type QuizQuestion = {
  rule: Rule;
  type: RuleType;
};

/** Fills "Should your policy ___ this?" for each rule type. */
export const quizVerbs: Record<RuleType, string> = {
  permits: 'permit',
  requires: 'require',
  forbids: 'forbid',
};

/** `null` means the question was skipped. */
export type QuizAnswer = boolean | null;

function takes(policy: QuizPolicy, { rule, type }: QuizQuestion) {
  return policy.rules[type]?.includes(rule.id) ?? false;
}

export function nextQuestion(
  candidates: QuizPolicy[],
  asked: Rule['id'][],
): QuizQuestion | undefined {
  const questions = rules
    .filter((rule) => !asked.includes(rule.id))
    .flatMap((rule) => ruleTypes.map(({ type }) => ({ rule, type })));

  let best: QuizQuestion | undefined;
  let bestImbalance = candidates.length;

  for (const question of questions) {
    const answersYes = candidates.filter((policy) => {
      return takes(policy, question);
    }).length;

    const imbalance = Math.abs(2 * answersYes - candidates.length);
    if (imbalance < bestImbalance) {
      best = question;
      bestImbalance = imbalance;
    }
  }

  return best;
}

export function filterCandidates<T extends QuizPolicy>(
  candidates: T[],
  question: QuizQuestion,
  answer: QuizAnswer,
): T[] {
  if (answer === null) {
    return candidates;
  }

  return candidates.filter((policy) => {
    return takes(policy, question) === answer;
  });
}
