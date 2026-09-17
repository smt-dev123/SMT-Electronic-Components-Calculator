<template>
  <ClientOnly>
    <InductorCalculator />
    <template #fallback>
      <div class="min-h-[400px]" aria-hidden="true" />
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import InductorCalculator from "~/components/calculators/inductor/InductorCalculator.vue";

definePageMeta({
  layout: "calculator",
  title: "គណនាអាំងឌុចទ័រ",
  icon: "fa-solid fa-rotate",
  description:
    "គណនាតម្លៃអាំងឌុចទ័រ — កូដពណ៌, រូបមន្ត, Reactance, សេរី/ប៉ារ៉ាឡែល",
});

useSeoMeta({
  title: "គណនាអាំងឌុចទ័រ (Inductor Calculator)",
  description: "Inductor Color Code, Solenoid Formula, Reactance & Resonance",
});
</script>
