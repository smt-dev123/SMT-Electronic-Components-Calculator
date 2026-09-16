<template>
  <ClientOnly>
    <CapacitorCalculator />
    <template #fallback>
      <div class="min-h-[400px]" aria-hidden="true" />
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import CapacitorCalculator from "~/components/calculators/CapacitorCalculator.vue";

definePageMeta({
  layout: "calculator",
  title: "គណនាកាប៉ាស៊ីទ័រ",
  icon: "fa-solid fa-bolt",
  description: "បម្លែងកូដកាប៉ាស៊ីទ័រ និងឯកតា pF / nF / µF",
});

useSeoMeta({
  title: "គណនាកាប៉ាស៊ីទ័រ (Capacitor Calculator)",
  description: "Capacitor Code Lookup & Unit Converter",
  ogTitle: "Capacitor Calculator - Khmer Electronics Suite",
});
</script>
