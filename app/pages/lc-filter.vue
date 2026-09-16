<template>
  <LcFilterCalculator />
</template>

<script setup lang="ts">
import LcFilterCalculator from "~/components/calculators/LcFilterCalculator.vue";

definePageMeta({
  layout: "calculator",
  title: "LC Filter",
  icon: "fa-solid fa-filter",
  description: "គណនា LC Filter — Cutoff, Q Factor, Band-Pass, Attenuation",
});

useSeoMeta({
  title: "LC Filter Calculator",
  description: "LC Low-Pass, High-Pass, Band-Pass Filter Calculator",
  ogTitle: "LC Filter Calculator - Khmer Electronics Suite",
  ogDescription: "Free online LC filter calculator in Khmer language",
});
</script>
