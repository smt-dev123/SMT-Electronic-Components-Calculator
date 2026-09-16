<template>
  <ClientOnly>
    <TransistorCalculator />
    <template #fallback>
      <div class="min-h-[400px]" aria-hidden="true" />
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import TransistorCalculator from "~/components/calculators/TransistorCalculator.vue";

definePageMeta({
  layout: "calculator",
  title: "គណនា Transistor",
  icon: "fa-solid fa-microchip",
  description: "គណនា BJT Transistor — Database, Switch, Amplifier, Finder",
});

useSeoMeta({
  title: "គណនា Transistor (BJT Calculator)",
  description: "BJT Transistor Database, Base Resistor, Amplifier Calculator",
});
</script>
