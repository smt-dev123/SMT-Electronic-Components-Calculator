<template>
  <div class="glass-card rounded-2xl p-5 sm:p-6 space-y-4 mx-auto">
    <div class="border-b border-slate-800 pb-3">
      <h2 class="text-lg font-bold text-white flex items-center gap-2">
        <LucideArrowRightLeft class="w-4 h-4 text-cyan-400" />
        បំប្លែងឯកតា (Unit Converter)
      </h2>
      <p class="text-xs text-slate-400">pF ↔ nF ↔ µF</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label class="block text-xs font-semibold text-slate-300 mb-1">
          តម្លៃ (Value):
        </label>
        <input
          v-model.number="converter.value"
          type="number"
          step="any"
          class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3 text-white font-mono text-lg focus:outline-none focus:border-cyan-500"
        />
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-300 mb-1">
          ឯកតា (Unit):
        </label>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="u in ['pF', 'nF', 'µF']"
            :key="u"
            @click="converter.fromUnit = u"
            class="py-3 rounded-xl font-mono font-semibold transition-all"
            :class="
              converter.fromUnit === u
                ? 'bg-cyan-500 text-slate-950 scale-105'
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
            "
          >
            {{ u }}
          </button>
        </div>
      </div>
    </div>

    <div class="pt-4 space-y-2 border-t border-slate-800">
      <div
        v-for="u in ['pF', 'nF', 'µF']"
        :key="u"
        class="flex justify-between items-center py-3 px-4 bg-slate-950 border border-slate-800 rounded-xl"
      >
        <span class="text-slate-400 font-mono">{{ u }}</span>
        <Transition name="fade-slide" mode="out-in">
          <span
            :key="convertedValue(u)"
            class="font-mono text-lg text-cyan-400 font-bold"
          >
            {{ convertedValue(u) }}
          </span>
        </Transition>
      </div>
    </div>

    <button
      @click="saveConverterToHistory"
      class="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors"
    >
      <LucideSave class="w-4 h-4" />
      រក្សាទុកប្រវត្តិ
    </button>
  </div>
</template>
<script setup lang="ts">
import { useCapacitorCalc } from "~/composables/core/useCapacitorCalc";
import { useCanvasAnimation } from "~/composables/useCanvasAnimation";

// ===== Stores =====
const historyStore = useHistoryStore();

// ===== Composable =====
const { convertUnit, calculateSeries, formatCapacitance } = useCapacitorCalc();

// ===== Mode =====
type Mode = "lookup" | "convert" | "network";

const capacitorCanvas = ref<HTMLCanvasElement | null>(null);

const converter = ref({
  value: 100,
  fromUnit: "nF",
});

const convertedValue = (to: string): string => {
  const result = convertUnit(
    converter.value.value,
    converter.value.fromUnit,
    to,
  );
  if (to === "pF") return result.toFixed(2);
  if (to === "nF") return result.toFixed(4);
  return result.toFixed(6);
};

// ===== MODE 3: Series / Parallel =====
const series = ref({ items: [10, 20] as number[] });
const parallel = ref({ items: [10, 20] as number[] });

const seriesResultFormatted = computed(() => {
  const inFarads = series.value.items.filter((v) => v > 0).map((v) => v * 1e-6);
  return formatCapacitance(calculateSeries(inFarads));
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

const saveConverterToHistory = () => {
  historyStore.add({
    type: "capacitor",
    title: "Capacitor Unit Converter",
    value: `${converter.value.value} ${converter.value.fromUnit}`,
    input: { ...converter.value },
  });
};
</script>
