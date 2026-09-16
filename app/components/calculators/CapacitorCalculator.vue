<template>
  <div class="space-y-6">
    <!-- ===== Mode Selector ===== -->
    <div class="glass-card rounded-2xl p-5">
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          v-for="m in modes"
          :key="m.value"
          @click="mode = m.value"
          class="py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-300"
          :class="
            mode === m.value
              ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-slate-950 shadow-md shadow-cyan-500/20 scale-105'
              : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800'
          "
        >
          <component :is="m.icon" class="w-3.5 h-3.5" />
          <span>{{ m.label }}</span>
        </button>
      </div>
    </div>

    <!-- ===== MODE 1: Code Lookup ===== -->
    <div v-if="mode === 'lookup'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="glass-card rounded-2xl p-5 sm:p-6 space-y-5">
        <div class="border-b border-slate-800 pb-3">
          <h2 class="text-lg font-bold text-white flex items-center gap-2">
            <LucideZap class="w-4 h-4 text-cyan-400" />
            គណនាកូដកាប៉ាស៊ីទ័រ (Capacitor Code Lookup)
          </h2>
          <p class="text-xs text-slate-400">
            បម្លែងលេខកូដកាប៉ាស៊ីទ័រសេរ៉ាមិច ឬហ្វីល (ឧ: 104K, 223J)
          </p>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1.5">
              បញ្ចូលកូដកាប៉ាស៊ីទ័រ (Capacitor Code):
            </label>
            <div class="relative">
              <input
                v-model="capInput"
                type="text"
                placeholder="e.g. 104K"
                maxlength="10"
                class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3 text-white font-mono uppercase text-lg focus:outline-none focus:border-cyan-500"
              />
              <button
                v-if="capInput"
                @click="capInput = ''"
                class="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-500 hover:text-slate-300 rounded-lg transition-colors"
              >
                <LucideX class="w-3 h-3" />
              </button>
            </div>
          </div>

          <!-- Quick Chips -->
          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="chip in quickChips"
              :key="chip"
              @click="capInput = chip"
              class="px-2 py-1 text-[10px] font-mono rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-colors"
            >
              {{ chip }}
            </button>
          </div>

          <!-- Canvas -->
          <UiCanvasWrapper :height="112">
            <template #default>
              <canvas ref="capacitorCanvas" class="w-full h-full block" />
            </template>
          </UiCanvasWrapper>

          <!-- Result -->
          <div
            class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3"
          >
            <div>
              <span class="text-xs text-slate-400 block font-mono">
                តម្លៃអគ្គិសនីសរុប (Capacitance Value)
              </span>
              <Transition name="fade-slide" mode="out-in">
                <div
                  :key="capResult.primary"
                  class="text-3xl font-bold font-mono mt-1"
                  :class="
                    capResult.primary === 'កូដមិនត្រឹមត្រូវ'
                      ? 'text-red-400'
                      : 'text-cyan-400'
                  "
                >
                  {{ capResult.primary }}
                </div>
              </Transition>
            </div>

            <div
              class="grid grid-cols-3 gap-2 border-t border-slate-800 pt-3 text-xs font-mono"
            >
              <div>
                <span class="text-slate-500 block">Picofarad (pF)</span>
                <span class="text-slate-200 font-semibold">{{
                  capResult.pF
                }}</span>
              </div>
              <div>
                <span class="text-slate-500 block">Nanofarad (nF)</span>
                <span class="text-cyan-300 font-semibold">{{
                  capResult.nF
                }}</span>
              </div>
              <div>
                <span class="text-slate-500 block">Microfarad (µF)</span>
                <span class="text-slate-200 font-semibold">{{
                  capResult.uF
                }}</span>
              </div>
            </div>

            <div
              class="text-xs text-amber-400 font-mono border-t border-slate-800 pt-2"
            >
              កម្រិតលំអៀង (Tolerance): {{ capResult.tolerance }}
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2 pt-2 border-t border-slate-800">
            <button
              @click="saveToHistory"
              :disabled="capResult.primary === 'កូដមិនត្រឹមត្រូវ'"
              class="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <LucideSave class="w-3.5 h-3.5" />
              រក្សាទុក
            </button>
            <button
              @click="toggleFavorite"
              class="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl border transition-colors"
              :class="
                favoritesStore.has('cap-lookup')
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              "
            >
              <LucideStar
                class="w-3.5 h-3.5"
                :fill="
                  favoritesStore.has('cap-lookup') ? 'currentColor' : 'none'
                "
              />
              {{ favoritesStore.has("cap-lookup") ? "ដកចេញ" : "ចូលចិត្ត" }}
            </button>
          </div>
        </div>
      </div>

      <!-- Reference Card -->
      <div class="glass-card rounded-2xl p-5 sm:p-6 space-y-4">
        <div class="border-b border-slate-800 pb-3">
          <h3 class="text-base font-bold text-white flex items-center gap-2">
            <LucideListChecks class="w-4 h-4 text-amber-400" />
            តារាងកូដលំអៀង និងតម្លៃទូទៅ
          </h3>
        </div>

        <div>
          <h4 class="text-xs font-semibold text-slate-400 uppercase mb-2">
            អក្សរកូដលំអៀង (Tolerance Letter Codes)
          </h4>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
            <div
              v-for="t in tolerances"
              :key="t.letter"
              class="bg-slate-950 p-2 rounded-lg border border-slate-800"
            >
              <span class="text-amber-400 font-bold">{{ t.letter }}</span>
              : {{ t.value }}
            </div>
          </div>
        </div>

        <div class="pt-2">
          <h4 class="text-xs font-semibold text-slate-400 uppercase mb-2">
            កូដដែលប្រើញឹកញាប់ (Popular Codes)
          </h4>
          <div class="space-y-1.5 text-xs font-mono">
            <div
              v-for="(pop, i) in popularCapacitors"
              :key="i"
              class="flex justify-between bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 hover:border-cyan-500/30 transition-colors cursor-pointer"
              @click="capInput = pop.code"
            >
              <span class="text-amber-300 font-bold">{{ pop.code }}</span>
              <span class="text-cyan-400">{{ pop.val }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== MODE 2: Unit Converter ===== -->
    <div
      v-if="mode === 'convert'"
      class="glass-card rounded-2xl p-5 sm:p-6 space-y-4 max-w-2xl mx-auto"
    >
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

    <!-- ===== MODE 3: Series / Parallel ===== -->
    <div
      v-if="mode === 'network'"
      class="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
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
  </div>
</template>

<script setup lang="ts">
import { useCapacitorCalc } from "~/composables/core/useCapacitorCalc";
import { useCanvasAnimation } from "~/composables/useCanvasAnimation";

// ===== Stores =====
const historyStore = useHistoryStore();
const favoritesStore = useFavoritesStore();

// ===== Composable =====
const {
  parseCapCode,
  convertUnit,
  calculateSeries,
  calculateParallel,
  formatCapacitance,
} = useCapacitorCalc();

// ===== Mode =====
type Mode = "lookup" | "convert" | "network";
const mode = ref<Mode>("lookup");

const modes = [
  { value: "lookup", label: "កូដ", icon: "LucideBarcode" },
  { value: "convert", label: "បំប្លែងឯកតា", icon: "LucideArrowRightLeft" },
  { value: "network", label: "សេរី/ប៉ារ៉ាឡែល", icon: "LucideGitBranch" },
] as const;

// ===== MODE 1: Lookup =====
const capInput = ref("104K");
const capacitorCanvas = ref<HTMLCanvasElement | null>(null);

const quickChips = ["104K", "223J", "473M", "105K", "102K", "474M"];

const popularCapacitors = [
  { code: "102", val: "1 nF / 0.001 µF" },
  { code: "103", val: "10 nF / 0.01 µF" },
  { code: "104", val: "100 nF / 0.1 µF" },
  { code: "473", val: "47 nF / 0.047 µF" },
  { code: "105", val: "1 µF" },
  { code: "224", val: "220 nF / 0.22 µF" },
  { code: "474", val: "470 nF / 0.47 µF" },
];

const tolerances = [
  { letter: "J", value: "±5%" },
  { letter: "K", value: "±10%" },
  { letter: "M", value: "±20%" },
  { letter: "F", value: "±1%" },
  { letter: "G", value: "±2%" },
  { letter: "Z", value: "+80/-20%" },
];

const capResult = computed(() => parseCapCode(capInput.value));

// ===== MODE 2: Converter =====
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

// ===== Actions =====
const saveToHistory = () => {
  if (capResult.value.primary === "កូដមិនត្រឹមត្រូវ") return;
  historyStore.add({
    type: "capacitor",
    title: `Cap Code: ${capInput.value}`,
    value: capResult.value.primary,
    input: { code: capInput.value },
  });
};

const toggleFavorite = () => {
  favoritesStore.toggle("cap-lookup", "Code Lookup", "transistor");
};

const saveConverterToHistory = () => {
  historyStore.add({
    type: "capacitor",
    title: "Capacitor Unit Converter",
    value: `${converter.value.value} ${converter.value.fromUnit}`,
    input: { ...converter.value },
  });
};

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
