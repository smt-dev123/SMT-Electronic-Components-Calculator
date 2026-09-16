<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import "~/assets/css/main.css";
// Global app-level logic
useHead({
  bodyAttrs: {
    class:
      "min-h-screen flex flex-col selection:bg-cyan-500 selection:text-slate-950",
  },
});
</script>
