type RuleGroup = {
  kind: RuleKind;
  label: string;
  rules: Rule[];
};

type usePolicyRulesReturn = {
  policyRuleGroups: ComputedRef<RuleGroup[]>;
};

export function usePolicyRules(ruleIds: Rule['id'][]): usePolicyRulesReturn {
  const policyRuleGroups = computed<RuleGroup[]>(() => {
    return ruleKinds.map(({ kind, label }) => {
      return {
        kind,
        label,
        rules: rules.filter((rule) => {
          return rule.kind === kind && ruleIds.includes(rule.id);
        }),
      };
    });
  });

  return {
    policyRuleGroups,
  };
}
