<script setup lang="ts">
const props = defineProps<{
  rules: Rule['id'][];
}>();

const { policyRuleGroups } = usePolicyRules(props.rules);
</script>

<template>
  <ul class="flex flex-wrap gap-1.5" aria-label="Rules">
    <template v-for="group in policyRuleGroups" :key="group.kind">
      <li
        v-for="rule in group.rules"
        :key="rule.id"
        class="inline-flex items-center gap-1.5 rounded-full border border-transparent bg-ui-surface-2 py-0.5 pr-2.5 pl-1 text-xs text-ui-muted"
        :title="rule.description"
      >
        <RuleIcon :kind="group.kind" small />
        <span class="sr-only">{{ group.kind }}:</span>
        {{ rule.label }}
      </li>
    </template>
  </ul>
</template>
