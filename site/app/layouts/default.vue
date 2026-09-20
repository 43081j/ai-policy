<template>
  <div class="mx-auto max-w-5xl px-4 sm:px-8">
    <header class="flex items-center justify-between gap-4 py-5">
      <NuxtLink
        to="/"
        class="inline-flex items-center gap-2.5 font-semibold no-underline"
      >
        <span class="i-lucide:scale text-ui-muted" aria-hidden="true" />
        AI Contribution Policies
      </NuxtLink>
      <nav class="flex gap-5 text-sm">
        <a
          href="https://github.com/43081j/ai-policy"
          target="_blank"
          class="text-ui-muted no-underline hover:text-ui-text"
          >Source</a
        >
      </nav>
    </header>
    <main>
      <slot />
    </main>
    <footer
      class="mt-24 border-t border-ui-border pt-7 pb-10 text-sm text-ui-muted"
    >
      <p>Policies are MIT licensed.</p>
    </footer>
  </div>
</template>
