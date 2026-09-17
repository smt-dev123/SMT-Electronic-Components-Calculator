<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
    <!-- Inputs -->
    <div class="lg:col-span-5 glass-card rounded-2xl p-5 sm:p-6 space-y-4">
      <div class="border-b border-slate-800 pb-3">
        <h2 class="text-lg font-bold text-white flex items-center gap-2">
          <LucideRuler class="w-4 h-4 text-cyan-400" />
          PCB Trace Width (IPC-2221)
        </h2>
        <p class="text-xs text-slate-400">
          គណនាទទឹង trace សម្រាប់ចរន្តដែលចង់បាន
        </p>
      </div>

      <div class="space-y-3">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            ចរន្ត (Current - A):
          </label>
          <input
            v-model.number="width.current"
            type="number"
            step="0.1"
            min="0.01"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            ការកើនសីតុណ្ហភាព (ΔT - °C):
          </label>
          <input
            v-model.number="width.tempRise"
            type="number"
            min="1"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
          <p class="text-[10px] text-slate-500 mt-1">
            ធម្មតា: 10°C សម្រាប់ការងារទូទៅ, 20°C សម្រាប់ power
          </p>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            កម្រាស់ស្ពាន់ (Copper):
          </label>
          <select
            v-model.number="width.copperOz"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          >
            <option v-for="c in copperThicknesses" :key="c.oz" :value="c.oz">
              {{ c.label }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            Layer:
          </label>
          <div class="grid grid-cols-2 gap-2">
            <button
              @click="width.layer = 'external'"
              class="py-2 rounded-xl font-semibold text-xs transition-all"
              :class="
                width.layer === 'external'
                  ? 'bg-cyan-500 text-slate-950'
                  : 'bg-slate-950 text-slate-400 border border-slate-800'
              "
            >
              External (Outer)
            </button>
            <button
              @click="width.layer = 'internal'"
              class="py-2 rounded-xl font-semibold text-xs transition-all"
              :class="
                width.layer === 'internal'
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-950 text-slate-400 border border-slate-800'
              "
            >
              Internal (Inner)
            </button>
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            ប្រវែង Trace (Length - mm):
          </label>
          <input
            v-model.number="width.length"
            type="number"
            step="10"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      <!-- Result -->
      <div
        v-if="widthResult"
        class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3"
      >
        <div>
          <span class="text-xs text-slate-400 font-mono block">
            Trace Width ត្រូវការ
          </span>
          <Transition name="fade-slide" mode="out-in">
            <div :key="widthResult.width_mil" class="mt-1">
              <div class="text-3xl font-bold font-mono text-cyan-400">
                {{ widthResult.width_mil.toFixed(2) }}
                <span class="text-lg">mil</span>
              </div>
              <div class="text-xl font-bold font-mono text-emerald-400">
                {{ widthResult.width_mm.toFixed(3) }}
                <span class="text-sm">mm</span>
              </div>
            </div>
          </Transition>
        </div>

        <div
          v-if="dropResult"
          class="border-t border-slate-800 pt-2 space-y-1 text-xs font-mono"
        >
          <div class="flex justify-between">
            <span class="text-slate-400">
              Resistance ({{ width.length }} mm):
            </span>
            <span class="text-slate-200">
              {{ dropResult.resistance_mOhm.toFixed(2) }} mΩ
            </span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Voltage Drop:</span>
            <span class="text-amber-400 font-bold">
              {{ dropResult.voltageDropFormatted }}
            </span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Power Loss:</span>
            <span class="text-red-400 font-bold">
              {{ dropResult.powerLoss_mW.toFixed(2) }} mW
            </span>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-2">
        <button
          v-if="widthResult"
          @click="saveToHistory"
          class="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors"
        >
          <LucideSave class="w-3.5 h-3.5" />
          រក្សាទុកប្រវត្តិ
        </button>
      </div>
    </div>

    <!-- Visualization -->
    <div class="lg:col-span-7 glass-card rounded-2xl p-5 sm:p-6 space-y-4">
      <h3 class="text-base font-bold text-white border-b border-slate-800 pb-3">
        <LucideLayoutGrid class="w-4 h-4 text-amber-400 mr-2 inline" />
        រូបភាព Trace
      </h3>

      <div class="bg-slate-950 border border-slate-800 rounded-2xl p-6">
        <svg viewBox="0 0 500 260" class="w-full">
          <!-- PCB Background -->
          <rect
            x="20"
            y="20"
            width="460"
            height="220"
            fill="#064e3b"
            opacity="0.15"
            rx="8"
          />
          <text
            x="30"
            y="45"
            fill="#94a3b8"
            font-size="10"
            font-family="JetBrains Mono"
          >
            PCB Top View
          </text>

          <!-- Trace -->
          <line
            x1="60"
            y1="130"
            :x2="440"
            y2="130"
            :stroke-width="traceWidthPx"
            stroke="#fbbf24"
            stroke-linecap="round"
          />

          <!-- Pads -->
          <circle cx="60" cy="130" r="14" fill="#f59e0b" opacity="0.5" />
          <circle cx="440" cy="130" r="14" fill="#f59e0b" opacity="0.5" />
          <circle cx="60" cy="130" r="6" fill="#0f172a" />
          <circle cx="440" cy="130" r="6" fill="#0f172a" />

          <!-- Dimension line -->
          <line
            x1="250"
            y1="180"
            x2="250"
            y2="200"
            stroke="#22d3ee"
            stroke-width="1"
          />
          <line
            x1="230"
            y1="200"
            x2="270"
            y2="200"
            stroke="#22d3ee"
            stroke-width="1"
          />
          <line
            x1="250"
            y1="175"
            x2="250"
            y2="205"
            stroke="#22d3ee"
            stroke-width="1"
            stroke-dasharray="2,2"
          />
          <text
            x="252"
            y="215"
            fill="#22d3ee"
            font-size="10"
            font-family="JetBrains Mono"
          >
            {{ widthResult ? widthResult.width_mm.toFixed(3) + " mm" : "—" }}
          </text>

          <!-- Info Labels -->
          <text
            x="30"
            y="80"
            fill="#22d3ee"
            font-size="10"
            font-family="JetBrains Mono"
          >
            I = {{ width.current }} A
          </text>
          <text
            x="30"
            y="95"
            fill="#f59e0b"
            font-size="10"
            font-family="JetBrains Mono"
          >
            ΔT = {{ width.tempRise }} °C
          </text>
          <text
            x="30"
            y="110"
            fill="#10b981"
            font-size="10"
            font-family="JetBrains Mono"
          >
            Cu = {{ width.copperOz }} oz
          </text>

          <!-- Animated current -->
          <circle r="4" fill="#22d3ee">
            <animate
              attributeName="cx"
              from="60"
              to="440"
              :dur="`${Math.max(1, 4 / Math.max(width.current, 0.5))}s`"
              repeatCount="indefinite"
            />
            <animate
              attributeName="cy"
              values="130;130"
              :dur="`${Math.max(1, 4 / Math.max(width.current, 0.5))}s`"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-3 gap-3">
        <div
          class="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center"
        >
          <div class="text-[10px] text-slate-500 font-mono">Width</div>
          <div class="text-cyan-400 font-bold font-mono text-sm">
            {{ widthResult ? widthResult.width_mil.toFixed(1) + " mil" : "—" }}
          </div>
        </div>
        <div
          class="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center"
        >
          <div class="text-[10px] text-slate-500 font-mono">Copper</div>
          <div class="text-amber-400 font-bold font-mono text-sm">
            {{ width.copperOz }} oz
          </div>
        </div>
        <div
          class="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center"
        >
          <div class="text-[10px] text-slate-500 font-mono">Layer</div>
          <div class="text-emerald-400 font-bold font-mono text-sm capitalize">
            {{ width.layer }}
          </div>
        </div>
      </div>

      <!-- IPC-2221 Info -->
      <div
        class="text-xs font-mono text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800"
      >
        <p class="text-cyan-400 font-bold mb-1">IPC-2221 Formula:</p>
        <p>A = (I / (k × ΔT^0.44))^(1/0.725)</p>
        <p class="text-slate-500 mt-1">
          k = 0.048 (external), 0.024 (internal)
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePcbTraceCalc } from "~/composables/core/usePcbTraceCalc";

const historyStore = useHistoryStore();

const { copperThicknesses, calculateWidth, calculateVoltageDrop } =
  usePcbTraceCalc();

// Local state សម្រាប់ tab នេះតែប៉ុណ្ណោះ
const width = ref({
  current: 1,
  tempRise: 10,
  copperOz: 1,
  layer: "external" as "external" | "internal",
  length: 100,
});

const widthResult = computed(() =>
  calculateWidth(
    width.value.current,
    width.value.tempRise,
    width.value.copperOz,
    width.value.layer,
  ),
);

const dropResult = computed(() => {
  if (!widthResult.value) return null;
  return calculateVoltageDrop(
    widthResult.value.width_mm,
    width.value.copperOz,
    width.value.length,
    width.value.current,
  );
});

const traceWidthPx = computed(() => {
  if (!widthResult.value) return 2;
  // Scale: 0.1mm = 1px, min 3px, max 40px
  return Math.max(3, Math.min(40, widthResult.value.width_mm * 5));
});

const saveToHistory = () => {
  if (!widthResult.value) return;
  historyStore.add({
    type: "transistor",
    title: `PCB Trace ${width.value.current}A`,
    value: `${widthResult.value.width_mil.toFixed(1)} mil / ${widthResult.value.width_mm.toFixed(2)} mm`,
    input: { ...width.value },
  });
};
</script>
