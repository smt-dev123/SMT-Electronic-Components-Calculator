<template>
  <OpAmpCalculator />
</template>

<script setup lang="ts">
import OpAmpCalculator from "~/components/calculators/OpAmpCalculator.vue";

definePageMeta({
  layout: "calculator",
  title: "Op-Amp",
  icon: "fa-solid fa-wave-square",
  description: "គណនា Non-Inverting, Inverting, Filter",
});

useSeoMeta({
  title: "Op-Amp Calculator",
  description: "Operational Amplifier Gain & Filter Calculator",
});
</script>
