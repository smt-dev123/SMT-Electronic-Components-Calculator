<template>
  <div class="space-y-6">
    <!-- Mode Selector -->
    <div class="glass-card rounded-2xl p-5">
      <div class="grid grid-cols-2 gap-2">
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

    <!-- Astable Mode -->
    <div
      v-if="mode === 'astable'"
      class="grid grid-cols-1 lg:grid-cols-12 gap-6"
    >
      <div class="lg:col-span-5 glass-card rounded-2xl p-5 sm:p-6 space-y-4">
        <div class="border-b border-slate-800 pb-3">
          <h2 class="text-lg font-bold text-white flex items-center gap-2">
            <LucideClock class="w-4 h-4 text-cyan-400" />
            Astable Mode
          </h2>
          <p class="text-xs text-slate-400">Oscillator បន្តរលក</p>
        </div>

        <div class="space-y-3">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              R1 (Ω):
            </label>
            <input
              v-model.number="astable.r1"
              type="number"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              R2 (Ω):
            </label>
            <input
              v-model.number="astable.r2"
              type="number"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              C1 (µF):
            </label>
            <input
              v-model.number="astable.c1"
              type="number"
              step="0.001"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div
          v-if="astableResult"
          class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2"
        >
          <div>
            <span class="text-xs text-slate-400 font-mono block">
              ប្រេកង់ (Frequency)
            </span>
            <div class="text-3xl font-bold font-mono text-cyan-400 mt-1">
              {{ astableResult.frequencyFormatted }}
            </div>
          </div>
          <div
            class="grid grid-cols-2 gap-2 border-t border-slate-800 pt-2 text-xs font-mono"
          >
            <div>
              <span class="text-slate-500 block">Duty Cycle</span>
              <span class="text-amber-400 font-bold">{{
                astableResult.dutyFormatted
              }}</span>
            </div>
            <div>
              <span class="text-slate-500 block">Period</span>
              <span class="text-emerald-400 font-bold">{{
                astableResult.periodFormatted
              }}</span>
            </div>
            <div>
              <span class="text-slate-500 block">t High</span>
              <span class="text-slate-300">{{
                astableResult.tHighFormatted
              }}</span>
            </div>
            <div>
              <span class="text-slate-500 block">t Low</span>
              <span class="text-slate-300">{{
                astableResult.tLowFormatted
              }}</span>
            </div>
          </div>
        </div>

        <button
          v-if="astableResult"
          @click="
            saveToHistory('555 Astable', astableResult.frequencyFormatted)
          "
          class="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors"
        >
          <LucideSave class="w-3.5 h-3.5" />
          រក្សាទុកប្រវត្តិ
        </button>
      </div>

      <!-- Waveform Display -->
      <div class="lg:col-span-7 glass-card rounded-2xl p-5 sm:p-6 space-y-4">
        <h3
          class="text-base font-bold text-white border-b border-slate-800 pb-3"
        >
          <LucideAudioLines class="w-4 h-4 text-cyan-400 mr-2 inline" />
          Waveform Display
        </h3>

        <div class="bg-slate-950 border border-slate-800 rounded-2xl p-6">
          <svg viewBox="0 0 400 200" class="w-full">
            <!-- Grid -->
            <g stroke="#1e293b" stroke-width="1">
              <line
                v-for="x in 13"
                :key="`v${x}`"
                :x1="(x - 1) * 33"
                y1="0"
                :x2="(x - 1) * 33"
                y2="200"
              />
              <line
                v-for="y in 7"
                :key="`h${y}`"
                x1="0"
                :y1="(y - 1) * 33"
                x2="400"
                :y2="(y - 1) * 33"
              />
            </g>

            <!-- Waveform -->
            <path
              d="M 0 150 L 30 150 L 30 50 L 60 50 L 60 150 L 90 150 L 90 50 L 120 50 L 120 150 L 150 150 L 150 50 L 180 50 L 180 150 L 210 150 L 210 50 L 240 50 L 240 150 L 270 150 L 270 50 L 300 50 L 300 150 L 330 150 L 330 50 L 360 50 L 360 150 L 400 150"
              fill="none"
              stroke="#22d3ee"
              stroke-width="3"
            />
          </svg>
        </div>

        <div
          class="text-xs font-mono text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800"
        >
          <i class="fa-solid fa-square-root-variable text-cyan-400 mr-2"></i>
          f = 1.44 / ((R1 + 2·R2) × C1)
        </div>
      </div>
    </div>

    <!-- Monostable Mode -->
    <div
      v-if="mode === 'monostable'"
      class="glass-card rounded-2xl p-5 sm:p-6 max-w-2xl mx-auto space-y-4"
    >
      <div class="border-b border-slate-800 pb-3">
        <h2 class="text-lg font-bold text-white flex items-center gap-2">
          <LucideTimer class="w-4 h-4 text-cyan-400" />
          Monostable Mode (One-shot)
        </h2>
        <p class="text-xs text-slate-400">បញ្ចេញ pulse ម្តងក្នុងមួយ trigger</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            R (Ω):
          </label>
          <input
            v-model.number="mono.r"
            type="number"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            C (µF):
          </label>
          <input
            v-model.number="mono.c"
            type="number"
            step="0.001"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      <div
        v-if="monoResult"
        class="bg-slate-950 p-4 rounded-xl border border-slate-800"
      >
        <span class="text-xs text-slate-400 font-mono block">
          Pulse Width (T)
        </span>
        <div class="text-3xl font-bold font-mono text-cyan-400 mt-1">
          {{ monoResult.pulseWidthFormatted }}
        </div>
        <p class="text-[10px] text-slate-500 mt-2 font-mono">T = 1.1 × R × C</p>
      </div>
    </div>

    <!-- Find Resistors -->
    <div
      v-if="mode === 'find'"
      class="glass-card rounded-2xl p-5 sm:p-6 max-w-2xl mx-auto space-y-4"
    >
      <div class="border-b border-slate-800 pb-3">
        <h2 class="text-lg font-bold text-white flex items-center gap-2">
          <LucideSearch class="w-4 h-4 text-cyan-400" />
          រក R1, R2 សម្រាប់ Frequency ត្រូវការ
        </h2>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            Target Frequency (Hz):
          </label>
          <input
            v-model.number="find.targetFreq"
            type="number"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            C1 (µF):
          </label>
          <input
            v-model.number="find.c"
            type="number"
            step="0.001"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      <div
        v-if="findResult"
        class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2"
      >
        <div class="grid grid-cols-2 gap-3">
          <div>
            <span class="text-xs text-slate-400 font-mono block">R1</span>
            <div class="text-xl font-bold font-mono text-cyan-400">
              {{ findResult.r1Formatted }}
            </div>
          </div>
          <div>
            <span class="text-xs text-slate-400 font-mono block">R2</span>
            <div class="text-xl font-bold font-mono text-cyan-400">
              {{ findResult.r2Formatted }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTimer555Calc } from "~/composables/core/useTimer555Calc";

const historyStore = useHistoryStore();
const {
  astable: calcAstable,
  monostable: calcMono,
  findResistorsForFreq,
} = useTimer555Calc();

type Mode = "astable" | "monostable" | "find";
const mode = ref<Mode>("astable");

const modes = [
  { value: "astable", label: "Astable", icon: "LucideClock" },
  { value: "monostable", label: "Monostable", icon: "LucideTimer" },
  { value: "find", label: "រក R", icon: "LucideSearch" },
] as const;

// Astable
const astable = ref({ r1: 10000, r2: 47000, c1: 1 });
const astableResult = computed(() =>
  calcAstable(astable.value.r1, astable.value.r2, astable.value.c1),
);

// Monostable
const mono = ref({ r: 10000, c: 10 });
const monoResult = computed(() => calcMono(mono.value.r, mono.value.c));

// Find
const find = ref({ targetFreq: 1000, c: 1 });
const findResult = computed(() =>
  findResistorsForFreq(find.value.targetFreq, find.value.c),
);

// Actions
const saveToHistory = (title: string, value: string) => {
  historyStore.add({
    type: "transistor",
    title,
    value,
    input: { ...astable.value },
  });
};
</script>
