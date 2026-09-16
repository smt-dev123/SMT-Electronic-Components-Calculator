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
          <i :class="m.icon"></i>
          <span>{{ m.label }}</span>
        </button>
      </div>
    </div>

    <!-- MODE 1: Database -->
    <div
      v-if="mode === 'database'"
      class="glass-card rounded-2xl p-5 sm:p-6 space-y-4"
    >
      <div class="border-b border-slate-800 pb-3">
        <h2 class="text-lg font-bold text-white flex items-center gap-2">
          <i class="fa-solid fa-database text-cyan-400"></i>
          ទិន្នន័យ Optocoupler
        </h2>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="ស្វែងរក Part No..."
          class="bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono uppercase text-sm focus:outline-none focus:border-cyan-500"
        />
        <select
          v-model="filterSpeed"
          class="bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
        >
          <option value="">Speed ទាំងអស់</option>
          <option value="Slow">Slow</option>
          <option value="Fast">Fast</option>
          <option value="Very Fast">Very Fast</option>
          <option value="N/A">N/A (Triac)</option>
        </select>
      </div>

      <div class="overflow-x-auto border border-slate-800 rounded-xl">
        <table class="w-full text-xs">
          <thead class="bg-slate-950">
            <tr class="text-slate-400 font-mono">
              <th class="px-3 py-2 text-left">Part</th>
              <th class="px-3 py-2 text-left">Type</th>
              <th class="px-3 py-2 text-right">Vf</th>
              <th class="px-3 py-2 text-right">CTR</th>
              <th class="px-3 py-2 text-right">Vceo</th>
              <th class="px-3 py-2 text-right">Viso</th>
              <th class="px-3 py-2 text-left">Speed</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800">
            <tr
              v-for="o in filteredOptocouplers"
              :key="o.partNumber"
              class="hover:bg-slate-800/40 transition-colors"
            >
              <td class="px-3 py-2 font-mono font-bold text-cyan-400">
                {{ o.partNumber }}
              </td>
              <td class="px-3 py-2 text-slate-300 text-[10px]">
                {{ o.typeKh }}
              </td>
              <td class="px-3 py-2 text-right font-mono text-amber-400">
                {{ o.vF }}V
              </td>
              <td class="px-3 py-2 text-right font-mono text-emerald-400">
                {{ o.ctr_min }}–{{ o.ctr_max }}%
              </td>
              <td class="px-3 py-2 text-right font-mono text-slate-300">
                {{ o.vCEO }}V
              </td>
              <td
                class="px-3 py-2 text-right font-mono text-slate-400 text-[10px]"
              >
                {{ o.vISO }}V
              </td>
              <td class="px-3 py-2 text-slate-400 text-[10px]">
                {{ o.speed }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- MODE 2: Resistor Calculator -->
    <div
      v-if="mode === 'resistor'"
      class="grid grid-cols-1 lg:grid-cols-12 gap-6"
    >
      <div class="lg:col-span-5 glass-card rounded-2xl p-5 sm:p-6 space-y-4">
        <div class="border-b border-slate-800 pb-3">
          <h2 class="text-lg font-bold text-white flex items-center gap-2">
            <i class="fa-solid fa-toggle-on text-cyan-400"></i>
            គណនា Input Resistor
          </h2>
          <p class="text-xs text-slate-400">
            គណនា Resistor សម្រាប់ LED ខាង Input
          </p>
        </div>

        <div class="space-y-3">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              ជ្រើសរើស Optocoupler:
            </label>
            <select
              v-model="rCalc.selectedPart"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
            >
              <option
                v-for="o in commonOptocouplers"
                :key="o.partNumber"
                :value="o.partNumber"
              >
                {{ o.partNumber }} (Vf={{ o.vF }}V)
              </option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              តង់ស្យុងចូល Vin - V:
            </label>
            <input
              v-model.number="rCalc.vIn"
              type="number"
              step="0.1"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              ចរន្ត LED If ត្រូវការ - mA:
            </label>
            <input
              v-model.number="rCalc.iF_mA"
              type="number"
              step="1"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div
          v-if="rResult"
          class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs font-mono"
        >
          <div>
            <span class="text-slate-400 block">Input Resistor (Rin)</span>
            <div class="text-2xl font-bold text-cyan-400 mt-1">
              {{ rResult.rFormatted }}
            </div>
          </div>
          <div class="border-t border-slate-800 pt-2 flex justify-between">
            <span class="text-slate-400">អានុភាព R:</span>
            <span class="text-amber-400 font-bold">{{
              rResult.pRFormatted
            }}</span>
          </div>
        </div>
      </div>

      <div class="lg:col-span-7 glass-card rounded-2xl p-5 sm:p-6 space-y-4">
        <h3
          class="text-base font-bold text-white border-b border-slate-800 pb-3"
        >
          <i class="fa-solid fa-diagram-project text-amber-400 mr-2"></i>
          ដ្យាក្រាម Optocoupler
        </h3>

        <div class="bg-slate-950 border border-slate-800 rounded-2xl p-6">
          <svg viewBox="0 0 400 200" class="w-full">
            <!-- Input Side -->
            <rect
              x="30"
              y="60"
              width="100"
              height="80"
              fill="none"
              stroke="#22d3ee"
              stroke-width="2"
              rx="4"
            />
            <text
              x="55"
              y="105"
              fill="#22d3ee"
              font-size="11"
              font-family="JetBrains Mono"
            >
              Input
            </text>

            <!-- LED Symbol -->
            <polygon points="90,85 90,105 110,95" fill="#f59e0b" />
            <line
              x1="110"
              y1="85"
              x2="110"
              y2="105"
              stroke="#f59e0b"
              stroke-width="2"
            />
            <line
              x1="60"
              y1="95"
              x2="90"
              y2="95"
              stroke="#cbd5e1"
              stroke-width="2"
            />
            <line
              x1="110"
              y1="95"
              x2="140"
              y2="95"
              stroke="#cbd5e1"
              stroke-width="2"
            />

            <!-- Arrows (Light) -->
            <g stroke="#f59e0b" stroke-width="2" fill="none">
              <line x1="150" y1="85" x2="180" y2="85" />
              <polygon points="180,85 175,82 175,88" fill="#f59e0b" />
              <line x1="150" y1="95" x2="180" y2="95" />
              <polygon points="180,95 175,92 175,98" fill="#f59e0b" />
              <line x1="150" y1="105" x2="180" y2="105" />
              <polygon points="180,105 175,102 175,108" fill="#f59e0b" />
            </g>

            <!-- Output Side -->
            <rect
              x="180"
              y="60"
              width="100"
              height="80"
              fill="none"
              stroke="#10b981"
              stroke-width="2"
              rx="4"
            />
            <text
              x="205"
              y="105"
              fill="#10b981"
              font-size="11"
              font-family="JetBrains Mono"
            >
              Output
            </text>

            <!-- Phototransistor -->
            <line
              x1="215"
              y1="80"
              x2="215"
              y2="120"
              stroke="#10b981"
              stroke-width="3"
            />
            <line
              x1="215"
              y1="85"
              x2="240"
              y2="75"
              stroke="#10b981"
              stroke-width="2"
            />
            <line
              x1="215"
              y1="115"
              x2="240"
              y2="125"
              stroke="#10b981"
              stroke-width="2"
            />

            <!-- Isolator Barrier -->
            <line
              x1="200"
              y1="30"
              x2="200"
              y2="170"
              stroke="#475569"
              stroke-width="2"
              stroke-dasharray="5,5"
            />

            <!-- Animated Light -->
            <circle r="3" fill="#f59e0b">
              <animate
                attributeName="cx"
                from="140"
                to="200"
                dur="2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="cy"
                values="95;95"
                dur="2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="1;0.3;1"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </div>

        <div
          class="text-xs font-mono text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800"
        >
          Rin = (Vin − Vf) / If
        </div>
      </div>
    </div>

    <!-- MODE 3: Complete Circuit -->
    <div
      v-if="mode === 'circuit'"
      class="glass-card rounded-2xl p-5 sm:p-6 space-y-4"
    >
      <div class="border-b border-slate-800 pb-3">
        <h2 class="text-lg font-bold text-white flex items-center gap-2">
          <i class="fa-solid fa-microchip text-cyan-400"></i>
          គណនាសៀគ្វីពេញលេញ
        </h2>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="space-y-3">
          <h3 class="text-sm font-bold text-cyan-400">Input Side</h3>
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1"
              >Vin (V):</label
            >
            <input
              v-model.number="circuit.vIn"
              type="number"
              step="0.1"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1"
              >Rin (Ω):</label
            >
            <input
              v-model.number="circuit.rIn"
              type="number"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div class="space-y-3">
          <h3 class="text-sm font-bold text-emerald-400">Output Side</h3>
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1"
              >VCC (V):</label
            >
            <input
              v-model.number="circuit.vCC"
              type="number"
              step="0.1"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1"
              >Ic ត្រូវការ (mA):</label
            >
            <input
              v-model.number="circuit.iC_mA"
              type="number"
              step="1"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      </div>

      <div v-if="circuitResult" class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div class="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <span class="text-[10px] text-slate-400 font-mono block"
            >Input Current If</span
          >
          <div class="text-xl font-bold font-mono text-cyan-400 mt-1">
            {{ circuitResult.iF_mAFormatted }}
          </div>
        </div>
        <div class="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <span class="text-[10px] text-slate-400 font-mono block"
            >Output Current Ic</span
          >
          <div class="text-xl font-bold font-mono text-emerald-400 mt-1">
            {{ circuitResult.iC_mAFormatted }}
          </div>
        </div>
        <div
          v-if="outputRResult"
          class="bg-slate-950 p-4 rounded-xl border border-slate-800"
        >
          <span class="text-[10px] text-slate-400 font-mono block"
            >Output Resistor RL</span
          >
          <div class="text-xl font-bold font-mono text-amber-400 mt-1">
            {{ outputRResult.rLFormatted }}
          </div>
        </div>
      </div>
    </div>

    <!-- MODE 4: Finder -->
    <div
      v-if="mode === 'finder'"
      class="glass-card rounded-2xl p-5 sm:p-6 space-y-4"
    >
      <div class="border-b border-slate-800 pb-3">
        <h2 class="text-lg font-bold text-white flex items-center gap-2">
          <i class="fa-solid fa-magnifying-glass text-cyan-400"></i>
          ជ្រើសរើស Optocoupler ត្រឹមត្រូវ
        </h2>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            CTR ត្រូវការ (%):
          </label>
          <input
            v-model.number="finder.ctr"
            type="number"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            Vceo ត្រូវការ (V):
          </label>
          <input
            v-model.number="finder.vCEO"
            type="number"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            Speed:
          </label>
          <select
            v-model="finder.speed"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
          >
            <option value="Any">ទាំងអស់</option>
            <option value="Slow">Slow</option>
            <option value="Fast">Fast</option>
            <option value="Very Fast">Very Fast</option>
          </select>
        </div>
      </div>

      <div class="space-y-2">
        <div
          v-for="o in finderResults"
          :key="o.partNumber"
          class="glass-card rounded-xl p-4 flex items-center justify-between"
        >
          <div>
            <h4 class="font-bold text-cyan-400 font-mono">
              {{ o.partNumber }}
            </h4>
            <p class="text-[10px] text-slate-400">
              {{ o.typeKh }} • {{ o.package }} • {{ o.speed }}
            </p>
          </div>
          <div class="text-right text-xs font-mono">
            <div class="text-slate-300">
              CTR: {{ o.ctr_min }}–{{ o.ctr_max }}%
            </div>
            <div class="text-slate-500 text-[10px]">Viso: {{ o.vISO }}V</div>
          </div>
        </div>
        <p v-if="!finderResults.length" class="text-center text-slate-500 py-8">
          រកមិនឃើញ Optocoupler សមស្រប
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useOptocoupler } from "~/composables/core/useOptocoupler";

const {
  commonOptocouplers,
  calculateInputResistor,
  calculateOutputResistor,
  calculateCollectorCurrent,
  findSuitableOptocouplers,
} = useOptocoupler();

type Mode = "database" | "resistor" | "circuit" | "finder";
const mode = ref<Mode>("database");

const modes = [
  { value: "database", label: "ទិន្នន័យ", icon: "fa-solid fa-database" },
  { value: "resistor", label: "Resistor", icon: "fa-solid fa-toggle-on" },
  { value: "circuit", label: "សៀគ្វី", icon: "fa-solid fa-microchip" },
  { value: "finder", label: "រក Part", icon: "fa-solid fa-magnifying-glass" },
] as const;

// MODE 1
const searchQuery = ref("");
const filterSpeed = ref("");
const filteredOptocouplers = computed(() =>
  commonOptocouplers.filter((o) => {
    const matchSearch =
      !searchQuery.value ||
      o.partNumber.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchSpeed = !filterSpeed.value || o.speed === filterSpeed.value;
    return matchSearch && matchSpeed;
  }),
);

// MODE 2
const rCalc = ref({ selectedPart: "PC817", vIn: 5, iF_mA: 10 });

const rResult = computed(() => {
  const o = commonOptocouplers.find(
    (x) => x.partNumber === rCalc.value.selectedPart,
  );
  if (!o) return null;
  return calculateInputResistor(rCalc.value.vIn, o.vF, rCalc.value.iF_mA);
});

// MODE 3
const circuit = ref({
  vIn: 5,
  rIn: 380,
  vCC: 5,
  iC_mA: 5,
});

const circuitResult = computed(() => {
  const o = commonOptocouplers.find((x) => x.partNumber === "PC817");
  if (!o) return null;
  return calculateCollectorCurrent(
    circuit.value.vIn,
    circuit.value.rIn,
    o.ctr_min,
    o.vF,
  );
});

const outputRResult = computed(() =>
  calculateOutputResistor(circuit.value.vCC, circuit.value.iC_mA),
);

// MODE 4
const finder = ref({ ctr: 50, vCEO: 30, speed: "Any" });

const finderResults = computed(() =>
  findSuitableOptocouplers(
    finder.value.ctr,
    finder.value.speed as any,
    finder.value.vCEO,
  ),
);
</script>
