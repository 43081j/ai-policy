<script setup lang="ts">
import { policyFileName } from '~/shared/constants/policies';

const { data: policies } = await usePolicies();
</script>

<template>
  <div>
    <section class="pt-16">
      <h1
        class="mb-5 text-4xl sm:text-5xl font-semibold tracking-tight text-balance"
      >
        Your project, your rules.
      </h1>
      <div class="max-w-xl text-lg text-pretty text-ui-muted">
        A community collection of ready-made contribution policies. Whether you
        welcome AI contributions, want everything written by humans, or
        something in between.
      </div>
    </section>

    <section class="mt-14" aria-labelledby="policies-heading">
      <h2 id="policies-heading" class="sr-only">Policies</h2>

      <div
        class="grid gap-6 border-b border-ui-border pb-3 font-mono text-xs text-ui-muted md:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))]"
      >
        <p>
          {{ policies.length }}
          {{ policies.length === 1 ? 'policy' : 'policies' }}
        </p>
        <p
          v-for="{ type, label } in ruleTypes"
          :key="type"
          class="caption max-md:hidden"
          aria-hidden="true"
        >
          {{ label }}
        </p>
      </div>

      <ul>
        <li v-for="policy in policies" :key="policy.path">
          <PolicyRow
            :name="policy.name"
            :to="policy.to"
            :tagline="policy.tagline"
            :rules="policy.rules"
          />
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
