<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
    <!-- Left: Canvas + Result -->
    <div class="lg:col-span-7 glass-card rounded-2xl p-5 sm:p-6 space-y-6">
      <div>
        <h2 class="text-lg font-bold text-white flex items-center gap-2">
          <LucidePalette class="w-4 h-4 text-cyan-400" />
          កូដពណ៌អាំងឌុចទ័រ (Inductor Color Code)
        </h2>
        <p class="text-xs text-slate-400">
          គណនាតម្លៃអាំងឌុចទ័រតាមរយៈកូដពណ៌ (4 bands)
        </p>
      </div>

      <!-- SVG Preview -->
      <div class="bg-slate-950 border border-slate-800 rounded-2xl p-6">
        <svg viewBox="0 0 400 120" class="w-full max-w-md mx-auto">
          <!-- Leads -->
          <line
            x1="0"
            y1="60"
            x2="80"
            y2="60"
            stroke="#9CA3AF"
            stroke-width="4"
          />
          <line
            x1="320"
            y1="60"
            x2="400"
            y2="60"
            stroke="#9CA3AF"
            stroke-width="4"
          />

          <!-- Body -->
          <ellipse
            cx="200"
            cy="60"
            rx="120"
            ry="30"
            fill="#1e293b"
            stroke="#475569"
            stroke-width="2"
          />

          <!-- Windings -->
          <path
            d="M 80 60 Q 95 20, 110 60 T 140 60 T 170 60 T 200 60 T 230 60 T 260 60 T 290 60 T 320 60"
            fill="none"
            stroke="#cbd5e1"
            stroke-width="3"
          />

          <!-- Color bands -->
          <g v-for="(band, i) in previewBands" :key="i">
            <rect
              :x="bandPositions[i]"
              y="30"
              width="14"
              height="60"
              :fill="band?.hex || 'transparent'"
              class="transition-all duration-300"
            />
          </g>

          <!-- Animated electron -->
          <circle r="3" fill="#22d3ee">
            <animate
              attributeName="cx"
              from="0"
              to="400"
              dur="3s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="cy"
              values="60;60"
              dur="3s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      </div>

      <!-- Results -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div class="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <span class="text-[11px] text-slate-400 font-mono block">
            តម្លៃអាំងឌុចទ័រ (Inductance)
          </span>
          <Transition name="fade-slide" mode="out-in">
            <div
              :key="result.formatted"
              class="text-3xl font-bold font-mono text-cyan-400 mt-1"
            >
              {{ result.formatted }}
            </div>
          </Transition>
        </div>
        <div class="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <span class="text-[11px] text-slate-400 font-mono block">
            ភាពលំអៀង (Tolerance)
          </span>
          <div class="text-2xl font-bold font-mono text-amber-400 mt-1">
            ±{{ result.tolerance }}%
          </div>
          <div class="text-[10px] text-slate-500 font-mono mt-1">
            Range: {{ result.range.min }} - {{ result.range.max }}
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-2 pt-2 border-t border-slate-800">
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
            favoritesStore.has('inductor-color-code')
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
          "
        >
          <LucideStar
            class="w-3.5 h-3.5"
            :fill="
              favoritesStore.has('inductor-color-code')
                ? 'currentColor'
                : 'none'
            "
          />
          {{ favoritesStore.has("inductor-color-code") ? "ដកចេញ" : "ចូលចិត្ត" }}
        </button>
      </div>
    </div>

    <!-- Right: Color Band Selectors -->
    <div class="lg:col-span-5 glass-card rounded-2xl p-5 sm:p-6 space-y-4">
      <h3 class="text-sm font-bold text-white flex items-center gap-2">
        <LucideMousePointerClick class="w-4 h-4 text-cyan-400" />
        ជ្រើសរើសពណ៌កង់
      </h3>

      <div v-for="(label, idx) in bandLabels" :key="idx" class="space-y-2">
        <div class="flex items-center justify-between">
          <label class="text-xs font-semibold text-slate-300">
            {{ label }}
          </label>
          <div class="flex items-center gap-2">
            <span
              class="w-3.5 h-3.5 rounded-full border border-slate-600"
              :style="{ backgroundColor: selectedColors[idx]?.hex || '#000' }"
            />
            <span class="text-[10px] font-mono text-cyan-400">
              {{ selectedColors[idx]?.khmer }}
            </span>
          </div>
        </div>
        <div class="grid grid-cols-6 sm:grid-cols-8 gap-2">
          <button
            v-for="color in availableColors(idx)"
            :key="color.name"
            @click="selectedColors[idx] = color"
            class="aspect-square rounded-full border-2 transition-all duration-200 hover:scale-110 relative"
            :class="
              selectedColors[idx]?.name === color.name
                ? 'scale-125 border-cyan-400 ring-4 ring-cyan-500/30 shadow-lg shadow-cyan-500/20'
                : 'border-slate-700'
            "
            :style="{ backgroundColor: color.hex }"
            :title="color.khmer"
          >
            <LucideCheck
              v-if="selectedColors[idx]?.name === color.name"
              class="absolute inset-0 m-auto w-3 h-3"
              :class="
                color.name === 'white' || color.name === 'yellow'
                  ? 'text-slate-900'
                  : 'text-white'
              "
            />
          </button>
        </div>
      </div>

      <!-- Unit reference -->
      <div class="pt-3 border-t border-slate-800">
        <h4 class="text-xs font-bold text-slate-400 uppercase mb-2">
          តារាងឯកតា
        </h4>
        <div class="space-y-1 text-xs font-mono">
          <div class="flex justify-between text-slate-400">
            <span>1 H</span>
            <span class="text-cyan-400">= 1,000 mH</span>
          </div>
          <div class="flex justify-between text-slate-400">
            <span>1 mH</span>
            <span class="text-cyan-400">= 1,000 µH</span>
          </div>
          <div class="flex justify-between text-slate-400">
            <span>1 µH</span>
            <span class="text-cyan-400">= 1,000 nH</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  useInductorCalc,
  type InductorColor,
} from "~/composables/core/useInductorCalc";

// ===== Stores =====
const historyStore = useHistoryStore();
const favoritesStore = useFavoritesStore();

// ===== Composable =====
const { inductorColors, calculateByColorCode } = useInductorCalc();

// ===== Color Code =====
type InductorBands = [
  InductorColor,
  InductorColor,
  InductorColor,
  InductorColor | null,
];

const selectedColors = ref<InductorBands>([
  inductorColors[1]!, // brown
  inductorColors[0]!, // black
  inductorColors[0]!, // black (x1)
  inductorColors[10]!, // gold (5%)
]);

const bandLabels = ["កង់ទី ១", "កង់ទី ២", "មេគុណ", "លំអៀង"];

const availableColors = (idx: number): InductorColor[] => {
  if (idx === 3) {
    return inductorColors.filter(
      (c) => c.tolerance !== null && c.digit === null,
    );
  }
  if (idx === 2) {
    return inductorColors.filter((c) => c.multiplier !== null);
  }
  return inductorColors.filter((c) => c.digit !== null);
};

const previewBands = computed(() => selectedColors.value.filter(Boolean));
const bandPositions = [100, 150, 220, 290];

const result = computed(() => {
  const [b1, b2, mult, tol] = selectedColors.value;
  if (!b1 || !b2 || !mult) {
    return {
      formatted: "0 H",
      tolerance: 20,
      range: { min: "0 H", max: "0 H" },
    };
  }
  return calculateByColorCode(b1, b2, mult, tol);
});

// ===== Actions =====
const saveToHistory = () => {
  historyStore.add({
    type: "inductor",
    title: "Inductor Color Code",
    value: result.value.formatted,
    input: {
      colors: selectedColors.value.map((c) => c?.name ?? ""),
      bands: [...selectedColors.value.map((c) => c?.name ?? "")],
    },
  });
};

const toggleFavorite = () => {
  favoritesStore.toggle("inductor-color-code", "4-Band", "transistor");
};
</script>
