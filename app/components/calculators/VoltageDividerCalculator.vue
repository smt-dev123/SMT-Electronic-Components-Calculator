<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
    <!-- Inputs -->
    <div
      class="lg:col-span-5 glass-card rounded-2xl p-5 sm:p-6 shadow-xl space-y-4"
    >
      <div class="border-b border-slate-800 pb-3">
        <h2 class="text-lg font-bold text-white flex items-center gap-2">
          <i class="fa-solid fa-sitemap text-cyan-400"></i>
          គណនាស៊ីគ្វីចែកតង់ស្យុង (Voltage Divider)
        </h2>
        <p class="text-xs text-slate-400">
          គណនាតង់ស្យុងចេញ (Vout) ពីស៊ីគ្វីរេស៊ីស្តង់ ២ សេរី
        </p>
      </div>

      <div class="space-y-3">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            តង់ស្យុងចូល (Input Voltage Vin) - Volts:
          </label>
          <input
            v-model.number="divider.vin"
            type="number"
            step="any"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            រេស៊ីស្តង់ទី១ (Resistor R1) - Ohms:
          </label>
          <input
            v-model.number="divider.r1"
            type="number"
            step="any"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            រេស៊ីស្តង់ទី២ (Resistor R2) - Ohms:
          </label>
          <input
            v-model.number="divider.r2"
            type="number"
            step="any"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      <div
        class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2"
      >
        <span class="text-xs text-slate-400 font-mono block">
          តង់ស្យុងចេញ (Output Voltage Vout)
        </span>
        <Transition name="fade-slide" mode="out-in">
          <div
            :key="dividerResult.voutFormatted"
            class="text-3xl font-bold font-mono text-cyan-400"
          >
            {{ dividerResult.voutFormatted }}
          </div>
        </Transition>
        <div
          class="text-xs font-mono text-amber-400 border-t border-slate-800 pt-2 space-y-1"
        >
          <div>
            ចរន្តឆ្លងកាត់ (Current): {{ dividerResult.currentFormatted }}
          </div>
          <div>អានុភាព R1: {{ dividerResult.pr1Formatted }}</div>
          <div>អានុភាព R2: {{ dividerResult.pr2Formatted }}</div>
        </div>
      </div>
    </div>

    <!-- Schematic -->
    <div
      class="lg:col-span-7 glass-card rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between"
    >
      <div>
        <h3
          class="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2"
        >
          <i class="fa-solid fa-diagram-project text-amber-400"></i>
          រូបភាពឌីយ៉ាក្រាមស៊ីគ្វី (Voltage Divider Schematic)
        </h3>
      </div>

      <div class="my-4">
        <UiCanvasWrapper :height="256">
          <template #default>
            <canvas ref="dividerCanvas" class="w-full h-full block" />
          </template>
        </UiCanvasWrapper>
      </div>

      <div
        class="text-xs font-mono text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800"
      >
        រូបមន្ត (Formula): Vout = Vin × (R2 / (R1 + R2))
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCanvasAnimation } from "~/composables/useCanvasAnimation";

const divider = ref({ vin: 12, r1: 10000, r2: 10000 });
const dividerCanvas = ref<HTMLCanvasElement | null>(null);

const dividerResult = computed(() => {
  const { vin, r1, r2 } = divider.value;
  if (!vin || !r1 || !r2 || r1 + r2 === 0) {
    return {
      voutFormatted: "0 V",
      currentFormatted: "0 mA",
      pr1Formatted: "0 W",
      pr2Formatted: "0 W",
      voutRaw: 0,
    };
  }

  const vout = vin * (r2 / (r1 + r2));
  const current = vin / (r1 + r2);
  return {
    voutFormatted: vout.toFixed(2) + " V",
    currentFormatted: (current * 1000).toFixed(2) + " mA",
    pr1Formatted: (current * current * r1).toFixed(3) + " W",
    pr2Formatted: (current * current * r2).toFixed(3) + " W",
    voutRaw: vout,
  };
});

const { animTime, register, setupCanvas, start, stop } = useCanvasAnimation();

register(() => {
  const result = setupCanvas(dividerCanvas.value);
  if (!result) return;
  const { ctx, w, h } = result;
  ctx.clearRect(0, 0, w, h);

  // Central line
  ctx.strokeStyle = "#06b6d4";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(w / 2, 20);
  ctx.lineTo(w / 2, h - 20);
  ctx.stroke();

  // Resistor boxes (R1, R2)
  const rBoxW = 60;
  const rBoxH = 24;

  ctx.strokeStyle = "#94a3b8";
  ctx.lineWidth = 2;
  ctx.strokeRect(w / 2 - rBoxW / 2, 60, rBoxW, rBoxH);
  ctx.strokeRect(w / 2 - rBoxW / 2, h - 60 - rBoxH, rBoxW, rBoxH);

  ctx.fillStyle = "#cbd5e1";
  ctx.font = "bold 11px JetBrains Mono";
  ctx.fillText("R1", w / 2 + rBoxW / 2 + 10, 76);
  ctx.fillText("R2", w / 2 + rBoxW / 2 + 10, h - 60 - rBoxH / 2 + 4);

  // Output meter
  const vin = divider.value.vin || 1;
  const vout = dividerResult.value.voutRaw || 0;
  const ratio = Math.min(1, vout / vin);

  ctx.fillStyle = "rgba(6, 182, 212, 0.2)";
  ctx.fillRect(w * 0.75, 40, 30, h - 80);

  ctx.fillStyle = "#06b6d4";
  ctx.fillRect(w * 0.75, h - 40 - (h - 80) * ratio, 30, (h - 80) * ratio);

  ctx.fillStyle = "#ffffff";
  ctx.font = "10px JetBrains Mono";
  ctx.fillText("Vout", w * 0.75 - 5, 30);

  // Animated electrons along the divider
  ctx.fillStyle = "#22d3ee";
  for (let i = 0; i < 4; i++) {
    const py = 30 + ((animTime.value * 40 + i * 40) % (h - 60));
    ctx.beginPath();
    ctx.arc(w / 2, py, 3, 0, Math.PI * 2);
    ctx.fill();
  }
});

onMounted(() => start());
onUnmounted(() => stop());
</script>
