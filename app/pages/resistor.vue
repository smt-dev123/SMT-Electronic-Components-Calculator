<template>
  <ClientOnly>
    <ResistorCalculator />
    <template #fallback>
      <div class="min-h-[400px]" aria-hidden="true" />
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import ResistorCalculator from "~/components/calculators/ResistorCalculator.vue";

definePageMeta({
  layout: "calculator",
  title: "គណនារេស៊ីស្តង់",
  icon: "fa-solid fa-palette",
  description: "គណនាតម្លៃរេស៊ីស្តង់តាមរយៈកូដពណ៌ និង SMD Code",
});

useSeoMeta({
  title: "គណនារេស៊ីស្តង់ (Resistor Calculator)",
  description: "Resistor Color Code & SMD Code Calculator with Khmer UI",
  ogTitle: "Resistor Calculator - Khmer Electronics Suite",
  ogDescription: "Free online resistor calculator in Khmer language",
});
</script>
