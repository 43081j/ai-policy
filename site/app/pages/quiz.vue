<script setup lang="ts">
const { data: policies } = await usePolicies();
const answers = ref<{ ruleId: Rule['id']; answer: boolean }[]>([]);

// Replay the answers to find who is still in the running and what to ask next.
const candidates = computed(() =>
  answers.value.reduce(
    (remaining, { ruleId, answer }) =>
      filterCandidates(remaining, ruleId, answer),
    policies.value,
  ),
);

const question = computed(() =>
  nextQuestion(
    candidates.value,
    answers.value.map(({ ruleId }) => ruleId),
  ),
);

function choose(answer: boolean) {
  answers.value.push({ ruleId: question.value!.ruleId, answer });
}

function back() {
  answers.value.pop();
}

function restart() {
  answers.value = [];
}

useSeoMeta({
  title: 'Find your policy · AI Contribution Policies',
  description:
    'Answer a few questions to find the AI contribution policy that fits your project.',
});
</script>

<template>
  <div>
    <NuxtLink
      to="/"
      class="mt-8 inline-block text-sm text-ui-muted no-underline hover:text-ui-text"
    >
      <span aria-hidden="true">←</span> All policies
    </NuxtLink>

    <header class="py-10">
      <h1
        class="mt-4 text-4xl font-semibold tracking-tight text-balance sm:text-5xl"
      >
        Find your policy
      </h1>
    </header>

    <section v-if="question" class="max-w-2xl" aria-labelledby="question-title">
      <p class="font-mono text-xs text-ui-muted">
        Question {{ answers.length + 1 }} · {{ candidates.length }} policies
        left
      </p>

      <div :key="answers.length" class="quiz-enter mt-10">
        <h2
          id="question-title"
          class="text-2xl font-semibold tracking-tight text-balance sm:text-3xl"
        >
          {{ question.title }}
        </h2>
        <p class="mt-3 max-w-xl text-ui-muted text-pretty">
          {{ question.detail }}
        </p>

        <div class="mt-8 grid gap-3">
          <button
            v-for="option in [true, false]"
            :key="String(option)"
            type="button"
            class="group flex min-h-18 w-full items-center justify-between gap-4 rounded-xl border border-ui-border bg-ui-surface px-5 py-4 text-left transition-colors hover:border-ui-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ui-text"
            @click="choose(option)"
          >
            <span class="font-medium">
              {{ option ? question.yes : question.no }}
            </span>
            <span
              class="text-ui-faint transition-colors group-hover:text-ui-text"
              aria-hidden="true"
              >→</span
            >
          </button>
        </div>
      </div>

      <button
        v-if="answers.length"
        type="button"
        class="mt-8 text-sm text-ui-muted underline-offset-4 hover:text-ui-text hover:underline"
        @click="back"
      >
        ← Previous question
      </button>
    </section>

    <section v-else class="quiz-enter max-w-2xl" aria-labelledby="result-title">
      <h2
        id="result-title"
        class="text-2xl font-semibold tracking-tight text-balance sm:text-3xl"
      >
        {{ candidates.length === 1 ? 'Your match' : 'Your matches' }}
      </h2>

      <div class="mt-8 grid gap-4">
        <article
          v-for="result in candidates"
          :key="result.path"
          class="rounded-xl border border-ui-border bg-ui-surface p-6 sm:p-8"
        >
          <h3 class="text-2xl font-semibold tracking-tight">
            {{ result.name }}
          </h3>
          <p class="mt-2 text-ui-muted text-pretty">{{ result.tagline }}</p>
          <NuxtLink
            :to="result.to"
            class="mt-7 inline-flex items-center gap-2 rounded-lg bg-ui-text px-4 py-2.5 text-sm font-medium text-ui-bg no-underline transition-opacity hover:opacity-80"
          >
            Read {{ result.name }} <span aria-hidden="true">→</span>
          </NuxtLink>
        </article>
      </div>

      <div class="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm">
        <button
          type="button"
          class="text-ui-muted underline-offset-4 hover:text-ui-text hover:underline"
          @click="back"
        >
          ← Change last answer
        </button>
        <button
          type="button"
          class="text-ui-muted underline-offset-4 hover:text-ui-text hover:underline"
          @click="restart"
        >
          Start over
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.quiz-enter {
  animation: quiz-enter 240ms ease-out both;
}

@keyframes quiz-enter {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .quiz-enter {
    animation: none;
  }
}
</style>
