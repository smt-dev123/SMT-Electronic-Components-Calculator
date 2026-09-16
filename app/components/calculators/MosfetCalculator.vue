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
          ទិន្នន័យ MOSFET
        </h2>
        <p class="text-xs text-slate-400">
          ស្វែងរក និងពិនិត្យលក្ខណៈពិសេសរបស់ MOSFET
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="ស្វែងរក Part No..."
          class="sm:col-span-2 bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono uppercase text-sm focus:outline-none focus:border-cyan-500"
        />
        <select
          v-model="filterType"
          class="bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
        >
          <option value="">ប្រភេទទាំងអស់</option>
          <option value="N-Channel">N-Channel</option>
          <option value="P-Channel">P-Channel</option>
        </select>
      </div>

      <div class="overflow-x-auto border border-slate-800 rounded-xl">
        <table class="w-full text-xs">
          <thead class="bg-slate-950">
            <tr class="text-slate-400 font-mono">
              <th class="px-3 py-2 text-left">Part</th>
              <th class="px-3 py-2 text-center">Type</th>
              <th class="px-3 py-2 text-right">Vds</th>
              <th class="px-3 py-2 text-right">Id</th>
              <th class="px-3 py-2 text-right">Rds(on)</th>
              <th class="px-3 py-2 text-right">Vgs(th)</th>
              <th class="px-3 py-2 text-left">Package</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800">
            <tr
              v-for="m in filteredMosfets"
              :key="m.partNumber"
              class="hover:bg-slate-800/40 transition-colors"
            >
              <td class="px-3 py-2 font-mono font-bold text-cyan-400">
                {{ m.partNumber }}
              </td>
              <td class="px-3 py-2 text-center">
                <span
                  class="px-2 py-0.5 rounded-full text-[10px] font-bold"
                  :class="
                    m.type === 'N-Channel'
                      ? 'bg-cyan-500/20 text-cyan-400'
                      : 'bg-amber-500/20 text-amber-400'
                  "
                >
                  {{ m.type === "N-Channel" ? "N" : "P" }}
                </span>
              </td>
              <td class="px-3 py-2 text-right font-mono text-slate-300">
                {{ m.vDS }}V
              </td>
              <td class="px-3 py-2 text-right font-mono text-emerald-400">
                {{ m.iD_max }}A
              </td>
              <td class="px-3 py-2 text-right font-mono text-amber-400">
                {{ (m.rDS_on * 1000).toFixed(0) }}mΩ
              </td>
              <td class="px-3 py-2 text-right font-mono text-slate-400">
                {{ m.vGS_th }}V
              </td>
              <td class="px-3 py-2 font-mono text-slate-500 text-[10px]">
                {{ m.package }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="text-[10px] text-slate-500 font-mono">
        បង្ហាញ {{ filteredMosfets.length }} / {{ commonMosfets.length }}
      </p>
    </div>

    <!-- MODE 2: Gate Resistor -->
    <div v-if="mode === 'gate'" class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div class="lg:col-span-5 glass-card rounded-2xl p-5 sm:p-6 space-y-4">
        <div class="border-b border-slate-800 pb-3">
          <h2 class="text-lg font-bold text-white flex items-center gap-2">
            <i class="fa-solid fa-bolt text-cyan-400"></i>
            គណនា Gate Resistor
          </h2>
          <p class="text-xs text-slate-400">Rg គ្រប់គ្រងល្បឿន Switching</p>
        </div>

        <div class="space-y-3">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              ជ្រើសរើស MOSFET:
            </label>
            <select
              v-model="gate.selectedPart"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
            >
              <option
                v-for="m in commonMosfets"
                :key="m.partNumber"
                :value="m.partNumber"
              >
                {{ m.partNumber }} (Qg={{ m.qG }}nC)
              </option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              តង់ស្យុង Gate Drive - V:
            </label>
            <input
              v-model.number="gate.vDrive"
              type="number"
              step="0.1"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              Rise Time ត្រូវការ - ns:
            </label>
            <input
              v-model.number="gate.tRise"
              type="number"
              step="10"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div
          v-if="gateResult"
          class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs font-mono"
        >
          <div>
            <span class="text-slate-400 block">Gate Resistor (Rg)</span>
            <div class="text-2xl font-bold text-cyan-400 mt-1">
              {{ gateResult.rGFormatted }}
            </div>
          </div>
          <div class="border-t border-slate-800 pt-2 flex justify-between">
            <span class="text-slate-400">Peak Gate Current:</span>
            <span class="text-amber-400 font-bold">{{
              gateResult.peakCurrentFormatted
            }}</span>
          </div>
        </div>
      </div>

      <div class="lg:col-span-7 glass-card rounded-2xl p-5 sm:p-6 space-y-4">
        <h3
          class="text-base font-bold text-white border-b border-slate-800 pb-3"
        >
          <i class="fa-solid fa-diagram-project text-amber-400 mr-2"></i>
          Gate Drive Circuit
        </h3>

        <div class="bg-slate-950 border border-slate-800 rounded-2xl p-6">
          <svg viewBox="0 0 400 220" class="w-full">
            <!-- Driver IC -->
            <rect
              x="30"
              y="80"
              width="60"
              height="60"
              rx="8"
              fill="none"
              stroke="#22d3ee"
              stroke-width="2"
            />
            <text
              x="45"
              y="115"
              fill="#22d3ee"
              font-size="11"
              font-family="JetBrains Mono"
            >
              Driver
            </text>

            <!-- Rg -->
            <rect
              x="140"
              y="100"
              width="40"
              height="20"
              fill="none"
              stroke="#f59e0b"
              stroke-width="2"
            />
            <text
              x="150"
              y="135"
              fill="#f59e0b"
              font-size="11"
              font-family="JetBrains Mono"
            >
              Rg
            </text>
            <line
              x1="90"
              y1="110"
              x2="140"
              y2="110"
              stroke="#cbd5e1"
              stroke-width="2"
            />
            <line
              x1="180"
              y1="110"
              x2="250"
              y2="110"
              stroke="#cbd5e1"
              stroke-width="2"
            />

            <!-- MOSFET Symbol -->
            <circle
              cx="290"
              cy="110"
              r="30"
              fill="none"
              stroke="#10b981"
              stroke-width="2"
            />
            <line
              x1="275"
              y1="90"
              x2="275"
              y2="130"
              stroke="#10b981"
              stroke-width="3"
            />
            <line
              x1="275"
              y1="95"
              x2="300"
              y2="85"
              stroke="#10b981"
              stroke-width="2"
            />
            <line
              x1="275"
              y1="125"
              x2="300"
              y2="135"
              stroke="#10b981"
              stroke-width="2"
            />
            <text
              x="310"
              y="115"
              fill="#10b981"
              font-size="11"
              font-family="JetBrains Mono"
            >
              MOSFET
            </text>

            <!-- Ground -->
            <line
              x1="90"
              y1="140"
              x2="90"
              y2="170"
              stroke="#cbd5e1"
              stroke-width="2"
            />
            <line
              x1="60"
              y1="170"
              x2="120"
              y2="170"
              stroke="#cbd5e1"
              stroke-width="2"
            />
            <line
              x1="64"
              y1="176"
              x2="116"
              y2="176"
              stroke="#cbd5e1"
              stroke-width="2"
            />
            <line
              x1="90"
              y1="140"
              x2="90"
              y2="170"
              stroke="#cbd5e1"
              stroke-width="2"
            />

            <!-- Animated Pulse -->
            <circle r="4" fill="#f59e0b">
              <animate
                attributeName="cx"
                from="90"
                to="275"
                dur="1.5s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="cy"
                values="110;110"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </div>

        <div
          class="text-xs font-mono text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800"
        >
          Rg = t_rise / (2.2 × Ciss) ≈ t_rise × Vdrive / (2.2 × Qg)
        </div>
      </div>
    </div>

    <!-- MODE 3: Power Loss & Heatsink -->
    <div v-if="mode === 'power'" class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div class="lg:col-span-5 glass-card rounded-2xl p-5 sm:p-6 space-y-4">
        <div class="border-b border-slate-800 pb-3">
          <h2 class="text-lg font-bold text-white flex items-center gap-2">
            <i class="fa-solid fa-fire text-amber-400"></i>
            គណនាការសាយភាយកម្ដៅ
          </h2>
          <p class="text-xs text-slate-400">
            Power Loss & Heatsink Requirement
          </p>
        </div>

        <div class="space-y-3">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              ជ្រើសរើស MOSFET:
            </label>
            <select
              v-model="power.selectedPart"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
            >
              <option
                v-for="m in commonMosfets"
                :key="m.partNumber"
                :value="m.partNumber"
              >
                {{ m.partNumber }} (Rds={{ (m.rDS_on * 1000).toFixed(0) }}mΩ)
              </option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              ចរន្ត Id - A:
            </label>
            <input
              v-model.number="power.iD"
              type="number"
              step="0.1"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              ប្រេកង់ Switching - Hz (ស្រេចចិត្ត):
            </label>
            <input
              v-model.number="power.freq"
              type="number"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              សីតុណ្ហភាពបរិស្ថាន - °C:
            </label>
            <input
              v-model.number="power.tAmbient"
              type="number"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div
          v-if="powerResult"
          class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs font-mono"
        >
          <div>
            <span class="text-slate-400 block">Total Power Loss</span>
            <div class="text-2xl font-bold text-amber-400 mt-1">
              {{ powerResult.pTotalFormatted }}
            </div>
          </div>
          <div class="border-t border-slate-800 pt-2 space-y-1">
            <div class="flex justify-between">
              <span class="text-slate-400">Conduction:</span>
              <span class="text-cyan-400">{{
                powerResult.pConductionFormatted
              }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Switching:</span>
              <span class="text-emerald-400">{{
                powerResult.pSwitchingFormatted
              }}</span>
            </div>
          </div>
          <div v-if="heatsinkResult" class="border-t border-slate-800 pt-2">
            <span class="text-slate-400 block">Heatsink ត្រូវការ</span>
            <div
              class="text-lg font-bold mt-1"
              :class="
                heatsinkResult.needsHeatsink
                  ? 'text-red-400'
                  : 'text-emerald-400'
              "
            >
              {{ heatsinkResult.rThetaSA_maxFormatted }}
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-7 glass-card rounded-2xl p-5 sm:p-6 space-y-4">
        <h3
          class="text-base font-bold text-white border-b border-slate-800 pb-3"
        >
          <i class="fa-solid fa-temperature-high text-amber-400 mr-2"></i>
          ដ្យាក្រាម Thermal
        </h3>

        <div
          class="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-6"
        >
          <div class="space-y-3">
            <div class="flex items-center justify-between text-xs font-mono">
              <span class="text-red-400">Junction (Tj)</span>
              <span class="text-slate-400"
                >{{ power.tAmbient + (powerResult?.pTotal ?? 0) * 3 }}°C</span
              >
            </div>
            <div class="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
              <div
                class="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500"
                :style="{ width: '75%' }"
              ></div>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-3 text-center text-xs font-mono">
            <div class="p-3 bg-slate-900 rounded-lg border border-slate-800">
              <div class="text-slate-400 text-[10px]">Rθ(JC)</div>
              <div class="text-cyan-400 font-bold">1.5°C/W</div>
            </div>
            <div class="p-3 bg-slate-900 rounded-lg border border-slate-800">
              <div class="text-slate-400 text-[10px]">Rθ(CS)</div>
              <div class="text-cyan-400 font-bold">0.5°C/W</div>
            </div>
            <div class="p-3 bg-slate-900 rounded-lg border border-slate-800">
              <div class="text-slate-400 text-[10px]">Rθ(SA)</div>
              <div class="text-amber-400 font-bold">
                {{ heatsinkResult?.rThetaSA_max.toFixed(1) ?? "—" }}°C/W
              </div>
            </div>
          </div>
        </div>

        <div
          class="text-xs font-mono text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800"
        >
          Rθ(SA) = (Tj_max − Ta) / Pd − Rθ(JC) − Rθ(CS)
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
          ជ្រើសរើស MOSFET ត្រឹមត្រូវ
        </h2>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            Vds ត្រូវការ (V):
          </label>
          <input
            v-model.number="finder.vDS"
            type="number"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            Id ត្រូវការ (A):
          </label>
          <input
            v-model.number="finder.iD"
            type="number"
            step="0.1"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            Rds(on) max (Ω):
          </label>
          <input
            v-model.number="finder.rDSon"
            type="number"
            step="0.001"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div class="flex items-end">
          <label
            class="flex items-center gap-2 text-xs text-slate-300 cursor-pointer"
          >
            <input
              v-model="finder.logicLevel"
              type="checkbox"
              class="w-4 h-4 rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-cyan-500"
            />
            Logic Level
          </label>
        </div>
      </div>

      <div class="space-y-2">
        <div
          v-for="m in finderResults"
          :key="m.partNumber"
          class="glass-card rounded-xl p-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
        >
          <div class="flex items-center gap-4">
            <span
              class="px-2 py-1 rounded-lg text-[10px] font-bold font-mono"
              :class="
                m.type === 'N-Channel'
                  ? 'bg-cyan-500/20 text-cyan-400'
                  : 'bg-amber-500/20 text-amber-400'
              "
            >
              {{ m.type === "N-Channel" ? "N" : "P" }}
            </span>
            <div>
              <h4 class="font-bold text-cyan-400 font-mono">
                {{ m.partNumber }}
              </h4>
              <p class="text-[10px] text-slate-400">
                {{ m.usage }} • {{ m.package }}
              </p>
            </div>
          </div>
          <div class="text-right text-xs font-mono">
            <div class="text-slate-300">{{ m.vDS }}V / {{ m.iD_max }}A</div>
            <div class="text-slate-500 text-[10px]">
              Rds: {{ (m.rDS_on * 1000).toFixed(0) }}mΩ
            </div>
          </div>
        </div>
        <p v-if="!finderResults.length" class="text-center text-slate-500 py-8">
          <i class="fa-solid fa-face-frown text-2xl mb-2"></i>
          <br />
          រកមិនឃើញ MOSFET សមស្រប
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMosfet } from "~/composables/core/useMosfet";

const {
  commonMosfets,
  calculateGateResistor,
  calculatePowerLoss,
  calculateHeatsink,
  findSuitableMosfets,
} = useMosfet();

type Mode = "database" | "gate" | "power" | "finder";
const mode = ref<Mode>("database");

const modes = [
  { value: "database", label: "ទិន្នន័យ", icon: "fa-solid fa-database" },
  { value: "gate", label: "Gate R", icon: "fa-solid fa-bolt" },
  { value: "power", label: "Power/Heat", icon: "fa-solid fa-fire" },
  { value: "finder", label: "រក Part", icon: "fa-solid fa-magnifying-glass" },
] as const;

// MODE 1
const searchQuery = ref("");
const filterType = ref("");
const filteredMosfets = computed(() =>
  commonMosfets.filter((m) => {
    const matchSearch =
      !searchQuery.value ||
      m.partNumber.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchType = !filterType.value || m.type === filterType.value;
    return matchSearch && matchType;
  }),
);

// MODE 2
const gate = ref({ selectedPart: "IRLZ44N", vDrive: 10, tRise: 100 });

const gateResult = computed(() => {
  const m = commonMosfets.find((x) => x.partNumber === gate.value.selectedPart);
  if (!m) return null;
  return calculateGateResistor(gate.value.vDrive, m.qG, gate.value.tRise);
});

// MODE 3
const power = ref({
  selectedPart: "IRLZ44N",
  iD: 10,
  freq: 20000,
  tAmbient: 25,
});

const powerResult = computed(() => {
  const m = commonMosfets.find(
    (x) => x.partNumber === power.value.selectedPart,
  );
  if (!m) return null;
  return calculatePowerLoss(
    power.value.iD,
    m.rDS_on,
    power.value.freq,
    m.qG,
    10,
    0,
    m.vDS,
  );
});

const heatsinkResult = computed(() => {
  if (!powerResult.value) return null;
  return calculateHeatsink(
    powerResult.value.pTotal,
    power.value.tAmbient,
    150,
    1.5,
    0.5,
  );
});

// MODE 4
const finder = ref({
  vDS: 50,
  iD: 10,
  rDSon: 0.05,
  logicLevel: true,
});

const finderResults = computed(() =>
  findSuitableMosfets(
    finder.value.vDS,
    finder.value.iD,
    finder.value.rDSon,
    finder.value.logicLevel,
  ),
);
</script>
