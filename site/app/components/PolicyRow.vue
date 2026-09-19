<script setup lang="ts">
const props = defineProps<{
  name: string;
  path: string;
  tagline: string;
  rules: Rule['id'][];
}>();

const { policyRuleGroups } = usePolicyRules(props.rules);
</script>

<template>
  <article
    class="group relative grid gap-4 border-b border-ui-border py-6 md:(grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))] gap-6)"
  >
    <div>
      <h3 class="text-lg font-semibold tracking-tight text-balance">
        <NuxtLink
          :to="path"
          class="no-underline group-hover:underline after:(absolute inset-0 content-[''])"
        >
          {{ name }}
        </NuxtLink>
      </h3>
      <p class="mt-1 text-ui-muted text-pretty">{{ tagline }}</p>
    </div>

    <dl class="contents">
      <div
        v-for="group in policyRuleGroups"
        :key="group.kind"
        :class="{ 'max-md:hidden': !group.rules.length }"
      >
        <dt class="caption mb-2 md:sr-only">{{ group.label }}</dt>
        <dd>
          <ul v-if="group.rules.length" class="grid gap-1.5 text-sm">
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
          <p v-else class="text-sm text-ui-faint">None</p>
        </dd>
      </div>
    </dl>
  </article>
</template>
