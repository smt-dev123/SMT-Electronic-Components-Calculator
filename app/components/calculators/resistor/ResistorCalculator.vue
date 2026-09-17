<template>
  <UiAppTabs v-model="mode" :tabs="tabs" :cols="4">
    <ColorCodeTab v-if="mode === 'color'" />
    <SmdResistorTab v-else-if="mode === 'smd'" />
    <SeriesParallelTab v-else-if="mode === 'seriesParallel'" />
    <ReferenceTableTab v-else-if="mode === 'reference'" />
  </UiAppTabs>
</template>

<script setup lang="ts">
import ColorCodeTab from "./tabs/ColorCodeTab.vue";
import SmdResistorTab from "./tabs/SmdResistorTab.vue";
import SeriesParallelTab from "./tabs/networks/SeriesParallelTab.vue";
import ReferenceTableTab from "./tabs/ReferenceTableTab.vue";

type Mode = "color" | "smd" | "seriesParallel" | "reference";
const mode = ref<Mode>("color");

const tabs = [
  { value: "color", label: "កូដពណ៌", icon: "LucidePalette" },
  { value: "smd", label: "SMD Code", icon: "LucideBarcode" },
  { value: "seriesParallel", label: "សេរី/ប៉ារ៉ាឡែល", icon: "LucideNetwork" },
  { value: "reference", label: "តារាង", icon: "LucideBookOpen" },
] as const;
</script>
