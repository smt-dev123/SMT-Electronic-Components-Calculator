<template>
  <PidCalculator />
</template>

<script setup lang="ts">
import PidCalculator from "~/components/calculators/PidCalculator.vue";

definePageMeta({
  layout: "calculator",
  title: "PID Controller",
  icon: "fa-solid fa-chart-line",
  description: "គណនា PID Gains (ZN, Cohen-Coon) និង Simulation",
});

useSeoMeta({
  title: "PID Controller Calculator",
  description: "PID Tuning (Ziegler-Nichols, Cohen-Coon) & FOPDT Simulation",
});
</script>
