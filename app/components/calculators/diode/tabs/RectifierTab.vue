<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
    <div class="lg:col-span-5 glass-card rounded-2xl p-5 sm:p-6 space-y-4">
      <div class="border-b border-slate-800 pb-3">
        <h2 class="text-lg font-bold text-white flex items-center gap-2">
          <LucideArrowRight class="w-4 h-4 text-cyan-400" />
          គណនា Rectifier Diode
        </h2>
        <p class="text-xs text-slate-400">
          ជ្រើសរើស Diode ត្រឹមត្រូវសម្រាប់គណនា
        </p>
      </div>

      <div class="space-y-3">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            តង់ស្យុងចូល (Input Voltage) - V:
          </label>
          <input
            v-model.number="rectifier.vIn"
            type="number"
            step="0.1"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            ចរន្ត Load (Load Current) - A:
          </label>
          <input
            v-model.number="rectifier.iLoad"
            type="number"
            step="0.01"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            Safety Factor:
          </label>
          <select
            v-model.number="rectifier.safety"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          >
            <option :value="1.2">1.2× (តឹងតែង)</option>
            <option :value="1.5">1.5× (ធម្មតា)</option>
            <option :value="2">2.0× (សុវត្ថិភាព)</option>
          </select>
        </div>
      </div>

      <div
        v-if="rectifierResult"
        class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2"
      >
        <div>
          <span class="text-xs text-slate-400 font-mono block">
            Vr ត្រូវការ (Required Reverse V)
          </span>
          <div class="text-2xl font-bold font-mono text-cyan-400">
            {{ rectifierResult.vReverseFormatted }}
          </div>
        </div>
        <div class="border-t border-slate-800 pt-2">
          <span class="text-xs text-slate-400 font-mono block">
            If ត្រូវការ (Required Forward I)
          </span>
          <div class="text-2xl font-bold font-mono text-amber-400">
            {{ rectifierResult.iForwardFormatted }}
          </div>
        </div>
      </div>

      <!-- Recommended Diodes -->
      <div
        v-if="recommendedDiodes.length"
        class="pt-3 border-t border-slate-800"
      >
        <h4 class="text-xs font-bold text-slate-400 uppercase mb-2">
          Diode ដែលសមស្រប
        </h4>
        <div class="space-y-1.5">
          <div
            v-for="d in recommendedDiodes"
            :key="d.partNumber"
            class="flex justify-between items-center px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono"
          >
            <span class="text-cyan-400 font-bold">{{ d.partNumber }}</span>
            <span class="text-slate-400">
              {{ d.vReverse }}V / {{ d.iForward_max }}A
            </span>
          </div>
        </div>
      </div>

      <button
        v-if="rectifierResult"
        @click="saveToHistory"
        class="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors"
      >
        <LucideSave class="w-3.5 h-3.5" />
        រក្សាទុកប្រវត្តិ
      </button>
    </div>

    <div class="lg:col-span-7 glass-card rounded-2xl p-5 sm:p-6 space-y-4">
      <h3 class="text-base font-bold text-white border-b border-slate-800 pb-3">
        <LucideNetwork class="w-4 h-4 text-amber-400 mr-2 inline" />
        ដ្យាក្រាម Rectifier
      </h3>

      <div class="bg-slate-950 border border-slate-800 rounded-2xl p-6">
        <svg viewBox="0 0 400 200" class="w-full">
          <text
            x="20"
            y="30"
            fill="#cbd5e1"
            font-size="12"
            font-family="JetBrains Mono"
          >
            AC In
          </text>
          <line
            x1="20"
            y1="80"
            x2="100"
            y2="80"
            stroke="#cbd5e1"
            stroke-width="2"
          />
          <line
            x1="20"
            y1="120"
            x2="100"
            y2="120"
            stroke="#cbd5e1"
            stroke-width="2"
          />

          <polygon points="100,70 100,90 120,80" fill="#22d3ee" />
          <line
            x1="120"
            y1="70"
            x2="120"
            y2="90"
            stroke="#22d3ee"
            stroke-width="3"
          />

          <line
            x1="120"
            y1="80"
            x2="200"
            y2="80"
            stroke="#cbd5e1"
            stroke-width="2"
          />
          <text
            x="210"
            y="85"
            fill="#10b981"
            font-size="12"
            font-family="JetBrains Mono"
          >
            DC Out
          </text>

          <rect
            x="250"
            y="70"
            width="30"
            height="20"
            fill="none"
            stroke="#cbd5e1"
            stroke-width="2"
          />
          <text
            x="255"
            y="105"
            fill="#cbd5e1"
            font-size="10"
            font-family="JetBrains Mono"
          >
            Load
          </text>

          <line
            x1="200"
            y1="120"
            x2="320"
            y2="120"
            stroke="#cbd5e1"
            stroke-width="2"
          />
          <line
            x1="260"
            y1="120"
            x2="260"
            y2="140"
            stroke="#cbd5e1"
            stroke-width="2"
          />
          <line
            x1="250"
            y1="140"
            x2="270"
            y2="140"
            stroke="#cbd5e1"
            stroke-width="2"
          />

          <path
            d="M 20 100 Q 40 70, 60 100 T 100 100"
            fill="none"
            stroke="#f59e0b"
            stroke-width="2"
          >
            <animate
              attributeName="d"
              values="M 20 100 Q 40 70, 60 100 T 100 100;
                      M 20 100 Q 40 130, 60 100 T 100 100;
                      M 20 100 Q 40 70, 60 100 T 100 100"
              dur="2s"
              repeatCount="indefinite"
            />
          </path>
        </svg>
      </div>

      <div
        class="text-xs font-mono text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800"
      >
        ជ្រើសរើស Diode ដែលមាន Vr &gt; Input × Safety និង If &gt; Load Current ×
        Safety
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDiode } from "~/composables/core/useDiode";

const historyStore = useHistoryStore();
const { commonDiodes, calculateRectifier } = useDiode();

const rectifier = ref({
  vIn: 24,
  iLoad: 0.5,
  safety: 1.5,
});

const rectifierResult = computed(() =>
  calculateRectifier(
    rectifier.value.vIn,
    rectifier.value.iLoad,
    rectifier.value.safety,
  ),
);

const recommendedDiodes = computed(() => {
  const result = rectifierResult.value;
  if (!result) return [];

  const reqVr = rectifier.value.vIn * rectifier.value.safety;
  const reqIf = rectifier.value.iLoad * rectifier.value.safety;

  return commonDiodes
    .filter((d: any) => d.vReverse >= reqVr && d.iForward_max >= reqIf)
    .slice(0, 4);
});

const saveToHistory = () => {
  if (!rectifierResult.value) return;
  historyStore.add({
    type: "diode",
    title: "Rectifier",
    value: rectifierResult.value.vReverseFormatted,
    input: { ...rectifier.value },
  });
};
</script>
