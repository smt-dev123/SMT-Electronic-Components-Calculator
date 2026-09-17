<template>
  <ClientOnly>
    <DiodeCalculator />
    <template #fallback>
      <div class="min-h-[400px]" aria-hidden="true" />
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import DiodeCalculator from "~/components/calculators/diode/DiodeCalculator.vue";

definePageMeta({
  layout: "calculator",
  title: "Diode Calculator គណនាឌីយ៉ូត",
  icon: "fa-solid fa-arrow-right-long",
  description: "Diode Calculator — Database, Rectifier, Zener, Bridge",
});

useSeoMeta({
  title: "គណនាឌីយ៉ូត (Diode Calculator)",
  description: "Diode Database, Rectifier, Zener Regulator, Bridge Rectifier",
});
</script>
