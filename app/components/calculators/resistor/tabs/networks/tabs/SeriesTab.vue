<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
    <div class="lg:col-span-5 glass-card rounded-2xl p-5 sm:p-6 space-y-4">
      <div class="border-b border-slate-800 pb-3">
        <h2 class="text-lg font-bold text-white flex items-center gap-2">
          <LucideArrowRight class="w-4 h-4 text-cyan-400" />
          រេស៊ីស្តង់សេរី (Series)
        </h2>
        <p class="text-xs text-slate-400">R_total = R1 + R2 + R3 + ...</p>
      </div>

      <div class="space-y-2">
        <div v-for="(_val, i) in series.items" :key="i" class="flex gap-2">
          <div class="flex-1 relative">
            <span
              class="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-500"
            >
              R{{ i + 1 }}
            </span>
            <input
              v-model.number="series.items[i]"
              type="number"
              step="1"
              placeholder="Ω"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
            />
          </div>
          <button
            v-if="series.items.length > 2"
            @click="series.items.splice(i, 1)"
            class="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl border border-red-500/30 transition-colors"
          >
            <LucideX class="w-3.5 h-3.5" />
          </button>
        </div>
        <button
          @click="series.items.push(100)"
          class="w-full py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs rounded-xl border border-slate-800 transition-colors flex items-center justify-center gap-1"
        >
          <LucidePlus class="w-3 h-3" /> បន្ថែម Resistor
        </button>
      </div>

      <div
        v-if="seriesResult"
        class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2"
      >
        <div>
          <span class="text-xs text-slate-400 font-mono block">
            R_total ({{ seriesResult.count }} resistors)
          </span>
          <Transition name="fade-slide" mode="out-in">
            <div
              :key="seriesResult.totalFormatted"
              class="text-3xl font-bold font-mono text-cyan-400 mt-1"
            >
              {{ seriesResult.totalFormatted }}
            </div>
          </Transition>
        </div>

        <!-- Power Distribution -->
        <div
          v-if="seriesPowerResult"
          class="border-t border-slate-800 pt-3 space-y-2"
        >
          <div class="flex items-center gap-2 mb-2">
            <label class="text-[10px] text-slate-400 font-mono">
              តង់ស្យុងសរុប (V):
            </label>
            <input
              v-model.number="series.voltage"
              type="number"
              step="0.1"
              class="flex-1 bg-slate-900 border border-slate-700/80 rounded-lg px-2 py-1 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div
            v-for="(r, i) in seriesPowerResult.results"
            :key="i"
            class="flex justify-between text-[10px] font-mono"
          >
            <span class="text-slate-400">R{{ i + 1 }}:</span>
            <span class="text-slate-300">
              {{ r.voltageFormatted }} • {{ r.powerFormatted }}
            </span>
          </div>
        </div>
      </div>

      <button
        v-if="seriesResult"
        @click="saveToHistory('Series', seriesResult.totalFormatted)"
        class="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors"
      >
        <LucideSave class="w-3.5 h-3.5" />
        រក្សាទុកប្រវត្តិ
      </button>
    </div>

    <!-- Schematic -->
    <div class="lg:col-span-7 glass-card rounded-2xl p-5 sm:p-6 space-y-4">
      <h3 class="text-base font-bold text-white border-b border-slate-800 pb-3">
        <LucideNetwork class="w-4 h-4 text-amber-400 mr-2 inline" />
        ដ្យាក្រាមសៀគ្វី (Series)
      </h3>

      <div class="bg-slate-950 border border-slate-800 rounded-2xl p-6">
        <svg
          :viewBox="`0 0 ${Math.max(400, series.items.length * 80 + 100)} 120`"
          class="w-full"
        >
          <!-- Wire -->
          <line
            x1="20"
            y1="60"
            :x2="40 + series.items.length * 80"
            y2="60"
            stroke="#64748b"
            stroke-width="4"
          />

          <!-- Resistors -->
          <g v-for="(r, i) in series.items" :key="i">
            <rect
              :x="40 + i * 80"
              y="40"
              width="60"
              height="40"
              rx="6"
              fill="#1e293b"
              stroke="#22d3ee"
              stroke-width="2"
            />
            <text
              :x="55 + i * 80"
              y="30"
              fill="#22d3ee"
              font-size="10"
              font-family="JetBrains Mono"
            >
              R{{ i + 1 }}
            </text>
            <text
              :x="55 + i * 80"
              y="95"
              fill="#94a3b8"
              font-size="9"
              font-family="JetBrains Mono"
            >
              {{ formatResistance(r) }}
            </text>
          </g>

          <!-- Animated current -->
          <circle r="4" fill="#22d3ee">
            <animate
              attributeName="cx"
              from="20"
              :to="40 + series.items.length * 80"
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

      <div
        class="text-xs font-mono text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800"
      >
        <p class="text-cyan-400 font-bold mb-1">📐 រូបមន្ត Series:</p>
        <p>R_total = R1 + R2 + R3 + ...</p>
        <p class="text-slate-500 mt-1">• ចរន្តដូចគ្នា (I ដូចគ្នាទាំងអស់)</p>
        <p class="text-slate-500">• តង់ស្យុងបែងចែកតាម R</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useResistorCalc } from "~/composables/core/useResistorCalc";

// ===== Stores =====
const historyStore = useHistoryStore();

// ===== Composable =====
const { formatResistance, calculateSeries, calculatePowerDistribution } =
  useResistorCalc();

// ===== Series =====
const series = ref({
  items: [100, 220, 470] as number[],
  voltage: 12,
});

const seriesResult = computed(() => calculateSeries(series.value.items));

const seriesPowerResult = computed(() => {
  if (!seriesResult.value || series.value.voltage <= 0) return null;
  return calculatePowerDistribution(
    series.value.items.filter((r) => r > 0),
    "series",
    series.value.voltage,
  );
});

// ===== Actions =====
const saveToHistory = (title: string, value: string) => {
  historyStore.add({
    type: "resistor",
    title: `Resistor ${title}`,
    value,
    input: { items: series.value.items },
  });
};
</script>
