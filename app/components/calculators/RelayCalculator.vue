<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
    <!-- Inputs -->
    <div class="lg:col-span-5 glass-card rounded-2xl p-5 sm:p-6 space-y-4">
      <div class="border-b border-slate-800 pb-3">
        <h2 class="text-lg font-bold text-white flex items-center gap-2">
          <LucideToggleRight class="w-4 h-4 text-cyan-400" />
          គណនា Relay Driver
        </h2>
        <p class="text-xs text-slate-400">
          គណនា Base Resistor សម្រាប់បញ្ជា Relay តាម Transistor
        </p>
      </div>

      <div class="space-y-3">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            តង់ស្យុង Coil (V):
          </label>
          <input
            v-model.number="relay.vCoil"
            type="number"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            រេស៊ីស្តង់ Coil (Ω):
          </label>
          <input
            v-model.number="relay.rCoil"
            type="number"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            តង់ស្យុង Drive (V):
          </label>
          <input
            v-model.number="relay.vDrive"
            type="number"
            step="0.1"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            hFE របស់ Transistor:
          </label>
          <input
            v-model.number="relay.hFE"
            type="number"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            Overdrive Factor (3–10):
          </label>
          <input
            v-model.number="relay.overdrive"
            type="number"
            min="3"
            max="10"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      <div
        v-if="result"
        class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs font-mono"
      >
        <div>
          <span class="text-slate-400 block">Base Resistor (Rb)</span>
          <div class="text-2xl font-bold text-cyan-400 mt-1">
            {{ result.rBFormatted }}
          </div>
        </div>
        <div class="border-t border-slate-800 pt-2 space-y-1">
          <div class="flex justify-between">
            <span class="text-slate-400">Coil Current:</span>
            <span class="text-amber-400 font-bold">{{
              result.iCoilFormatted
            }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Power Rb:</span>
            <span class="text-emerald-400 font-bold">{{
              result.pRFormatted
            }}</span>
          </div>
        </div>
        <div class="border-t border-slate-800 pt-2">
          <span class="text-slate-400 block">Flyback Diode:</span>
          <span class="text-cyan-400 font-mono text-[11px]">{{
            result.diode
          }}</span>
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
        ដ្យាក្រាម Relay Driver
      </h3>

      <div class="bg-slate-950 border border-slate-800 rounded-2xl p-6">
        <svg viewBox="0 0 400 260" class="w-full">
          <!-- VCC Rail -->
          <line
            x1="50"
            y1="30"
            x2="350"
            y2="30"
            stroke="#f59e0b"
            stroke-width="3"
          />
          <text
            x="360"
            y="35"
            fill="#f59e0b"
            font-size="12"
            font-family="JetBrains Mono"
          >
            Vcc
          </text>

          <!-- Relay Coil -->
          <rect
            x="180"
            y="60"
            width="40"
            height="40"
            rx="4"
            fill="none"
            stroke="#22d3ee"
            stroke-width="2"
          />
          <text
            x="230"
            y="85"
            fill="#22d3ee"
            font-size="11"
            font-family="JetBrains Mono"
          >
            Relay Coil
          </text>
          <line
            x1="200"
            y1="30"
            x2="200"
            y2="60"
            stroke="#cbd5e1"
            stroke-width="2"
          />

          <!-- Flyback Diode -->
          <polygon points="240,70 240,90 260,80" fill="#f59e0b" />
          <line
            x1="260"
            y1="70"
            x2="260"
            y2="90"
            stroke="#f59e0b"
            stroke-width="2"
          />
          <text
            x="265"
            y="85"
            fill="#f59e0b"
            font-size="10"
            font-family="JetBrains Mono"
          >
            1N4148
          </text>
          <line
            x1="220"
            y1="80"
            x2="240"
            y2="80"
            stroke="#cbd5e1"
            stroke-width="2"
          />
          <line
            x1="260"
            y1="80"
            x2="280"
            y2="80"
            stroke="#cbd5e1"
            stroke-width="2"
          />
          <line
            x1="280"
            y1="30"
            x2="280"
            y2="80"
            stroke="#cbd5e1"
            stroke-width="2"
          />

          <!-- Transistor -->
          <circle
            cx="200"
            cy="160"
            r="25"
            fill="none"
            stroke="#10b981"
            stroke-width="2"
          />
          <line
            x1="185"
            y1="145"
            x2="185"
            y2="175"
            stroke="#10b981"
            stroke-width="3"
          />
          <line
            x1="185"
            y1="150"
            x2="215"
            y2="140"
            stroke="#10b981"
            stroke-width="2"
          />
          <line
            x1="185"
            y1="170"
            x2="215"
            y2="180"
            stroke="#10b981"
            stroke-width="2"
          />

          <!-- Connections -->
          <line
            x1="200"
            y1="100"
            x2="200"
            y2="135"
            stroke="#cbd5e1"
            stroke-width="2"
          />
          <line
            x1="215"
            y1="180"
            x2="250"
            y2="180"
            stroke="#cbd5e1"
            stroke-width="2"
          />

          <!-- Base Resistor -->
          <rect
            x="80"
            y="150"
            width="40"
            height="20"
            fill="none"
            stroke="#f59e0b"
            stroke-width="2"
          />
          <text
            x="90"
            y="190"
            fill="#f59e0b"
            font-size="11"
            font-family="JetBrains Mono"
          >
            Rb
          </text>
          <line
            x1="50"
            y1="160"
            x2="80"
            y2="160"
            stroke="#cbd5e1"
            stroke-width="2"
          />
          <line
            x1="120"
            y1="160"
            x2="185"
            y2="160"
            stroke="#cbd5e1"
            stroke-width="2"
          />

          <!-- Vin -->
          <text
            x="30"
            y="165"
            fill="#cbd5e1"
            font-size="12"
            font-family="JetBrains Mono"
          >
            Vin
          </text>

          <!-- Ground -->
          <line
            x1="250"
            y1="180"
            x2="250"
            y2="220"
            stroke="#cbd5e1"
            stroke-width="2"
          />
          <line
            x1="240"
            y1="220"
            x2="260"
            y2="220"
            stroke="#cbd5e1"
            stroke-width="2"
          />
          <line
            x1="244"
            y1="226"
            x2="256"
            y2="226"
            stroke="#cbd5e1"
            stroke-width="2"
          />

          <!-- Animated current -->
          <circle r="3" fill="#22d3ee">
            <animate
              attributeName="cy"
              from="30"
              to="135"
              dur="2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="cx"
              values="200;200"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      </div>

      <div
        class="text-xs font-mono text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800"
      >
        Rb = (Vdrive − 0.7) / (Icoil / hFE × Overdrive)
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRelayCalc } from "~/composables/core/useRelayCalc";

const historyStore = useHistoryStore();
const { calculateDriver } = useRelayCalc();

const relay = ref({
  vCoil: 12,
  rCoil: 400,
  vDrive: 5,
  hFE: 100,
  overdrive: 3,
});

const result = computed(() =>
  calculateDriver(
    relay.value.vCoil,
    relay.value.rCoil,
    relay.value.vDrive,
    relay.value.hFE,
    relay.value.overdrive,
  ),
);

const saveToHistory = () => {
  if (!result.value) return;
  historyStore.add({
    type: "transistor",
    title: "Relay Driver",
    value: result.value.rBFormatted,
    input: { ...relay.value },
  });
};
</script>
