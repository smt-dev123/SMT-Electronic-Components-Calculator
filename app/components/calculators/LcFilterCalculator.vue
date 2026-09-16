<template>
  <div class="space-y-6">
    <!-- Mode Selector -->
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

    <!-- MODE 1: Cutoff -->
    <div
      v-if="mode === 'cutoff'"
      class="grid grid-cols-1 lg:grid-cols-12 gap-6"
    >
      <div class="lg:col-span-5 glass-card rounded-2xl p-5 sm:p-6 space-y-4">
        <div class="border-b border-slate-800 pb-3">
          <h2 class="text-lg font-bold text-white flex items-center gap-2">
            <LucideWaves class="w-4 h-4 text-cyan-400" />
            LC Filter Cutoff
          </h2>
          <p class="text-xs text-slate-400">fc = 1 / (2π × √(L × C))</p>
        </div>

        <div class="space-y-3">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              Inductance L (µH):
            </label>
            <input
              v-model.number="cutoff.inductance"
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
              v-model.number="cutoff.capacitance"
              type="number"
              step="0.001"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div
          v-if="cutoffResult"
          class="bg-slate-950 p-4 rounded-xl border border-slate-800"
        >
          <span class="text-xs text-slate-400 font-mono block">
            Cutoff Frequency (fc)
          </span>
          <Transition name="fade-slide" mode="out-in">
            <div
              :key="cutoffResult.cutoff_Hz"
              class="text-3xl font-bold font-mono text-cyan-400 mt-1"
            >
              {{ cutoffResult.cutoffFormatted }}
            </div>
          </Transition>
        </div>

        <button
          v-if="cutoffResult"
          @click="saveToHistory('LC Cutoff', cutoffResult.cutoffFormatted)"
          class="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors"
        >
          <LucideSave class="w-3.5 h-3.5" />
          រក្សាទុកប្រវត្តិ
        </button>
      </div>

      <!-- Frequency Response -->
      <div class="lg:col-span-7 glass-card rounded-2xl p-5 sm:p-6 space-y-4">
        <h3
          class="text-base font-bold text-white border-b border-slate-800 pb-3"
        >
          <LucideChartLine class="w-4 h-4 text-amber-400 mr-2 inline" />
          Frequency Response (Bode)
        </h3>

        <div class="bg-slate-950 border border-slate-800 rounded-2xl p-4">
          <svg viewBox="0 0 500 260" class="w-full">
            <!-- Grid -->
            <g stroke="#1e293b" stroke-width="1">
              <line
                v-for="x in 11"
                :key="`vx${x}`"
                :x1="(x - 1) * 50"
                y1="0"
                :x2="(x - 1) * 50"
                y2="260"
              />
              <line
                v-for="y in 7"
                :key="`vy${y}`"
                x1="0"
                :y1="(y - 1) * 43"
                x2="500"
                :y2="(y - 1) * 43"
              />
            </g>

            <!-- Cutoff line -->
            <line
              v-if="cutoffResult"
              :x1="cutoffX"
              y1="0"
              :x2="cutoffX"
              y2="260"
              stroke="#f59e0b"
              stroke-width="1"
              stroke-dasharray="4,4"
            />

            <!-- Response curve -->
            <path
              :d="responseCurve"
              fill="none"
              stroke="#22d3ee"
              stroke-width="2.5"
            />

            <!-- -3dB line -->
            <line
              x1="0"
              y1="130"
              x2="500"
              y2="130"
              stroke="#10b981"
              stroke-width="1"
              opacity="0.5"
            />
            <text
              x="8"
              y="125"
              fill="#10b981"
              font-size="9"
              font-family="JetBrains Mono"
            >
              -3 dB
            </text>

            <!-- Labels -->
            <text
              x="10"
              y="20"
              fill="#94a3b8"
              font-size="10"
              font-family="JetBrains Mono"
            >
              Gain (dB)
            </text>
            <text
              x="440"
              y="250"
              fill="#94a3b8"
              font-size="10"
              font-family="JetBrains Mono"
            >
              Freq
            </text>

            <!-- Passband / Stopband labels -->
            <text
              x="30"
              y="240"
              fill="#10b981"
              font-size="9"
              font-family="JetBrains Mono"
            >
              Passband
            </text>
            <text
              x="380"
              y="240"
              fill="#ef4444"
              font-size="9"
              font-family="JetBrains Mono"
            >
              Stopband
            </text>
          </svg>

          <div class="mt-2 text-center">
            <p class="text-xs font-mono text-slate-400">
              Cutoff:
              <span class="text-cyan-400 font-bold">
                {{ cutoffResult?.cutoffFormatted ?? "—" }}
              </span>
            </p>
          </div>
        </div>

        <div
          class="text-xs font-mono text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800"
        >
          <p class="text-cyan-400 font-bold mb-1">2nd Order Low-Pass:</p>
          <p>fc = 1 / (2π × √(L × C))</p>
          <p class="text-slate-500 mt-1">Slope: -40 dB/decade (after cutoff)</p>
        </div>
      </div>
    </div>

    <!-- MODE 2: Q Factor & Impedance -->
    <div
      v-if="mode === 'qfactor'"
      class="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      <div class="glass-card rounded-2xl p-5 sm:p-6 space-y-4">
        <div class="border-b border-slate-800 pb-3">
          <h2 class="text-lg font-bold text-white flex items-center gap-2">
            <LucideTrendingUp class="w-4 h-4 text-cyan-400" />
            Q Factor & Impedance
          </h2>
        </div>

        <div class="space-y-3">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              Inductance L (µH):
            </label>
            <input
              v-model.number="q.inductance"
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
              v-model.number="q.capacitance"
              type="number"
              step="0.001"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              Resistance R (Ω):
            </label>
            <input
              v-model.number="q.resistance"
              type="number"
              step="1"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      </div>

      <div class="glass-card rounded-2xl p-5 sm:p-6 space-y-4">
        <h3
          class="text-base font-bold text-white border-b border-slate-800 pb-3"
        >
          លទ្ធផល
        </h3>

        <div class="space-y-3">
          <div
            v-if="z0Result"
            class="bg-slate-950 p-4 rounded-xl border border-slate-800"
          >
            <span class="text-xs text-slate-400 font-mono block">
              Characteristic Impedance Z0
            </span>
            <div class="text-2xl font-bold font-mono text-cyan-400 mt-1">
              {{ z0Result.impedanceFormatted }}
            </div>
          </div>

          <div
            v-if="seriesQResult"
            class="bg-slate-950 p-4 rounded-xl border border-slate-800"
          >
            <span class="text-xs text-slate-400 font-mono block">
              Series Q Factor
            </span>
            <div class="text-2xl font-bold font-mono text-amber-400 mt-1">
              {{ seriesQResult.qFormatted }}
            </div>
          </div>

          <div
            v-if="parallelQResult"
            class="bg-slate-950 p-4 rounded-xl border border-slate-800"
          >
            <span class="text-xs text-slate-400 font-mono block">
              Parallel Q Factor
            </span>
            <div class="text-2xl font-bold font-mono text-emerald-400 mt-1">
              {{ parallelQResult.qFormatted }}
            </div>
          </div>

          <div
            v-if="dampingResult"
            class="bg-slate-950 p-4 rounded-xl border border-slate-800"
          >
            <span class="text-xs text-slate-400 font-mono block">
              Damping Factor ζ
            </span>
            <div class="text-2xl font-bold font-mono text-purple-400 mt-1">
              {{ dampingResult.zetaFormatted }}
            </div>
            <div class="text-xs text-slate-300 mt-1">
              {{ dampingResult.response }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MODE 3: Band-Pass -->
    <div
      v-if="mode === 'bandpass'"
      class="grid grid-cols-1 lg:grid-cols-12 gap-6"
    >
      <div class="lg:col-span-5 glass-card rounded-2xl p-5 sm:p-6 space-y-4">
        <div class="border-b border-slate-800 pb-3">
          <h2 class="text-lg font-bold text-white flex items-center gap-2">
            <LucideActivity class="w-4 h-4 text-amber-400" />
            LC Band-Pass Filter
          </h2>
          <p class="text-xs text-slate-400">Center frequency, bandwidth & Q</p>
        </div>

        <div class="space-y-3">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              Inductance L (µH):
            </label>
            <input
              v-model.number="bandpass.inductance"
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
              v-model.number="bandpass.capacitance"
              type="number"
              step="0.001"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              Resistance R (Ω):
            </label>
            <input
              v-model.number="bandpass.resistance"
              type="number"
              step="1"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div
          v-if="bandpassResult"
          class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs font-mono"
        >
          <div>
            <span class="text-slate-400 block">Center Frequency</span>
            <div class="text-2xl font-bold text-amber-400 mt-1">
              {{ bandpassResult.centerFormatted }}
            </div>
          </div>
          <div class="border-t border-slate-800 pt-2 space-y-1">
            <div class="flex justify-between">
              <span class="text-slate-400">Bandwidth:</span>
              <span class="text-cyan-400 font-bold">{{
                bandpassResult.bandwidthFormatted
              }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Q Factor:</span>
              <span class="text-emerald-400 font-bold">{{
                bandpassResult.qFormatted
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-7 glass-card rounded-2xl p-5 sm:p-6 space-y-4">
        <h3
          class="text-base font-bold text-white border-b border-slate-800 pb-3"
        >
          <LucideChartLine class="w-4 h-4 text-amber-400 mr-2 inline" />
          Band-Pass Response
        </h3>

        <div class="bg-slate-950 border border-slate-800 rounded-2xl p-4">
          <svg viewBox="0 0 500 260" class="w-full">
            <!-- Grid -->
            <g stroke="#1e293b" stroke-width="1">
              <line
                v-for="x in 11"
                :key="`vx${x}`"
                :x1="(x - 1) * 50"
                y1="0"
                :x2="(x - 1) * 50"
                y2="260"
              />
              <line
                v-for="y in 7"
                :key="`vy${y}`"
                x1="0"
                :y1="(y - 1) * 43"
                x2="500"
                :y2="(y - 1) * 43"
              />
            </g>

            <!-- Band-pass curve -->
            <path
              :d="bandpassCurve"
              fill="none"
              stroke="#f59e0b"
              stroke-width="2.5"
            />

            <!-- Center line -->
            <line
              x1="250"
              y1="0"
              x2="250"
              y2="260"
              stroke="#22d3ee"
              stroke-width="1"
              stroke-dasharray="4,4"
            />
            <text
              x="255"
              y="20"
              fill="#22d3ee"
              font-size="9"
              font-family="JetBrains Mono"
            >
              f₀
            </text>

            <text
              x="10"
              y="20"
              fill="#94a3b8"
              font-size="10"
              font-family="JetBrains Mono"
            >
              Gain
            </text>
            <text
              x="460"
              y="250"
              fill="#94a3b8"
              font-size="10"
              font-family="JetBrains Mono"
            >
              Freq
            </text>
          </svg>
        </div>

        <div
          class="text-xs font-mono text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800"
        >
          <p class="text-amber-400 font-bold mb-1">Band-Pass Formula:</p>
          <p>f₀ = 1 / (2π × √(L × C))</p>
          <p>BW = R / (2π × L)</p>
          <p>Q = f₀ / BW</p>
        </div>
      </div>
    </div>

    <!-- MODE 4: Attenuation -->
    <div
      v-if="mode === 'attenuation'"
      class="glass-card rounded-2xl p-5 sm:p-6 max-w-3xl mx-auto space-y-4"
    >
      <div class="border-b border-slate-800 pb-3">
        <h2 class="text-lg font-bold text-white flex items-center gap-2">
          <LucideTrendingDown class="w-4 h-4 text-red-400" />
          Attenuation Calculator
        </h2>
        <p class="text-xs text-slate-400">គណនា dB នៅ frequency ជាក់លាក់</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            Frequency (Hz):
          </label>
          <input
            v-model.number="att.frequency"
            type="number"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            Cutoff (Hz):
          </label>
          <input
            v-model.number="att.cutoff"
            type="number"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            Filter Order:
          </label>
          <select
            v-model.number="att.order"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          >
            <option :value="1">1st Order (-20 dB/dec)</option>
            <option :value="2">2nd Order (-40 dB/dec)</option>
            <option :value="3">3rd Order (-60 dB/dec)</option>
            <option :value="4">4th Order (-80 dB/dec)</option>
          </select>
        </div>
      </div>

      <div
        v-if="attResult"
        class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2"
      >
        <div>
          <span class="text-xs text-slate-400 font-mono block"
            >Attenuation</span
          >
          <div class="text-3xl font-bold font-mono text-red-400 mt-1">
            {{ attResult.attenuationFormatted }}
          </div>
        </div>
        <div class="text-xs text-slate-500 font-mono">
          Slope: {{ attResult.dbPerDecade }} dB/decade
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLcFilterCalc } from "~/composables/core/useLcFilterCalc";

const historyStore = useHistoryStore();
const {
  lowPass,
  bandPass,
  characteristicImpedance,
  seriesQ,
  parallelQ,
  dampingFactor,
  attenuation,
} = useLcFilterCalc();

type Mode = "cutoff" | "qfactor" | "bandpass" | "attenuation";
const mode = ref<Mode>("cutoff");

const modes = [
  { value: "cutoff", label: "Cutoff", icon: "LucideWaves" },
  { value: "qfactor", label: "Q Factor", icon: "LucideTrendingUp" },
  { value: "bandpass", label: "Band-Pass", icon: "LucideActivity" },
  { value: "attenuation", label: "Attenuation", icon: "LucideTrendingDown" },
] as const;

// MODE 1: Cutoff
const cutoff = ref({ inductance: 100, capacitance: 0.1 });
const cutoffResult = computed(() =>
  lowPass(cutoff.value.inductance, cutoff.value.capacitance),
);

const cutoffX = computed(() => {
  if (!cutoffResult.value) return 250;
  const fc = cutoffResult.value.cutoff_Hz;
  // Log scale from 10 Hz to 1 MHz (5 decades) → 500 px
  const logFc = Math.log10(fc);
  const x = ((logFc - 1) / 5) * 500;
  return Math.max(0, Math.min(500, x));
});

const responseCurve = computed(() => {
  if (!cutoffResult.value) return "M 0 130 L 500 130";
  const fc = cutoffResult.value.cutoff_Hz;

  const points: string[] = [];
  for (let x = 0; x <= 500; x += 10) {
    const logF = (x / 500) * 5 + 1; // 10^1 to 10^6
    const f = Math.pow(10, logF);
    const ratio = f / fc;
    const gain_dB = ratio <= 1 ? 0 : -40 * Math.log10(ratio);
    const y = 130 - gain_dB * 1.5; // Scale: 130 = 0dB, +30dB = higher
    const safeY = Math.max(0, Math.min(260, y));
    points.push(`${x},${safeY}`);
  }
  return "M " + points.join(" L ");
});

// MODE 2: Q Factor
const q = ref({ inductance: 100, capacitance: 0.1, resistance: 10 });

const z0Result = computed(() =>
  characteristicImpedance(q.value.inductance, q.value.capacitance),
);
const seriesQResult = computed(() =>
  seriesQ(q.value.inductance, q.value.capacitance, q.value.resistance),
);
const parallelQResult = computed(() =>
  parallelQ(q.value.inductance, q.value.capacitance, q.value.resistance),
);
const dampingResult = computed(() =>
  dampingFactor(q.value.inductance, q.value.capacitance, q.value.resistance),
);

// MODE 3: Band-Pass
const bandpass = ref({ inductance: 100, capacitance: 0.1, resistance: 50 });
const bandpassResult = computed(() =>
  bandPass(
    bandpass.value.inductance,
    bandpass.value.capacitance,
    bandpass.value.resistance,
  ),
);

const bandpassCurve = computed(() => {
  if (!bandpassResult.value) return "M 0 260 L 500 260";
  const fc = bandpassResult.value.centerFreq_Hz;
  const bw = bandpassResult.value.bandwidth_Hz;
  const q = bandpassResult.value.q;

  const points: string[] = [];
  for (let x = 0; x <= 500; x += 10) {
    const logF = (x / 500) * 5 + 1;
    const f = Math.pow(10, logF);
    const ratio = f / fc;
    // Simplified response: gain = 1 / sqrt(1 + ((f/fc - fc/f)/Q)²)
    const qTerm = (ratio - 1 / ratio) * q;
    const gain = 1 / Math.sqrt(1 + qTerm * qTerm);
    const gain_dB = 20 * Math.log10(gain);
    const y = 130 - gain_dB * 3;
    const safeY = Math.max(0, Math.min(260, y));
    points.push(`${x},${safeY}`);
  }
  return "M " + points.join(" L ");
});

// MODE 4: Attenuation
const att = ref({ frequency: 10000, cutoff: 1000, order: 2 });
const attResult = computed(() =>
  attenuation(att.value.frequency, att.value.cutoff, att.value.order),
);

// Actions
const saveToHistory = (title: string, value: string) => {
  historyStore.add({
    type: "inductor",
    title: `LC Filter ${title}`,
    value,
    input: { ...cutoff.value },
  });
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
