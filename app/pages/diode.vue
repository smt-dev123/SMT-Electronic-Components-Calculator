<template>
  <ClientOnly>
    <DiodeCalculator />
    <template #fallback>
      <div class="min-h-[400px]" aria-hidden="true" />
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import DiodeCalculator from "~/components/calculators/DiodeCalculator.vue";

definePageMeta({
  layout: "calculator",
  title: "គណនាឌីយ៉ូត",
  icon: "fa-solid fa-arrow-right-long",
  description: "គណនាឌីយ៉ូត — Database, Rectifier, Zener, Bridge",
});

useSeoMeta({
  title: "គណនាឌីយ៉ូត (Diode Calculator)",
  description: "Diode Database, Rectifier, Zener Regulator, Bridge Rectifier",
});
</script>
