<script setup lang="ts">
import { useClipboard } from '@vueuse/core';
import PolicyRules from '~/components/PolicyRules.vue';

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
const markdown = policyMarkdown(policy.value.rawbody);
const downloadUrl = `data:text/markdown;charset=utf-8,${encodeURIComponent(markdown)}`;

const sourceUrl = `https://github.com/43081j/ai-policy/blob/main${path}.md`;
const fileName = 'AI_POLICY.md';

const policyTabs = ['preview', 'markdown'];
const selectedPolicyTab = ref<(typeof policyTabs)[number]>('preview');

const { copied, copy } = useClipboard({
  source: markdown,
});

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
      <div class="min-w-0 rounded-xl border border-ui-border bg-ui-surface">
        <div
          class="sticky top-0 z-1 flex flex-wrap items-center justify-between gap-3 rounded-t-xl border-b border-ui-border bg-ui-surface/88 py-2.5 pr-2.5 pl-3 backdrop-blur-sm"
        >
          <Tabs :tabs="policyTabs" v-model:selected="selectedPolicyTab" />

          <div class="flex gap-2">
            <a :href="downloadUrl" download="AI_POLICY.md" class="btn">
              Download
            </a>
            <button class="btn btn-primary" @click="copy(markdown)">
              {{ copied ? 'Copied!' : 'Copy' }}
            </button>
          </div>
        </div>

        <ContentRenderer
          v-if="selectedPolicyTab === 'preview'"
          :value="policy"
          class="policy-prose"
        />

        <pre
          v-else
          class="overflow-x-auto whitespace-pre-wrap px-6 py-7 font-mono text-sm leading-relaxed wrap-anywhere"
          v-text="markdown"
        />

        <span class="sr-only" aria-live="polite">
          {{ copied ? 'Policy copied to clipboard' : '' }}
        </span>
      </div>

      <aside class="grid gap-8 text-sm lg:(sticky top-6)">
        <div>
          <h2 class="caption mb-2.5">How to apply</h2>
          <ol
            class="grid list-decimal gap-2.5 pl-5 marker:(font-mono text-sm text-ui-muted)"
          >
            <li>Copy or download the policy text.</li>
            <li>Save it as {{ fileName }} at the root of your repository.</li>
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
          :href="sourceUrl"
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

<style scoped>
.policy-prose {
  @apply px-6 pt-7 pb-8 sm:px-11 sm:pt-9 sm:pb-11;
}

.policy-prose > :deep(:first-child) {
  @apply mt-0;
}

.policy-prose > :deep(:last-child) {
  @apply mb-0;
}

.policy-prose :deep(h1) {
  @apply mb-5 text-2xl font-semibold leading-tight tracking-tight text-balance;
}

.policy-prose :deep(h2) {
  @apply mt-9 mb-3 text-lg font-semibold tracking-tight text-balance;
}

.policy-prose :deep(:is(h1, h2) a) {
  @apply no-underline;
}

.policy-prose :deep(p) {
  @apply my-4 text-pretty;
}

.policy-prose :deep(ul) {
  @apply my-4 list-disc pl-5;
}

.policy-prose :deep(li) {
  @apply text-pretty;
}

.policy-prose :deep(li + li) {
  @apply mt-1.5;
}

.policy-prose :deep(li::marker) {
  @apply text-ui-faint;
}
</style>
