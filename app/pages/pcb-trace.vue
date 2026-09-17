<template>
  <PcbTraceCalculator />
</template>

<script setup lang="ts">
import PcbTraceCalculator from "~/components/calculators/pcb-trace/PcbTraceCalculator.vue";

definePageMeta({
  layout: "calculator",
  title: "PCB Trace Width",
  icon: "fa-solid fa-ruler-combined",
  description: "គណនាទទឹង Trace តាម IPC-2221 សម្រាប់ចរន្តដែលចង់បាន",
});

useSeoMeta({
  title: "PCB Trace Width Calculator",
  description:
    "IPC-2221 PCB Trace Width, Max Current & Voltage Drop Calculator",
  ogTitle: "PCB Trace Calculator - Khmer Electronics Suite",
  ogDescription: "Free online PCB trace width calculator in Khmer language",
});
</script>
