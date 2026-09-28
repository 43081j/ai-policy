export interface QuizPolicy {
  path: string;
  rules: RulesByType;
}

export interface QuizQuestion extends RuleQuestion {
  ruleId: Rule['id'];
}

// A policy answers "yes" to a rule when it permits or requires it.
function isYes(policy: QuizPolicy, ruleId: Rule['id']) {
  return (
    (policy.rules.permits?.includes(ruleId) ||
      policy.rules.requires?.includes(ruleId)) ??
    false
  );
}

export function questionFor(rule: Rule): QuizQuestion {
  return {
    ruleId: rule.id,
    title: rule.question?.title ?? rule.label,
    detail: rule.question?.detail ?? rule.description,
    yes: rule.question?.yes ?? 'Yes',
    no: rule.question?.no ?? 'No',
  };
}

/**
 * Picks the rule that splits the candidates most evenly. Rules all
 * candidates agree on are skipped, so every answer narrows the list.
 */
export function nextQuestion(
  candidates: QuizPolicy[],
  asked: Rule['id'][],
): QuizQuestion | undefined {
  let best: { rule: Rule; imbalance: number } | undefined;

  for (const rule of rules) {
    if (asked.includes(rule.id)) continue;

    const yes = candidates.filter((policy) => isYes(policy, rule.id)).length;
    const no = candidates.length - yes;
    if (yes === 0 || no === 0) continue;

    const imbalance = Math.abs(yes - no);
    if (!best || imbalance < best.imbalance) best = { rule, imbalance };
  }

  return best && questionFor(best.rule);
}

export function filterCandidates<T extends QuizPolicy>(
  candidates: T[],
  ruleId: Rule['id'],
  answer: boolean,
): T[] {
  return candidates.filter((policy) => isYes(policy, ruleId) === answer);
}
