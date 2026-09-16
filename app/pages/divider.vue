<!-- app/pages/divider.vue -->
<template>
  <ClientOnly>
    <VoltageDividerCalculator />
    <template #fallback>
      <div class="min-h-[400px]" aria-hidden="true" />
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import VoltageDividerCalculator from "~/components/calculators/VoltageDividerCalculator.vue";

definePageMeta({
  layout: "calculator",
  title: "ស៊ីគ្វីចែកតង់ស្យុង",
  icon: "fa-solid fa-sitemap",
  description: "គណនាតង់ស្យុងចេញ (Vout) ពីស៊ីគ្វី R1, R2",
});

useSeoMeta({
  title: "គណនាស៊ីគ្វីចែកតង់ស្យុង (Voltage Divider)",
  description: "Voltage Divider Calculator - Compute Vout, current, power",
});
</script>
