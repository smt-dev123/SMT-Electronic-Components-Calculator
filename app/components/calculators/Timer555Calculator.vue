<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
    <!-- Inputs -->
    <div
      class="lg:col-span-5 glass-card rounded-2xl p-5 sm:p-6 shadow-xl space-y-4"
    >
      <div class="border-b border-slate-800 pb-3">
        <h2 class="text-lg font-bold text-white flex items-center gap-2">
          <i class="fa-solid fa-clock text-cyan-400"></i>
          IC 555 Astable Oscillator
        </h2>
        <p class="text-xs text-slate-400">
          គណនាប្រេកង់ (Frequency) និង Duty Cycle នៃចលនារលក Pulse
        </p>
      </div>

      <div class="space-y-3">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            រេស៊ីស្តង់ R1 (Ohms):
          </label>
          <input
            v-model.number="t555.r1"
            type="number"
            step="any"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            រេស៊ីស្តង់ R2 (Ohms):
          </label>
          <input
            v-model.number="t555.r2"
            type="number"
            step="any"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            កាប៉ាស៊ីទ័រ C1 (Microfarads - µF):
          </label>
          <input
            v-model.number="t555.c1"
            type="number"
            step="any"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      <div
        class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3"
      >
        <div>
          <span class="text-xs text-slate-400 font-mono block">
            ប្រេកង់សរុប (Output Frequency)
          </span>
          <div class="text-3xl font-bold font-mono text-cyan-400 mt-1">
            {{ t555Result.freqFormatted }}
          </div>
        </div>
        <div
          class="grid grid-cols-2 gap-2 border-t border-slate-800 pt-2 text-xs font-mono"
        >
          <div class="bg-slate-900 p-2 rounded-lg">
            <span class="text-slate-500 block">Duty Cycle</span>
            <span class="text-amber-400 font-bold">{{
              t555Result.dutyFormatted
            }}</span>
          </div>
          <div class="bg-slate-900 p-2 rounded-lg">
            <span class="text-slate-500 block">រយៈពេល (Period)</span>
            <span class="text-emerald-400 font-bold">{{
              t555Result.periodFormatted
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Oscilloscope -->
    <div
      class="lg:col-span-7 glass-card rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between"
    >
      <div>
        <h3
          class="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2"
        >
          <i class="fa-solid fa-wave-square text-cyan-400"></i>
          អូស៊ីឡូស្កូបបន្តផ្ទាល់ (Live Oscilloscope Waveform)
        </h3>
      </div>

      <div class="my-4">
        <UiCanvasWrapper :height="256">
          <template #default>
            <canvas ref="scopeCanvas" class="w-full h-full block" />
          </template>
        </UiCanvasWrapper>
      </div>

      <div
        class="text-xs font-mono text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800"
      >
        Freq = 1.44 / ((R1 + 2×R2) × C1)
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCanvasAnimation } from "~/composables/useCanvasAnimation";

const t555 = ref({ r1: 10000, r2: 47000, c1: 1 });
const scopeCanvas = ref<HTMLCanvasElement | null>(null);

const t555Result = computed(() => {
  const { r1, r2, c1: c1Uf } = t555.value;
  if (!r1 || !r2 || !c1Uf || r1 <= 0 || r2 <= 0 || c1Uf <= 0) {
    return {
      freqFormatted: "0 Hz",
      dutyFormatted: "0%",
      periodFormatted: "0 ms",
      rawFreq: 1,
      rawDuty: 50,
    };
  }

  const c1 = c1Uf / 1000000;
  const freq = 1.44 / ((r1 + 2 * r2) * c1);
  const duty = ((r1 + r2) / (r1 + 2 * r2)) * 100;
  const period = 1 / freq;

  return {
    freqFormatted:
      freq >= 1000
        ? (freq / 1000).toFixed(2) + " kHz"
        : freq.toFixed(2) + " Hz",
    dutyFormatted: duty.toFixed(1) + " %",
    periodFormatted:
      period < 0.001
        ? (period * 1000000).toFixed(2) + " µs"
        : (period * 1000).toFixed(2) + " ms",
    rawFreq: freq,
    rawDuty: duty,
  };
});

const { animTime, register, setupCanvas, start, stop } = useCanvasAnimation();

register(() => {
  const result = setupCanvas(scopeCanvas.value);
  if (!result) return;
  const { ctx, w, h } = result;
  ctx.clearRect(0, 0, w, h);

  // Grid
  ctx.strokeStyle = "#1e293b";
  ctx.lineWidth = 1;
  for (let x = 0; x < w; x += 30) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y < h; y += 30) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // Waveform
  ctx.strokeStyle = "#22d3ee";
  ctx.lineWidth = 3;
  ctx.shadowColor = "#22d3ee";
  ctx.shadowBlur = 10;
  ctx.beginPath();

  const freq = t555Result.value.rawFreq || 1;
  const duty = (t555Result.value.rawDuty || 50) / 100;
  const periodPx = Math.max(40, Math.min(200, 1000 / freq));

  const startX = -(animTime.value * 100) % periodPx;
  const highY = 40;
  const lowY = h - 40;

  ctx.moveTo(0, lowY);
  for (let x = startX; x < w + periodPx; x += periodPx) {
    const highW = periodPx * duty;
    ctx.lineTo(x, lowY);
    ctx.lineTo(x, highY);
    ctx.lineTo(x + highW, highY);
    ctx.lineTo(x + highW, lowY);
    ctx.lineTo(x + periodPx, lowY);
  }
  ctx.stroke();
  ctx.shadowBlur = 0;
});

onMounted(() => start());
onUnmounted(() => stop());
</script>
