<template>
  <RelayCalculator />
</template>

<script setup lang="ts">
import RelayCalculator from "~/components/calculators/RelayCalculator.vue";

definePageMeta({
  layout: "calculator",
  title: "Relay Driver",
  icon: "fa-solid fa-toggle-on",
  description: "គណនា Relay Driver Transistor",
});

useSeoMeta({
  title: "Relay Driver Calculator",
});
</script>
