<script setup lang="ts">
const { data } = await useAsyncData('policies', () =>
  queryCollection('policies').select('path', 'tagline', 'rules').all(),
);

const policies = computed(() =>
  (data.value ?? [])
    .map((policy) => ({ ...policy, name: policyName(policy.path) }))
    .sort((a, b) => a.name.localeCompare(b.name)),
);
</script>

<template>
  <div>
    <section class="pt-16">
      <p class="mb-4 font-mono text-xs tracking-wide text-ui-muted">
        For open source maintainers
      </p>
      <h1
        class="mb-5 text-4xl sm:text-5xl font-semibold tracking-tight text-balance"
      >
        Say how your project handles&nbsp;AI.
      </h1>
      <p class="max-w-xl text-lg text-pretty text-ui-muted">
        Drop-in contribution policies, from fully open to strictly human. Find
        the one that fits, copy it into your repository, and point contributors
        to it.
      </p>
    </section>

    <section class="mt-14" aria-labelledby="policies-heading">
      <h2 id="policies-heading" class="sr-only">Policies</h2>

      <p class="border-b border-ui-border pb-3 font-mono text-xs text-ui-muted">
        {{ policies.length }}
        {{ policies.length === 1 ? 'policy' : 'policies' }}
      </p>

      <ul>
        <li
          v-for="policy in policies"
          :key="policy.path"
          class="group relative border-b border-ui-border py-6"
        >
          <h3 class="text-xl font-semibold tracking-tight text-balance">
            <!-- The ::after overlay makes the whole row clickable. -->
            <NuxtLink
              :to="policy.path"
              class="no-underline group-hover:underline after:(absolute inset-0 content-[''])"
              >{{ policy.name }}</NuxtLink
            >
          </h3>
          <p class="mt-1.5 mb-3.5 max-w-2xl text-ui-muted">
            {{ policy.tagline }}
          </p>
          <ul class="flex flex-wrap gap-1.5" aria-label="Rules">
            <template v-for="{ kind } in ruleKinds" :key="kind">
              <li
                v-for="rule in policyRules(policy.rules, kind)"
                :key="rule.id"
                class="inline-flex items-center gap-1.5 rounded-full border border-transparent bg-ui-surface-2 py-0.5 pr-2.5 pl-1 text-xs text-ui-muted"
                :title="rule.description"
              >
                <RuleIcon :kind="kind" small />
                <span class="sr-only">{{ kind }}:</span>
                {{ rule.label }}
              </li>
            </template>
          </ul>
        </li>
      </ul>
    </section>

    <section aria-labelledby="howto-heading">
      <h2
        id="howto-heading"
        class="mt-24 mb-2 text-2xl font-semibold tracking-tight text-balance"
      >
        How to use a policy
      </h2>
      <ol class="mt-6 grid gap-8 md:grid-cols-3">
        <li class="border-t border-ui-text pt-5">
          <span class="font-mono text-xs text-ui-muted" aria-hidden="true"
            >01</span
          >
          <h3 class="mt-2 mb-1.5 text-lg font-semibold tracking-tight">
            Choose
          </h3>
          <p class="text-ui-muted">
            Compare the rules each policy sets and pick the one that fits.
          </p>
        </li>
        <li class="border-t border-ui-text pt-5">
          <span class="font-mono text-xs text-ui-muted" aria-hidden="true"
            >02</span
          >
          <h3 class="mt-2 mb-1.5 text-lg font-semibold tracking-tight">Copy</h3>
          <p class="text-ui-muted">
            Copy or download the Markdown and save it as
            <code>AI_POLICY.md</code> in your repository.
          </p>
        </li>
        <li class="border-t border-ui-text pt-5">
          <span class="font-mono text-xs text-ui-muted" aria-hidden="true"
            >03</span
          >
          <h3 class="mt-2 mb-1.5 text-lg font-semibold tracking-tight">Link</h3>
          <p class="text-ui-muted">
            Reference it from your <code>CONTRIBUTING.md</code> and pull request
            template.
          </p>
        </li>
      </ol>
    </section>
  </div>
</template>
