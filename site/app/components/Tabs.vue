<script setup lang="ts">
const props = defineProps<{
  tabs: string[];
}>();

const selected = defineModel<string>('selected');
const activeTab = computed(() => {
  return selected.value ?? props.tabs[0];
});

function selectTab(tab: string) {
  selected.value = tab;
}
</script>

<template>
  <div class="inline-flex rounded-lg bg-ui-surface-2 p-1" role="tablist">
    <button
      v-for="tab in tabs"
      :key="String(tab)"
      role="tab"
      class="rounded-md border border-transparent px-3 py-1 text-sm font-medium capitalize text-ui-muted transition-colors hover:text-ui-text aria-selected:(bg-ui-surface text-ui-text shadow-xs)"
      :aria-selected="activeTab === tab"
      @click="selectTab(tab)"
    >
      {{ tab }}
    </button>
  </div>
</template>
