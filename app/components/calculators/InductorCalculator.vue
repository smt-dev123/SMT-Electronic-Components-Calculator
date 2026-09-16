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

    <!-- ===== MODE 1: Color Code ===== -->
    <div v-if="mode === 'color'" class="grid grid-cols-1 lg:grid-cols-12 gap-6">
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
            {{
              favoritesStore.has("inductor-color-code") ? "ដកចេញ" : "ចូលចិត្ត"
            }}
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

    <!-- ===== MODE 2: Solenoid Formula ===== -->
    <div
      v-if="mode === 'solenoid'"
      class="grid grid-cols-1 lg:grid-cols-12 gap-6"
    >
      <div class="lg:col-span-5 glass-card rounded-2xl p-5 sm:p-6 space-y-4">
        <div>
          <h2 class="text-lg font-bold text-white flex items-center gap-2">
            <LucideRotateCw class="w-4 h-4 text-cyan-400" />
            គណនាតាមរូបមន្ត Wheeler
          </h2>
          <p class="text-xs text-slate-400">សម្រាប់ Air-core coil</p>
        </div>

        <div class="space-y-3">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              ចំនួនរង្វង់ (Turns - N):
            </label>
            <input
              v-model.number="solenoid.turns"
              type="number"
              min="1"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              អង្កត់ផ្ចិត (Diameter - mm):
            </label>
            <input
              v-model.number="solenoid.diameter"
              type="number"
              step="0.1"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              ប្រវែង (Length - mm):
            </label>
            <input
              v-model.number="solenoid.length"
              type="number"
              step="0.1"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              Permeability (μr):
            </label>
            <select
              v-model.number="solenoid.permeability"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            >
              <option :value="1">Air / ខ្យល់ (μr = 1)</option>
              <option :value="100">Ferrite Low (μr = 100)</option>
              <option :value="1000">Ferrite High (μr = 1000)</option>
              <option :value="5000">Iron Powder (μr = 5000)</option>
            </select>
          </div>
        </div>

        <div class="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <span class="text-xs text-slate-400 font-mono block">
            តម្លៃអាំងឌុចទ័រ
          </span>
          <Transition name="fade-slide" mode="out-in">
            <div
              :key="solenoidResult?.formatted || '0'"
              class="text-3xl font-bold font-mono text-cyan-400 mt-1"
            >
              {{ solenoidResult?.formatted || "0 H" }}
            </div>
          </Transition>
        </div>
      </div>

      <div class="lg:col-span-7 glass-card rounded-2xl p-5 sm:p-6 space-y-4">
        <h3
          class="text-base font-bold text-white border-b border-slate-800 pb-3"
        >
          <LucideSquare class="w-4 h-4 text-amber-400 mr-2 inline" />
          រូបមន្ត Wheeler
        </h3>

        <div
          class="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-center space-y-3"
        >
          <p class="text-slate-300 font-mono text-base">
            L(µH) = (d² × N²) / (18d + 40l) × μr
          </p>
          <div class="text-xs text-slate-500 space-y-1 font-mono">
            <p>d = អង្កត់ផ្ចិត (inch)</p>
            <p>l = ប្រវែង (inch)</p>
            <p>N = ចំនួនរង្វង់</p>
            <p>μr = Permeability</p>
          </div>
        </div>

        <!-- Visual Coil -->
        <div class="bg-slate-950 border border-slate-800 rounded-2xl p-4">
          <svg viewBox="0 0 300 100" class="w-full">
            <g stroke="#cbd5e1" stroke-width="2.5" fill="none">
              <ellipse cx="50" cy="50" rx="8" ry="22" />
              <ellipse cx="75" cy="50" rx="8" ry="22" />
              <ellipse cx="100" cy="50" rx="8" ry="22" />
              <ellipse cx="125" cy="50" rx="8" ry="22" />
              <ellipse cx="150" cy="50" rx="8" ry="22" />
              <ellipse cx="175" cy="50" rx="8" ry="22" />
              <ellipse cx="200" cy="50" rx="8" ry="22" />
              <ellipse cx="225" cy="50" rx="8" ry="22" />
              <ellipse cx="250" cy="50" rx="8" ry="22" />
            </g>
            <line
              x1="0"
              y1="50"
              x2="42"
              y2="50"
              stroke="#64748b"
              stroke-width="3"
            />
            <line
              x1="258"
              y1="50"
              x2="300"
              y2="50"
              stroke="#64748b"
              stroke-width="3"
            />
          </svg>
        </div>
      </div>
    </div>

    <!-- ===== MODE 3: Reactance & Resonance ===== -->
    <div
      v-if="mode === 'reactance'"
      class="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      <!-- Reactance -->
      <div class="glass-card rounded-2xl p-5 sm:p-6 space-y-4">
        <h2 class="text-lg font-bold text-white flex items-center gap-2">
          <LucideAudioLines class="w-4 h-4 text-cyan-400" />
          គណនា Reactance (XL)
        </h2>
        <p class="text-xs text-slate-400">XL = 2πfL</p>

        <div class="space-y-3">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              Inductance L (µH):
            </label>
            <input
              v-model.number="reactance.inductance_uH"
              type="number"
              step="0.1"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              Frequency f (Hz):
            </label>
            <input
              v-model.number="reactance.frequency"
              type="number"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div class="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <span class="text-xs text-slate-400 font-mono block"
            >Reactance (XL)</span
          >
          <Transition name="fade-slide" mode="out-in">
            <div
              :key="reactanceResult?.formatted || '0'"
              class="text-3xl font-bold font-mono text-cyan-400 mt-1"
            >
              {{ reactanceResult?.formatted || "0 Ω" }}
            </div>
          </Transition>
        </div>
      </div>

      <!-- Resonance -->
      <div class="glass-card rounded-2xl p-5 sm:p-6 space-y-4">
        <h2 class="text-lg font-bold text-white flex items-center gap-2">
          <LucideZap class="w-4 h-4 text-amber-400" />
          គណនា LC Resonance
        </h2>
        <p class="text-xs text-slate-400">f = 1 / (2π√(LC))</p>

        <div class="space-y-3">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              Inductance L (µH):
            </label>
            <input
              v-model.number="resonance.inductance_uH"
              type="number"
              step="0.1"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              Capacitance C (µF):
            </label>
            <input
              v-model.number="resonance.capacitance_uF"
              type="number"
              step="0.001"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div class="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <span class="text-xs text-slate-400 font-mono block">
            Resonant Frequency
          </span>
          <Transition name="fade-slide" mode="out-in">
            <div
              :key="resonanceResult?.formatted || '0'"
              class="text-3xl font-bold font-mono text-amber-400 mt-1"
            >
              {{ resonanceResult?.formatted || "0 Hz" }}
            </div>
          </Transition>
        </div>
      </div>
    </div>

    <!-- ===== MODE 4: Series & Parallel ===== -->
    <div
      v-if="mode === 'network'"
      class="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      <!-- Series -->
      <div class="glass-card rounded-2xl p-5 sm:p-6 space-y-4">
        <h2 class="text-lg font-bold text-white flex items-center gap-2">
          <LucideArrowRight class="w-4 h-4 text-cyan-400" />
          អាំងឌុចទ័រសេរី (Series)
        </h2>
        <p class="text-xs text-slate-400">L_total = L₁ + L₂ + L₃ + ...</p>

        <div class="space-y-2">
          <div v-for="(_val, i) in series.items" :key="i" class="flex gap-2">
            <input
              v-model.number="series.items[i]"
              type="number"
              step="0.1"
              :placeholder="`L${i + 1} (µH)`"
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
            @click="series.items.push(0)"
            class="w-full py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs rounded-xl border border-slate-800 transition-colors flex items-center justify-center gap-1"
          >
            <LucidePlus class="w-3 h-3" /> បន្ថែម
          </button>
        </div>

        <div class="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <span class="text-xs text-slate-400 font-mono block">L_total</span>
          <div class="text-3xl font-bold font-mono text-cyan-400 mt-1">
            {{ seriesResult.formatted }}
          </div>
        </div>
      </div>

      <!-- Parallel -->
      <div class="glass-card rounded-2xl p-5 sm:p-6 space-y-4">
        <h2 class="text-lg font-bold text-white flex items-center gap-2">
          <LucideGitBranch class="w-4 h-4 text-amber-400" />
          អាំងឌុចទ័រប៉ារ៉ាឡែល (Parallel)
        </h2>
        <p class="text-xs text-slate-400">1/L_total = 1/L₁ + 1/L₂ + ...</p>

        <div class="space-y-2">
          <div v-for="(_val, i) in parallel.items" :key="i" class="flex gap-2">
            <input
              v-model.number="parallel.items[i]"
              type="number"
              step="0.1"
              :placeholder="`L${i + 1} (µH)`"
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
            @click="parallel.items.push(0)"
            class="w-full py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs rounded-xl border border-slate-800 transition-colors flex items-center justify-center gap-1"
          >
            <LucidePlus class="w-3 h-3" /> បន្ថែម
          </button>
        </div>

        <div class="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <span class="text-xs text-slate-400 font-mono block">L_total</span>
          <div class="text-3xl font-bold font-mono text-amber-400 mt-1">
            {{ parallelResult?.formatted || "0 H" }}
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
const {
  inductorColors,
  formatInductance,
  calculateByColorCode,
  calculateSolenoid,
  calculateResonantFreq,
  calculateReactance,
  calculateSeries,
  calculateParallel,
} = useInductorCalc();

// ===== Mode =====
type Mode = "color" | "solenoid" | "reactance" | "network";
const mode = ref<Mode>("color");

const modes = [
  { value: "color", label: "កូដពណ៌", icon: "LucidePalette" },
  { value: "solenoid", label: "រូបមន្ត", icon: "LucideRotateCw" },
  { value: "reactance", label: "Reactance", icon: "LucideAudioLines" },
  { value: "network", label: "សេរី/ប៉ារ៉ាឡែល", icon: "LucideGitBranch" },
] as const;

// ===== MODE 1: Color Code =====
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

// ===== MODE 2: Solenoid =====
const solenoid = ref({
  turns: 20,
  diameter: 10,
  length: 20,
  permeability: 1,
});

const solenoidResult = computed(() =>
  calculateSolenoid(
    solenoid.value.turns,
    solenoid.value.diameter,
    solenoid.value.length,
    solenoid.value.permeability,
  ),
);

// ===== MODE 3: Reactance & Resonance =====
const reactance = ref({
  inductance_uH: 100,
  frequency: 1000,
});

const reactanceResult = computed(() =>
  calculateReactance(
    reactance.value.inductance_uH * 1e-6,
    reactance.value.frequency,
  ),
);

const resonance = ref({
  inductance_uH: 100,
  capacitance_uF: 0.1,
});

const resonanceResult = computed(() =>
  calculateResonantFreq(
    resonance.value.inductance_uH * 1e-6,
    resonance.value.capacitance_uF * 1e-6,
  ),
);

// ===== MODE 4: Series & Parallel =====
const series = ref({ items: [10, 20] as number[] });
const parallel = ref({ items: [10, 20] as number[] });

const seriesResult = computed(() =>
  calculateSeries(series.value.items.filter((v) => v > 0).map((v) => v * 1e-6)),
);

const parallelResult = computed(() =>
  calculateParallel(
    parallel.value.items.filter((v) => v > 0).map((v) => v * 1e-6),
  ),
);

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
