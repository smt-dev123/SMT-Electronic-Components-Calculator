<template>
  <ClientOnly>
    <OhmLawCalculator />
    <template #fallback>
      <div class="min-h-[400px]" aria-hidden="true" />
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import OhmLawCalculator from "~/components/calculators/OhmLawCalculator.vue";

definePageMeta({
  layout: "calculator",
  title: "ច្បាប់អូម",
  icon: "fa-solid fa-calculator",
  description: "គណនា Voltage, Current, Resistance និង Power",
});

useSeoMeta({
  title: "ច្បាប់អូម (Ohm's Law Calculator)",
  description: "Ohm's Law & Power Solver - Calculate V, I, R, P",
});
</script>
