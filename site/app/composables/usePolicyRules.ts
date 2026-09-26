type RuleGroup = {
  type: RuleType;
  label: string;
  rules: Rule[];
};

type usePolicyRulesReturn = {
  policyRuleGroups: ComputedRef<RuleGroup[]>;
};

export function usePolicyRules(ruleIds: RulesByType): usePolicyRulesReturn {
  const policyRuleGroups = computed<RuleGroup[]>(() => {
    return ruleTypes.map(({ type, label }) => {
      return {
        type,
        label,
        rules: rules.filter((rule) => {
          return ruleIds[type]?.includes(rule.id);
        }),
      };
    });
  });

  return {
    policyRuleGroups,
  };
}
