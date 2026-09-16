<!-- app/pages/led.vue -->
<template>
  <ClientOnly>
    <LedResistorCalculator />
    <template #fallback>
      <div class="min-h-[400px]" aria-hidden="true" />
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import LedResistorCalculator from "~/components/calculators/LedResistorCalculator.vue";

definePageMeta({
  layout: "calculator",
  title: "រេស៊ីស្តង់ LED",
  icon: "fa-regular fa-lightbulb",
  description: "គណនារេស៊ីស្តង់ការពារ LED",
});

useSeoMeta({
  title: "គណនារេស៊ីស្តង់ LED (LED Resistor Calculator)",
  description: "Calculate the current-limiting resistor for LEDs",
});
</script>
