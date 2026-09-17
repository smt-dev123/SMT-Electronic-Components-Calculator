<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
    <div class="lg:col-span-5 glass-card rounded-2xl p-5 sm:p-6 space-y-4">
      <div class="border-b border-slate-800 pb-3">
        <h2 class="text-lg font-bold text-white flex items-center gap-2">
          <LucideCircle class="w-4 h-4 text-cyan-400" />
          Hole & Pad Size Calculator
        </h2>
        <p class="text-xs text-slate-400">គណនា Hole និង Pad ពី Lead Diameter</p>
      </div>

      <div class="space-y-3">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            Lead Diameter (mm):
          </label>
          <input
            v-model.number="hole.leadDiameter"
            type="number"
            step="0.1"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            Plating Thickness (mm):
          </label>
          <input
            v-model.number="hole.plating"
            type="number"
            step="0.005"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
          <p class="text-[10px] text-slate-500 mt-1">
            ធម្មតា: 0.025 mm (25 µm)
          </p>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            Tolerance (mm):
          </label>
          <input
            v-model.number="hole.tolerance"
            type="number"
            step="0.05"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
          <p class="text-[10px] text-slate-500 mt-1">
            ធម្មតា: 0.1 mm (drill tolerance)
          </p>
        </div>
      </div>

      <div
        v-if="holeResult"
        class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2"
      >
        <div>
          <span class="text-xs text-slate-400 font-mono block">
            Hole Diameter
          </span>
          <div class="text-2xl font-bold font-mono text-cyan-400 mt-1">
            {{ holeResult.holeFormatted }}
          </div>
        </div>
        <div class="border-t border-slate-800 pt-2">
          <span class="text-xs text-slate-400 font-mono block">
            Pad Diameter (recommended)
          </span>
          <div class="text-2xl font-bold font-mono text-emerald-400 mt-1">
            {{ holeResult.padFormatted }}
          </div>
        </div>
        <div class="border-t border-slate-800 pt-2 text-xs font-mono">
          <div class="flex justify-between">
            <span class="text-slate-400">Annular Ring:</span>
            <span class="text-amber-400 font-bold">
              {{ holeResult.annularRingFormatted }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Annular Ring Calculator -->
    <div class="lg:col-span-7 glass-card rounded-2xl p-5 sm:p-6 space-y-4">
      <h3 class="text-base font-bold text-white border-b border-slate-800 pb-3">
        <LucideCircleDashed class="w-4 h-4 text-amber-400 mr-2 inline" />
        Annular Ring Checker
      </h3>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            Pad Diameter (mm):
          </label>
          <input
            v-model.number="ring.padDiameter"
            type="number"
            step="0.1"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            Hole Diameter (mm):
          </label>
          <input
            v-model.number="ring.holeDiameter"
            type="number"
            step="0.1"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      <div
        v-if="ringResult"
        class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2"
      >
        <div>
          <span class="text-xs text-slate-400 font-mono block">
            Annular Ring
          </span>
          <div class="text-2xl font-bold font-mono text-cyan-400 mt-1">
            {{ ringResult.ringFormatted }}
          </div>
        </div>
        <div class="border-t border-slate-800 pt-2 text-xs font-mono">
          <div class="flex justify-between">
            <span class="text-slate-400">IPC Class:</span>
            <span
              :class="{
                'text-emerald-400': ringResult.ipcClass === 'Class 3',
                'text-amber-400': ringResult.ipcClass === 'Class 2',
                'text-red-400': ringResult.ipcClass.includes('មិន'),
              }"
              class="font-bold"
            >
              {{ ringResult.ipcClass }}
            </span>
          </div>
        </div>
      </div>

      <!-- Visualization -->
      <div class="bg-slate-950 border border-slate-800 rounded-2xl p-6">
        <svg viewBox="0 0 300 200" class="w-full max-w-xs mx-auto">
          <!-- Pad -->
          <circle
            cx="150"
            cy="100"
            :r="padRadiusPx"
            fill="#f59e0b"
            opacity="0.4"
          />
          <!-- Hole -->
          <circle
            cx="150"
            cy="100"
            :r="holeRadiusPx"
            fill="#0f172a"
            stroke="#22d3ee"
            stroke-width="2"
          />
          <!-- Ring indicator -->
          <circle
            cx="150"
            cy="100"
            :r="ringRadiusPx"
            fill="none"
            stroke="#10b981"
            stroke-width="1"
            stroke-dasharray="3,3"
          />
          <!-- Labels -->
          <text
            x="155"
            y="30"
            fill="#f59e0b"
            font-size="10"
            font-family="JetBrains Mono"
          >
            Pad
          </text>
          <text
            x="155"
            y="180"
            fill="#22d3ee"
            font-size="10"
            font-family="JetBrains Mono"
          >
            Hole
          </text>
          <text
            x="155"
            y="195"
            fill="#10b981"
            font-size="10"
            font-family="JetBrains Mono"
          >
            Ring
          </text>
        </svg>
      </div>

      <div
        class="text-xs font-mono text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800"
      >
        <p class="text-cyan-400 font-bold mb-1">IPC Standards:</p>
        <p>• Class 1: ≥ 0.05 mm (2 mils)</p>
        <p>• Class 2: ≥ 0.05 mm (2 mils)</p>
        <p>• Class 3: ≥ 0.10 mm (4 mils)</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePcbTraceCalc } from "~/composables/core/usePcbTraceCalc";

const { calculateAnnularRing, calculateHoleFromLead } = usePcbTraceCalc();

const hole = ref({
  leadDiameter: 0.8,
  plating: 0.025,
  tolerance: 0.1,
});

const holeResult = computed(() =>
  calculateHoleFromLead(
    hole.value.leadDiameter,
    hole.value.plating,
    hole.value.tolerance,
  ),
);

const ring = ref({
  padDiameter: 1.8,
  holeDiameter: 0.8,
});

const ringResult = computed(() =>
  calculateAnnularRing(ring.value.padDiameter, ring.value.holeDiameter),
);

// SVG scaling (mm → px)
const padRadiusPx = computed(() => {
  if (!ring.value.padDiameter) return 50;
  return Math.min(90, ring.value.padDiameter * 30);
});

const holeRadiusPx = computed(() => {
  if (!ring.value.holeDiameter) return 20;
  return Math.min(60, ring.value.holeDiameter * 30);
});

const ringRadiusPx = computed(() => {
  return (padRadiusPx.value + holeRadiusPx.value) / 2;
});
</script>
