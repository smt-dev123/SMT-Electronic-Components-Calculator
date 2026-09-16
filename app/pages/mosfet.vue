<template>
  <ClientOnly>
    <MosfetCalculator />
    <template #fallback>
      <div class="min-h-[400px]" aria-hidden="true" />
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import MosfetCalculator from "~/components/calculators/MosfetCalculator.vue";

definePageMeta({
  layout: "calculator",
  title: "គណនា MOSFET",
  icon: "fa-solid fa-bolt",
  description: "គណនា MOSFET — Database, Gate R, Power/Heat, Finder",
});

useSeoMeta({
  title: "គណនា MOSFET",
  description:
    "MOSFET Database, Gate Resistor, Power Loss & Heatsink Calculator",
});
</script>
