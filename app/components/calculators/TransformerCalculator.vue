<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
    <!-- Inputs -->
    <div class="lg:col-span-5 glass-card rounded-2xl p-5 sm:p-6 space-y-4">
      <div class="border-b border-slate-800 pb-3">
        <h2 class="text-lg font-bold text-white flex items-center gap-2">
          <LucideRotateCw class="w-4 h-4 text-cyan-400" />
          គណនា Transformer
        </h2>
        <p class="text-xs text-slate-400">Turns Ratio, Current, Power</p>
      </div>

      <div class="space-y-3">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            Primary Voltage (V):
          </label>
          <input
            v-model.number="tr.vPrimary"
            type="number"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            Secondary Voltage (V):
          </label>
          <input
            v-model.number="tr.vSecondary"
            type="number"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            Secondary Current (A):
          </label>
          <input
            v-model.number="tr.iSecondary"
            type="number"
            step="0.1"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            Primary Turns (ស្រេចចិត្ត):
          </label>
          <input
            v-model.number="tr.nPrimary"
            type="number"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      <div
        v-if="result"
        class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs font-mono"
      >
        <div>
          <span class="text-slate-400 block">Turns Ratio (Np/Ns)</span>
          <div class="text-2xl font-bold text-cyan-400 mt-1">
            {{ result.turnsRatioFormatted }}
          </div>
        </div>
        <div class="border-t border-slate-800 pt-2 space-y-1">
          <div class="flex justify-between">
            <span class="text-slate-400">Primary Current:</span>
            <span class="text-amber-400 font-bold">{{
              result.iPrimaryFormatted
            }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Power (VA):</span>
            <span class="text-emerald-400 font-bold">{{
              result.powerFormatted
            }}</span>
          </div>
          <div v-if="tr.nPrimary > 0" class="flex justify-between">
            <span class="text-slate-400">Secondary Turns:</span>
            <span class="text-cyan-400 font-bold">{{
              result.nSecondaryFormatted
            }}</span>
          </div>
        </div>
      </div>

      <button
        v-if="result"
        @click="saveToHistory"
        class="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors"
      >
        <LucideSave class="w-3.5 h-3.5" />
        រក្សាទុកប្រវត្តិ
      </button>
    </div>

    <!-- Schematic -->
    <div class="lg:col-span-7 glass-card rounded-2xl p-5 sm:p-6 space-y-4">
      <h3 class="text-base font-bold text-white border-b border-slate-800 pb-3">
        <LucideNetwork class="w-4 h-4 text-amber-400 mr-2 inline" />
        ដ្យាក្រាម Transformer
      </h3>

      <div class="bg-slate-950 border border-slate-800 rounded-2xl p-6">
        <svg viewBox="0 0 400 220" class="w-full">
          <!-- Primary coil -->
          <g stroke="#22d3ee" stroke-width="2.5" fill="none">
            <ellipse cx="130" cy="110" rx="8" ry="22" />
            <ellipse cx="150" cy="110" rx="8" ry="22" />
            <ellipse cx="170" cy="110" rx="8" ry="22" />
            <ellipse cx="190" cy="110" rx="8" ry="22" />
          </g>
          <text
            x="130"
            y="70"
            fill="#22d3ee"
            font-size="11"
            font-family="JetBrains Mono"
          >
            Primary
          </text>
          <line
            x1="60"
            y1="110"
            x2="122"
            y2="110"
            stroke="#cbd5e1"
            stroke-width="2"
          />
          <text
            x="20"
            y="115"
            fill="#cbd5e1"
            font-size="11"
            font-family="JetBrains Mono"
          >
            Vp
          </text>

          <!-- Core -->
          <line
            x1="200"
            y1="60"
            x2="200"
            y2="160"
            stroke="#94a3b8"
            stroke-width="4"
          />
          <line
            x1="210"
            y1="60"
            x2="210"
            y2="160"
            stroke="#94a3b8"
            stroke-width="4"
          />

          <!-- Secondary coil -->
          <g stroke="#10b981" stroke-width="2.5" fill="none">
            <ellipse cx="220" cy="110" rx="8" ry="22" />
            <ellipse cx="240" cy="110" rx="8" ry="22" />
            <ellipse cx="260" cy="110" rx="8" ry="22" />
            <ellipse cx="280" cy="110" rx="8" ry="22" />
            <ellipse cx="300" cy="110" rx="8" ry="22" />
          </g>
          <text
            x="240"
            y="70"
            fill="#10b981"
            font-size="11"
            font-family="JetBrains Mono"
          >
            Secondary
          </text>
          <line
            x1="308"
            y1="110"
            x2="360"
            y2="110"
            stroke="#cbd5e1"
            stroke-width="2"
          />
          <text
            x="365"
            y="115"
            fill="#cbd5e1"
            font-size="11"
            font-family="JetBrains Mono"
          >
            Vs
          </text>

          <!-- Bottom wires -->
          <line
            x1="60"
            y1="150"
            x2="130"
            y2="150"
            stroke="#cbd5e1"
            stroke-width="2"
          />
          <line
            x1="60"
            y1="110"
            x2="60"
            y2="150"
            stroke="#cbd5e1"
            stroke-width="2"
          />
          <line
            x1="280"
            y1="150"
            x2="360"
            y2="150"
            stroke="#cbd5e1"
            stroke-width="2"
          />
          <line
            x1="360"
            y1="110"
            x2="360"
            y2="150"
            stroke="#cbd5e1"
            stroke-width="2"
          />
        </svg>
      </div>

      <div
        class="text-xs font-mono text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800"
      >
        Turns Ratio = Vp / Vs = Np / Ns = Is / Ip
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTransformerCalc } from "~/composables/core/useTransformerCalc";

const historyStore = useHistoryStore();
const { calculate } = useTransformerCalc();

const tr = ref({
  vPrimary: 220,
  vSecondary: 12,
  iSecondary: 2,
  nPrimary: 1000,
});

const result = computed(() =>
  calculate(
    tr.value.vPrimary,
    tr.value.vSecondary,
    tr.value.iSecondary,
    tr.value.nPrimary,
  ),
);

const saveToHistory = () => {
  if (!result.value) return;
  historyStore.add({
    type: "transformer",
    title: `Transformer ${tr.value.vPrimary}V → ${tr.value.vSecondary}V`,
    value: result.value.powerFormatted,
    input: { ...tr.value },
  });
};
</script>
