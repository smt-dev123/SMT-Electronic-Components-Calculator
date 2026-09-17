<template>
  <UiAppTabs v-model="mode" :tabs="tabs" :cols="4">
    <ColorCode v-if="mode === 'code'" />
    <SolenoidFormula v-else-if="mode === 'formula'" />
    <ReactanceResonance v-else-if="mode === 'reactance'" />
    <SeriesParallel v-else-if="mode === 'network'" />
  </UiAppTabs>
</template>

<script setup lang="ts">
import ColorCode from "./tabs/ColorCode.vue";
import SolenoidFormula from "./tabs/SolenoidFormula.vue";
import ReactanceResonance from "./tabs/ReactanceResonance.vue";
import SeriesParallel from "./tabs/SeriesParallel.vue";

type Mode = "code" | "formula" | "reactance" | "network";
const mode = ref<Mode>("code");

const tabs = [
  { value: "code", label: "Color Code", icon: "LucidePalette" },
  { value: "formula", label: "Solenoid Formula", icon: "LucideMath" },
  {
    value: "reactance",
    label: "Reactance & Resonance",
    icon: "LucideWaveform",
  },
  { value: "network", label: "Series & Parallel", icon: "LucideNetwork" },
] as const;
</script>
