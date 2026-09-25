<script setup lang="ts">
import { policyFileName } from '~/shared/constants/policies';
import { clientContent } from '~/utils/policy';

const route = useRoute();
const path = `/${route.params.slug}`;

const { data: policy } = await useAsyncData(path, () => {
  return clientContent.get(path);
});

if (!policy.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Policy not found',
    fatal: true,
  });
}

const name = policy.value.data.name;

useSeoMeta({
  title: `${name} · AI Contribution Policies`,
  description: policy.value.data.tagline,
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
        {{ policy.data.tagline }}
      </p>
      <p
        v-if="policy.data.created || policy.data.updated"
        class="mt-4 font-mono text-xs text-ui-muted"
      >
        <template v-if="policy.data.created">
          Created
          <NuxtTime :datetime="policy.data.created" date-style="medium" />
        </template>
        <span
          v-if="policy.data.created && policy.data.updated"
          aria-hidden="true"
        >
          ·
        </span>
        <template v-if="policy.data.updated">
          Updated
          <NuxtTime :datetime="policy.data.updated" date-style="medium" />
        </template>
      </p>
    </header>

    <PolicyRules :rules="policy.data.rules" />

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
