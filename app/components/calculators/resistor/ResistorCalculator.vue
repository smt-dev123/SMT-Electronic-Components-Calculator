<template>
  <UiAppTabs v-model="mode" :tabs="tabs" :cols="3">
    <ColorCodeTab v-if="mode === 'color'" />
    <SmdResistorTab v-else-if="mode === 'smd'" />
    <ReferenceTableTab v-else-if="mode === 'reference'" />
  </UiAppTabs>
</template>

<script setup lang="ts">
import ColorCodeTab from "./tabs/ColorCodeTab.vue";
import SmdResistorTab from "./tabs/SmdResistorTab.vue";
import ReferenceTableTab from "./tabs/ReferenceTableTab.vue";

type Mode = "color" | "smd" | "reference";
const mode = ref<Mode>("color");

const tabs = [
  { value: "color", label: "កូដពណ៌", icon: "LucidePalette" },
  { value: "smd", label: "SMD Code", icon: "LucideBarcode" },
  { value: "reference", label: "តារាង", icon: "LucideBookOpen" },
] as const;
</script>
