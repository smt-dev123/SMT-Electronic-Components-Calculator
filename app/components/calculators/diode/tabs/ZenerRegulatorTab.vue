<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
    <div class="lg:col-span-5 glass-card rounded-2xl p-5 sm:p-6 space-y-4">
      <div class="border-b border-slate-800 pb-3">
        <h2 class="text-lg font-bold text-white flex items-center gap-2">
          <LucideZap class="w-4 h-4 text-amber-400" />
          គណនា Zener Regulator
        </h2>
        <p class="text-xs text-slate-400">រក R សមស្របសម្រាប់ស្ថេរភាពតង់ស្យុង</p>
      </div>

      <div class="space-y-3">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            តង់ស្យុងចូល (Vin) - V:
          </label>
          <input
            v-model.number="zener.vIn"
            type="number"
            step="0.1"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            តង់ស្យុង Zener (Vz) - V:
          </label>
          <input
            v-model.number="zener.vZener"
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
            v-model.number="zener.iLoad"
            type="number"
            step="0.001"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      <div
        v-if="zenerResult"
        class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2"
      >
        <div>
          <span class="text-xs text-slate-400 font-mono block">
            រេស៊ីស្តង់សមស្រប (Recommended R)
          </span>
          <div class="text-2xl font-bold font-mono text-cyan-400">
            {{ zenerResult.rFormatted }}
          </div>
          <div class="text-[10px] text-slate-500 font-mono mt-1">
            Range: {{ zenerResult.rMinFormatted }} -
            {{ zenerResult.rMaxFormatted }}
          </div>
        </div>

        <div class="border-t border-slate-800 pt-2 space-y-1 text-xs font-mono">
          <div class="flex justify-between">
            <span class="text-slate-400">អានុភាព R:</span>
            <span class="text-amber-400 font-bold">
              {{ zenerResult.pResistorFormatted }}
            </span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">អានុភាព Zener:</span>
            <span class="text-emerald-400 font-bold">
              {{ zenerResult.pZenerFormatted }}
            </span>
          </div>
        </div>
      </div>

      <button
        v-if="zenerResult"
        @click="saveToHistory"
        class="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors"
      >
        <LucideSave class="w-3.5 h-3.5" />
        រក្សាទុកប្រវត្តិ
      </button>
    </div>

    <div class="lg:col-span-7 glass-card rounded-2xl p-5 sm:p-6 space-y-4">
      <h3 class="text-base font-bold text-white border-b border-slate-800 pb-3">
        <LucideNetwork class="w-4 h-4 text-cyan-400 mr-2 inline" />
        ដ្យាក្រាម Zener Regulator
      </h3>

      <div class="bg-slate-950 border border-slate-800 rounded-2xl p-6">
        <svg viewBox="0 0 400 220" class="w-full">
          <text
            x="20"
            y="30"
            fill="#cbd5e1"
            font-size="12"
            font-family="JetBrains Mono"
          >
            Vin
          </text>
          <line
            x1="20"
            y1="50"
            x2="120"
            y2="50"
            stroke="#cbd5e1"
            stroke-width="2"
          />

          <rect
            x="120"
            y="40"
            width="40"
            height="20"
            fill="none"
            stroke="#22d3ee"
            stroke-width="2"
          />
          <text
            x="130"
            y="80"
            fill="#22d3ee"
            font-size="11"
            font-family="JetBrains Mono"
          >
            R
          </text>

          <line
            x1="160"
            y1="50"
            x2="280"
            y2="50"
            stroke="#cbd5e1"
            stroke-width="2"
          />

          <line
            x1="240"
            y1="50"
            x2="240"
            y2="90"
            stroke="#cbd5e1"
            stroke-width="2"
          />
          <polygon points="230,90 250,90 240,110" fill="#f59e0b" />
          <line
            x1="230"
            y1="110"
            x2="250"
            y2="110"
            stroke="#f59e0b"
            stroke-width="3"
          />
          <line
            x1="230"
            y1="115"
            x2="250"
            y2="115"
            stroke="#f59e0b"
            stroke-width="3"
          />
          <text
            x="260"
            y="105"
            fill="#f59e0b"
            font-size="11"
            font-family="JetBrains Mono"
          >
            Zener
          </text>
          <line
            x1="240"
            y1="115"
            x2="240"
            y2="170"
            stroke="#cbd5e1"
            stroke-width="2"
          />

          <text
            x="300"
            y="55"
            fill="#10b981"
            font-size="12"
            font-family="JetBrains Mono"
          >
            Vout
          </text>
          <line
            x1="280"
            y1="50"
            x2="320"
            y2="50"
            stroke="#cbd5e1"
            stroke-width="2"
          />

          <rect
            x="300"
            y="80"
            width="30"
            height="40"
            fill="none"
            stroke="#cbd5e1"
            stroke-width="2"
          />
          <text
            x="305"
            y="140"
            fill="#cbd5e1"
            font-size="10"
            font-family="JetBrains Mono"
          >
            Load
          </text>
          <line
            x1="315"
            y1="50"
            x2="315"
            y2="80"
            stroke="#cbd5e1"
            stroke-width="2"
          />
          <line
            x1="315"
            y1="120"
            x2="315"
            y2="170"
            stroke="#cbd5e1"
            stroke-width="2"
          />

          <line
            x1="20"
            y1="170"
            x2="320"
            y2="170"
            stroke="#cbd5e1"
            stroke-width="2"
          />

          <circle r="4" fill="#22d3ee">
            <animate
              attributeName="cx"
              from="20"
              to="240"
              dur="2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="cy"
              values="50;50"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      </div>

      <div
        class="text-xs font-mono text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800"
      >
        R = (Vin - Vz) / (Iz + IL) — ជ្រើសរើស R ក្នុងចន្លោះ Rmin និង Rmax
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDiode } from "~/composables/core/useDiode";

const historyStore = useHistoryStore();
const { calculateZenerResistor } = useDiode();

const zener = ref({ vIn: 12, vZener: 5.1, iLoad: 0.02 });

const zenerResult = computed(() =>
  calculateZenerResistor(
    zener.value.vIn,
    zener.value.vZener,
    zener.value.iLoad,
  ),
);

const saveToHistory = () => {
  if (!zenerResult.value) return;
  historyStore.add({
    type: "diode",
    title: "Zener Regulator",
    value: zenerResult.value.rFormatted,
    input: { ...zener.value },
  });
};
</script>
