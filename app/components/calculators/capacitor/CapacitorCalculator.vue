<template>
  <UiAppTabs v-model="mode" :tabs="tabs" :cols="3">
    <CodeLookupTab v-if="mode === 'lookup'" />
    <NetworkTab v-else-if="mode === 'network'" />
    <UnitConverter v-else-if="mode === 'convert'" />
  </UiAppTabs>
</template>

<script setup lang="ts">
import CodeLookupTab from "./tabs/CodeLookupTab.vue";
import NetworkTab from "./tabs/NetworkTab.vue";
import UnitConverter from "./tabs/UnitConverter.vue";

type Mode = "lookup" | "convert" | "network";
const mode = ref<Mode>("lookup");

const tabs = [
  { value: "lookup", label: "Lookup", icon: "LucideSearch" },
  { value: "network", label: "Network", icon: "LucideGitBranch" },
  { value: "convert", label: "Convert", icon: "LucideRefreshCw" },
] as const;
</script>
