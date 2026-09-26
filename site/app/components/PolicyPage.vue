<script setup lang="ts">
import { policyFileName } from '~/shared/constants/policies';

const props = defineProps<{
  slug: string;
  version?: string;
}>();

const { data } = await usePolicy(props.slug, props.version);

if (!data.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Policy not found',
    fatal: true,
  });
}

const { policy, path, version: activeVersion, versions } = data.value;
const name = policy.data.name;
const latestVersion = versions[0] ?? activeVersion;
const isLatest = activeVersion === latestVersion;

useSeoMeta({
  title: isLatest
    ? `${name} · AI Contribution Policies`
    : `${name} (${activeVersion}) · AI Contribution Policies`,
  description: policy.data.tagline,
});

defineOgImage('Policy', {
  title: name,
  description: policy.data.tagline,
});
</script>

<template>
  <article>
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
      <p class="mt-4 font-mono text-xs text-ui-muted">
        Version
        <NuxtLink
          :to="policyPermalink(slug, activeVersion)"
          class="text-ui-text"
        >
          {{ activeVersion }}
        </NuxtLink>
        <template v-if="policy.data.created">
          <span aria-hidden="true"> · </span>
          Created
          <NuxtTime :datetime="policy.data.created" date-style="medium" />
        </template>
        <template v-if="policy.data.updated">
          <span aria-hidden="true"> · </span>
          Updated
          <NuxtTime :datetime="policy.data.updated" date-style="medium" />
        </template>
      </p>
    </header>

    <p
      v-if="!isLatest"
      role="note"
      class="mb-10 rounded-xl border border-ui-border bg-ui-surface px-5 py-4 text-sm"
    >
      You are viewing version {{ activeVersion }} of this policy. The latest
      version is {{ latestVersion }}.
      <NuxtLink :to="`/policies/${slug}`">View the latest version</NuxtLink>
    </p>

    <PolicyRules :rules="policy.data.rules" />

    <div
      class="mt-10 grid gap-10 lg:(grid-cols-[minmax(0,1fr)_260px] items-start gap-12)"
    >
      <Policy :policy :slug :version="activeVersion" />

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
        <div v-if="versions.length">
          <h2 class="caption mb-2.5">Versions</h2>
          <ul class="grid gap-1.5 font-mono text-xs">
            <li v-for="v in versions" :key="v" class="flex gap-2">
              <NuxtLink
                :to="policyPermalink(slug, v)"
                :aria-current="v === activeVersion ? 'page' : undefined"
                :class="
                  v === activeVersion
                    ? 'text-ui-text no-underline'
                    : 'text-ui-muted hover:text-ui-text'
                "
              >
                {{ v }}
              </NuxtLink>
              <span v-if="v === latestVersion" class="text-ui-faint">
                latest
              </span>
              <NuxtLink
                :href="policyReleaseUrl(slug, v)"
                class="ml-auto text-ui-muted hover:text-ui-text"
                target="_blank"
                external
              >
                Changes <span aria-hidden="true">↗</span>
                <span class="sr-only">in version {{ v }}</span>
              </NuxtLink>
            </li>
          </ul>
        </div>
        <NuxtLink
          :href="`https://github.com/43081j/ai-policy/blob/main/policies${path}.md`"
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
