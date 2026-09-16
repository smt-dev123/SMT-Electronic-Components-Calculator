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

    <!-- LM317 Adjustable -->
    <div v-if="mode === 'lm317'" class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div class="lg:col-span-5 glass-card rounded-2xl p-5 sm:p-6 space-y-4">
        <div class="border-b border-slate-800 pb-3">
          <h2 class="text-lg font-bold text-white flex items-center gap-2">
            <LucideBattery class="w-4 h-4 text-cyan-400" />
            LM317 Adjustable Regulator
          </h2>
          <p class="text-xs text-slate-400">Vout = 1.25 × (1 + R2/R1)</p>
        </div>

        <div class="space-y-3">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              R1 (Ω):
            </label>
            <input
              v-model.number="lm317.r1"
              type="number"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              R2 (Ω) — Potentiometer:
            </label>
            <input
              v-model.number="lm317.r2"
              type="number"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div
          v-if="lm317Result"
          class="bg-slate-950 p-4 rounded-xl border border-slate-800"
        >
          <span class="text-xs text-slate-400 font-mono block">
            Output Voltage (Vout)
          </span>
          <div class="text-3xl font-bold font-mono text-cyan-400 mt-1">
            {{ lm317Result.voutFormatted }}
          </div>
          <p class="text-[10px] text-slate-500 mt-2 font-mono">
            R1 ធម្មតា = 240 Ω | Vref = 1.25 V
          </p>
        </div>
      </div>

      <!-- Schematic -->
      <div class="lg:col-span-7 glass-card rounded-2xl p-5 sm:p-6 space-y-4">
        <h3
          class="text-base font-bold text-white border-b border-slate-800 pb-3"
        >
          <LucideNetwork class="w-4 h-4 text-amber-400 mr-2 inline" />
          ដ្យាក្រាម LM317
        </h3>

        <div class="bg-slate-950 border border-slate-800 rounded-2xl p-6">
          <svg viewBox="0 0 400 220" class="w-full">
            <!-- Vin -->
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
              x2="150"
              y2="50"
              stroke="#cbd5e1"
              stroke-width="2"
            />

            <!-- LM317 Box -->
            <rect
              x="150"
              y="30"
              width="100"
              height="60"
              rx="4"
              fill="none"
              stroke="#22d3ee"
              stroke-width="2"
            />
            <text
              x="175"
              y="65"
              fill="#22d3ee"
              font-size="11"
              font-family="JetBrains Mono"
            >
              LM317
            </text>

            <!-- Vout line -->
            <line
              x1="250"
              y1="50"
              x2="350"
              y2="50"
              stroke="#10b981"
              stroke-width="2"
            />
            <text
              x="355"
              y="55"
              fill="#10b981"
              font-size="12"
              font-family="JetBrains Mono"
            >
              Vout
            </text>

            <!-- R1 -->
            <rect
              x="240"
              y="90"
              width="20"
              height="40"
              fill="none"
              stroke="#f59e0b"
              stroke-width="2"
            />
            <text
              x="265"
              y="115"
              fill="#f59e0b"
              font-size="10"
              font-family="JetBrains Mono"
            >
              R1
            </text>

            <!-- R2 -->
            <rect
              x="240"
              y="140"
              width="20"
              height="40"
              fill="none"
              stroke="#f59e0b"
              stroke-width="2"
            />
            <text
              x="265"
              y="165"
              fill="#f59e0b"
              font-size="10"
              font-family="JetBrains Mono"
            >
              R2
            </text>

            <!-- Connections -->
            <line
              x1="250"
              y1="60"
              x2="250"
              y2="90"
              stroke="#cbd5e1"
              stroke-width="2"
            />
            <line
              x1="250"
              y1="130"
              x2="250"
              y2="140"
              stroke="#cbd5e1"
              stroke-width="2"
            />
            <line
              x1="250"
              y1="180"
              x2="250"
              y2="200"
              stroke="#cbd5e1"
              stroke-width="2"
            />

            <!-- ADJ pin -->
            <line
              x1="220"
              y1="90"
              x2="220"
              y2="100"
              stroke="#cbd5e1"
              stroke-width="2"
            />
            <line
              x1="220"
              y1="100"
              x2="250"
              y2="110"
              stroke="#cbd5e1"
              stroke-width="2"
            />

            <!-- Ground -->
            <line
              x1="20"
              y1="200"
              x2="250"
              y2="200"
              stroke="#cbd5e1"
              stroke-width="2"
            />
            <line
              x1="150"
              y1="200"
              x2="150"
              y2="215"
              stroke="#cbd5e1"
              stroke-width="2"
            />
            <line
              x1="140"
              y1="215"
              x2="160"
              y2="215"
              stroke="#cbd5e1"
              stroke-width="2"
            />
          </svg>
        </div>

        <div
          class="text-xs font-mono text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800"
        >
          Vout = 1.25 × (1 + R2 / R1)
        </div>
      </div>
    </div>

    <!-- Fixed Regulator (78XX) -->
    <div v-if="mode === 'fixed'" class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div class="lg:col-span-5 glass-card rounded-2xl p-5 sm:p-6 space-y-4">
        <div class="border-b border-slate-800 pb-3">
          <h2 class="text-lg font-bold text-white flex items-center gap-2">
            <LucideZap class="w-4 h-4 text-amber-400" />
            Fixed Regulator (78XX / 79XX)
          </h2>
          <p class="text-xs text-slate-400">គណនាការសាយភាយកម្ដៅ</p>
        </div>

        <div class="space-y-3">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              តង់ស្យុងចូល Vin (V):
            </label>
            <input
              v-model.number="fixed.vin"
              type="number"
              step="0.1"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              តង់ស្យុងចេញ Vout (V):
            </label>
            <select
              v-model.number="fixed.vout"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            >
              <option :value="3.3">3.3V (LM7833)</option>
              <option :value="5">5V (LM7805)</option>
              <option :value="6">6V (LM7806)</option>
              <option :value="9">9V (LM7809)</option>
              <option :value="12">12V (LM7812)</option>
              <option :value="15">15V (LM7815)</option>
              <option :value="24">24V (LM7824)</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              ចរន្ត Load (A):
            </label>
            <input
              v-model.number="fixed.iLoad"
              type="number"
              step="0.01"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div
          v-if="fixedResult"
          class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs font-mono"
        >
          <div>
            <span class="text-slate-400 block">អានុភាពសាយភាយ (Power Loss)</span>
            <div class="text-2xl font-bold text-amber-400 mt-1">
              {{ fixedResult.powerLossFormatted }}
            </div>
          </div>
          <div class="border-t border-slate-800 pt-2 space-y-1">
            <div class="flex justify-between">
              <span class="text-slate-400">Efficiency:</span>
              <span class="text-emerald-400 font-bold">{{
                fixedResult.efficiencyFormatted
              }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Heatsink:</span>
              <span
                :class="
                  fixedResult.needsHeatsink
                    ? 'text-red-400'
                    : 'text-emerald-400'
                "
                class="font-bold"
              >
                {{ fixedResult.needsHeatsink ? "ត្រូវការ" : "មិនចាំបាច់" }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-7 glass-card rounded-2xl p-5 sm:p-6 space-y-4">
        <h3
          class="text-base font-bold text-white border-b border-slate-800 pb-3"
        >
          <LucideThermometer class="w-4 h-4 text-amber-400 mr-2 inline" />
          ព័ត៌មាន Heatsink
        </h3>

        <div
          class="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4"
        >
          <div class="grid grid-cols-3 gap-3 text-center text-xs font-mono">
            <div class="p-3 bg-slate-900 rounded-lg border border-slate-800">
              <div class="text-slate-400 text-[10px]">Rθ(JC)</div>
              <div class="text-cyan-400 font-bold">5°C/W</div>
            </div>
            <div class="p-3 bg-slate-900 rounded-lg border border-slate-800">
              <div class="text-slate-400 text-[10px]">Rθ(CS)</div>
              <div class="text-cyan-400 font-bold">1.5°C/W</div>
            </div>
            <div class="p-3 bg-slate-900 rounded-lg border border-slate-800">
              <div class="text-slate-400 text-[10px]">Tambient</div>
              <div class="text-amber-400 font-bold">25°C</div>
            </div>
          </div>

          <div
            class="text-xs font-mono text-slate-400 bg-slate-900 p-3 rounded-lg"
          >
            <p class="mb-1">• បើ Power Loss &gt; 1W → ត្រូវការ Heatsink</p>
            <p class="mb-1">
              • បើ Power Loss &gt; 5W → ត្រូវការ Heatsink ធំ + Fan
            </p>
            <p>• ត្រូវការ Capacitor ចូល/ចេញ (0.33µF / 0.1µF)</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRegulatorCalc } from "~/composables/core/useRegulatorCalc";

const historyStore = useHistoryStore();
const { lm317: calcLm317, fixedRegulator } = useRegulatorCalc();

type Mode = "lm317" | "fixed";
const mode = ref<Mode>("lm317");

const modes = [
  { value: "lm317", label: "LM317", icon: "LucideBattery" },
  { value: "fixed", label: "Fixed 78XX", icon: "LucideZap" },
] as const;

// LM317
const lm317 = ref({ r1: 240, r2: 1000 });
const lm317Result = computed(() => calcLm317(lm317.value.r1, lm317.value.r2));

// Fixed
const fixed = ref({ vin: 12, vout: 5, iLoad: 0.5 });
const fixedResult = computed(() =>
  fixedRegulator(fixed.value.vin, fixed.value.vout, fixed.value.iLoad),
);
</script>
