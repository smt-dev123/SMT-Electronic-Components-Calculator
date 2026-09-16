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

    <!-- MODE 1: ZN Open Loop -->
    <div
      v-if="mode === 'znOpen'"
      class="grid grid-cols-1 lg:grid-cols-12 gap-6"
    >
      <div class="lg:col-span-5 glass-card rounded-2xl p-5 sm:p-6 space-y-4">
        <div class="border-b border-slate-800 pb-3">
          <h2 class="text-lg font-bold text-white flex items-center gap-2">
            <LucideActivity class="w-4 h-4 text-cyan-400" />
            Ziegler-Nichols (Open Loop)
          </h2>
          <p class="text-xs text-slate-400">Process Reaction Curve (FOPDT)</p>
        </div>

        <div class="space-y-3">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              Process Gain K:
            </label>
            <input
              v-model.number="znOpen.K"
              type="number"
              step="0.1"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              Dead Time L (s):
            </label>
            <input
              v-model.number="znOpen.L"
              type="number"
              step="0.1"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              Time Constant T (s):
            </label>
            <input
              v-model.number="znOpen.T"
              type="number"
              step="0.1"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div
          v-if="znOpenResult"
          class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2"
        >
          <div class="grid grid-cols-3 gap-2 text-center">
            <div class="p-2 bg-slate-900 rounded-lg">
              <div class="text-[10px] text-slate-500 font-mono">Kp</div>
              <div class="text-cyan-400 font-bold font-mono">
                {{ znOpenResult.kpFormatted }}
              </div>
            </div>
            <div class="p-2 bg-slate-900 rounded-lg">
              <div class="text-[10px] text-slate-500 font-mono">Ki</div>
              <div class="text-amber-400 font-bold font-mono">
                {{ znOpenResult.kiFormatted }}
              </div>
            </div>
            <div class="p-2 bg-slate-900 rounded-lg">
              <div class="text-[10px] text-slate-500 font-mono">Kd</div>
              <div class="text-emerald-400 font-bold font-mono">
                {{ znOpenResult.kdFormatted }}
              </div>
            </div>
          </div>
        </div>

        <button
          v-if="znOpenResult"
          @click="applyZnOpen"
          class="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-colors"
        >
          <LucidePlay class="w-3.5 h-3.5" />
          Apply to Simulation
        </button>
      </div>

      <div class="lg:col-span-7 glass-card rounded-2xl p-5 sm:p-6 space-y-4">
        <h3
          class="text-base font-bold text-white border-b border-slate-800 pb-3"
        >
          <LucideBookOpen class="w-4 h-4 text-amber-400 mr-2 inline" />
          ព័ត៌មាន Ziegler-Nichols
        </h3>

        <div
          class="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-3 text-xs font-mono"
        >
          <div class="bg-slate-900 p-3 rounded-lg space-y-1">
            <p class="text-cyan-400">Kp = 1.2 × T / (K × L)</p>
            <p class="text-amber-400">Ti = 2 × L</p>
            <p class="text-emerald-400">Td = 0.5 × L</p>
          </div>
        </div>
      </div>
    </div>

    <!-- MODE 2: ZN Closed Loop -->
    <div
      v-if="mode === 'znClosed'"
      class="grid grid-cols-1 lg:grid-cols-12 gap-6"
    >
      <div class="lg:col-span-5 glass-card rounded-2xl p-5 sm:p-6 space-y-4">
        <div class="border-b border-slate-800 pb-3">
          <h2 class="text-lg font-bold text-white flex items-center gap-2">
            <LucideActivity class="w-4 h-4 text-cyan-400" />
            Ziegler-Nichols (Closed Loop)
          </h2>
        </div>

        <div class="space-y-3">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              Ultimate Gain Ku:
            </label>
            <input
              v-model.number="znClosed.ku"
              type="number"
              step="0.1"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              Ultimate Period Pu (s):
            </label>
            <input
              v-model.number="znClosed.pu"
              type="number"
              step="0.1"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              ប្រភេទ Response:
            </label>
            <select
              v-model="znClosed.type"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
            >
              <option value="classic">Classic</option>
              <option value="someOvershoot">Some Overshoot</option>
              <option value="noOvershoot">No Overshoot</option>
            </select>
          </div>
        </div>

        <div
          v-if="znClosedResult"
          class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2"
        >
          <div class="grid grid-cols-3 gap-2 text-center">
            <div class="p-2 bg-slate-900 rounded-lg">
              <div class="text-[10px] text-slate-500 font-mono">Kp</div>
              <div class="text-cyan-400 font-bold font-mono">
                {{ znClosedResult.kpFormatted }}
              </div>
            </div>
            <div class="p-2 bg-slate-900 rounded-lg">
              <div class="text-[10px] text-slate-500 font-mono">Ki</div>
              <div class="text-amber-400 font-bold font-mono">
                {{ znClosedResult.kiFormatted }}
              </div>
            </div>
            <div class="p-2 bg-slate-900 rounded-lg">
              <div class="text-[10px] text-slate-500 font-mono">Kd</div>
              <div class="text-emerald-400 font-bold font-mono">
                {{ znClosedResult.kdFormatted }}
              </div>
            </div>
          </div>
        </div>

        <button
          v-if="znClosedResult"
          @click="applyZnClosed"
          class="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-colors"
        >
          <LucidePlay class="w-3.5 h-3.5" />
          Apply to Simulation
        </button>
      </div>

      <div class="lg:col-span-7 glass-card rounded-2xl p-5 sm:p-6 space-y-4">
        <h3
          class="text-base font-bold text-white border-b border-slate-800 pb-3"
        >
          <LucideBookOpen class="w-4 h-4 text-amber-400 mr-2 inline" />
          រូបមន្ត ZN Closed Loop
        </h3>

        <div
          class="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-3 text-xs font-mono"
        >
          <div class="bg-slate-900 p-3 rounded-lg space-y-1">
            <p class="text-cyan-400">Classic: Kp=0.6×Ku</p>
            <p class="text-amber-400">Some Overshoot: Kp=0.33×Ku</p>
            <p class="text-emerald-400">No Overshoot: Kp=0.2×Ku</p>
          </div>
        </div>
      </div>
    </div>

    <!-- MODE 3: Cohen-Coon -->
    <div
      v-if="mode === 'cohenCoon'"
      class="grid grid-cols-1 lg:grid-cols-12 gap-6"
    >
      <div class="lg:col-span-5 glass-card rounded-2xl p-5 sm:p-6 space-y-4">
        <div class="border-b border-slate-800 pb-3">
          <h2 class="text-lg font-bold text-white flex items-center gap-2">
            <LucideActivity class="w-4 h-4 text-cyan-400" />
            Cohen-Coon Method
          </h2>
        </div>

        <div class="space-y-3">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              Process Gain K:
            </label>
            <input
              v-model.number="cc.K"
              type="number"
              step="0.1"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              Dead Time L (s):
            </label>
            <input
              v-model.number="cc.L"
              type="number"
              step="0.1"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              Time Constant T (s):
            </label>
            <input
              v-model.number="cc.T"
              type="number"
              step="0.1"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div
          v-if="ccResult"
          class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2"
        >
          <div class="grid grid-cols-3 gap-2 text-center">
            <div class="p-2 bg-slate-900 rounded-lg">
              <div class="text-[10px] text-slate-500 font-mono">Kp</div>
              <div class="text-cyan-400 font-bold font-mono">
                {{ ccResult.kpFormatted }}
              </div>
            </div>
            <div class="p-2 bg-slate-900 rounded-lg">
              <div class="text-[10px] text-slate-500 font-mono">Ki</div>
              <div class="text-amber-400 font-bold font-mono">
                {{ ccResult.kiFormatted }}
              </div>
            </div>
            <div class="p-2 bg-slate-900 rounded-lg">
              <div class="text-[10px] text-slate-500 font-mono">Kd</div>
              <div class="text-emerald-400 font-bold font-mono">
                {{ ccResult.kdFormatted }}
              </div>
            </div>
          </div>
        </div>

        <button
          v-if="ccResult"
          @click="applyCc"
          class="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-colors"
        >
          <LucidePlay class="w-3.5 h-3.5" />
          Apply to Simulation
        </button>
      </div>

      <div class="lg:col-span-7 glass-card rounded-2xl p-5 sm:p-6 space-y-4">
        <h3
          class="text-base font-bold text-white border-b border-slate-800 pb-3"
        >
          <LucideBookOpen class="w-4 h-4 text-amber-400 mr-2 inline" />
          រូបមន្ត Cohen-Coon
        </h3>

        <div
          class="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-3 text-xs font-mono"
        >
          <div class="bg-slate-900 p-3 rounded-lg space-y-2">
            <p class="text-cyan-400">r = L / T</p>
            <p class="text-cyan-400">Kp = (1/K) × (T/L) × (1.35 + 0.27r)</p>
            <p class="text-amber-400">Ti = L × (2.5 − 2r) / (1 − 0.39r)</p>
            <p class="text-emerald-400">Td = L × 0.37 / (1 − 0.81r)</p>
          </div>
        </div>
      </div>
    </div>

    <!-- MODE 4: Simulation -->
    <div v-if="mode === 'simulate'" class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div class="lg:col-span-4 glass-card rounded-2xl p-5 sm:p-6 space-y-4">
          <div class="border-b border-slate-800 pb-3">
            <h2 class="text-lg font-bold text-white flex items-center gap-2">
              <LucidePlay class="w-4 h-4 text-cyan-400" />
              PID Simulation
            </h2>
          </div>

          <div class="space-y-3">
            <div class="grid grid-cols-3 gap-2">
              <div>
                <label
                  class="block text-[10px] font-semibold text-cyan-400 mb-1"
                  >Kp</label
                >
                <input
                  v-model.number="sim.kp"
                  type="number"
                  step="0.01"
                  class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-2 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label
                  class="block text-[10px] font-semibold text-amber-400 mb-1"
                  >Ki</label
                >
                <input
                  v-model.number="sim.ki"
                  type="number"
                  step="0.01"
                  class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-2 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label
                  class="block text-[10px] font-semibold text-emerald-400 mb-1"
                  >Kd</label
                >
                <input
                  v-model.number="sim.kd"
                  type="number"
                  step="0.01"
                  class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-2 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div class="grid grid-cols-3 gap-2">
              <div>
                <label
                  class="block text-[10px] font-semibold text-slate-400 mb-1"
                  >K</label
                >
                <input
                  v-model.number="sim.K"
                  type="number"
                  step="0.1"
                  class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-2 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label
                  class="block text-[10px] font-semibold text-slate-400 mb-1"
                  >L (s)</label
                >
                <input
                  v-model.number="sim.L"
                  type="number"
                  step="0.1"
                  class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-2 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label
                  class="block text-[10px] font-semibold text-slate-400 mb-1"
                  >T (s)</label
                >
                <input
                  v-model.number="sim.T"
                  type="number"
                  step="0.1"
                  class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-2 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <button
              @click="runSimulation"
              class="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 text-slate-950 hover:scale-105 transition-all"
            >
              <LucidePlay class="w-3.5 h-3.5" />
              ដំណើរការ Simulation
            </button>
          </div>

          <div
            v-if="simResult"
            class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs font-mono"
          >
            <div class="flex justify-between">
              <span class="text-slate-400">Steady State:</span>
              <span class="text-cyan-400 font-bold">
                {{ simResult.metrics.steadyStateFormatted }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Overshoot:</span>
              <span class="text-amber-400 font-bold">
                {{ simResult.metrics.overshootFormatted }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Rise Time:</span>
              <span class="text-emerald-400 font-bold">
                {{ simResult.metrics.riseTimeFormatted }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Settling Time:</span>
              <span class="text-purple-400 font-bold">
                {{ simResult.metrics.settlingTimeFormatted }}
              </span>
            </div>
          </div>
        </div>

        <div class="lg:col-span-8 glass-card rounded-2xl p-5 sm:p-6 space-y-4">
          <h3
            class="text-base font-bold text-white border-b border-slate-800 pb-3"
          >
            <LucideActivity class="w-4 h-4 text-cyan-400 mr-2 inline" />
            Response Curve
          </h3>

          <div
            v-if="!simResult"
            class="bg-slate-950 border border-slate-800 rounded-2xl p-12 text-center"
          >
            <LucideActivity class="w-12 h-12 text-slate-700 mx-auto mb-3" />
            <p class="text-sm text-slate-500">ចុច "ដំណើរការ Simulation"</p>
          </div>

          <div
            v-else
            class="bg-slate-950 border border-slate-800 rounded-2xl p-4"
          >
            <svg viewBox="0 0 500 300" class="w-full">
              <g stroke="#1e293b" stroke-width="1">
                <line
                  v-for="x in 11"
                  :key="`vx${x}`"
                  :x1="(x - 1) * 50"
                  y1="0"
                  :x2="(x - 1) * 50"
                  y2="300"
                />
                <line
                  v-for="y in 7"
                  :key="`vy${y}`"
                  x1="0"
                  :y1="(y - 1) * 50"
                  x2="500"
                  :y2="(y - 1) * 50"
                />
              </g>

              <line
                x1="0"
                y1="50"
                x2="500"
                y2="50"
                stroke="#f59e0b"
                stroke-width="2"
                stroke-dasharray="5,5"
              />

              <polyline
                :points="outputPath"
                fill="none"
                stroke="#22d3ee"
                stroke-width="2.5"
              />

              <polyline
                :points="controlPath"
                fill="none"
                stroke="#f59e0b"
                stroke-width="1.5"
                opacity="0.6"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePidCalc } from "~/composables/core/usePidCalc";

const historyStore = useHistoryStore();

const { zieglerNicholsOpen, zieglerNicholsClosed, cohenCoon, simulateFopdt } =
  usePidCalc();

type Mode = "znOpen" | "znClosed" | "cohenCoon" | "simulate";
const mode = ref<Mode>("znOpen");

const modes = [
  { value: "znOpen", label: "ZN Open", icon: "LucideActivity" },
  { value: "znClosed", label: "ZN Closed", icon: "LucideTrendingUp" },
  { value: "cohenCoon", label: "Cohen-Coon", icon: "LucideTrendingDown" },
  { value: "simulate", label: "Simulate", icon: "LucidePlay" },
] as const;

// ZN Open
const znOpen = ref({ K: 2.0, L: 0.5, T: 5.0 });
const znOpenResult = computed(() =>
  zieglerNicholsOpen(znOpen.value.K, znOpen.value.L, znOpen.value.T),
);

// ZN Closed
const znClosed = ref({
  ku: 4.0,
  pu: 1.0,
  type: "classic" as "classic" | "someOvershoot" | "noOvershoot",
});
const znClosedResult = computed(() =>
  zieglerNicholsClosed(
    znClosed.value.ku,
    znClosed.value.pu,
    znClosed.value.type,
  ),
);

// Cohen-Coon
const cc = ref({ K: 2.0, L: 1.0, T: 5.0 });
const ccResult = computed(() => cohenCoon(cc.value.K, cc.value.L, cc.value.T));

// Simulation
const sim = ref({
  kp: 1.2,
  ki: 0.5,
  kd: 0.1,
  K: 2.0,
  L: 0.5,
  T: 5.0,
});

const simResult = ref<ReturnType<typeof simulateFopdt>>(null);

const runSimulation = () => {
  simResult.value = simulateFopdt(
    { kp: sim.value.kp, ki: sim.value.ki, kd: sim.value.kd },
    sim.value.K,
    sim.value.L,
    sim.value.T,
    1,
    10,
    0.01,
  );
};

const applyZnOpen = () => {
  if (!znOpenResult.value) return;
  sim.value.kp = znOpenResult.value.kp;
  sim.value.ki = znOpenResult.value.ki;
  sim.value.kd = znOpenResult.value.kd;
  sim.value.K = znOpen.value.K;
  sim.value.L = znOpen.value.L;
  sim.value.T = znOpen.value.T;
  mode.value = "simulate";
  nextTick(() => runSimulation());
};

const applyZnClosed = () => {
  if (!znClosedResult.value) return;
  sim.value.kp = znClosedResult.value.kp;
  sim.value.ki = znClosedResult.value.ki;
  sim.value.kd = znClosedResult.value.kd;
  mode.value = "simulate";
  nextTick(() => runSimulation());
};

const applyCc = () => {
  if (!ccResult.value) return;
  sim.value.kp = ccResult.value.kp;
  sim.value.ki = ccResult.value.ki;
  sim.value.kd = ccResult.value.kd;
  sim.value.K = cc.value.K;
  sim.value.L = cc.value.L;
  sim.value.T = cc.value.T;
  mode.value = "simulate";
  nextTick(() => runSimulation());
};

const outputPath = computed(() => {
  if (!simResult.value) return "";
  const { time, output, setpoint } = simResult.value;
  const w = 500;
  const h = 300;
  const maxT = time[time.length - 1] ?? 1;
  const yMax = Math.max(setpoint * 2, ...output) * 1.2;
  const yMin = 0;

  return output
    .map((val, i) => {
      const tVal = time[i] ?? 0;
      const x = (tVal / maxT) * w;
      const y = h - ((val - yMin) / (yMax - yMin)) * h;
      return `${x},${y}`;
    })
    .join(" ");
});

const controlPath = computed(() => {
  if (!simResult.value) return "";
  const { time, control } = simResult.value;
  const w = 500;
  const h = 300;
  const maxT = time[time.length - 1] ?? 1;
  const cMax = Math.max(...control.map(Math.abs)) * 1.2 || 1;

  return control
    .map((val, i) => {
      const tVal = time[i] ?? 0;
      const x = (tVal / maxT) * w;
      const y = h / 2 - (val / cMax) * (h / 2);
      return `${x},${y}`;
    })
    .join(" ");
});

const saveToHistory = (title: string, value: string) => {
  historyStore.add({
    type: "transistor",
    title: `PID ${title}`,
    value,
    input: { ...znOpen.value },
  });
};
</script>
