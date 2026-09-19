<script setup lang="ts">
const { small = false } = defineProps<{
  kind: RuleKind;
  small?: boolean;
}>();

const colors: Record<RuleKind, string> = {
  permits: 'text-ui-permits bg-ui-permits-bg',
  requires: 'text-ui-requires bg-ui-requires-bg',
  forbids: 'text-ui-forbids bg-ui-forbids-bg',
};
</script>

<template>
  <span
    class="inline-grid flex-none place-items-center rounded-full align-middle"
    :class="[colors[kind], small ? 'size-4.5' : 'size-5.5']"
    aria-hidden="true"
  >
    <svg
      viewBox="0 0 16 16"
      :class="small ? 'size-3.5' : 'size-4'"
      fill="none"
      stroke="currentColor"
      stroke-width="1.75"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path v-if="kind === 'permits'" d="M4.5 8.25 7 10.5l4.5-5" />
      <path v-else-if="kind === 'requires'" d="M8 4.75v4M8 11.25v.01" />
      <path v-else d="m5.5 5.5 5 5m0-5-5 5" />
    </svg>
  </span>
</template>
