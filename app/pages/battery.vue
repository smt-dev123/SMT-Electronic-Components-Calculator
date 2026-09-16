<template>
  <BatteryCalculator />
</template>

<script setup lang="ts">
import BatteryCalculator from "~/components/calculators/BatteryCalculator.vue";

definePageMeta({
  layout: "calculator",
  title: "Battery",
  icon: "fa-solid fa-battery-full",
  description: "គណនា Battery Life និង Runtime",
});

useSeoMeta({
  title: "Battery Life Calculator",
});
</script>
