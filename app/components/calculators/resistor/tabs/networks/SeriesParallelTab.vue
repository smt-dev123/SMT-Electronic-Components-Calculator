<template>
  <UiAppTabs v-model="mode" :tabs="tabs" :cols="4">
    <SeriesTab v-if="mode === 'series'" />
    <ParallelTab v-else-if="mode === 'parallel'" />
    <Combination v-else-if="mode === 'combination'" />
    <FinderTab v-else-if="mode === 'finder'" />
  </UiAppTabs>
</template>

<script setup lang="ts">
import SeriesTab from "./tabs/SeriesTab.vue";
import ParallelTab from "./tabs/ParallelTab.vue";
import Combination from "./tabs/Combination.vue";
import FinderTab from "./tabs/FinderTab.vue";

type Mode = "series" | "parallel" | "combination" | "finder";
const mode = ref<Mode>("series");

const tabs = [
  { value: "series", label: "សេរី", icon: "LucideNetwork" },
  { value: "parallel", label: "ប៉ារ៉ាឡែល", icon: "LucideNetwork" },
  { value: "combination", label: "ការបញ្ចូល", icon: "LucideNetwork" },
  { value: "finder", label: "Finder", icon: "LucideSearch" },
] as const;
</script>
