<script setup lang="ts">
const props = defineProps<{
  rules: Rule['id'][];
}>();

const { policyRuleGroups } = usePolicyRules(props.rules);
</script>

<template>
  <section
    class="grid gap-px overflow-hidden rounded-xl border border-ui-border bg-ui-border md:grid-cols-3"
    aria-label="At a glance"
  >
    <div
      v-for="group in policyRuleGroups"
      :key="group.kind"
      class="bg-ui-surface px-6 pt-5 pb-6"
    >
      <h2 class="caption mb-3.5">{{ group.label }}</h2>
      <ul v-if="group.rules.length" class="grid gap-3">
        <li
          v-for="rule in group.rules"
          class="flex gap-2.5 text-sm"
          :title="rule.description"
        >
          <RuleIcon :kind="group.kind" />
          <span>
            <span class="block font-medium">{{ rule.label }}</span>
            <span class="block text-ui-muted">{{ rule.description }}</span>
          </span>
        </li>
      </ul>
      <p v-else class="text-sm text-ui-faint">Nothing listed</p>
    </div>
  </section>
</template>
