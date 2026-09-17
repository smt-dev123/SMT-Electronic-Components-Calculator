<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <!-- Series -->
    <div class="glass-card rounded-2xl p-5 sm:p-6 space-y-4">
      <div class="border-b border-slate-800 pb-3">
        <h2 class="text-lg font-bold text-white flex items-center gap-2">
          <LucideArrowRight class="w-4 h-4 text-cyan-400" />
          សេរី (Series)
        </h2>
        <p class="text-xs text-slate-400">1/C = 1/C₁ + 1/C₂ + ...</p>
      </div>

      <div class="space-y-2">
        <div v-for="(_val, i) in series.items" :key="i" class="flex gap-2">
          <input
            v-model.number="series.items[i]"
            type="number"
            step="any"
            :placeholder="`C${i + 1} (µF)`"
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
          @click="series.items.push(10)"
          class="w-full py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs rounded-xl border border-slate-800 transition-colors flex items-center justify-center gap-1"
        >
          <LucidePlus class="w-3 h-3" /> បន្ថែម
        </button>
      </div>

      <div class="bg-slate-950 p-4 rounded-xl border border-slate-800">
        <span class="text-xs text-slate-400 font-mono block">C_total</span>
        <div class="text-2xl font-bold font-mono text-cyan-400 mt-1">
          {{ seriesResultFormatted }}
        </div>
      </div>
    </div>

    <!-- Parallel -->
    <div class="glass-card rounded-2xl p-5 sm:p-6 space-y-4">
      <div class="border-b border-slate-800 pb-3">
        <h2 class="text-lg font-bold text-white flex items-center gap-2">
          <LucideGitBranch class="w-4 h-4 text-amber-400" />
          ប៉ារ៉ាឡែល (Parallel)
        </h2>
        <p class="text-xs text-slate-400">C = C₁ + C₂ + ...</p>
      </div>

      <div class="space-y-2">
        <div v-for="(_val, i) in parallel.items" :key="i" class="flex gap-2">
          <input
            v-model.number="parallel.items[i]"
            type="number"
            step="any"
            :placeholder="`C${i + 1} (µF)`"
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
          @click="parallel.items.push(10)"
          class="w-full py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs rounded-xl border border-slate-800 transition-colors flex items-center justify-center gap-1"
        >
          <LucidePlus class="w-3 h-3" /> បន្ថែម
        </button>
      </div>

      <div class="bg-slate-950 p-4 rounded-xl border border-slate-800">
        <span class="text-xs text-slate-400 font-mono block">C_total</span>
        <div class="text-2xl font-bold font-mono text-amber-400 mt-1">
          {{ parallelResultFormatted }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCapacitorCalc } from "~/composables/core/useCapacitorCalc";

// ===== Composable =====
const { calculateSeries, calculateParallel, formatCapacitance } =
  useCapacitorCalc();

// ===== Mode =====
type Mode = "lookup" | "convert" | "network";
const capacitorCanvas = ref<HTMLCanvasElement | null>(null);

const series = ref({ items: [10, 20] as number[] });
const parallel = ref({ items: [10, 20] as number[] });

const seriesResultFormatted = computed(() => {
  const inFarads = series.value.items.filter((v) => v > 0).map((v) => v * 1e-6);
  return formatCapacitance(calculateSeries(inFarads));
});

const parallelResultFormatted = computed(() => {
  const inFarads = parallel.value.items
    .filter((v) => v > 0)
    .map((v) => v * 1e-6);
  return formatCapacitance(calculateParallel(inFarads));
});

// ===== Canvas Animation =====
const { animTime, register, setupCanvas, start, stop } = useCanvasAnimation();

register(() => {
  const result = setupCanvas(capacitorCanvas.value);
  if (!result) return;
  const { ctx, w, h } = result;
  ctx.clearRect(0, 0, w, h);

  // Plates
  ctx.fillStyle = "#94a3b8";
  ctx.fillRect(w * 0.3, 20, 12, h - 40);
  ctx.fillRect(w * 0.7, 20, 12, h - 40);

  // Electric field waves
  ctx.strokeStyle = "rgba(6, 182, 212, 0.4)";
  ctx.lineWidth = 2;
  for (let y = 30; y < h - 30; y += 15) {
    ctx.beginPath();
    const waveOffset = Math.sin(animTime.value * 3 + y * 0.1) * 4;
    ctx.moveTo(w * 0.3 + 12, y);
    ctx.lineTo(w * 0.7 + waveOffset, y);
    ctx.stroke();
  }
});
</script>
