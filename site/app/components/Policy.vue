<script setup lang="ts">
import { useClipboard } from '@vueuse/core';
import type { ContentFile } from 'comark-content';
import { MarkdownDocument } from '@comark/vue';
import { renderMarkdown } from 'comark/render';
import { policyFileName } from '~/shared/constants/policies';

const props = defineProps<{
  policy: ContentFile;
}>();

const { data: markdown } = await useAsyncData(
  `policy-markdown:${props.policy.path}`,
  () => renderMarkdown({ nodes: props.policy.nodes }),
  {
    default: () => '',
    watch: [() => props.policy.path],
  },
);

const downloadUrl = computed(() => {
  return `data:text/markdown;charset=utf-8,${encodeURIComponent(markdown.value)}`;
});

const policyTabs = ['preview', 'markdown'];
const selectedPolicyTab = ref<(typeof policyTabs)[number]>('preview');

const { copied, copy } = useClipboard({
  source: markdown,
});
</script>

<template>
  <div class="min-w-0 rounded-xl border border-ui-border bg-ui-surface">
    <div
      class="sticky top-0 z-1 flex flex-wrap items-center justify-between gap-3 rounded-t-xl border-b border-ui-border bg-ui-surface/88 py-2.5 pr-2.5 pl-3 backdrop-blur-sm"
    >
      <Tabs :tabs="policyTabs" v-model:selected="selectedPolicyTab" />

      <div class="flex gap-2">
        <a
          :href="downloadUrl"
          :download="policyFileName"
          class="btn flex items-center"
          aria-label="Download"
        >
          <span class="i-lucide:download sm:hidden"></span>
          <span class="hidden sm:block">Download</span>
        </a>

        <button
          class="btn btn-primary flex items-center"
          :aria-label="copied ? 'Copied' : 'Copy'"
          @click="copy(markdown)"
        >
          <span
            class="sm:hidden"
            :class="copied ? 'i-lucide:check' : 'i-lucide:copy'"
          ></span>
          <span class="hidden sm:block">
            {{ copied ? 'Copied!' : 'Copy' }}
          </span>
        </button>
      </div>
    </div>

    <MarkdownDocument
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

.policy-prose :deep(a) {
  @apply underline;
}
</style>
