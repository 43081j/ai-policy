<script setup lang="ts">
const route = useRoute()
const path = `/policies/${route.params.slug}`

const { data: policy } = await useAsyncData(path, () =>
  queryCollection('policies').path(path).first(),
)

if (!policy.value) {
  throw createError({ statusCode: 404, statusMessage: 'Policy not found', fatal: true })
}

const { data: others } = await useAsyncData('policies-nav', () =>
  queryCollection('policies').select('path').all(),
)

const name = policyName(path)
const markdown = policyMarkdown(policy.value.rawbody)
useSeoMeta({ title: `${name} · AI Contribution Policies`, description: policy.value.tagline })

const sourceUrl = `https://github.com/43081j/ai-policy/blob/main${path}.md`
const fileName = 'AI_POLICY.md'

const view = ref<'preview' | 'markdown'>('preview')
const copyState = ref<'idle' | 'copied' | 'failed'>('idle')
let resetTimer: ReturnType<typeof setTimeout> | undefined

async function copy() {
  try {
    await navigator.clipboard.writeText(markdown)
    copyState.value = 'copied'
  } catch {
    copyState.value = 'failed'
  }
  clearTimeout(resetTimer)
  resetTimer = setTimeout(() => (copyState.value = 'idle'), 2000)
}

function download() {
  const url = URL.createObjectURL(new Blob([markdown], { type: 'text/markdown' }))
  const link = Object.assign(document.createElement('a'), { href: url, download: fileName })
  link.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <article v-if="policy">
    <NuxtLink to="/" class="mt-8 inline-block text-sm text-ui-muted no-underline hover:text-ui-text">
      <span aria-hidden="true">←</span> All policies
    </NuxtLink>

    <header class="py-10">
      <h1 class="mt-4 mb-5 text-4xl sm:text-5xl font-semibold tracking-tight text-balance">
        {{ name }}
      </h1>
      <p class="max-w-xl text-lg text-pretty text-ui-muted">{{ policy.tagline }}</p>
    </header>

    <section
      class="grid gap-px overflow-hidden rounded-xl border border-ui-border bg-ui-border md:grid-cols-3"
      aria-label="At a glance"
    >
      <div v-for="{ kind, label } in ruleKinds" :key="kind" class="bg-ui-surface px-6 pt-5 pb-6">
        <h2 class="eyebrow mb-3.5">{{ label }}</h2>
        <ul v-if="policyRules(policy.rules, kind).length" class="grid gap-3">
          <li
            v-for="rule in policyRules(policy.rules, kind)"
            :key="rule.id"
            class="flex gap-2.5 text-sm"
            :title="rule.description"
          >
            <RuleIcon :kind="kind" />
            <span>
              <span class="block font-medium">{{ rule.label }}</span>
              <span class="block text-ui-muted">{{ rule.description }}</span>
            </span>
          </li>
        </ul>
        <p v-else class="text-sm text-ui-faint">Nothing listed</p>
      </div>
    </section>

    <div class="mt-10 grid gap-10 lg:(grid-cols-[minmax(0,1fr)_260px] items-start gap-12)">
      <div class="min-w-0 rounded-xl border border-ui-border bg-ui-surface">
        <div
          class="sticky top-0 z-1 flex flex-wrap items-center justify-between gap-3 rounded-t-xl border-b border-ui-border bg-ui-surface/88 py-2.5 pr-2.5 pl-3 backdrop-blur-sm"
        >
          <div class="inline-flex rounded-lg bg-ui-surface-2 p-1" role="tablist" aria-label="View">
            <button
              v-for="tab in (['preview', 'markdown'] as const)"
              :key="tab"
              role="tab"
              class="cursor-pointer rounded-md border border-transparent px-3 py-1 text-sm font-medium capitalize text-ui-muted aria-selected:(bg-ui-surface text-ui-text shadow-xs)"
              :aria-selected="view === tab"
              @click="view = tab"
            >{{ tab }}</button>
          </div>
          <div class="flex gap-2">
            <button class="btn" @click="download">Download</button>
            <button class="btn btn-primary" @click="copy">
              {{ copyState === 'copied' ? 'Copied' : copyState === 'failed' ? 'Copy failed' : 'Copy' }}
            </button>
          </div>
        </div>
        <!-- Rendered Markdown can't take classes, so it is styled from here. -->
        <ContentRenderer
          v-if="view === 'preview'"
          :value="policy"
          class="px-6 pt-7 pb-8 sm:(px-11 pt-9 pb-11) [&>:first-child]:mt-0 [&>:last-child]:mb-0 [&_h1]:(mb-5 text-2xl font-semibold leading-tight tracking-tight text-balance) [&_h2]:(mt-9 mb-3 text-lg font-semibold tracking-tight text-balance) [&_:is(h1,h2)_a]:no-underline [&_p]:(my-4 text-pretty) [&_ul]:(my-4 list-disc pl-5) [&_li]:text-pretty [&_li+li]:mt-1.5 [&_li::marker]:text-ui-faint"
        />
        <pre
          v-else
          class="overflow-x-auto whitespace-pre-wrap px-6 py-7 font-mono text-sm leading-relaxed wrap-anywhere [&_code]:(border-0 bg-transparent p-0 [font-size:inherit])"
        ><code>{{ markdown }}</code></pre>
        <span class="sr-only" aria-live="polite">
          {{ copyState === 'copied' ? 'Policy copied to clipboard' : '' }}
        </span>
      </div>

      <aside class="grid gap-8 text-sm lg:(sticky top-6)">
        <div>
          <h2 class="eyebrow mb-2.5">How to apply</h2>
          <ol class="grid list-decimal gap-2.5 pl-5 marker:(font-mono text-sm text-ui-muted)">
            <li>Copy or download the policy text.</li>
            <li>Save it as <code>{{ fileName }}</code> at the root of your repository.</li>
            <li>Link to it from <code>CONTRIBUTING.md</code> and your pull request template.</li>
          </ol>
        </div>
        <div>
          <h2 class="eyebrow mb-2.5">Enforcement</h2>
          <p>{{ policy.enforcement }}</p>
        </div>
        <div>
          <h2 class="eyebrow mb-2.5">Other policies</h2>
          <ul class="grid gap-1.5">
            <li v-for="other in (others ?? []).filter((o) => o.path !== path)" :key="other.path">
              <NuxtLink :to="other.path">{{ policyName(other.path) }}</NuxtLink>
            </li>
          </ul>
        </div>
        <a :href="sourceUrl" class="text-sm text-ui-muted" target="_blank" rel="noopener">
          View source on GitHub <span aria-hidden="true">↗</span>
        </a>
      </aside>
    </div>
  </article>
</template>
