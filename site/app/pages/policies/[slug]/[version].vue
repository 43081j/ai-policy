<script setup lang="ts">
const route = useRoute();
</script>

<template>
  <PolicyPage
    :slug="String(route.params.slug)"
    :version="String(route.params.version)"
  />
</template>
