<template>
  <ClientOnly>
    <OptocouplerCalculator />
    <template #fallback>
      <div class="min-h-[400px]" aria-hidden="true" />
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import OptocouplerCalculator from "~/components/calculators/OptocouplerCalculator.vue";

definePageMeta({
  layout: "calculator",
  title: "គណនា Optocoupler",
  icon: "fa-solid fa-shield-halved",
  description: "គណនា Optocoupler — Database, Resistor, Circuit, Finder",
});

useSeoMeta({
  title: "គណនា Optocoupler",
  description: "Optocoupler Database, Input/Output Resistor Calculator",
});
</script>
