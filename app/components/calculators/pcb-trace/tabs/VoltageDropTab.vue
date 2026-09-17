<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
    <div class="lg:col-span-5 glass-card rounded-2xl p-5 sm:p-6 space-y-4">
      <div class="border-b border-slate-800 pb-3">
        <h2 class="text-lg font-bold text-white flex items-center gap-2">
          <LucideTrendingDown class="w-4 h-4 text-amber-400" />
          Voltage Drop Calculator
        </h2>
        <p class="text-xs text-slate-400">គណនា voltage drop តាមប្រវែង trace</p>
      </div>

      <div class="space-y-3">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            Width (mm):
          </label>
          <input
            v-model.number="drop.width"
            type="number"
            step="0.01"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            Copper (oz):
          </label>
          <select
            v-model.number="drop.copperOz"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          >
            <option v-for="c in copperThicknesses" :key="c.oz" :value="c.oz">
              {{ c.label }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            Length (mm):
          </label>
          <input
            v-model.number="drop.length"
            type="number"
            step="10"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            Current (A):
          </label>
          <input
            v-model.number="drop.current"
            type="number"
            step="0.1"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      <div
        v-if="dropResult"
        class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs font-mono"
      >
        <div>
          <span class="text-slate-400 block">Voltage Drop</span>
          <div class="text-2xl font-bold text-amber-400 mt-1">
            {{ dropResult.voltageDropFormatted }}
          </div>
        </div>
        <div class="border-t border-slate-800 pt-2 space-y-1">
          <div class="flex justify-between">
            <span class="text-slate-400">Resistance:</span>
            <span class="text-slate-200"
              >{{ dropResult.resistance_mOhm.toFixed(2) }} mΩ</span
            >
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Power Loss:</span>
            <span class="text-red-400"
              >{{ dropResult.powerLoss_mW.toFixed(2) }} mW</span
            >
          </div>
        </div>
      </div>
    </div>

    <div class="lg:col-span-7 glass-card rounded-2xl p-5 sm:p-6 space-y-4">
      <h3 class="text-base font-bold text-white border-b border-slate-800 pb-3">
        <LucideInfo class="w-4 h-4 text-cyan-400 mr-2 inline" />
        ព័ត៌មានជំនួយ
      </h3>

      <div
        class="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4 text-xs font-mono"
      >
        <div class="bg-slate-900 p-3 rounded-lg">
          <p class="text-cyan-400 mb-2">📐 រូបមន្ត:</p>
          <p class="text-slate-300">R = ρ × L / (W × T)</p>
          <p class="text-slate-300">Vdrop = I × R</p>
          <p class="text-slate-300">Ploss = I² × R</p>
        </div>

        <div class="bg-slate-900 p-3 rounded-lg">
          <p class="text-amber-400 mb-2">📊 គន្លឹះ:</p>
          <ul class="space-y-1 text-slate-400">
            <li>• Vdrop &lt; 5% នៃ Vin → ល្អ</li>
            <li>• Vdrop &gt; 10% → ត្រូវការ width ធំ</li>
            <li>• ប្រវែងវែង → Vdrop ច្រើន</li>
            <li>• ចរន្តច្រើន → Vdrop ច្រើន</li>
          </ul>
        </div>

        <div class="bg-slate-900 p-3 rounded-lg">
          <p class="text-emerald-400 mb-2">💡 ρ Copper:</p>
          <p class="text-slate-400">1.68 × 10⁻⁸ Ω·m @ 20°C</p>
          <p class="text-slate-400">2.16 × 10⁻⁸ Ω·m @ 80°C</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePcbTraceCalc } from "~/composables/core/usePcbTraceCalc";

const { copperThicknesses, calculateVoltageDrop, calculateWidth } =
  usePcbTraceCalc();

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

const drop = ref({
  width: 0.5,
  copperOz: 1,
  length: 100,
  current: 1,
});
</script>
