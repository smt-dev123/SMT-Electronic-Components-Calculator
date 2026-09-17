<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <!-- Input -->
    <div class="glass-card rounded-2xl p-5 sm:p-6 space-y-4">
      <div class="border-b border-slate-800 pb-3">
        <h2 class="text-lg font-bold text-white flex items-center gap-2">
          <LucideZap class="w-4 h-4 text-cyan-400" />
          រកចរន្តអតិបរមាសម្រាប់ Width
        </h2>
        <p class="text-xs text-slate-400">ផ្ទុយពី Width Calculator</p>
      </div>

      <div class="space-y-3">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            Trace Width (mil):
          </label>
          <input
            v-model.number="maxCurrent.width"
            type="number"
            step="1"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
          <p class="text-[10px] text-slate-500 mt-1">
            ឧ. 10 mil ≈ 0.254 mm, 20 mil ≈ 0.508 mm
          </p>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            ការកើនសីតុណ្ហភាព (ΔT - °C):
          </label>
          <input
            v-model.number="maxCurrent.tempRise"
            type="number"
            min="1"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            Copper (oz):
          </label>
          <select
            v-model.number="maxCurrent.copperOz"
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
              @click="maxCurrent.layer = 'external'"
              class="py-2 rounded-xl font-semibold text-xs transition-all"
              :class="
                maxCurrent.layer === 'external'
                  ? 'bg-cyan-500 text-slate-950'
                  : 'bg-slate-950 text-slate-400 border border-slate-800'
              "
            >
              External
            </button>
            <button
              @click="maxCurrent.layer = 'internal'"
              class="py-2 rounded-xl font-semibold text-xs transition-all"
              :class="
                maxCurrent.layer === 'internal'
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-950 text-slate-400 border border-slate-800'
              "
            >
              Internal
            </button>
          </div>
        </div>
      </div>

      <div
        v-if="maxCurrentResult"
        class="bg-slate-950 p-4 rounded-xl border border-slate-800"
      >
        <span class="text-xs text-slate-400 font-mono block">
          ចរន្តអតិបរមា
        </span>
        <Transition name="fade-slide" mode="out-in">
          <div
            :key="maxCurrentResult.current_A"
            class="text-3xl font-bold font-mono text-cyan-400 mt-1"
          >
            {{ maxCurrentResult.currentFormatted }}
          </div>
        </Transition>
      </div>
    </div>

    <!-- Reference Table -->
    <div class="glass-card rounded-2xl p-5 sm:p-6 space-y-4">
      <h3 class="text-base font-bold text-white border-b border-slate-800 pb-3">
        <LucideBookOpen class="w-4 h-4 text-amber-400 mr-2 inline" />
        តារាងយោង Width vs Current (IPC-2221)
      </h3>

      <div class="overflow-x-auto">
        <table class="w-full text-xs">
          <thead class="bg-slate-950">
            <tr class="text-slate-400 font-mono">
              <th class="px-3 py-2 text-left">Width</th>
              <th class="px-3 py-2 text-right">0.5 oz</th>
              <th class="px-3 py-2 text-right">1 oz</th>
              <th class="px-3 py-2 text-right">2 oz</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800">
            <tr
              v-for="row in referenceTable"
              :key="row.width"
              class="hover:bg-slate-800/40 transition-colors"
            >
              <td class="px-3 py-2 font-mono font-bold text-cyan-400">
                {{ row.width }} mil
              </td>
              <td class="px-3 py-2 text-right font-mono text-slate-300">
                {{ row.c05 }} A
              </td>
              <td class="px-3 py-2 text-right font-mono text-amber-400">
                {{ row.c1 }} A
              </td>
              <td class="px-3 py-2 text-right font-mono text-emerald-400">
                {{ row.c2 }} A
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="text-[10px] text-slate-500 font-mono">
        * តម្លៃសម្រាប់ External layers, ΔT = 10°C
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePcbTraceCalc } from "~/composables/core/usePcbTraceCalc";

const { copperThicknesses, calculateMaxCurrent } = usePcbTraceCalc();

const maxCurrent = ref({
  width: 20,
  tempRise: 10,
  copperOz: 1,
  layer: "external" as "external" | "internal",
});

const maxCurrentResult = computed(() =>
  calculateMaxCurrent(
    maxCurrent.value.width,
    maxCurrent.value.tempRise,
    maxCurrent.value.copperOz,
    maxCurrent.value.layer,
  ),
);

// Reference table
const referenceTable = computed(() => {
  const widths = [5, 10, 15, 20, 30, 40, 50, 75, 100];
  return widths.map((w) => ({
    width: w,
    c05: (calculateMaxCurrent(w, 10, 0.5, "external")?.current_A ?? 0).toFixed(
      2,
    ),
    c1: (calculateMaxCurrent(w, 10, 1, "external")?.current_A ?? 0).toFixed(2),
    c2: (calculateMaxCurrent(w, 10, 2, "external")?.current_A ?? 0).toFixed(2),
  }));
});
</script>
