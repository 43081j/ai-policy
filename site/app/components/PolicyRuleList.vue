<script setup lang="ts">
const props = defineProps<{
  rules: Rule['id'][];
}>();

const { policyRuleGroups } = usePolicyRules(props.rules);
</script>

<template>
  <dl class="grid gap-4 text-sm sm:(grid-cols-3 gap-6)">
    <div
      v-for="group in policyRuleGroups"
      :key="group.kind"
      :class="{ 'max-sm:hidden': !group.rules.length }"
    >
      <dt class="caption mb-2">{{ group.label }}</dt>
      <dd>
        <ul v-if="group.rules.length" class="grid gap-1.5">
          <li
            v-for="rule in group.rules"
            :key="rule.id"
            class="flex items-center gap-2"
            :title="rule.description"
          >
            <RuleIcon :kind="group.kind" small />
            {{ rule.label }}
          </li>
        </ul>
        <p v-else class="text-ui-faint">Nothing listed</p>
      </dd>
    </div>
  </dl>
</template>
