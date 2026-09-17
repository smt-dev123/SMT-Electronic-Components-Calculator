<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              :fill="favoritesStore.has('cap-lookup') ? 'currentColor' : 'none'"
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
  favoritesStore.toggle("cap-lookup", "Code Lookup", "capacitor");
};
</script>
