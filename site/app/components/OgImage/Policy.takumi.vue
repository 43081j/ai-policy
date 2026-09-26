<script setup lang="ts">
defineProps<{
  title?: string;
  description?: string;
}>();

const logoPath =
  'M19.414 14.414C21 12.828 22 11.5 22 9.5a5.5 5.5 0 0 0-9.591-3.676.6.6 0 0 1-.818.001A5.5 5.5 0 0 0 2 9.5c0 2.3 1.5 4 3 5.5l5.535 5.362a2 2 0 0 0 2.879.052 2.12 2.12 0 0 0-.004-3 2.124 2.124 0 1 0 3-3 2.124 2.124 0 0 0 3.004 0 2 2 0 0 0 0-2.828l-1.881-1.882a2.41 2.41 0 0 0-3.409 0l-1.71 1.71a2 2 0 0 1-2.828 0 2 2 0 0 1 0-2.828l2.823-2.762';
const siteName = 'AI Contribution Policies';
const domain = 'ai-policy.dev';
</script>

<template>
  <div
    v-if="title"
    class="h-full w-full flex flex-col justify-between bg-[#0b0b0d] p-20 text-[#ededef] font-sans"
  >
    <div class="flex items-center gap-5 text-8 font-semibold">
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path :d="logoPath" />
      </svg>
      {{ siteName }}
    </div>
    <div class="flex flex-col">
      <div class="text-22 font-semibold leading-none tracking-tight">
        {{ title }}
      </div>
      <div
        v-if="description"
        class="mt-7 max-w-240 text-9 leading-snug text-[#9d9da7]"
      >
        {{ description }}
      </div>
    </div>
    <div class="font-mono text-7.5 font-medium text-[#9d9da7]">
      {{ domain }}
    </div>
  </div>
  <div
    v-else
    class="h-full w-full flex flex-col items-center justify-center bg-[#0b0b0d] text-[#ededef] font-sans"
  >
    <svg
      width="168"
      height="168"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path :d="logoPath" />
    </svg>
    <div class="mt-11 text-20 font-semibold leading-none tracking-tight">
      {{ siteName }}
    </div>
    <div class="mt-7 font-mono text-8.5 font-medium text-[#9d9da7]">
      {{ domain }}
    </div>
  </div>
</template>
