<!-- app/pages/timer-555.vue -->
<template>
  <ClientOnly>
    <Timer555Calculator />
    <template #fallback>
      <div class="min-h-[400px]" aria-hidden="true" />
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import Timer555Calculator from "~/components/calculators/Timer555Calculator.vue";

definePageMeta({
  layout: "calculator",
  title: "IC 555 Oscillator",
  icon: "fa-solid fa-clock",
  description: "គណនាប្រេកង់ និង Duty Cycle នៃ IC 555",
});

useSeoMeta({
  title: "IC 555 Astable Oscillator Calculator",
  description: "Calculate 555 Timer frequency and duty cycle",
});
</script>
