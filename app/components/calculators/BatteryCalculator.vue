<template>
  <div class="space-y-6">
    <!-- Mode Selector -->
    <div class="glass-card rounded-2xl p-5">
      <div class="grid grid-cols-2 gap-2">
        <button
          v-for="m in modes"
          :key="m.value"
          @click="mode = m.value"
          class="py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-300"
          :class="
            mode === m.value
              ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-slate-950 shadow-md shadow-cyan-500/20 scale-105'
              : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800'
          "
        >
          <component :is="m.icon" class="w-3.5 h-3.5" />
          <span>{{ m.label }}</span>
        </button>
      </div>
    </div>

    <!-- Battery Life -->
    <div
      v-if="mode === 'life'"
      class="glass-card rounded-2xl p-5 sm:p-6 max-w-2xl mx-auto space-y-4"
    >
      <div class="border-b border-slate-800 pb-3">
        <h2 class="text-lg font-bold text-white flex items-center gap-2">
          <LucideBatteryFull class="w-4 h-4 text-cyan-400" />
          គណនាអាយុកាល Battery (Runtime)
        </h2>
        <p class="text-xs text-slate-400">T = Capacity / Load Current</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            Capacity (mAh):
          </label>
          <input
            v-model.number="life.capacity"
            type="number"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            Load Current (mA):
          </label>
          <input
            v-model.number="life.current"
            type="number"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      <div
        v-if="lifeResult"
        class="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3"
      >
        <div>
          <span class="text-xs text-slate-400 font-mono block">Runtime</span>
          <div class="text-3xl font-bold font-mono text-cyan-400 mt-1">
            {{ lifeResult.hoursFormatted }}
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2 border-t border-slate-800 pt-3">
          <div>
            <span class="text-xs text-slate-400 font-mono block">Days</span>
            <span class="text-lg font-bold text-amber-400">{{
              lifeResult.daysFormatted
            }}</span>
          </div>
          <div>
            <span class="text-xs text-slate-400 font-mono block">Minutes</span>
            <span class="text-lg font-bold text-emerald-400">{{
              lifeResult.minutesFormatted
            }}</span>
          </div>
        </div>
      </div>

      <button
        v-if="lifeResult"
        @click="saveToHistory('Battery Life', lifeResult.hoursFormatted)"
        class="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors"
      >
        <LucideSave class="w-3.5 h-3.5" />
        រក្សាទុកប្រវត្តិ
      </button>
    </div>

    <!-- Charging Time -->
    <div
      v-if="mode === 'charge'"
      class="glass-card rounded-2xl p-5 sm:p-6 max-w-2xl mx-auto space-y-4"
    >
      <div class="border-b border-slate-800 pb-3">
        <h2 class="text-lg font-bold text-white flex items-center gap-2">
          <LucideZap class="w-4 h-4 text-amber-400" />
          គណនាពេលវេលាសាក (Charging Time)
        </h2>
        <p class="text-xs text-slate-400">
          T = Capacity / (Charge Rate × Efficiency)
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            Capacity (mAh):
          </label>
          <input
            v-model.number="charge.capacity"
            type="number"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            Charge Rate (mA):
          </label>
          <input
            v-model.number="charge.rate"
            type="number"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      <div
        v-if="chargeResult"
        class="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-2"
      >
        <span class="text-xs text-slate-400 font-mono block"
          >Charging Time</span
        >
        <div class="text-3xl font-bold font-mono text-amber-400">
          {{ chargeResult.hoursFormatted }}
        </div>
        <div class="text-xs text-slate-400 font-mono">
          ≈ {{ chargeResult.minutesFormatted }} (Efficiency 85%)
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBatteryCalc } from "~/composables/core/useBatteryCalc";

const historyStore = useHistoryStore();
const { calculateLife, calculateCharging } = useBatteryCalc();

type Mode = "life" | "charge";
const mode = ref<Mode>("life");

const modes = [
  { value: "life", label: "Runtime", icon: "LucideBatteryFull" },
  { value: "charge", label: "Charging", icon: "LucideZap" },
] as const;

const life = ref({ capacity: 2000, current: 100 });
const lifeResult = computed(() =>
  calculateLife(life.value.capacity, life.value.current),
);

const charge = ref({ capacity: 2000, rate: 500 });
const chargeResult = computed(() =>
  calculateCharging(charge.value.capacity, charge.value.rate),
);

const saveToHistory = (title: string, value: string) => {
  historyStore.add({
    type: "transistor",
    title,
    value,
    input: { ...life.value },
  });
};
</script>
