<template>
  <div class="space-y-6">
    <!-- Mode Selector -->
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

    <!-- MODE 1: Load Caps -->
    <div
      v-if="mode === 'loadCaps'"
      class="grid grid-cols-1 lg:grid-cols-12 gap-6"
    >
      <div class="lg:col-span-5 glass-card rounded-2xl p-5 sm:p-6 space-y-4">
        <div class="border-b border-slate-800 pb-3">
          <h2 class="text-lg font-bold text-white flex items-center gap-2">
            <LucideCpu class="w-4 h-4 text-cyan-400" />
            Load Capacitors
          </h2>
          <p class="text-xs text-slate-400">គណនា C1, C2 សម្រាប់ Crystal</p>
        </div>

        <div class="space-y-3">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              Crystal Frequency:
            </label>
            <select
              v-model.number="loadCap.crystalIdx"
              @change="applyCrystalPreset"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            >
              <option v-for="(c, i) in commonCrystals" :key="i" :value="i">
                {{ c.label }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              Load Capacitance CL (pF):
            </label>
            <input
              v-model.number="loadCap.loadCap"
              type="number"
              step="0.5"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
            <p class="text-[10px] text-slate-500 mt-1">
              ធម្មតា: 12.5 pF, 18 pF, 20 pF (តាម datasheet)
            </p>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              Stray Capacitance (pF):
            </label>
            <input
              v-model.number="loadCap.strayCap"
              type="number"
              step="0.5"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
            <p class="text-[10px] text-slate-500 mt-1">
              ធម្មតា: 3–5 pF (PCB trace + pin capacitance)
            </p>
          </div>
        </div>

        <div
          v-if="loadCapResult"
          class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2"
        >
          <div>
            <span class="text-xs text-slate-400 font-mono block">
              Load Capacitors ត្រូវការ
            </span>
            <Transition name="fade-slide" mode="out-in">
              <div :key="loadCapResult.c1Formatted" class="mt-1">
                <div class="text-2xl font-bold font-mono text-cyan-400">
                  C1 = {{ loadCapResult.c1Formatted }}
                </div>
                <div class="text-2xl font-bold font-mono text-emerald-400">
                  C2 = {{ loadCapResult.c2Formatted }}
                </div>
              </div>
            </Transition>
          </div>

          <div
            class="border-t border-slate-800 pt-2 space-y-1 text-xs font-mono"
          >
            <div class="flex justify-between">
              <span class="text-slate-400">Standard Value:</span>
              <span class="text-amber-400 font-bold">
                {{ loadCapResult.nearestFormatted }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Actual CL:</span>
              <span class="text-slate-200">{{
                loadCapResult.actualCLFormatted
              }}</span>
            </div>
          </div>
        </div>

        <button
          v-if="loadCapResult && !loadCapResult.error"
          @click="saveLoadCaps"
          class="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors"
        >
          <LucideSave class="w-3.5 h-3.5" />
          រក្សាទុកប្រវត្តិ
        </button>
      </div>

      <div class="lg:col-span-7 glass-card rounded-2xl p-5 sm:p-6 space-y-4">
        <h3
          class="text-base font-bold text-white border-b border-slate-800 pb-3"
        >
          <LucideNetwork class="w-4 h-4 text-amber-400 mr-2 inline" />
          Pierce Oscillator Circuit
        </h3>

        <div class="bg-slate-950 border border-slate-800 rounded-2xl p-6">
          <svg viewBox="0 0 400 260" class="w-full">
            <!-- Inverter -->
            <polygon
              points="150,80 150,140 200,110"
              fill="none"
              stroke="#22d3ee"
              stroke-width="2"
            />
            <circle cx="205" cy="110" r="4" fill="#22d3ee" />

            <!-- Feedback Resistor (Rf) -->
            <rect
              x="200"
              y="50"
              width="40"
              height="15"
              fill="none"
              stroke="#f59e0b"
              stroke-width="2"
            />
            <text
              x="245"
              y="63"
              fill="#f59e0b"
              font-size="10"
              font-family="JetBrains Mono"
            >
              Rf
            </text>
            <line
              x1="150"
              y1="75"
              x2="150"
              y2="50"
              stroke="#cbd5e1"
              stroke-width="2"
            />
            <line
              x1="150"
              y1="50"
              x2="200"
              y2="50"
              stroke="#cbd5e1"
              stroke-width="2"
            />
            <line
              x1="240"
              y1="50"
              x2="250"
              y2="50"
              stroke="#cbd5e1"
              stroke-width="2"
            />
            <line
              x1="250"
              y1="50"
              x2="250"
              y2="110"
              stroke="#cbd5e1"
              stroke-width="2"
            />
            <line
              x1="205"
              y1="110"
              x2="250"
              y2="110"
              stroke="#cbd5e1"
              stroke-width="2"
            />

            <!-- Crystal -->
            <rect
              x="60"
              y="100"
              width="30"
              height="20"
              rx="2"
              fill="none"
              stroke="#10b981"
              stroke-width="2"
            />
            <line
              x1="50"
              y1="110"
              x2="60"
              y2="110"
              stroke="#cbd5e1"
              stroke-width="2"
            />
            <line
              x1="90"
              y1="110"
              x2="150"
              y2="110"
              stroke="#cbd5e1"
              stroke-width="2"
            />
            <text
              x="62"
              y="95"
              fill="#10b981"
              font-size="10"
              font-family="JetBrains Mono"
            >
              Y1
            </text>

            <!-- C1 -->
            <line
              x1="50"
              y1="110"
              x2="50"
              y2="180"
              stroke="#cbd5e1"
              stroke-width="2"
            />
            <line
              x1="40"
              y1="180"
              x2="60"
              y2="180"
              stroke="#cbd5e1"
              stroke-width="3"
            />
            <line
              x1="40"
              y1="185"
              x2="60"
              y2="185"
              stroke="#cbd5e1"
              stroke-width="3"
            />
            <text
              x="25"
              y="200"
              fill="#22d3ee"
              font-size="10"
              font-family="JetBrains Mono"
            >
              C1
            </text>

            <!-- C2 -->
            <line
              x1="150"
              y1="110"
              x2="150"
              y2="180"
              stroke="#cbd5e1"
              stroke-width="2"
            />
            <line
              x1="140"
              y1="180"
              x2="160"
              y2="180"
              stroke="#cbd5e1"
              stroke-width="3"
            />
            <line
              x1="140"
              y1="185"
              x2="160"
              y2="185"
              stroke="#cbd5e1"
              stroke-width="3"
            />
            <text
              x="165"
              y="200"
              fill="#22d3ee"
              font-size="10"
              font-family="JetBrains Mono"
            >
              C2
            </text>

            <!-- Ground -->
            <line
              x1="30"
              y1="220"
              x2="280"
              y2="220"
              stroke="#cbd5e1"
              stroke-width="2"
            />
            <line
              x1="50"
              y1="185"
              x2="50"
              y2="220"
              stroke="#cbd5e1"
              stroke-width="2"
            />
            <line
              x1="150"
              y1="185"
              x2="150"
              y2="220"
              stroke="#cbd5e1"
              stroke-width="2"
            />
            <line
              x1="100"
              y1="220"
              x2="100"
              y2="240"
              stroke="#cbd5e1"
              stroke-width="2"
            />
            <line
              x1="90"
              y1="240"
              x2="110"
              y2="240"
              stroke="#cbd5e1"
              stroke-width="2"
            />
            <line
              x1="94"
              y1="246"
              x2="106"
              y2="246"
              stroke="#cbd5e1"
              stroke-width="2"
            />

            <!-- Animated signal -->
            <circle r="3" fill="#f59e0b">
              <animate
                attributeName="cx"
                values="50;150"
                dur="1s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="cy"
                values="110;110"
                dur="1s"
                repeatCount="indefinite"
              />
            </circle>

            <!-- Labels -->
            <text
              x="270"
              y="115"
              fill="#22d3ee"
              font-size="10"
              font-family="JetBrains Mono"
            >
              Output
            </text>
            <text
              x="20"
              y="60"
              fill="#94a3b8"
              font-size="10"
              font-family="JetBrains Mono"
            >
              Pierce Oscillator
            </text>
          </svg>
        </div>

        <div
          class="text-xs font-mono text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800"
        >
          <p class="text-cyan-400 font-bold mb-1">Pierce Oscillator:</p>
          <p>C1 = C2 = 2 × (CL − Cstray)</p>
          <p class="text-slate-500 mt-1">Rf ≈ 1MΩ (MHz) / 10MΩ (32kHz)</p>
        </div>
      </div>
    </div>

    <!-- MODE 2: Resonance -->
    <div
      v-if="mode === 'resonance'"
      class="grid grid-cols-1 lg:grid-cols-2 gap-6"
    >
      <div class="glass-card rounded-2xl p-5 sm:p-6 space-y-4">
        <div class="border-b border-slate-800 pb-3">
          <h2 class="text-lg font-bold text-white flex items-center gap-2">
            <LucideActivity class="w-4 h-4 text-cyan-400" />
            Series Resonance (Fs)
          </h2>
          <p class="text-xs text-slate-400">Fs = 1 / (2π × √(L1 × C1))</p>
        </div>

        <div class="space-y-3">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              Motional Inductance L1 (mH):
            </label>
            <input
              v-model.number="resonance.inductance"
              type="number"
              step="0.1"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              Motional Capacitance C1 (fF):
            </label>
            <input
              v-model.number="resonance.capacitance"
              type="number"
              step="0.1"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div
          v-if="seriesResult"
          class="bg-slate-950 p-4 rounded-xl border border-slate-800"
        >
          <span class="text-xs text-slate-400 font-mono block"
            >Series Freq (Fs)</span
          >
          <div class="text-3xl font-bold font-mono text-cyan-400 mt-1">
            {{ seriesResult.frequencyFormatted }}
          </div>
        </div>
      </div>

      <div class="glass-card rounded-2xl p-5 sm:p-6 space-y-4">
        <div class="border-b border-slate-800 pb-3">
          <h2 class="text-lg font-bold text-white flex items-center gap-2">
            <LucideActivity class="w-4 h-4 text-amber-400" />
            Parallel Resonance (Fp)
          </h2>
          <p class="text-xs text-slate-400">Fp = Fs × √(1 + C1/C0)</p>
        </div>

        <div class="space-y-3">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              Series Frequency Fs (Hz):
            </label>
            <input
              v-model.number="parallel.seriesFreq"
              type="number"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              Motional Cap C1 (fF):
            </label>
            <input
              v-model.number="parallel.c1"
              type="number"
              step="0.1"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              Shunt Cap C0 (pF):
            </label>
            <input
              v-model.number="parallel.c0"
              type="number"
              step="0.1"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div
          v-if="parallelResult"
          class="bg-slate-950 p-4 rounded-xl border border-slate-800"
        >
          <span class="text-xs text-slate-400 font-mono block"
            >Parallel Freq (Fp)</span
          >
          <div class="text-3xl font-bold font-mono text-amber-400 mt-1">
            {{ parallelResult.frequencyFormatted }}
          </div>
        </div>
      </div>
    </div>

    <!-- MODE 3: Pullability -->
    <div
      v-if="mode === 'pull'"
      class="glass-card rounded-2xl p-5 sm:p-6 max-w-3xl mx-auto space-y-4"
    >
      <div class="border-b border-slate-800 pb-3">
        <h2 class="text-lg font-bold text-white flex items-center gap-2">
          <LucideTrendingUp class="w-4 h-4 text-purple-400" />
          Pullability Calculator
        </h2>
        <p class="text-xs text-slate-400">
          ΔF/F = (C1/2) × (1/(C0+CL) − 1/(C0+CL₀))
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            Nominal Frequency (Hz):
          </label>
          <input
            v-model.number="pull.nominalFreq"
            type="number"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            Motional Cap C1 (fF):
          </label>
          <input
            v-model.number="pull.c1"
            type="number"
            step="0.1"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            Shunt Cap C0 (pF):
          </label>
          <input
            v-model.number="pull.c0"
            type="number"
            step="0.1"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            Load Cap 1 (pF):
          </label>
          <input
            v-model.number="pull.cl1"
            type="number"
            step="0.5"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            Load Cap 2 (pF):
          </label>
          <input
            v-model.number="pull.cl2"
            type="number"
            step="0.5"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      <div
        v-if="pullResult"
        class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2"
      >
        <div>
          <span class="text-xs text-slate-400 font-mono block">
            Frequency Shift
          </span>
          <div class="text-2xl font-bold font-mono text-purple-400 mt-1">
            {{ pullResult.deltaFFormatted }}
          </div>
          <div class="text-lg font-bold font-mono text-cyan-400">
            {{ pullResult.deltaHzFormatted }}
          </div>
        </div>
      </div>
    </div>

    <!-- MODE 4: Drive Power -->
    <div
      v-if="mode === 'power'"
      class="glass-card rounded-2xl p-5 sm:p-6 max-w-2xl mx-auto space-y-4"
    >
      <div class="border-b border-slate-800 pb-3">
        <h2 class="text-lg font-bold text-white flex items-center gap-2">
          <LucideZap class="w-4 h-4 text-amber-400" />
          Drive Power Calculator
        </h2>
        <p class="text-xs text-slate-400">
          P = I² × ESR ដែល I = 2π × F × V × C1
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            Frequency (Hz):
          </label>
          <input
            v-model.number="power.frequency"
            type="number"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            Drive Voltage (V):
          </label>
          <input
            v-model.number="power.voltage"
            type="number"
            step="0.1"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            Motional Cap C1 (fF):
          </label>
          <input
            v-model.number="power.c1"
            type="number"
            step="0.1"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            ESR (Ω):
          </label>
          <input
            v-model.number="power.esr"
            type="number"
            step="1"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      <div
        v-if="powerResult"
        class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs font-mono"
      >
        <div class="flex justify-between">
          <span class="text-slate-400">Crystal Current:</span>
          <span class="text-amber-400 font-bold">{{
            powerResult.currentFormatted
          }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-slate-400">Drive Power:</span>
          <span class="text-red-400 font-bold">{{
            powerResult.powerFormatted
          }}</span>
        </div>
        <p class="text-[10px] text-slate-500 pt-2 border-t border-slate-800">
          ⚠️ ត្រូវធ្វើឱ្យតម្លៃតិចជាង Drive Level ក្នុង datasheet
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCrystalCalc } from "~/composables/core/useCrystalCalc";

const historyStore = useHistoryStore();
const {
  commonCrystals,
  calculateLoadCaps,
  calculateSeriesResonance,
  calculateParallelResonance,
  calculatePullability,
  calculateDrivePower,
} = useCrystalCalc();

type Mode = "loadCaps" | "resonance" | "pull" | "power";
const mode = ref<Mode>("loadCaps");

const modes = [
  { value: "loadCaps", label: "Load Caps", icon: "LucideCpu" },
  { value: "resonance", label: "Resonance", icon: "LucideActivity" },
  { value: "pull", label: "Pullability", icon: "LucideTrendingUp" },
  { value: "power", label: "Drive Power", icon: "LucideZap" },
] as const;

// MODE 1: Load Caps
const loadCap = ref({
  crystalIdx: 3, // 8 MHz
  loadCap: 18,
  strayCap: 5,
});

const applyCrystalPreset = () => {
  // optional: auto-adjust load cap based on crystal
};

const loadCapResult = computed(() =>
  calculateLoadCaps(loadCap.value.loadCap, loadCap.value.strayCap),
);

// MODE 2: Resonance
const resonance = ref({ inductance: 100, capacitance: 1 });
const seriesResult = computed(() =>
  calculateSeriesResonance(
    resonance.value.inductance,
    resonance.value.capacitance,
  ),
);

const parallel = ref({ seriesFreq: 8e6, c1: 1, c0: 5 });
const parallelResult = computed(() =>
  calculateParallelResonance(
    parallel.value.seriesFreq,
    parallel.value.c1,
    parallel.value.c0,
  ),
);

// MODE 3: Pullability
const pull = ref({
  nominalFreq: 8e6,
  c1: 1,
  c0: 5,
  cl1: 12.5,
  cl2: 18,
});

const pullResult = computed(() =>
  calculatePullability(
    pull.value.nominalFreq,
    pull.value.c1,
    pull.value.c0,
    pull.value.cl1,
    pull.value.cl2,
  ),
);

// MODE 4: Drive Power
const power = ref({ frequency: 8e6, voltage: 1, c1: 1, esr: 100 });
const powerResult = computed(() =>
  calculateDrivePower(
    power.value.frequency,
    power.value.voltage,
    power.value.c1,
    power.value.esr,
  ),
);

// Actions
const saveToHistory = (title: string, value: string) => {
  historyStore.add({
    type: "transistor",
    title: `Crystal ${title}`,
    value,
    input: { ...loadCap.value },
  });
};

const saveLoadCaps = () => {
  const result = loadCapResult.value;

  if (!result) return;
  if (result.error) return;
  if (!result.nearestFormatted) return;

  saveToHistory("Crystal Load Caps", result.nearestFormatted);
};
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.25s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
