<template>
  <CrystalCalculator />
</template>

<script setup lang="ts">
import CrystalCalculator from "~/components/calculators/CrystalCalculator.vue";

definePageMeta({
  layout: "calculator",
  title: "Crystal Oscillator",
  icon: "fa-solid fa-crystal",
  description:
    "គណនា Crystal Oscillator — Load Caps, Resonance, Pullability, Drive Power",
});

useSeoMeta({
  title: "Crystal Oscillator Calculator",
  description: "Crystal Load Capacitors, Resonance & Pullability Calculator",
  ogTitle: "Crystal Calculator - Khmer Electronics Suite",
  ogDescription: "Free online crystal oscillator calculator in Khmer language",
});
</script>
