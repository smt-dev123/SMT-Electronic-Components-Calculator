<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
    <!-- ===== Left: Canvas & Results ===== -->
    <div
      class="lg:col-span-7 glass-card rounded-2xl p-5 sm:p-6 shadow-2xl space-y-6 flex flex-col justify-between"
    >
      <div>
        <div
          class="flex flex-wrap justify-between items-center gap-3 border-b border-slate-800 pb-4"
        >
          <div>
            <h2
              class="text-base sm:text-lg font-bold text-white flex items-center gap-2"
            >
              <LucidePalette class="w-4 h-4 text-cyan-400" />
              កូដពណ៌រេស៊ីស្តង់ (Resistor Color Code)
            </h2>
            <p class="text-xs text-slate-400">
              គណនាតម្លៃតស៊ូ និងកម្រិតលំអៀងដោយប្រើកូដពណ៌
            </p>
          </div>

          <div
            class="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center gap-1"
          >
            <button
              v-for="b in [4, 5, 6]"
              :key="b"
              @click="resistorBandsCount = b as 4 | 5 | 6"
              :class="[
                'px-3 py-1 rounded-lg text-xs font-semibold font-mono transition-all',
                resistorBandsCount === b
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white',
              ]"
            >
              {{ b }} Bands
            </button>
          </div>
        </div>

        <!-- Canvas -->
        <div class="mt-6">
          <UiCanvasWrapper :height="176">
            <template #default>
              <canvas ref="resistorCanvas" class="w-full h-full block" />
            </template>
          </UiCanvasWrapper>

          <!-- Results -->
          <div class="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            <UiResultCard
              label="តម្លៃតស៊ូសរុប (Resistance)"
              :value="formattedResistorValue"
              color="cyan"
              size="xl"
            />
            <UiResultCard
              label="កម្រិតលំអៀង & សីតុណ្ហភាព"
              :value="toleranceText"
              color="amber"
              size="md"
              :subtext="`Range: ${resistorRange}`"
            />
          </div>
        </div>
      </div>

      <!-- ===== Color Bands Selector ===== -->
      <div>
        <h3
          class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between"
        >
          <span class="flex items-center gap-1">
            <LucideMousePointerClick class="w-3.5 h-3.5 text-cyan-400" />
            ជ្រើសរើសពណ៌កង់នីមួយៗ (Select Color Bands)
          </span>
        </h3>

        <div class="space-y-4">
          <div
            v-for="(bandIdx, pos) in activeBandIndices"
            :key="pos"
            class="space-y-2"
          >
            <!-- Label + Selected -->
            <div class="flex items-center justify-between">
              <label class="text-xs font-semibold text-slate-300">
                {{ getBandTitle(resistorBandsCount, pos) }}
              </label>
              <div class="flex items-center gap-2">
                <span
                  class="w-4 h-4 rounded-full border-2 border-slate-600"
                  :style="{
                    backgroundColor:
                      selectedBands[pos] !== undefined
                        ? colorMasterList[selectedBands[pos]!]?.hex
                        : '#000',
                  }"
                ></span>
                <Transition name="fade-slide" mode="out-in">
                  <span
                    :key="selectedBands[pos]"
                    class="text-[11px] font-mono text-cyan-400 px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/30 rounded-full"
                  >
                    {{
                      selectedBands[pos] !== undefined
                        ? colorMasterList[selectedBands[pos]!]?.nameKh
                        : "—"
                    }}
                  </span>
                </Transition>
              </div>
            </div>

            <!-- Color Circles -->
            <div class="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2">
              <button
                v-for="color in filterColorsForBand(resistorBandsCount, pos)"
                :key="color.colorIndex"
                @click="selectedBands[pos] = color.colorIndex"
                :title="color.nameKh"
                class="aspect-square rounded-full border-2 transition-all duration-200 hover:scale-110 relative group"
                :class="[
                  selectedBands[pos] === color.colorIndex
                    ? 'scale-125 border-cyan-400 ring-4 ring-cyan-500/30 shadow-lg shadow-cyan-500/20'
                    : 'border-slate-700 hover:border-slate-500',
                ]"
                :style="{ backgroundColor: color.hex }"
              >
                <LucideCheck
                  v-if="selectedBands[pos] === color.colorIndex"
                  class="absolute inset-0 m-auto w-3 h-3"
                  :class="
                    color.colorIndex === 9 || color.colorIndex === 4
                      ? 'text-slate-900'
                      : 'text-white'
                  "
                />
              </button>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div
          class="mt-4 pt-4 border-t border-slate-800 flex items-center gap-2"
        >
          <button
            @click="saveToHistory"
            class="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors"
          >
            <LucideSave class="w-3.5 h-3.5" />
            រក្សាទុកប្រវត្តិ
          </button>
          <button
            @click="toggleFavorite"
            class="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl border transition-colors"
            :class="
              favoritesStore.has('resistor-color-code')
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            "
          >
            <LucideStar
              class="w-3.5 h-3.5"
              :fill="
                favoritesStore.has('resistor-color-code')
                  ? 'currentColor'
                  : 'none'
              "
            />
            {{
              favoritesStore.has("resistor-color-code") ? "ដកចេញ" : "ចូលចិត្ត"
            }}
          </button>
        </div>
      </div>
    </div>

    <!-- ===== Right: SMD + Reference ===== -->
    <div class="lg:col-span-5 space-y-6">
      <SmdResistorCard />
      <ColorReferenceTable />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  colorMasterList,
  formatResistance,
  useResistorCalc,
  type BandIndices,
} from "~/composables/core/useResistorCalc";
import { useCanvasAnimation } from "~/composables/useCanvasAnimation";
import SmdResistorCard from "./SmdResistorCard.vue";
import ColorReferenceTable from "./ColorReferenceTable.vue";

// ===== Stores =====
const historyStore = useHistoryStore();
const favoritesStore = useFavoritesStore();

// ===== Composable =====
const {
  filterColorsForBand,
  calculateOhms,
  getTolerance,
  getPPM,
  getActiveBandIndices,
  getBandTitle,
  getResistorRange,
} = useResistorCalc();

// ===== Local State (SSR-safe) =====
const resistorBandsCount = ref<4 | 5 | 6>(4);
const selectedBands = ref<BandIndices>([1, 0, 0, 2, 10, 1]);
const resistorCanvas = ref<HTMLCanvasElement | null>(null);

// ===== Canvas Animation =====
const { animTime, register, setupCanvas, start, stop } = useCanvasAnimation();

// ===== Computed =====
const activeBandIndices = computed(() =>
  getActiveBandIndices(resistorBandsCount.value),
);

const formattedResistorValue = computed(() =>
  formatResistance(
    calculateOhms(selectedBands.value, resistorBandsCount.value),
  ),
);

const resistorTolerance = computed(() =>
  getTolerance(selectedBands.value, resistorBandsCount.value),
);

const resistorPPM = computed(() =>
  getPPM(selectedBands.value, resistorBandsCount.value),
);

const resistorRange = computed(() =>
  getResistorRange(selectedBands.value, resistorBandsCount.value),
);

const toleranceText = computed(() => {
  const base = `±${resistorTolerance.value}%`;
  if (resistorBandsCount.value === 6 && resistorPPM.value !== null) {
    return `${base} (${resistorPPM.value} PPM/K)`;
  }
  return base;
});

// ===== Actions =====
const saveToHistory = () => {
  historyStore.add({
    type: "resistor",
    title: `Resistor ${resistorBandsCount.value}-Band`,
    value: formattedResistorValue.value,
    input: {
      bands: [...selectedBands.value],
      bandCount: resistorBandsCount.value,
      tolerance: resistorTolerance.value,
    },
  });
};

const toggleFavorite = () => {
  favoritesStore.toggle(
    "resistor-color-code",
    `${resistorBandsCount.value}-Band`,
    "transistor",
  );
};

// ===== Canvas Render =====
register(() => {
  const result = setupCanvas(resistorCanvas.value);
  if (!result) return;
  const { ctx, w, h } = result;
  ctx.clearRect(0, 0, w, h);

  // Wires
  ctx.strokeStyle = "#64748b";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(10, h / 2);
  ctx.lineTo(w - 10, h / 2);
  ctx.stroke();

  // Body
  const bodyW = w * 0.6;
  const bodyH = 64;
  const bodyX = (w - bodyW) / 2;
  const bodyY = (h - bodyH) / 2;

  const grad = ctx.createLinearGradient(bodyX, bodyY, bodyX, bodyY + bodyH);
  grad.addColorStop(0, "#e2e8f0");
  grad.addColorStop(0.5, "#cbd5e1");
  grad.addColorStop(1, "#94a3b8");

  ctx.fillStyle = grad;
  ctx.shadowColor = "rgba(6, 182, 212, 0.25)";
  ctx.shadowBlur = 15;
  ctx.beginPath();
  const ctxAny = ctx as CanvasRenderingContext2D & {
    roundRect?: (x: number, y: number, w: number, h: number, r: number) => void;
  };
  if (typeof ctxAny.roundRect === "function") {
    ctxAny.roundRect(bodyX, bodyY, bodyW, bodyH, 20);
  } else {
    ctx.rect(bodyX, bodyY, bodyW, bodyH);
  }
  ctx.fill();
  ctx.shadowBlur = 0;

  // Color bands
  const indices = activeBandIndices.value;
  const bandCount = indices.length;
  const startX = bodyX + 30;
  const spacing = (bodyW - 60) / Math.max(bandCount - 1, 1);

  indices.forEach((_bandPos, idx) => {
    const colorIdx = selectedBands.value[idx];
    if (colorIdx === undefined) return;
    const cData = colorMasterList[colorIdx];
    if (!cData) return;
    const bx = startX + idx * spacing;
    ctx.fillStyle = cData.hex;
    ctx.shadowColor = cData.hex;
    ctx.shadowBlur = 8;
    ctx.fillRect(bx - 6, bodyY, 12, bodyH);
    ctx.shadowBlur = 0;
  });

  // Electrons
  ctx.fillStyle = "#22d3ee";
  for (let i = 0; i < 8; i++) {
    const px = (animTime.value * 60 + i * (w / 8)) % w;
    ctx.beginPath();
    ctx.arc(px, h / 2, 3, 0, Math.PI * 2);
    ctx.fill();
  }
});

// ===== Lifecycle (SSR-safe) =====
onMounted(() => {
  start();
});

onUnmounted(() => {
  stop();
});
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.25s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
