<template>
  <div class="space-y-6">
    <div class="glass-card rounded-2xl p-5">
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
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

    <!-- Non-Inverting -->
    <div
      v-if="mode === 'nonInv'"
      class="glass-card rounded-2xl p-5 sm:p-6 max-w-3xl mx-auto space-y-4"
    >
      <div class="border-b border-slate-800 pb-3">
        <h2 class="text-lg font-bold text-white flex items-center gap-2">
          <LucideTrendingUp class="w-4 h-4 text-cyan-400" />
          Non-Inverting Amplifier
        </h2>
        <p class="text-xs text-slate-400">Gain = 1 + R2/R1 (ដូចសញ្ញា)</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1"
            >R1 (Ω):</label
          >
          <input
            v-model.number="nonInv.r1"
            type="number"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1"
            >R2 (Ω):</label
          >
          <input
            v-model.number="nonInv.r2"
            type="number"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1"
            >Vin (V):</label
          >
          <input
            v-model.number="nonInv.vin"
            type="number"
            step="0.1"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      <div
        v-if="nonInvResult"
        class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3"
      >
        <div class="grid grid-cols-3 gap-3">
          <div>
            <span class="text-xs text-slate-400 font-mono block">Gain</span>
            <div class="text-xl font-bold font-mono text-cyan-400">
              {{ nonInvResult.gainFormatted }}
            </div>
          </div>
          <div>
            <span class="text-xs text-slate-400 font-mono block"
              >Gain (dB)</span
            >
            <div class="text-xl font-bold font-mono text-amber-400">
              {{ nonInvResult.gainDbFormatted }}
            </div>
          </div>
          <div>
            <span class="text-xs text-slate-400 font-mono block">Vout</span>
            <div class="text-xl font-bold font-mono text-emerald-400">
              {{ nonInvResult.voutFormatted }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Inverting -->
    <div
      v-if="mode === 'inv'"
      class="glass-card rounded-2xl p-5 sm:p-6 max-w-3xl mx-auto space-y-4"
    >
      <div class="border-b border-slate-800 pb-3">
        <h2 class="text-lg font-bold text-white flex items-center gap-2">
          <LucideTrendingDown class="w-4 h-4 text-amber-400" />
          Inverting Amplifier
        </h2>
        <p class="text-xs text-slate-400">Gain = -R2/R1 (បញ្ច្រាសសញ្ញា)</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1"
            >R1 (Ω):</label
          >
          <input
            v-model.number="inv.r1"
            type="number"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1"
            >R2 (Ω):</label
          >
          <input
            v-model.number="inv.r2"
            type="number"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1"
            >Vin (V):</label
          >
          <input
            v-model.number="inv.vin"
            type="number"
            step="0.1"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      <div
        v-if="invResult"
        class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3"
      >
        <div class="grid grid-cols-3 gap-3">
          <div>
            <span class="text-xs text-slate-400 font-mono block">Gain</span>
            <div class="text-xl font-bold font-mono text-amber-400">
              {{ invResult.gainFormatted }}
            </div>
          </div>
          <div>
            <span class="text-xs text-slate-400 font-mono block"
              >Gain (dB)</span
            >
            <div class="text-xl font-bold font-mono text-amber-400">
              {{ invResult.gainDbFormatted }}
            </div>
          </div>
          <div>
            <span class="text-xs text-slate-400 font-mono block">Vout</span>
            <div class="text-xl font-bold font-mono text-emerald-400">
              {{ invResult.voutFormatted }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Low-Pass Filter -->
    <div
      v-if="mode === 'filter'"
      class="glass-card rounded-2xl p-5 sm:p-6 max-w-2xl mx-auto space-y-4"
    >
      <div class="border-b border-slate-800 pb-3">
        <h2 class="text-lg font-bold text-white flex items-center gap-2">
          <LucideWaves class="w-4 h-4 text-cyan-400" />
          Low-Pass Filter (RC)
        </h2>
        <p class="text-xs text-slate-400">fc = 1 / (2π·R·C)</p>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1"
            >R (Ω):</label
          >
          <input
            v-model.number="filter.r"
            type="number"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1"
            >C (µF):</label
          >
          <input
            v-model.number="filter.c"
            type="number"
            step="0.001"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      <div
        v-if="filterResult"
        class="bg-slate-950 p-4 rounded-xl border border-slate-800"
      >
        <span class="text-xs text-slate-400 font-mono block"
          >Cutoff Frequency (fc)</span
        >
        <div class="text-3xl font-bold font-mono text-cyan-400 mt-1">
          {{ filterResult.cutoffFormatted }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useOpAmpCalc } from "~/composables/core/useOpAmpCalc";

const { nonInverting, inverting, lowPassFilter } = useOpAmpCalc();

type Mode = "nonInv" | "inv" | "filter";
const mode = ref<Mode>("nonInv");

const modes = [
  { value: "nonInv", label: "Non-Inv", icon: "LucideTrendingUp" },
  { value: "inv", label: "Inverting", icon: "LucideTrendingDown" },
  { value: "filter", label: "LPF", icon: "LucideWaves" },
] as const;

const nonInv = ref({ r1: 1000, r2: 10000, vin: 1 });
const nonInvResult = computed(() =>
  nonInverting(nonInv.value.r1, nonInv.value.r2, nonInv.value.vin),
);

const inv = ref({ r1: 1000, r2: 10000, vin: 1 });
const invResult = computed(() =>
  inverting(inv.value.r1, inv.value.r2, inv.value.vin),
);

const filter = ref({ r: 1000, c: 1 });
const filterResult = computed(() =>
  lowPassFilter(filter.value.r, filter.value.c / 1e6),
);
</script>
