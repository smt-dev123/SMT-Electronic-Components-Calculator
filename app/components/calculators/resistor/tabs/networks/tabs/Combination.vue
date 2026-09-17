<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Series Section -->
      <div class="glass-card rounded-2xl p-5 sm:p-6 space-y-4">
        <div class="border-b border-slate-800 pb-3">
          <h3 class="text-base font-bold text-white flex items-center gap-2">
            <LucideArrowRight class="w-4 h-4 text-cyan-400" />
            ក្រុម Series
          </h3>
        </div>

        <div class="space-y-2">
          <div
            v-for="(_val, i) in combo.seriesItems"
            :key="i"
            class="flex gap-2"
          >
            <input
              v-model.number="combo.seriesItems[i]"
              type="number"
              :placeholder="`RS${i + 1} (Ω)`"
              class="flex-1 bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
            />
            <button
              v-if="combo.seriesItems.length > 1"
              @click="combo.seriesItems.splice(i, 1)"
              class="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl border border-red-500/30"
            >
              <LucideX class="w-3.5 h-3.5" />
            </button>
          </div>
          <button
            @click="combo.seriesItems.push(100)"
            class="w-full py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs rounded-xl border border-slate-800 flex items-center justify-center gap-1"
          >
            <LucidePlus class="w-3 h-3" /> បន្ថែម
          </button>
        </div>
      </div>

      <!-- Parallel Section -->
      <div class="glass-card rounded-2xl p-5 sm:p-6 space-y-4">
        <div class="border-b border-slate-800 pb-3">
          <h3 class="text-base font-bold text-white flex items-center gap-2">
            <LucideGitBranch class="w-4 h-4 text-amber-400" />
            ក្រុម Parallel
          </h3>
        </div>

        <div class="space-y-2">
          <div
            v-for="(_val, i) in combo.parallelItems"
            :key="i"
            class="flex gap-2"
          >
            <input
              v-model.number="combo.parallelItems[i]"
              type="number"
              :placeholder="`RP${i + 1} (Ω)`"
              class="flex-1 bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-amber-500"
            />
            <button
              v-if="combo.parallelItems.length > 1"
              @click="combo.parallelItems.splice(i, 1)"
              class="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl border border-red-500/30"
            >
              <LucideX class="w-3.5 h-3.5" />
            </button>
          </div>
          <button
            @click="combo.parallelItems.push(100)"
            class="w-full py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs rounded-xl border border-slate-800 flex items-center justify-center gap-1"
          >
            <LucidePlus class="w-3 h-3" /> បន្ថែម
          </button>
        </div>
      </div>
    </div>

    <!-- Result -->
    <div v-if="comboResult" class="glass-card rounded-2xl p-5 sm:p-6 space-y-4">
      <h3 class="text-base font-bold text-white border-b border-slate-800 pb-3">
        <LucideCalculator class="w-4 h-4 text-emerald-400 mr-2 inline" />
        លទ្ធផល
      </h3>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <span class="text-xs text-slate-400 font-mono block"
            >Series Total</span
          >
          <div class="text-xl font-bold font-mono text-cyan-400 mt-1">
            {{ comboResult.seriesFormatted }}
          </div>
        </div>
        <div class="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <span class="text-xs text-slate-400 font-mono block"
            >Parallel Total</span
          >
          <div class="text-xl font-bold font-mono text-amber-400 mt-1">
            {{ comboResult.parallelFormatted }}
          </div>
        </div>
        <div class="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <span class="text-xs text-slate-400 font-mono block">Total R</span>
          <Transition name="fade-slide" mode="out-in">
            <div
              :key="comboResult.totalFormatted"
              class="text-2xl font-bold font-mono text-emerald-400 mt-1"
            >
              {{ comboResult.totalFormatted }}
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useResistorCalc } from "~/composables/core/useResistorCalc";

// ===== Composable =====
const { calculateCombination } = useResistorCalc();

// ===== Combination =====
const combo = ref({
  seriesItems: [100] as number[],
  parallelItems: [220, 470] as number[],
});

const comboResult = computed(() =>
  calculateCombination(combo.value.seriesItems, combo.value.parallelItems),
);
</script>
