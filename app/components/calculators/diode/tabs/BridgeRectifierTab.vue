<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
    <div class="lg:col-span-5 glass-card rounded-2xl p-5 sm:p-6 space-y-4">
      <div class="border-b border-slate-800 pb-3">
        <h2 class="text-lg font-bold text-white flex items-center gap-2">
          <LucideGitBranch class="w-4 h-4 text-cyan-400" />
          គណនា Bridge Rectifier
        </h2>
        <p class="text-xs text-slate-400">AC → DC Full-wave rectification</p>
      </div>

      <div class="space-y-3">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            តង់ស្យុង AC ចូល (Vrms) - V:
          </label>
          <input
            v-model.number="bridge.vAcIn"
            type="number"
            step="0.1"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            ចរន្ត Load (IL) - A:
          </label>
          <input
            v-model.number="bridge.iLoad"
            type="number"
            step="0.01"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            Ripple Voltage ត្រូវការ (V):
          </label>
          <input
            v-model.number="bridge.vRipple"
            type="number"
            step="0.1"
            placeholder="e.g. 1"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      <div
        v-if="bridgeResult"
        class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs font-mono"
      >
        <div class="flex justify-between">
          <span class="text-slate-400">តង់ស្យុង Peak:</span>
          <span class="text-cyan-400 font-bold">{{
            bridgeResult.vPeakFormatted
          }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-slate-400">តង់ស្យុង DC (Avg):</span>
          <span class="text-emerald-400 font-bold">{{
            bridgeResult.vDcFormatted
          }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-slate-400">តង់ស្យុង DC (Real):</span>
          <span class="text-amber-400 font-bold">{{
            bridgeResult.vDcRealFormatted
          }}</span>
        </div>
        <div class="flex justify-between pt-2 border-t border-slate-800">
          <span class="text-slate-400">Vr ត្រូវការ / Diode:</span>
          <span class="text-cyan-400 font-bold">{{
            bridgeResult.vReverseFormatted
          }}</span>
        </div>
        <div
          v-if="filterCapResult"
          class="flex justify-between pt-2 border-t border-slate-800"
        >
          <span class="text-slate-400">Filter Capacitor:</span>
          <span class="text-purple-400 font-bold">{{
            filterCapResult.formatted
          }}</span>
        </div>
      </div>
    </div>

    <div class="lg:col-span-7 glass-card rounded-2xl p-5 sm:p-6 space-y-4">
      <h3 class="text-base font-bold text-white border-b border-slate-800 pb-3">
        <LucideNetwork class="w-4 h-4 text-amber-400 mr-2 inline" />
        ដ្យាក្រាម Bridge Rectifier
      </h3>

      <div class="bg-slate-950 border border-slate-800 rounded-2xl p-6">
        <svg viewBox="0 0 400 240" class="w-full">
          <text
            x="20"
            y="30"
            fill="#cbd5e1"
            font-size="12"
            font-family="JetBrains Mono"
          >
            AC
          </text>
          <line
            x1="50"
            y1="80"
            x2="100"
            y2="80"
            stroke="#cbd5e1"
            stroke-width="2"
          />
          <line
            x1="50"
            y1="160"
            x2="100"
            y2="160"
            stroke="#cbd5e1"
            stroke-width="2"
          />

          <g fill="none" stroke="#22d3ee" stroke-width="2">
            <polygon points="150,70 170,90 150,110 130,90" />
            <polygon points="250,70 270,90 250,110 230,90" />
            <polygon points="150,130 170,150 150,170 130,150" />
            <polygon points="250,130 270,150 250,170 230,150" />
          </g>

          <line
            x1="100"
            y1="80"
            x2="130"
            y2="90"
            stroke="#cbd5e1"
            stroke-width="2"
          />
          <line
            x1="100"
            y1="160"
            x2="130"
            y2="150"
            stroke="#cbd5e1"
            stroke-width="2"
          />
          <line
            x1="170"
            y1="90"
            x2="230"
            y2="90"
            stroke="#cbd5e1"
            stroke-width="2"
          />
          <line
            x1="170"
            y1="150"
            x2="230"
            y2="150"
            stroke="#cbd5e1"
            stroke-width="2"
          />
          <line
            x1="270"
            y1="90"
            x2="320"
            y2="90"
            stroke="#cbd5e1"
            stroke-width="2"
          />
          <line
            x1="270"
            y1="150"
            x2="320"
            y2="150"
            stroke="#cbd5e1"
            stroke-width="2"
          />

          <text
            x="330"
            y="85"
            fill="#10b981"
            font-size="12"
            font-family="JetBrains Mono"
          >
            + DC
          </text>
          <text
            x="330"
            y="165"
            fill="#10b981"
            font-size="12"
            font-family="JetBrains Mono"
          >
            - DC
          </text>
        </svg>
      </div>

      <div
        class="text-xs font-mono text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800"
      >
        Vdc = 2√2 × Vrms / π − 2Vf ; C = IL / (2 × f × Vripple)
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDiode } from "~/composables/core/useDiode";

const { calculateBridge, calculateFilterCap } = useDiode();

const bridge = ref({
  vAcIn: 12,
  iLoad: 0.5,
  vRipple: 1,
});

const bridgeResult = computed(() =>
  calculateBridge(bridge.value.vAcIn, bridge.value.iLoad),
);

const filterCapResult = computed(() => {
  if (!bridge.value.vRipple || bridge.value.vRipple <= 0) return null;
  return calculateFilterCap(bridge.value.iLoad, bridge.value.vRipple);
});
</script>
