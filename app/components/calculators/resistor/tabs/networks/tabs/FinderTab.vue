<template>
  <div class="glass-card rounded-2xl p-5 sm:p-6 mx-auto space-y-4">
    <div class="border-b border-slate-800 pb-3">
      <h2 class="text-lg font-bold text-white flex items-center gap-2">
        <LucideMagnifyingGlass class="w-4 h-4 text-cyan-400" />
        រក Combination ពី Standard Values
      </h2>
      <p class="text-xs text-slate-400">
        បញ្ចូលតម្លៃដែលចង់បាន → រក R1, R2 ដែលជិតបំផុត (E24 Series)
      </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <label class="block text-xs font-semibold text-slate-300 mb-1">
          Target Resistance (Ω):
        </label>
        <input
          v-model.number="finder.target"
          type="number"
          step="0.1"
          class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
        />
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-300 mb-1">
          Mode:
        </label>
        <select
          v-model="finder.mode"
          class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
        >
          <option value="both">ទាំងអស់</option>
          <option value="series">Series</option>
          <option value="parallel">Parallel</option>
        </select>
      </div>
    </div>

    <div
      v-if="finderResult"
      class="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3"
    >
      <div class="flex items-center gap-3 mb-3">
        <span
          class="px-3 py-1 rounded-lg text-xs font-bold font-mono"
          :class="
            finderResult.mode === 'series'
              ? 'bg-cyan-500/20 text-cyan-400'
              : 'bg-amber-500/20 text-amber-400'
          "
        >
          {{ finderResult.mode === "series" ? "SERIES" : "PARALLEL" }}
        </span>
        <span
          v-if="finderResult.isWithinTolerance"
          class="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg font-mono"
        >
          ✓ ក្នុង Tolerance
        </span>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div>
          <span class="text-xs text-slate-400 font-mono block">R1</span>
          <div class="text-xl font-bold font-mono text-cyan-400">
            {{ finderResult.r1Formatted }}
          </div>
        </div>
        <div>
          <span class="text-xs text-slate-400 font-mono block">R2</span>
          <div class="text-xl font-bold font-mono text-cyan-400">
            {{ finderResult.r2Formatted }}
          </div>
        </div>
        <div>
          <span class="text-xs text-slate-400 font-mono block">
            {{ finderResult.mode === "series" ? "Sum" : "Parallel" }}
          </span>
          <div class="text-xl font-bold font-mono text-emerald-400">
            {{ finderResult.valueFormatted }}
          </div>
        </div>
      </div>

      <div
        class="border-t border-slate-800 pt-3 flex justify-between text-xs font-mono"
      >
        <span class="text-slate-400">Error:</span>
        <span
          :class="
            finderResult.isWithinTolerance
              ? 'text-emerald-400'
              : 'text-amber-400'
          "
          class="font-bold"
        >
          {{ finderResult.errorPercentFormatted }}
        </span>
      </div>

      <button
        @click="applyFinderToSeries"
        class="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors"
      >
        <LucidePlay class="w-3.5 h-3.5" />
        Apply to
        {{ finderResult.mode === "series" ? "Series" : "Parallel" }} Tab
      </button>
    </div>

    <!-- Info -->
    <div
      class="text-xs font-mono text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800"
    >
      <p class="text-cyan-400 font-bold mb-1">💡 គន្លឹះ:</p>
      <p>• E24 Series មាន 24 តម្លៃ/decade (tolerance ±5%)</p>
      <p>• Series ប្រើសម្រាប់បង្កើនតម្លៃ</p>
      <p>• Parallel ប្រើសម្រាប់បន្ថយតម្លៃ</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useResistorCalc } from "~/composables/core/useResistorCalc";

// ===== Composable =====
const { findCombination } = useResistorCalc();

// ===== Sub-Mode =====
type SubMode = "series" | "parallel" | "combo" | "finder";
const subMode = ref<SubMode>("series");

// ===== Series =====
const series = ref({
  items: [100, 220, 470] as number[],
  voltage: 12,
});

// ===== Parallel =====
const parallel = ref({
  items: [100, 220, 470] as number[],
  current: 0.5,
});

const finder = ref({
  target: 350,
  mode: "both" as "series" | "parallel" | "both",
});

const finderResult = computed(() =>
  findCombination(finder.value.target, finder.value.mode),
);

const applyFinderToSeries = () => {
  if (!finderResult.value) return;
  if (finderResult.value.mode === "series") {
    series.value.items = [finderResult.value.r1, finderResult.value.r2];
    subMode.value = "series";
  } else {
    parallel.value.items = [finderResult.value.r1, finderResult.value.r2];
    subMode.value = "parallel";
  }
};
</script>
