<script setup lang="ts">
type Answer = boolean;

const questions = [
  {
    title: "Can contributors use AI privately?",
    detail:
      "Think of research, brainstorming, or drafting on their own machine, even when the submitted work must be their own.",
    yes: "Yes, private use is their business",
    no: "No, contributions must involve no AI assistance",
  },
  {
    title: "Can they submit AI-generated code?",
    detail:
      "Assume the contributor understands, tests, and takes responsibility for the code before submitting it.",
    yes: "Yes, if they understand it",
    no: "No, the submitted code must be their own",
  },
  {
    title: "Can AI write their public messages?",
    detail:
      "This includes issue reports, pull request descriptions, comments, and replies to review.",
    yes: "Yes, AI-written messages are welcome",
    no: "No, contributors should write in their own words",
  },
  {
    title: "Can agents submit directly?",
    detail:
      "An agent could open an issue or pull request without a person writing and posting each action.",
    yes: "Yes, agents may submit",
    no: "No, a person must submit",
  },
] as const;

const policyPositions: Record<string, Answer[]> = {
  "ai-allowed": [true, true, true, true],
  "human-voice": [true, true, false, false],
  "human-responsible": [true, false, false, false],
  "ai-disallowed": [false, false, false, false],
};

const { data: policies } = await usePolicies();
const step = ref(0);
const answers = ref<Answer[]>([]);

const results = computed(() => {
  if (step.value < questions.length) return [];

  const ranked = policies.value
    .filter((policy) => policySlug(policy.path) in policyPositions)
    .map((policy) => {
      const positions = policyPositions[policySlug(policy.path)]!;
      const differences = questions.flatMap((question, index) =>
        positions[index] === answers.value[index]
          ? []
          : [
              {
                question: question.title,
                position: positions[index] ? question.yes : question.no,
              },
            ],
      );

      return { ...policy, differences };
    })
    .toSorted((a, b) => a.differences.length - b.differences.length);

  const bestDistance = ranked[0]?.differences.length;
  return ranked.filter((policy) => policy.differences.length === bestDistance);
});

function choose(answer: Answer) {
  answers.value[step.value] = answer;
  step.value += 1;
}

function restart() {
  step.value = 0;
  answers.value = [];
}

useSeoMeta({
  title: "Find your policy · AI Contribution Policies",
  description:
    "Answer four questions to find the AI contribution policy that fits your project.",
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

    <section
      v-if="step < questions.length"
      class="max-w-2xl"
      aria-labelledby="question-title"
    >
      <p class="font-mono text-xs text-ui-muted">
        {{ step + 1 }} / {{ questions.length }}
      </p>
      <div class="mt-3 flex gap-1.5" aria-hidden="true">
        <span
          v-for="index in questions.length"
          :key="index"
          class="h-1 flex-1 rounded-full"
          :class="index <= step ? 'bg-ui-text' : 'bg-ui-border'"
        />
      </div>

      <div :key="step" class="quiz-enter mt-10">
        <h2
          id="question-title"
          class="text-2xl font-semibold tracking-tight text-balance sm:text-3xl"
        >
          {{ questions[step]!.title }}
        </h2>
        <p class="mt-3 max-w-xl text-ui-muted text-pretty">
          {{ questions[step]!.detail }}
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
              {{ option ? questions[step]!.yes : questions[step]!.no }}
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
        v-if="step > 0"
        type="button"
        class="mt-8 text-sm text-ui-muted underline-offset-4 hover:text-ui-text hover:underline"
        @click="step -= 1"
      >
        ← Previous question
      </button>
    </section>

    <section v-else class="quiz-enter max-w-2xl" aria-labelledby="result-title">
      <h2
        id="result-title"
        class="text-2xl font-semibold tracking-tight text-balance sm:text-3xl"
      >
        {{ results.length === 1 ? "Closest match" : "Closest matches" }}
      </h2>

      <div class="mt-8 grid gap-4">
        <article
          v-for="result in results"
          :key="result.path"
          class="rounded-xl border border-ui-border bg-ui-surface p-6 sm:p-8"
        >
          <h3 class="text-2xl font-semibold tracking-tight">
            {{ result.name }}
          </h3>
          <p class="mt-2 text-ui-muted text-pretty">{{ result.tagline }}</p>
          <div
            v-if="result.differences.length"
            class="mt-6 border-t border-ui-border pt-5"
          >
            <h4 class="caption">Differs on</h4>
            <ul class="mt-3 grid gap-3 text-sm">
              <li
                v-for="difference in result.differences"
                :key="difference.question"
              >
                <span class="font-medium">{{ difference.question }}</span>
                <span class="block text-ui-muted"
                  >Policy: {{ difference.position }}</span
                >
              </li>
            </ul>
          </div>
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
          @click="step -= 1"
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
