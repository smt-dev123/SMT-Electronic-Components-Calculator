<template>
  <UiAppTabs v-model="mode" :tabs="tabs" :cols="4">
    <DiodeDatabase v-if="mode === 'database'" />
    <Rectifier v-else-if="mode === 'rectifier'" />
    <ZenerRegulator v-else-if="mode === 'zener'" />
    <BridgeRectifier v-else-if="mode === 'bridge'" />
  </UiAppTabs>
</template>

<script setup lang="ts">
import DiodeDatabase from "./tabs/DiodeDatabaseTab.vue";
import Rectifier from "./tabs/RectifierTab.vue";
import ZenerRegulator from "./tabs/ZenerRegulatorTab.vue";
import BridgeRectifier from "./tabs/BridgeRectifierTab.vue";

type Mode = "database" | "rectifier" | "zener" | "bridge";
const mode = ref<Mode>("database");

const tabs = [
  { value: "database", label: "Database", icon: "LucideDatabase" },
  { value: "rectifier", label: "Rectifier", icon: "LucideActivity" },
  { value: "zener", label: "Zener", icon: "LucideZap" },
  { value: "bridge", label: "Bridge", icon: "LucideCornerUpLeft" },
] as const;
</script>
