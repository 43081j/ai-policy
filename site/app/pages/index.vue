<script setup lang="ts">
import { policyFileName } from '~/shared/constants/policies';

const { data } = await useAsyncData(
  'policies',
  () => queryCollection('policies').select('path', 'tagline', 'rules').all(),
  {
    default: () => [],
  },
);

const policies = computed(() => {
  return data.value
    .map((policy) => ({ ...policy, name: policyName(policy.path) }))
    .toSorted((a, b) => a.name.localeCompare(b.name));
});
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

      <div
        class="flex flex-wrap justify-between gap-x-6 gap-y-1 border-b border-ui-border pb-3 font-mono text-xs text-ui-muted"
      >
        <p>
          {{ policies.length }}
          {{ policies.length === 1 ? 'policy' : 'policies' }}
        </p>
      </div>

      <ul>
        <li
          v-for="policy in policies"
          :key="policy.path"
          class="group relative border-b border-ui-border py-6"
        >
          <h3 class="text-xl font-semibold tracking-tight text-balance">
            <NuxtLink
              :to="policy.path"
              class="no-underline group-hover:underline after:(absolute inset-0 content-[''])"
            >
              {{ policy.name }}
            </NuxtLink>
          </h3>
          <p class="mt-1.5 mb-5 max-w-2xl text-ui-muted text-pretty">
            {{ policy.tagline }}
          </p>
          <PolicyRuleList :rules="policy.rules" />
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
          <span class="font-mono text-xs text-ui-muted" aria-hidden="true">
            01
          </span>
          <h3 class="mt-2 mb-1.5 text-lg font-semibold tracking-tight">
            Choose
          </h3>
          <p class="text-ui-muted">
            Compare the rules each policy sets and pick the one that fits.
          </p>
        </li>
        <li class="border-t border-ui-text pt-5">
          <span class="font-mono text-xs text-ui-muted" aria-hidden="true">
            02
          </span>
          <h3 class="mt-2 mb-1.5 text-lg font-semibold tracking-tight">Copy</h3>
          <p class="text-ui-muted">
            Copy or download the Markdown and save it as {{ policyFileName }} in
            your repository.
          </p>
        </li>
        <li class="border-t border-ui-text pt-5">
          <span class="font-mono text-xs text-ui-muted" aria-hidden="true">
            03
          </span>
          <h3 class="mt-2 mb-1.5 text-lg font-semibold tracking-tight">Link</h3>
          <p class="text-ui-muted">
            Reference it from your CONTRIBUTING.md and pull request template.
          </p>
        </li>
      </ol>
    </section>
  </div>
</template>
