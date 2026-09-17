<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
    <div class="lg:col-span-5 glass-card rounded-2xl p-5 sm:p-6 space-y-4">
      <div class="border-b border-slate-800 pb-3">
        <h2 class="text-lg font-bold text-white flex items-center gap-2">
          <LucideCircleDot class="w-4 h-4 text-cyan-400" />
          Via Size Calculator
        </h2>
        <p class="text-xs text-slate-400">គណនាទំហំ Via សម្រាប់ចរន្តដែលចង់បាន</p>
      </div>

      <div class="space-y-3">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            ចរន្តក្នុង Via (Current - A):
          </label>
          <input
            v-model.number="via.current"
            type="number"
            step="0.1"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            ការកើនសីតុណ្ហភាព (ΔT - °C):
          </label>
          <input
            v-model.number="via.tempRise"
            type="number"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            Copper (oz):
          </label>
          <select
            v-model.number="via.copperOz"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          >
            <option v-for="c in copperThicknesses" :key="c.oz" :value="c.oz">
              {{ c.label }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            កម្រាស់ PCB (Via Length - mm):
          </label>
          <input
            v-model.number="via.length"
            type="number"
            step="0.1"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
          <p class="text-[10px] text-slate-500 mt-1">
            ធម្មតា: 1.6 mm (standard PCB)
          </p>
        </div>
      </div>

      <div
        v-if="viaResult"
        class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3"
      >
        <div>
          <span class="text-xs text-slate-400 font-mono block">
            Via Dimensions ត្រូវការ
          </span>
          <div class="text-xl font-bold font-mono text-cyan-400 mt-1">
            OD: {{ viaResult.odFormatted }}
          </div>
          <div class="text-xl font-bold font-mono text-emerald-400">
            ID: {{ viaResult.idFormatted }}
          </div>
        </div>

        <div class="border-t border-slate-800 pt-2 space-y-1 text-xs font-mono">
          <div class="flex justify-between">
            <span class="text-slate-400">Standard Drill:</span>
            <span class="text-amber-400 font-bold">
              {{ viaResult.nearestDrillFormatted }}
            </span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Via Resistance:</span>
            <span class="text-slate-200">
              {{ viaResult.resistance_mOhm.toFixed(2) }} mΩ
            </span>
          </div>
        </div>

        <!-- Via Count Calculator -->
        <div class="border-t border-slate-800 pt-3">
          <label class="block text-xs font-semibold text-slate-300 mb-2">
            ចំនួន Via ត្រូវការ (សម្រាប់ចរន្តសរុប):
          </label>
          <div class="flex gap-2">
            <input
              v-model.number="via.totalCurrent"
              type="number"
              step="0.1"
              placeholder="Total A"
              class="flex-1 bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
            />
            <div
              v-if="viaCountResult"
              class="px-3 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400 font-mono text-xs font-bold"
            >
              {{ viaCountResult.countFormatted }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Visualization -->
    <div class="lg:col-span-7 glass-card rounded-2xl p-5 sm:p-6 space-y-4">
      <h3 class="text-base font-bold text-white border-b border-slate-800 pb-3">
        <LucideCircleDot class="w-4 h-4 text-amber-400 mr-2 inline" />
        រូបភាព Via
      </h3>

      <div class="bg-slate-950 border border-slate-800 rounded-2xl p-6">
        <svg viewBox="0 0 400 300" class="w-full">
          <!-- PCB Cross-section -->
          <rect
            x="40"
            y="100"
            width="320"
            height="100"
            fill="#064e3b"
            opacity="0.3"
            rx="2"
          />
          <text
            x="50"
            y="120"
            fill="#94a3b8"
            font-size="10"
            font-family="JetBrains Mono"
          >
            PCB Cross-Section
          </text>

          <!-- Top copper -->
          <rect
            x="40"
            y="100"
            width="320"
            height="8"
            fill="#f59e0b"
            opacity="0.6"
          />
          <!-- Bottom copper -->
          <rect
            x="40"
            y="192"
            width="320"
            height="8"
            fill="#f59e0b"
            opacity="0.6"
          />

          <!-- Via hole -->
          <rect
            :x="200 - (viaResult ? viaResult.od_mm * 5 : 20)"
            y="80"
            :width="viaResult ? viaResult.od_mm * 10 : 40"
            height="140"
            fill="#1e293b"
            stroke="#f59e0b"
            stroke-width="2"
          />

          <!-- Plating -->
          <rect
            :x="200 - (viaResult ? viaResult.id_mm * 5 : 15)"
            y="85"
            :width="viaResult ? viaResult.id_mm * 10 : 30"
            height="130"
            fill="#0f172a"
          />

          <!-- Pad -->
          <rect
            :x="200 - (viaResult ? viaResult.od_mm * 8 : 30)"
            y="90"
            :width="viaResult ? viaResult.od_mm * 16 : 60"
            height="10"
            fill="#f59e0b"
            opacity="0.8"
          />
          <rect
            :x="200 - (viaResult ? viaResult.od_mm * 8 : 30)"
            y="180"
            :width="viaResult ? viaResult.od_mm * 16 : 60"
            height="10"
            fill="#f59e0b"
            opacity="0.8"
          />

          <!-- Labels -->
          <text
            x="220"
            y="80"
            fill="#22d3ee"
            font-size="10"
            font-family="JetBrains Mono"
          >
            OD: {{ viaResult ? viaResult.od_mm.toFixed(2) + " mm" : "—" }}
          </text>
          <text
            x="220"
            y="200"
            fill="#10b981"
            font-size="10"
            font-family="JetBrains Mono"
          >
            ID: {{ viaResult ? viaResult.id_mm.toFixed(2) + " mm" : "—" }}
          </text>

          <!-- Animated current -->
          <circle r="3" fill="#22d3ee">
            <animate
              attributeName="cy"
              from="80"
              to="220"
              dur="1.5s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="cx"
              values="200;200"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      </div>

      <div
        class="text-xs font-mono text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800"
      >
        <p class="text-cyan-400 font-bold mb-1">Via គណនាតាម IPC-2221:</p>
        <p>Area = π × D_avg × Plating Thickness</p>
        <p class="text-slate-500 mt-1">Plating: 25 µm (1 mil) ជាធម្មតា</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePcbTraceCalc } from "~/composables/core/usePcbTraceCalc";

const { copperThicknesses, calculateVia, calculateViaCount } =
  usePcbTraceCalc();

const via = ref({
  current: 0.5,
  tempRise: 10,
  copperOz: 1,
  length: 1.6,
  totalCurrent: 1,
});

const viaResult = computed(() =>
  calculateVia(
    via.value.current,
    via.value.tempRise,
    via.value.copperOz,
    via.value.length,
  ),
);

const viaCountResult = computed(() => {
  if (!viaResult.value) return null;
  return calculateViaCount(via.value.totalCurrent, via.value.current);
});
</script>
