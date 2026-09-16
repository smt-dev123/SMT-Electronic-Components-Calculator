<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
    <!-- Inputs -->
    <div
      class="lg:col-span-5 glass-card rounded-2xl p-5 sm:p-6 shadow-xl space-y-4"
    >
      <div class="border-b border-slate-800 pb-3">
        <h2 class="text-lg font-bold text-white flex items-center gap-2">
          <i class="fa-regular fa-lightbulb text-amber-400"></i>
          គណនារេស៊ីស្តង់ LED (LED Resistor)
        </h2>
        <p class="text-xs text-slate-400">
          រកទំហំរេស៊ីស្តង់តភ្ជាប់សេរីដើម្បីការពារ LED មិនឲ្យឆេះ
        </p>
      </div>

      <div class="space-y-3">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            តង់ស្យុងប្រភព (Source Voltage Vs) - Volts:
          </label>
          <input
            v-model.number="led.vs"
            type="number"
            step="any"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            តង់ស្យុង LED (Forward Voltage Vf) - Volts:
          </label>
          <div class="grid grid-cols-3 gap-2">
            <input
              v-model.number="led.vf"
              type="number"
              step="any"
              class="col-span-2 bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
            <select
              v-model="ledPreset"
              @change="applyLedPreset"
              class="bg-slate-800 border border-slate-700 rounded-xl px-2 text-xs text-slate-300"
            >
              <option value="">-- កូដពណ៌ --</option>
              <option value="red">Red (2.0V)</option>
              <option value="green">Green (2.2V)</option>
              <option value="blue">Blue/White (3.2V)</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            ចរន្ត LED (Forward Current If) - mA:
          </label>
          <input
            v-model.number="led.ifmA"
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
            តម្លៃរេស៊ីស្តង់ត្រូវប្រើ (Required Resistor)
          </span>
          <div class="text-2xl font-bold font-mono text-cyan-400 mt-1">
            {{ ledResult.resistanceFormatted }}
          </div>
          <div class="text-xs text-amber-400 font-mono mt-0.5">
            Standard E24 Nearest: {{ ledResult.nearestE24 }}
          </div>
        </div>
        <div class="border-t border-slate-800 pt-2">
          <span class="text-xs text-slate-400 font-mono block">
            អានុភាពស៊ីលើរេស៊ីស្តង់ (Power Dissipation)
          </span>
          <div class="text-lg font-bold font-mono text-emerald-400 mt-0.5">
            {{ ledResult.powerFormatted }}
          </div>
          <div class="text-xs text-slate-400 font-mono mt-0.5">
            ណែនាំប្រើ: {{ ledResult.recWattage }}
          </div>
        </div>
      </div>
    </div>

    <!-- Live Circuit -->
    <div
      class="lg:col-span-7 glass-card rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between"
    >
      <div>
        <h3
          class="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2"
        >
          <i class="fa-solid fa-microchip text-cyan-400"></i>
          រូបភាពស៊ីគ្វីបន្តផ្ទាល់ (Live LED Circuit)
        </h3>
        <p class="text-xs text-slate-400 mt-1">
          បង្ហាញចរន្តអេឡិចត្រុងរត់ និងកម្រិតពន្លឺ LED តាមការគណនា
        </p>
      </div>

      <div class="my-4">
        <UiCanvasWrapper :height="256">
          <template #default>
            <canvas ref="ledCanvas" class="w-full h-full block" />
          </template>
        </UiCanvasWrapper>
      </div>

      <div
        class="text-xs font-mono text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800"
      >
        រូបមន្ត (Formula): R = (Vs - Vf) / If
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCanvasAnimation } from "~/composables/useCanvasAnimation";

const led = ref({ vs: 5, vf: 2.0, ifmA: 20 });
const ledPreset = ref("");
const ledCanvas = ref<HTMLCanvasElement | null>(null);

const applyLedPreset = () => {
  if (ledPreset.value === "red") led.value.vf = 2.0;
  if (ledPreset.value === "green") led.value.vf = 2.2;
  if (ledPreset.value === "blue") led.value.vf = 3.2;
};

const ledResult = computed(() => {
  const { vs, vf, ifmA } = led.value;
  if (!vs || !vf || !ifmA || vs <= vf || ifmA <= 0) {
    return {
      resistanceFormatted: "ទិន្នន័យមិនត្រឹមត្រូវ",
      nearestE24: "-",
      powerFormatted: "-",
      recWattage: "-",
    };
  }
  const ifA = ifmA / 1000;
  const r = (vs - vf) / ifA;
  const power = (vs - vf) * ifA;

  let recP = "1/4 Watt (0.25W)";
  if (power > 0.25 && power <= 0.5) recP = "1/2 Watt (0.50W)";
  else if (power > 0.5) recP = `${(power * 2).toFixed(1)} Watt`;

  return {
    resistanceFormatted: formatResistance(r),
    nearestE24: formatResistance(r * 1.02),
    powerFormatted: power.toFixed(3) + " Watt",
    recWattage: recP,
  };
});

const { animTime, register, setupCanvas, start, stop } = useCanvasAnimation();

register(() => {
  const result = setupCanvas(ledCanvas.value);
  if (!result) return;
  const { ctx, w, h } = result;
  ctx.clearRect(0, 0, w, h);

  // Circuit wire
  ctx.strokeStyle = "#475569";
  ctx.lineWidth = 4;
  ctx.strokeRect(50, 40, w - 100, h - 80);

  // Battery
  ctx.fillStyle = "#0284c7";
  ctx.fillRect(40, h / 2 - 25, 20, 50);

  // LED glow
  const ledX = w - 50;
  const ledY = h / 2;
  const brightness = Math.min(1, (led.value.ifmA || 0) / 25);

  ctx.shadowColor = "#f59e0b";
  ctx.shadowBlur = brightness * 30;
  ctx.fillStyle = `rgba(245, 158, 11, ${Math.max(0.2, brightness)})`;
  ctx.beginPath();
  ctx.arc(ledX, ledY, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Electrons
  ctx.fillStyle = "#38bdf8";
  const speed = (led.value.ifmA || 0) * 0.05;
  for (let p = 0; p < 10; p++) {
    const pos =
      (animTime.value * speed * 20 + p * 40) % (2 * (w - 100) + 2 * (h - 80));
    let px = 50;
    let py = 40;
    const topW = w - 100;
    const sideH = h - 80;

    if (pos < topW) {
      px = 50 + pos;
      py = 40;
    } else if (pos < topW + sideH) {
      px = w - 50;
      py = 40 + (pos - topW);
    } else if (pos < 2 * topW + sideH) {
      px = w - 50 - (pos - topW - sideH);
      py = h - 40;
    } else {
      px = 50;
      py = h - 40 - (pos - 2 * topW - sideH);
    }

    ctx.beginPath();
    ctx.arc(px, py, 3, 0, Math.PI * 2);
    ctx.fill();
  }
});

onMounted(() => start());
onUnmounted(() => stop());
</script>
