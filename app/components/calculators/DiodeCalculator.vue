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

    <!-- MODE 1: Diode Database -->
    <div v-if="mode === 'database'" class="space-y-6">
      <div class="glass-card rounded-2xl p-5 sm:p-6 space-y-4">
        <div class="border-b border-slate-800 pb-3">
          <h2 class="text-lg font-bold text-white flex items-center gap-2">
            <i class="fa-solid fa-database text-cyan-400"></i>
            ទិន្នន័យ Diode ទូទៅ (Diode Database)
          </h2>
          <p class="text-xs text-slate-400">
            ស្វែងរក និងពិនិត្យលក្ខណៈពិសេសរបស់ Diode ទូទៅ
          </p>
        </div>

        <!-- Search & Filter -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              ស្វែងរក (Search):
            </label>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="e.g. 1N4007, SS34..."
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono uppercase text-sm focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              ប្រភេទ (Type):
            </label>
            <select
              v-model="filterType"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
            >
              <option value="">ទាំងអស់</option>
              <option value="rectifier">Rectifier</option>
              <option value="schottky">Schottky</option>
              <option value="zener">Zener</option>
              <option value="switching">Switching</option>
              <option value="fast">Fast Recovery</option>
              <option value="led">LED</option>
            </select>
          </div>
        </div>

        <!-- Results -->
        <div class="overflow-x-auto border border-slate-800 rounded-xl">
          <table class="w-full text-xs">
            <thead class="bg-slate-950 sticky top-0">
              <tr class="text-slate-400 font-mono">
                <th class="px-3 py-2 text-left">Part</th>
                <th class="px-3 py-2 text-left">Type</th>
                <th class="px-3 py-2 text-right">Vf (V)</th>
                <th class="px-3 py-2 text-right">Vr (V)</th>
                <th class="px-3 py-2 text-right">If (A)</th>
                <th class="px-3 py-2 text-right">trr (ns)</th>
                <th class="px-3 py-2 text-left">Package</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800">
              <tr
                v-for="d in filteredDiodes"
                :key="d.partNumber"
                class="hover:bg-slate-800/40 transition-colors"
              >
                <td class="px-3 py-2 font-mono font-bold text-cyan-400">
                  {{ d.partNumber }}
                </td>
                <td class="px-3 py-2 text-slate-300">{{ d.typeKh }}</td>
                <td class="px-3 py-2 text-right font-mono text-amber-400">
                  {{ d.vForward.toFixed(2) }}
                </td>
                <td class="px-3 py-2 text-right font-mono text-emerald-400">
                  {{ d.vReverse }}
                </td>
                <td class="px-3 py-2 text-right font-mono text-slate-300">
                  {{ d.iForward_max }}
                </td>
                <td class="px-3 py-2 text-right font-mono text-slate-400">
                  {{ d.recoveryTime || "—" }}
                </td>
                <td class="px-3 py-2 font-mono text-slate-500 text-[10px]">
                  {{ d.package }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p class="text-[10px] text-slate-500 font-mono">
          បង្ហាញ {{ filteredDiodes.length }} / {{ commonDiodes.length }} ធាតុ
        </p>
      </div>
    </div>

    <!-- MODE 2: Rectifier -->
    <div
      v-if="mode === 'rectifier'"
      class="grid grid-cols-1 lg:grid-cols-12 gap-6"
    >
      <div class="lg:col-span-5 glass-card rounded-2xl p-5 sm:p-6 space-y-4">
        <div class="border-b border-slate-800 pb-3">
          <h2 class="text-lg font-bold text-white flex items-center gap-2">
            <i class="fa-solid fa-arrow-right-long text-cyan-400"></i>
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
          class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2"
        >
          <div>
            <span class="text-xs text-slate-400 font-mono block">
              Vr ត្រូវការ (Required Reverse V)
            </span>
            <div class="text-2xl font-bold font-mono text-cyan-400">
              {{ rectifierResult?.vReverseFormatted || "—" }}
            </div>
          </div>
          <div class="border-t border-slate-800 pt-2">
            <span class="text-xs text-slate-400 font-mono block">
              If ត្រូវការ (Required Forward I)
            </span>
            <div class="text-2xl font-bold font-mono text-amber-400">
              {{ rectifierResult?.iForwardFormatted || "—" }}
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
      </div>

      <!-- Visual -->
      <div class="lg:col-span-7 glass-card rounded-2xl p-5 sm:p-6 space-y-4">
        <h3
          class="text-base font-bold text-white border-b border-slate-800 pb-3"
        >
          <i class="fa-solid fa-diagram-project text-amber-400 mr-2"></i>
          ដ្យាក្រាម Rectifier
        </h3>

        <div class="bg-slate-950 border border-slate-800 rounded-2xl p-6">
          <svg viewBox="0 0 400 200" class="w-full">
            <!-- AC Input -->
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

            <!-- Diode Symbol -->
            <polygon points="100,70 100,90 120,80" fill="#22d3ee" />
            <line
              x1="120"
              y1="70"
              x2="120"
              y2="90"
              stroke="#22d3ee"
              stroke-width="3"
            />

            <!-- Animated Sine Wave -->
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

            <!-- DC Output -->
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

            <!-- Load Resistor -->
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

            <!-- Ground -->
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
            <line
              x1="254"
              y1="146"
              x2="266"
              y2="146"
              stroke="#cbd5e1"
              stroke-width="2"
            />
            <line
              x1="258"
              y1="152"
              x2="262"
              y2="152"
              stroke="#cbd5e1"
              stroke-width="2"
            />
          </svg>
        </div>

        <div
          class="text-xs font-mono text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800"
        >
          ជ្រើសរើស Diode ដែលមាន Vr > Input × Safety និង If > Load Current ×
          Safety
        </div>
      </div>
    </div>

    <!-- MODE 3: Zener Regulator -->
    <div v-if="mode === 'zener'" class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div class="lg:col-span-5 glass-card rounded-2xl p-5 sm:p-6 space-y-4">
        <div class="border-b border-slate-800 pb-3">
          <h2 class="text-lg font-bold text-white flex items-center gap-2">
            <i class="fa-solid fa-bolt text-amber-400"></i>
            គណនា Zener Regulator
          </h2>
          <p class="text-xs text-slate-400">
            រក R សមស្របសម្រាប់ស្ថេរភាពតង់ស្យុង
          </p>
        </div>

        <div class="space-y-3">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              តង់ស្យុងចូល (Vin) - V:
            </label>
            <input
              v-model.number="zener.vIn"
              type="number"
              step="0.1"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              តង់ស្យុង Zener (Vz) - V:
            </label>
            <input
              v-model.number="zener.vZener"
              type="number"
              step="0.1"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              ចរន្ត Load (IL) - A:
            </label>
            <input
              v-model.number="zener.iLoad"
              type="number"
              step="0.001"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div
          v-if="zenerResult"
          class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2"
        >
          <div>
            <span class="text-xs text-slate-400 font-mono block">
              រេស៊ីស្តង់សមស្រប (Recommended R)
            </span>
            <div class="text-2xl font-bold font-mono text-cyan-400">
              {{ zenerResult.rFormatted }}
            </div>
            <div class="text-[10px] text-slate-500 font-mono mt-1">
              Range: {{ formatOhm(zenerResult.rMin) }} -
              {{ formatOhm(zenerResult.rMax) }}
            </div>
          </div>
          <div
            class="border-t border-slate-800 pt-2 space-y-1 text-xs font-mono"
          >
            <div class="flex justify-between">
              <span class="text-slate-400">អានុភាព R:</span>
              <span class="text-amber-400 font-bold">{{
                zenerResult.pResistorFormatted
              }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">អានុភាព Zener:</span>
              <span class="text-emerald-400 font-bold">{{
                zenerResult.pZenerFormatted
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-7 glass-card rounded-2xl p-5 sm:p-6 space-y-4">
        <h3
          class="text-base font-bold text-white border-b border-slate-800 pb-3"
        >
          <i class="fa-solid fa-diagram-project text-cyan-400 mr-2"></i>
          ដ្យាក្រាម Zener Regulator
        </h3>

        <div class="bg-slate-950 border border-slate-800 rounded-2xl p-6">
          <svg viewBox="0 0 400 220" class="w-full">
            <!-- Vin -->
            <text
              x="20"
              y="30"
              fill="#cbd5e1"
              font-size="12"
              font-family="JetBrains Mono"
            >
              Vin
            </text>
            <line
              x1="20"
              y1="50"
              x2="120"
              y2="50"
              stroke="#cbd5e1"
              stroke-width="2"
            />

            <!-- Resistor -->
            <rect
              x="120"
              y="40"
              width="40"
              height="20"
              fill="none"
              stroke="#22d3ee"
              stroke-width="2"
            />
            <text
              x="130"
              y="80"
              fill="#22d3ee"
              font-size="11"
              font-family="JetBrains Mono"
            >
              R
            </text>

            <!-- Line to output -->
            <line
              x1="160"
              y1="50"
              x2="280"
              y2="50"
              stroke="#cbd5e1"
              stroke-width="2"
            />

            <!-- Zener Diode (vertical) -->
            <line
              x1="240"
              y1="50"
              x2="240"
              y2="90"
              stroke="#cbd5e1"
              stroke-width="2"
            />
            <polygon points="230,90 250,90 240,110" fill="#f59e0b" />
            <line
              x1="230"
              y1="110"
              x2="250"
              y2="110"
              stroke="#f59e0b"
              stroke-width="3"
            />
            <line
              x1="230"
              y1="115"
              x2="250"
              y2="115"
              stroke="#f59e0b"
              stroke-width="3"
            />
            <text
              x="260"
              y="105"
              fill="#f59e0b"
              font-size="11"
              font-family="JetBrains Mono"
            >
              Zener
            </text>
            <line
              x1="240"
              y1="115"
              x2="240"
              y2="170"
              stroke="#cbd5e1"
              stroke-width="2"
            />

            <!-- Vout -->
            <text
              x="300"
              y="55"
              fill="#10b981"
              font-size="12"
              font-family="JetBrains Mono"
            >
              Vout
            </text>
            <line
              x1="280"
              y1="50"
              x2="320"
              y2="50"
              stroke="#cbd5e1"
              stroke-width="2"
            />

            <!-- Load -->
            <rect
              x="300"
              y="80"
              width="30"
              height="40"
              fill="none"
              stroke="#cbd5e1"
              stroke-width="2"
            />
            <text
              x="305"
              y="140"
              fill="#cbd5e1"
              font-size="10"
              font-family="JetBrains Mono"
            >
              Load
            </text>
            <line
              x1="315"
              y1="50"
              x2="315"
              y2="80"
              stroke="#cbd5e1"
              stroke-width="2"
            />
            <line
              x1="315"
              y1="120"
              x2="315"
              y2="170"
              stroke="#cbd5e1"
              stroke-width="2"
            />

            <!-- Ground -->
            <line
              x1="20"
              y1="170"
              x2="320"
              y2="170"
              stroke="#cbd5e1"
              stroke-width="2"
            />
            <line
              x1="170"
              y1="170"
              x2="170"
              y2="190"
              stroke="#cbd5e1"
              stroke-width="2"
            />
            <line
              x1="160"
              y1="190"
              x2="180"
              y2="190"
              stroke="#cbd5e1"
              stroke-width="2"
            />
            <line
              x1="164"
              y1="196"
              x2="176"
              y2="196"
              stroke="#cbd5e1"
              stroke-width="2"
            />

            <!-- Animated current -->
            <circle r="4" fill="#22d3ee">
              <animate
                attributeName="cx"
                from="20"
                to="240"
                dur="2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="cy"
                values="50;50"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </div>

        <div
          class="text-xs font-mono text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800"
        >
          R = (Vin - Vz) / (Iz + IL) — ជ្រើសរើស R ក្នុងចន្លោះ Rmin និង Rmax
        </div>
      </div>
    </div>

    <!-- MODE 4: Bridge Rectifier -->
    <div
      v-if="mode === 'bridge'"
      class="grid grid-cols-1 lg:grid-cols-12 gap-6"
    >
      <div class="lg:col-span-5 glass-card rounded-2xl p-5 sm:p-6 space-y-4">
        <div class="border-b border-slate-800 pb-3">
          <h2 class="text-lg font-bold text-white flex items-center gap-2">
            <i class="fa-solid fa-code-branch text-cyan-400"></i>
            គណនា Bridge Rectifier
          </h2>
          <p class="text-xs text-slate-400">AC → DC Full-wave rectification</p>
        </div>

        <div class="space-y-3">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              តង់ស្យុង AC ចូល (Vrms) - V:
            </label>
            <input
              v-model.number="bridge.vAcIn"
              type="number"
              step="0.1"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              ចរន្ត Load (IL) - A:
            </label>
            <input
              v-model.number="bridge.iLoad"
              type="number"
              step="0.01"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              Ripple Voltage ត្រូវការ (V) - ស្រេចចិត្ត:
            </label>
            <input
              v-model.number="bridge.vRipple"
              type="number"
              step="0.1"
              placeholder="e.g. 1"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div
          v-if="bridgeResult"
          class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs font-mono"
        >
          <div class="flex justify-between">
            <span class="text-slate-400">តង់ស្យុង Peak:</span>
            <span class="text-cyan-400 font-bold">{{
              bridgeResult.vPeakFormatted
            }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">តង់ស្យុង DC (Avg):</span>
            <span class="text-emerald-400 font-bold">{{
              bridgeResult.vDcFormatted
            }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">តង់ស្យុង DC (Real):</span>
            <span class="text-amber-400 font-bold">{{
              bridgeResult.vDcRealFormatted
            }}</span>
          </div>
          <div class="flex justify-between pt-2 border-t border-slate-800">
            <span class="text-slate-400">Vr ត្រូវការ / Diode:</span>
            <span class="text-cyan-400 font-bold">{{
              bridgeResult.vReverseFormatted
            }}</span>
          </div>
          <div
            v-if="filterCapResult"
            class="flex justify-between pt-2 border-t border-slate-800"
          >
            <span class="text-slate-400">Filter Capacitor:</span>
            <span class="text-purple-400 font-bold">{{
              filterCapResult.formatted
            }}</span>
          </div>
        </div>
      </div>

      <div class="lg:col-span-7 glass-card rounded-2xl p-5 sm:p-6 space-y-4">
        <h3
          class="text-base font-bold text-white border-b border-slate-800 pb-3"
        >
          <i class="fa-solid fa-diagram-project text-amber-400 mr-2"></i>
          ដ្យាក្រាម Bridge Rectifier
        </h3>

        <div class="bg-slate-950 border border-slate-800 rounded-2xl p-6">
          <svg viewBox="0 0 400 240" class="w-full">
            <!-- AC Input -->
            <text
              x="20"
              y="30"
              fill="#cbd5e1"
              font-size="12"
              font-family="JetBrains Mono"
            >
              AC
            </text>
            <line
              x1="50"
              y1="80"
              x2="100"
              y2="80"
              stroke="#cbd5e1"
              stroke-width="2"
            />
            <line
              x1="50"
              y1="160"
              x2="100"
              y2="160"
              stroke="#cbd5e1"
              stroke-width="2"
            />

            <!-- Diamond Bridge -->
            <g fill="#22d3ee" opacity="0.9">
              <polygon
                points="150,70 170,90 150,110 130,90"
                fill="none"
                stroke="#22d3ee"
                stroke-width="2"
              />
              <polygon
                points="250,70 270,90 250,110 230,90"
                fill="none"
                stroke="#22d3ee"
                stroke-width="2"
              />
              <polygon
                points="150,130 170,150 150,170 130,150"
                fill="none"
                stroke="#22d3ee"
                stroke-width="2"
              />
              <polygon
                points="250,130 270,150 250,170 230,150"
                fill="none"
                stroke="#22d3ee"
                stroke-width="2"
              />
            </g>

            <!-- Connections -->
            <line
              x1="100"
              y1="80"
              x2="130"
              y2="90"
              stroke="#cbd5e1"
              stroke-width="2"
            />
            <line
              x1="100"
              y1="160"
              x2="130"
              y2="150"
              stroke="#cbd5e1"
              stroke-width="2"
            />
            <line
              x1="170"
              y1="90"
              x2="230"
              y2="90"
              stroke="#cbd5e1"
              stroke-width="2"
            />
            <line
              x1="170"
              y1="150"
              x2="230"
              y2="150"
              stroke="#cbd5e1"
              stroke-width="2"
            />
            <line
              x1="270"
              y1="90"
              x2="320"
              y2="90"
              stroke="#cbd5e1"
              stroke-width="2"
            />
            <line
              x1="270"
              y1="150"
              x2="320"
              y2="150"
              stroke="#cbd5e1"
              stroke-width="2"
            />

            <!-- DC Output -->
            <text
              x="330"
              y="85"
              fill="#10b981"
              font-size="12"
              font-family="JetBrains Mono"
            >
              + DC
            </text>
            <text
              x="330"
              y="165"
              fill="#10b981"
              font-size="12"
              font-family="JetBrains Mono"
            >
              - DC
            </text>

            <!-- Labels -->
            <text
              x="185"
              y="85"
              fill="#cbd5e1"
              font-size="10"
              font-family="JetBrains Mono"
            >
              D1
            </text>
            <text
              x="185"
              y="145"
              fill="#cbd5e1"
              font-size="10"
              font-family="JetBrains Mono"
            >
              D2
            </text>
            <text
              x="95"
              y="85"
              fill="#cbd5e1"
              font-size="10"
              font-family="JetBrains Mono"
            >
              D3
            </text>
            <text
              x="95"
              y="155"
              fill="#cbd5e1"
              font-size="10"
              font-family="JetBrains Mono"
            >
              D4
            </text>

            <!-- Animated Sine -->
            <path
              d="M 20 120 Q 35 90, 50 120 T 80 120"
              fill="none"
              stroke="#f59e0b"
              stroke-width="2"
            >
              <animate
                attributeName="d"
                values="M 20 120 Q 35 90, 50 120 T 80 120;
                        M 20 120 Q 35 150, 50 120 T 80 120;
                        M 20 120 Q 35 90, 50 120 T 80 120"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </path>
          </svg>
        </div>

        <div
          class="text-xs font-mono text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800"
        >
          Vdc = 2√2 × Vrms / π − 2Vf ; C = IL / (2 × f × Vripple)
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDiode } from "~/composables/core/useDiode";

const {
  commonDiodes,
  calculateRectifier,
  calculateZenerResistor,
  calculateBridge,
  calculateFilterCap,
  formatOhm,
  formatWatt,
} = useDiode();

// ---- Mode ----
type Mode = "database" | "rectifier" | "zener" | "bridge";
const mode = ref<Mode>("database");

const modes = [
  { value: "database", label: "ទិន្នន័យ", icon: "fa-solid fa-database" },
  {
    value: "rectifier",
    label: "Rectifier",
    icon: "fa-solid fa-arrow-right-long",
  },
  { value: "zener", label: "Zener", icon: "fa-solid fa-bolt" },
  { value: "bridge", label: "Bridge", icon: "fa-solid fa-code-branch" },
] as const;

// ---- MODE 1: Database ----
const searchQuery = ref("");
const filterType = ref("");

const filteredDiodes = computed(() => {
  return commonDiodes.filter((d) => {
    const matchSearch =
      !searchQuery.value ||
      d.partNumber.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchType = !filterType.value || d.type === filterType.value;
    return matchSearch && matchType;
  });
});

// ---- MODE 2: Rectifier ----
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
    .filter((d) => d.vReverse >= reqVr && d.iForward_max >= reqIf)
    .slice(0, 4);
});

// ---- MODE 3: Zener ----
const zener = ref({ vIn: 12, vZener: 5.1, iLoad: 0.02 });
const zenerResult = computed(() =>
  calculateZenerResistor(
    zener.value.vIn,
    zener.value.vZener,
    zener.value.iLoad,
  ),
);

// ---- MODE 4: Bridge ----
const bridge = ref({ vAcIn: 12, iLoad: 0.5, vRipple: 1 });

const bridgeResult = computed(() =>
  calculateBridge(bridge.value.vAcIn, bridge.value.iLoad),
);

const filterCapResult = computed(() => {
  if (!bridge.value.vRipple || bridge.value.vRipple <= 0) return null;
  return calculateFilterCap(bridge.value.iLoad, bridge.value.vRipple);
});
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
