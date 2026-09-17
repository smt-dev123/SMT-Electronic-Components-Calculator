<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <!-- Series -->
    <div class="glass-card rounded-2xl p-5 sm:p-6 space-y-4">
      <h2 class="text-lg font-bold text-white flex items-center gap-2">
        <LucideArrowRight class="w-4 h-4 text-cyan-400" />
        អាំងឌុចទ័រសេរី (Series)
      </h2>
      <p class="text-xs text-slate-400">L_total = L₁ + L₂ + L₃ + ...</p>

      <div class="space-y-2">
        <div v-for="(_val, i) in series.items" :key="i" class="flex gap-2">
          <input
            v-model.number="series.items[i]"
            type="number"
            step="0.1"
            :placeholder="`L${i + 1} (µH)`"
            class="flex-1 bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
          />
          <button
            v-if="series.items.length > 2"
            @click="series.items.splice(i, 1)"
            class="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl border border-red-500/30 transition-colors"
          >
            <LucideX class="w-3.5 h-3.5" />
          </button>
        </div>
        <button
          @click="series.items.push(0)"
          class="w-full py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs rounded-xl border border-slate-800 transition-colors flex items-center justify-center gap-1"
        >
          <LucidePlus class="w-3 h-3" /> បន្ថែម
        </button>
      </div>

      <div class="bg-slate-950 p-4 rounded-xl border border-slate-800">
        <span class="text-xs text-slate-400 font-mono block">L_total</span>
        <div class="text-3xl font-bold font-mono text-cyan-400 mt-1">
          {{ seriesResult.formatted }}
        </div>
      </div>
    </div>

    <!-- Parallel -->
    <div class="glass-card rounded-2xl p-5 sm:p-6 space-y-4">
      <h2 class="text-lg font-bold text-white flex items-center gap-2">
        <LucideGitBranch class="w-4 h-4 text-amber-400" />
        អាំងឌុចទ័រប៉ារ៉ាឡែល (Parallel)
      </h2>
      <p class="text-xs text-slate-400">1/L_total = 1/L₁ + 1/L₂ + ...</p>

      <div class="space-y-2">
        <div v-for="(_val, i) in parallel.items" :key="i" class="flex gap-2">
          <input
            v-model.number="parallel.items[i]"
            type="number"
            step="0.1"
            :placeholder="`L${i + 1} (µH)`"
            class="flex-1 bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-amber-500"
          />
          <button
            v-if="parallel.items.length > 2"
            @click="parallel.items.splice(i, 1)"
            class="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl border border-red-500/30 transition-colors"
          >
            <LucideX class="w-3.5 h-3.5" />
          </button>
        </div>
        <button
          @click="parallel.items.push(0)"
          class="w-full py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs rounded-xl border border-slate-800 transition-colors flex items-center justify-center gap-1"
        >
          <LucidePlus class="w-3 h-3" /> បន្ថែម
        </button>
      </div>

      <div class="bg-slate-950 p-4 rounded-xl border border-slate-800">
        <span class="text-xs text-slate-400 font-mono block">L_total</span>
        <div class="text-3xl font-bold font-mono text-amber-400 mt-1">
          {{ parallelResult?.formatted || "0 H" }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useInductorCalc } from "~/composables/core/useInductorCalc";

// ===== Composable =====
const { calculateSeries, calculateParallel } = useInductorCalc();

// ===== Series & Parallel =====
const series = ref({ items: [10, 20] as number[] });
const parallel = ref({ items: [10, 20] as number[] });

const seriesResult = computed(() =>
  calculateSeries(series.value.items.filter((v) => v > 0).map((v) => v * 1e-6)),
);

const parallelResult = computed(() =>
  calculateParallel(
    parallel.value.items.filter((v) => v > 0).map((v) => v * 1e-6),
  ),
);
</script>
