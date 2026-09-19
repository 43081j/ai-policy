<script setup lang="ts">
import { policyFileName } from '~/shared/constants/policies';

const route = useRoute();
const path = `/policies/${route.params.slug}`;

const { data: policy } = await useAsyncData(path, () =>
  queryCollection('policies').path(path).first(),
);

if (!policy.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Policy not found',
    fatal: true,
  });
}

const { data: others } = await useAsyncData(
  'policies-nav',
  () => queryCollection('policies').select('path').all(),
  {
    default: () => [],
  },
);

const otherPolicies = computed(() => {
  return others.value.filter((item) => item.path !== path);
});

const name = policyName(path);

useSeoMeta({
  title: `${name} · AI Contribution Policies`,
  description: policy.value.tagline,
});
</script>

<template>
  <article v-if="policy">
    <NuxtLink
      to="/"
      class="mt-8 inline-block text-sm text-ui-muted no-underline hover:text-ui-text"
    >
      <span aria-hidden="true">←</span> All policies
    </NuxtLink>

    <header class="py-10">
      <h1
        class="mt-4 mb-5 text-4xl sm:text-5xl font-semibold tracking-tight text-balance"
      >
        {{ name }}
      </h1>
      <p class="max-w-xl text-lg text-pretty text-ui-muted">
        {{ policy.tagline }}
      </p>
    </header>

    <PolicyRules :rules="policy.rules" />

    <div
      class="mt-10 grid gap-10 lg:(grid-cols-[minmax(0,1fr)_260px] items-start gap-12)"
    >
      <Policy :policy />

      <aside class="grid gap-8 text-sm lg:(sticky top-6)">
        <div>
          <h2 class="caption mb-2.5">How to apply</h2>
          <ol
            class="grid list-decimal gap-2.5 pl-5 marker:(font-mono text-sm text-ui-muted)"
          >
            <li>Copy or download the policy text.</li>
            <li>
              Save it as {{ policyFileName }} at the root of your repository.
            </li>
            <li>
              Link to it from CONTRIBUTING.md and your pull request template.
            </li>
          </ol>
        </div>
        <div>
          <h2 class="caption mb-2.5">Enforcement</h2>
          <p>{{ policy.enforcement }}</p>
        </div>
        <div>
          <h2 class="caption mb-2.5">Other policies</h2>
          <ul class="grid gap-1.5">
            <li v-for="other in otherPolicies" :key="other.path">
              <NuxtLink :to="other.path">{{ policyName(other.path) }}</NuxtLink>
            </li>
          </ul>
        </div>
        <NuxtLink
          :href="`https://github.com/43081j/ai-policy/blob/main${path}.md`"
          class="text-sm text-ui-muted"
          target="_blank"
          external
        >
          View source on GitHub <span aria-hidden="true">↗</span>
        </NuxtLink>
      </aside>
    </div>
  </article>
</template>
