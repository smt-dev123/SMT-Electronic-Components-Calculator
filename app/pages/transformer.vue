<template>
  <TransformerCalculator />
</template>

<script setup lang="ts">
import TransformerCalculator from "~/components/calculators/TransformerCalculator.vue";

definePageMeta({
  layout: "calculator",
  title: "គណនា Transformer",
  icon: "fa-solid fa-rotate",
  description: "គណនា Turns Ratio, Primary Current, Power និង Secondary Turns",
});

useSeoMeta({
  title: "គណនា Transformer (Transformer Calculator)",
  description:
    "Transformer Turns Ratio, Primary/Secondary Current & Power Calculator",
  ogTitle: "Transformer Calculator - Khmer Electronics Suite",
  ogDescription: "Free online transformer calculator in Khmer language",
});
</script>
