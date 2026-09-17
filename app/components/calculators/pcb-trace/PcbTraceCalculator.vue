<template>
  <UiAppTabs v-model="mode" :tabs="tabs" :cols="5">
    <PcbWidthTab v-if="mode === 'width'" />
    <PcbMaxCurrentTab v-else-if="mode === 'current'" />
    <PcbVoltageDropTab v-else-if="mode === 'drop'" />
    <PcbViaSizeTab v-else-if="mode === 'via'" />
    <PcbHoleSizeTab v-else-if="mode === 'hole'" />
  </UiAppTabs>
</template>

<script setup lang="ts">
import PcbWidthTab from "./tabs/WidthTab.vue";
import PcbMaxCurrentTab from "./tabs/MaxCurrentTab.vue";
import PcbVoltageDropTab from "./tabs/VoltageDropTab.vue";
import PcbViaSizeTab from "./tabs/ViaSizeTab.vue";
import PcbHoleSizeTab from "./tabs/HoleSizeTab.vue";

type Mode = "width" | "current" | "drop" | "via" | "hole";
const mode = ref<Mode>("width");

const tabs = [
  { value: "width", label: "Width", icon: "LucideRuler" },
  { value: "current", label: "Max Current", icon: "LucideZap" },
  { value: "drop", label: "Voltage Drop", icon: "LucideTrendingDown" },
  { value: "via", label: "Via Size", icon: "LucideCircleDot" },
  { value: "hole", label: "Hole Size", icon: "LucideCircle" },
] as const;
</script>
