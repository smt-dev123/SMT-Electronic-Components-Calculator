<template>
  <RegulatorCalculator />
</template>

<script setup lang="ts">
import RegulatorCalculator from "~/components/calculators/RegulatorCalculator.vue";

definePageMeta({
  layout: "calculator",
  title: "Voltage Regulator",
  icon: "fa-solid fa-bolt",
  description: "គណនា LM317, LM7805, Resistor Divider",
});

useSeoMeta({
  title: "Voltage Regulator Calculator",
});
</script>
