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
          <i :class="m.icon"></i>
          <span>{{ m.label }}</span>
        </button>
      </div>
    </div>

    <!-- ===== MODE 1: Database ===== -->
    <div
      v-if="mode === 'database'"
      class="glass-card rounded-2xl p-5 sm:p-6 space-y-4"
    >
      <div class="border-b border-slate-800 pb-3">
        <h2 class="text-lg font-bold text-white flex items-center gap-2">
          <i class="fa-solid fa-database text-cyan-400"></i>
          ទិន្នន័យ Transistor (BJT Database)
        </h2>
        <p class="text-xs text-slate-400">
          ស្វែងរក និងពិនិត្យលក្ខណៈពិសេសរបស់ BJT Transistor
        </p>
      </div>

      <!-- Search & Filter -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div class="sm:col-span-2">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="ស្វែងរក Part No..."
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono uppercase text-sm focus:outline-none focus:border-cyan-500"
          />
        </div>
        <select
          v-model="filterType"
          class="bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
        >
          <option value="">ប្រភេទទាំងអស់</option>
          <option value="NPN">NPN</option>
          <option value="PNP">PNP</option>
        </select>
      </div>

      <!-- Filter Chips -->
      <div class="flex flex-wrap gap-2">
        <button
          v-for="chip in filterChips"
          :key="chip.value"
          @click="filterType = chip.value as '' | 'NPN' | 'PNP'"
          class="px-3 py-1.5 text-[11px] font-mono rounded-lg border transition-colors"
          :class="
            filterType === chip.value
              ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
              : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
          "
        >
          <i :class="chip.icon" class="mr-1"></i>
          {{ chip.label }}
        </button>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto border border-slate-800 rounded-xl">
        <table class="w-full text-xs">
          <thead class="bg-slate-950">
            <tr class="text-slate-400 font-mono">
              <th class="px-3 py-2 text-left">Part</th>
              <th class="px-3 py-2 text-center">Type</th>
              <th class="px-3 py-2 text-right">Vceo</th>
              <th class="px-3 py-2 text-right">Ic</th>
              <th class="px-3 py-2 text-right">hFE</th>
              <th class="px-3 py-2 text-right">Pmax</th>
              <th class="px-3 py-2 text-left">Package</th>
              <th class="px-3 py-2 text-center">⭐</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800">
            <tr
              v-for="t in filteredTransistors"
              :key="t.partNumber"
              class="hover:bg-slate-800/40 transition-colors"
            >
              <td class="px-3 py-2 font-mono font-bold text-cyan-400">
                {{ t.partNumber }}
              </td>
              <td class="px-3 py-2 text-center">
                <span
                  class="px-2 py-0.5 rounded-full text-[10px] font-bold"
                  :class="
                    t.type === 'NPN'
                      ? 'bg-cyan-500/20 text-cyan-400'
                      : 'bg-amber-500/20 text-amber-400'
                  "
                >
                  {{ t.type }}
                </span>
              </td>
              <td class="px-3 py-2 text-right font-mono text-slate-300">
                {{ t.vCEO }}V
              </td>
              <td class="px-3 py-2 text-right font-mono text-emerald-400">
                {{ t.iC_max }}A
              </td>
              <td class="px-3 py-2 text-right font-mono text-amber-400">
                {{ t.hFE_min }}–{{ t.hFE_max }}
              </td>
              <td class="px-3 py-2 text-right font-mono text-slate-400">
                {{ t.pMax }}W
              </td>
              <td class="px-3 py-2 font-mono text-slate-500 text-[10px]">
                {{ t.package }}
              </td>
              <td class="px-3 py-2 text-center">
                <button
                  @click="
                    favoritesStore.toggle(t.partNumber, t.type, 'transistor')
                  "
                  class="transition-colors"
                  :class="
                    favoritesStore.has(t.partNumber)
                      ? 'text-amber-400'
                      : 'text-slate-600 hover:text-amber-400'
                  "
                >
                  <i
                    :class="
                      favoritesStore.has(t.partNumber)
                        ? 'fa-solid fa-star'
                        : 'fa-regular fa-star'
                    "
                  ></i>
                </button>
              </td>
            </tr>
            <tr v-if="!filteredTransistors.length">
              <td colspan="8" class="text-center py-8 text-slate-500">
                <i class="fa-solid fa-face-frown text-2xl block mb-2"></i>
                រកមិនឃើញ Transistor
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="text-[10px] text-slate-500 font-mono">
        បង្ហាញ {{ filteredTransistors.length }} /
        {{ commonTransistors.length }} ធាតុ
      </p>
    </div>

    <!-- ===== MODE 2: Base Resistor (Switch) ===== -->
    <div
      v-if="mode === 'switch'"
      class="grid grid-cols-1 lg:grid-cols-12 gap-6"
    >
      <div class="lg:col-span-5 glass-card rounded-2xl p-5 sm:p-6 space-y-4">
        <div class="border-b border-slate-800 pb-3">
          <h2 class="text-lg font-bold text-white flex items-center gap-2">
            <i class="fa-solid fa-toggle-on text-cyan-400"></i>
            គណនា Base Resistor (Switch)
          </h2>
          <p class="text-xs text-slate-400">
            រក Rb សមស្របសម្រាប់ប្រើ Transistor ជា Switch
          </p>
        </div>

        <div class="space-y-3">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              តង់ស្យុងចូល (Vin) - V:
            </label>
            <input
              v-model.number="sw.vIn"
              type="number"
              step="0.1"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              ចរន្ត Load (Ic) - A:
            </label>
            <input
              v-model.number="sw.iLoad"
              type="number"
              step="0.01"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              ជ្រើសរើស Transistor:
            </label>
            <select
              v-model="sw.selectedPart"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
            >
              <option
                v-for="t in commonTransistors"
                :key="t.partNumber"
                :value="t.partNumber"
              >
                {{ t.partNumber }} ({{ t.type }}, hFE={{ t.hFE_min }})
              </option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              Overdrive Factor (3–10):
            </label>
            <input
              v-model.number="sw.overdrive"
              type="number"
              min="3"
              max="10"
              step="1"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
            <p class="text-[10px] text-slate-500 mt-1">
              តម្លៃខ្ពស់ = សុវត្ថិភាពជាង ប៉ុន្តែចរន្ត Base ច្រើន
            </p>
          </div>
        </div>

        <!-- Result -->
        <div
          v-if="swResult"
          class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs font-mono"
        >
          <div>
            <span class="text-slate-400 block">Base Resistor (Rb)</span>
            <Transition name="fade-slide" mode="out-in">
              <div
                :key="swResult.rBFormatted"
                class="text-2xl font-bold text-cyan-400 mt-1"
              >
                {{ swResult.rBFormatted }}
              </div>
            </Transition>
          </div>
          <div class="border-t border-slate-800 pt-2 space-y-1">
            <div class="flex justify-between">
              <span class="text-slate-400">Ib (min):</span>
              <span class="text-slate-300">{{ swResult.iB_minFormatted }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Ib (actual):</span>
              <span class="text-amber-400 font-bold">
                {{ swResult.iB_actualFormatted }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">អានុភាព Rb:</span>
              <span class="text-emerald-400 font-bold">{{
                swResult.pRFormatted
              }}</span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <button
          v-if="swResult"
          @click="saveSwitchHistory"
          class="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors"
        >
          <i class="fa-solid fa-save"></i> រក្សាទុកប្រវត្តិ
        </button>
      </div>

      <!-- Schematic -->
      <div class="lg:col-span-7 glass-card rounded-2xl p-5 sm:p-6 space-y-4">
        <h3
          class="text-base font-bold text-white border-b border-slate-800 pb-3"
        >
          <i class="fa-solid fa-diagram-project text-amber-400 mr-2"></i>
          ដ្យាក្រាម NPN Switch
        </h3>

        <div class="bg-slate-950 border border-slate-800 rounded-2xl p-6">
          <svg viewBox="0 0 400 240" class="w-full">
            <!-- VCC Rail -->
            <line
              x1="50"
              y1="30"
              x2="350"
              y2="30"
              stroke="#f59e0b"
              stroke-width="3"
            />
            <text
              x="360"
              y="35"
              fill="#f59e0b"
              font-size="12"
              font-family="JetBrains Mono"
            >
              Vcc
            </text>

            <!-- Rc -->
            <rect
              x="190"
              y="50"
              width="20"
              height="40"
              fill="none"
              stroke="#22d3ee"
              stroke-width="2"
            />
            <text
              x="215"
              y="75"
              fill="#22d3ee"
              font-size="11"
              font-family="JetBrains Mono"
            >
              Rc
            </text>

            <!-- Load -->
            <circle
              cx="200"
              cy="120"
              r="15"
              fill="none"
              stroke="#10b981"
              stroke-width="2"
            />
            <text
              x="220"
              y="125"
              fill="#10b981"
              font-size="11"
              font-family="JetBrains Mono"
            >
              Load
            </text>

            <!-- Transistor -->
            <circle
              cx="200"
              cy="170"
              r="25"
              fill="none"
              stroke="#cbd5e1"
              stroke-width="2"
            />
            <line
              x1="185"
              y1="155"
              x2="185"
              y2="185"
              stroke="#cbd5e1"
              stroke-width="3"
            />
            <line
              x1="185"
              y1="160"
              x2="215"
              y2="150"
              stroke="#cbd5e1"
              stroke-width="2"
            />
            <line
              x1="185"
              y1="180"
              x2="215"
              y2="190"
              stroke="#cbd5e1"
              stroke-width="2"
            />

            <!-- Connections -->
            <line
              x1="200"
              y1="90"
              x2="200"
              y2="105"
              stroke="#cbd5e1"
              stroke-width="2"
            />
            <line
              x1="200"
              y1="135"
              x2="200"
              y2="150"
              stroke="#cbd5e1"
              stroke-width="2"
            />
            <line
              x1="215"
              y1="190"
              x2="250"
              y2="190"
              stroke="#cbd5e1"
              stroke-width="2"
            />

            <!-- Base Resistor -->
            <rect
              x="80"
              y="160"
              width="40"
              height="20"
              fill="none"
              stroke="#f59e0b"
              stroke-width="2"
            />
            <text
              x="90"
              y="200"
              fill="#f59e0b"
              font-size="11"
              font-family="JetBrains Mono"
            >
              Rb
            </text>
            <line
              x1="50"
              y1="170"
              x2="80"
              y2="170"
              stroke="#cbd5e1"
              stroke-width="2"
            />
            <line
              x1="120"
              y1="170"
              x2="185"
              y2="170"
              stroke="#cbd5e1"
              stroke-width="2"
            />

            <!-- Vin -->
            <text
              x="30"
              y="175"
              fill="#cbd5e1"
              font-size="12"
              font-family="JetBrains Mono"
            >
              Vin
            </text>

            <!-- Ground -->
            <line
              x1="250"
              y1="190"
              x2="250"
              y2="220"
              stroke="#cbd5e1"
              stroke-width="2"
            />
            <line
              x1="240"
              y1="220"
              x2="260"
              y2="220"
              stroke="#cbd5e1"
              stroke-width="2"
            />
            <line
              x1="244"
              y1="226"
              x2="256"
              y2="226"
              stroke="#cbd5e1"
              stroke-width="2"
            />

            <!-- Animated Currents -->
            <circle r="4" fill="#f59e0b">
              <animate
                attributeName="cx"
                from="50"
                to="185"
                dur="2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="cy"
                values="170;170"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>

            <circle r="4" fill="#22d3ee">
              <animate
                attributeName="cy"
                from="30"
                to="150"
                dur="2.5s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="cx"
                values="200;200"
                dur="2.5s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </div>

        <div
          class="text-xs font-mono text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800"
        >
          <i class="fa-solid fa-square-root-variable text-cyan-400 mr-2"></i>
          Rb = (Vin − Vbe) / (Ic / hFE × Overdrive)
        </div>
      </div>
    </div>

    <!-- ===== MODE 3: Common Emitter Amplifier ===== -->
    <div
      v-if="mode === 'amplifier'"
      class="grid grid-cols-1 lg:grid-cols-12 gap-6"
    >
      <div class="lg:col-span-5 glass-card rounded-2xl p-5 sm:p-6 space-y-4">
        <div class="border-b border-slate-800 pb-3">
          <h2 class="text-lg font-bold text-white flex items-center gap-2">
            <i class="fa-solid fa-wave-square text-cyan-400"></i>
            គណនា Common Emitter Amplifier
          </h2>
          <p class="text-xs text-slate-400">
            គណនា Rc, Re, R1, R2 សម្រាប់ CE Amplifier
          </p>
        </div>

        <div class="space-y-3">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              Vcc - V:
            </label>
            <input
              v-model.number="amp.vCC"
              type="number"
              step="0.1"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              ចរន្ត Ic ត្រូវការ - mA:
            </label>
            <input
              v-model.number="amp.iC_mA"
              type="number"
              step="0.1"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              ជ្រើសរើស Transistor:
            </label>
            <select
              v-model="amp.selectedPart"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
            >
              <option
                v-for="t in npnTransistors"
                :key="t.partNumber"
                :value="t.partNumber"
              >
                {{ t.partNumber }} (hFE={{ t.hFE_min }})
              </option>
            </select>
          </div>
        </div>

        <!-- Result -->
        <div
          v-if="ampResult"
          class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs font-mono"
        >
          <div class="grid grid-cols-2 gap-3">
            <div>
              <span class="text-slate-400 block">Rc</span>
              <span class="text-cyan-400 font-bold">{{
                ampResult.rCFormatted
              }}</span>
            </div>
            <div>
              <span class="text-slate-400 block">Re</span>
              <span class="text-cyan-400 font-bold">{{
                ampResult.rEFormatted
              }}</span>
            </div>
            <div>
              <span class="text-slate-400 block">R1 (Base)</span>
              <span class="text-amber-400 font-bold">{{
                ampResult.r1Formatted
              }}</span>
            </div>
            <div>
              <span class="text-slate-400 block">R2 (Base)</span>
              <span class="text-amber-400 font-bold">{{
                ampResult.r2Formatted
              }}</span>
            </div>
          </div>
          <div class="border-t border-slate-800 pt-2 space-y-1">
            <div class="flex justify-between">
              <span class="text-slate-400">Vb:</span>
              <span class="text-slate-300">{{ ampResult.vB }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Ve:</span>
              <span class="text-slate-300">{{ ampResult.vE }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Gain (approx):</span>
              <span class="text-emerald-400 font-bold">{{
                ampResult.gain
              }}</span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <button
          v-if="ampResult"
          @click="saveAmpHistory"
          class="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors"
        >
          <i class="fa-solid fa-save"></i> រក្សាទុកប្រវត្តិ
        </button>
      </div>

      <!-- Schematic -->
      <div class="lg:col-span-7 glass-card rounded-2xl p-5 sm:p-6 space-y-4">
        <h3
          class="text-base font-bold text-white border-b border-slate-800 pb-3"
        >
          <i class="fa-solid fa-diagram-project text-amber-400 mr-2"></i>
          ដ្យាក្រាម Common Emitter Amplifier
        </h3>

        <div class="bg-slate-950 border border-slate-800 rounded-2xl p-6">
          <svg viewBox="0 0 400 280" class="w-full">
            <!-- VCC Rail -->
            <line
              x1="100"
              y1="20"
              x2="320"
              y2="20"
              stroke="#f59e0b"
              stroke-width="3"
            />
            <text
              x="330"
              y="25"
              fill="#f59e0b"
              font-size="11"
              font-family="JetBrains Mono"
            >
              Vcc
            </text>

            <!-- R1 -->
            <rect
              x="120"
              y="30"
              width="20"
              height="40"
              fill="none"
              stroke="#cbd5e1"
              stroke-width="2"
            />
            <text
              x="145"
              y="55"
              fill="#cbd5e1"
              font-size="10"
              font-family="JetBrains Mono"
            >
              R1
            </text>

            <!-- Rc -->
            <rect
              x="270"
              y="30"
              width="20"
              height="40"
              fill="none"
              stroke="#22d3ee"
              stroke-width="2"
            />
            <text
              x="295"
              y="55"
              fill="#22d3ee"
              font-size="10"
              font-family="JetBrains Mono"
            >
              Rc
            </text>

            <!-- R2 -->
            <rect
              x="120"
              y="140"
              width="20"
              height="40"
              fill="none"
              stroke="#cbd5e1"
              stroke-width="2"
            />
            <text
              x="145"
              y="165"
              fill="#cbd5e1"
              font-size="10"
              font-family="JetBrains Mono"
            >
              R2
            </text>

            <!-- Re -->
            <rect
              x="270"
              y="170"
              width="20"
              height="40"
              fill="none"
              stroke="#22d3ee"
              stroke-width="2"
            />
            <text
              x="295"
              y="195"
              fill="#22d3ee"
              font-size="10"
              font-family="JetBrains Mono"
            >
              Re
            </text>

            <!-- Transistor -->
            <circle
              cx="200"
              cy="110"
              r="25"
              fill="none"
              stroke="#10b981"
              stroke-width="2"
            />
            <line
              x1="185"
              y1="95"
              x2="185"
              y2="125"
              stroke="#10b981"
              stroke-width="3"
            />
            <line
              x1="185"
              y1="100"
              x2="210"
              y2="90"
              stroke="#10b981"
              stroke-width="2"
            />
            <line
              x1="185"
              y1="120"
              x2="210"
              y2="130"
              stroke="#10b981"
              stroke-width="2"
            />

            <!-- Connections -->
            <line
              x1="130"
              y1="70"
              x2="130"
              y2="100"
              stroke="#cbd5e1"
              stroke-width="2"
            />
            <line
              x1="130"
              y1="100"
              x2="185"
              y2="100"
              stroke="#cbd5e1"
              stroke-width="2"
            />
            <line
              x1="130"
              y1="140"
              x2="130"
              y2="100"
              stroke="#cbd5e1"
              stroke-width="2"
            />

            <line
              x1="280"
              y1="70"
              x2="280"
              y2="90"
              stroke="#cbd5e1"
              stroke-width="2"
            />
            <line
              x1="280"
              y1="90"
              x2="210"
              y2="90"
              stroke="#cbd5e1"
              stroke-width="2"
            />

            <line
              x1="280"
              y1="170"
              x2="280"
              y2="140"
              stroke="#cbd5e1"
              stroke-width="2"
            />
            <line
              x1="280"
              y1="140"
              x2="210"
              y2="130"
              stroke="#cbd5e1"
              stroke-width="2"
            />

            <!-- Input Cap -->
            <line
              x1="40"
              y1="100"
              x2="60"
              y2="100"
              stroke="#cbd5e1"
              stroke-width="2"
            />
            <line
              x1="60"
              y1="90"
              x2="60"
              y2="110"
              stroke="#cbd5e1"
              stroke-width="3"
            />
            <line
              x1="65"
              y1="90"
              x2="65"
              y2="110"
              stroke="#cbd5e1"
              stroke-width="3"
            />
            <line
              x1="65"
              y1="100"
              x2="130"
              y2="100"
              stroke="#cbd5e1"
              stroke-width="2"
            />
            <text
              x="30"
              y="105"
              fill="#cbd5e1"
              font-size="10"
              font-family="JetBrains Mono"
            >
              Vin
            </text>

            <!-- Output Cap -->
            <line
              x1="280"
              y1="90"
              x2="320"
              y2="90"
              stroke="#cbd5e1"
              stroke-width="2"
            />
            <line
              x1="320"
              y1="80"
              x2="320"
              y2="100"
              stroke="#cbd5e1"
              stroke-width="3"
            />
            <line
              x1="325"
              y1="80"
              x2="325"
              y2="100"
              stroke="#cbd5e1"
              stroke-width="3"
            />
            <line
              x1="325"
              y1="90"
              x2="360"
              y2="90"
              stroke="#cbd5e1"
              stroke-width="2"
            />
            <text
              x="365"
              y="95"
              fill="#10b981"
              font-size="10"
              font-family="JetBrains Mono"
            >
              Vout
            </text>

            <!-- Ground -->
            <line
              x1="130"
              y1="180"
              x2="280"
              y2="180"
              stroke="#cbd5e1"
              stroke-width="2"
            />
            <line
              x1="200"
              y1="180"
              x2="200"
              y2="210"
              stroke="#cbd5e1"
              stroke-width="2"
            />
            <line
              x1="190"
              y1="210"
              x2="210"
              y2="210"
              stroke="#cbd5e1"
              stroke-width="2"
            />
            <line
              x1="194"
              y1="216"
              x2="206"
              y2="216"
              stroke="#cbd5e1"
              stroke-width="2"
            />
            <line
              x1="280"
              y1="210"
              x2="280"
              y2="230"
              stroke="#cbd5e1"
              stroke-width="2"
            />

            <!-- Animated Signal -->
            <circle r="3" fill="#22d3ee">
              <animate
                attributeName="cx"
                from="40"
                to="280"
                dur="3s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="cy"
                values="100;100"
                dur="3s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </div>

        <div
          class="text-xs font-mono text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800"
        >
          <i class="fa-solid fa-square-root-variable text-cyan-400 mr-2"></i>
          Rc = (Vcc − Vce) / Ic ; Re = 0.1 × Rc ; Gain ≈ −Rc / Re
        </div>
      </div>
    </div>

    <!-- ===== MODE 4: Finder ===== -->
    <div
      v-if="mode === 'finder'"
      class="glass-card rounded-2xl p-5 sm:p-6 space-y-4"
    >
      <div class="border-b border-slate-800 pb-3">
        <h2 class="text-lg font-bold text-white flex items-center gap-2">
          <i class="fa-solid fa-magnifying-glass text-cyan-400"></i>
          ជ្រើសរើស Transistor ត្រឹមត្រូវ
        </h2>
        <p class="text-xs text-slate-400">
          បញ្ចូលតម្រូវការ ដើម្បីរក Transistor សមស្រប
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            Vceo ត្រូវការ (V):
          </label>
          <input
            v-model.number="finder.vCEO"
            type="number"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            Ic ត្រូវការ (A):
          </label>
          <input
            v-model.number="finder.iC"
            type="number"
            step="0.1"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            ប្រភេទ:
          </label>
          <select
            v-model="finder.type"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
          >
            <option value="both">ទាំងអស់</option>
            <option value="NPN">NPN</option>
            <option value="PNP">PNP</option>
          </select>
        </div>
      </div>

      <!-- Results -->
      <div class="space-y-2">
        <TransitionGroup name="list" tag="div" class="space-y-2">
          <div
            v-for="t in finderResults"
            :key="t.partNumber"
            class="glass-card rounded-xl p-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
          >
            <div class="flex items-center gap-4">
              <span
                class="px-2 py-1 rounded-lg text-[10px] font-bold font-mono"
                :class="
                  t.type === 'NPN'
                    ? 'bg-cyan-500/20 text-cyan-400'
                    : 'bg-amber-500/20 text-amber-400'
                "
              >
                {{ t.type }}
              </span>
              <div>
                <h4 class="font-bold text-cyan-400 font-mono">
                  {{ t.partNumber }}
                </h4>
                <p class="text-[10px] text-slate-400">
                  {{ t.usage }} • {{ t.package }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div class="text-right text-xs font-mono">
                <div class="text-slate-300">
                  {{ t.vCEO }}V / {{ t.iC_max }}A
                </div>
                <div class="text-slate-500 text-[10px]">
                  hFE: {{ t.hFE_min }}–{{ t.hFE_max }}
                </div>
              </div>
              <button
                @click="
                  favoritesStore.toggle(t.partNumber, t.type, 'transistor')
                "
                class="transition-colors"
                :class="
                  favoritesStore.has(t.partNumber)
                    ? 'text-amber-400'
                    : 'text-slate-600 hover:text-amber-400'
                "
              >
                <i
                  :class="
                    favoritesStore.has(t.partNumber)
                      ? 'fa-solid fa-star'
                      : 'fa-regular fa-star'
                  "
                ></i>
              </button>
            </div>
          </div>
        </TransitionGroup>

        <p v-if="!finderResults.length" class="text-center text-slate-500 py-8">
          <i class="fa-solid fa-face-frown text-2xl mb-2"></i>
          <br />
          រកមិនឃើញ Transistor សមស្រប
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTransistorCalc } from "~/composables/core/useTransistorCalc";

// ===== Stores =====
const historyStore = useHistoryStore();
const favoritesStore = useFavoritesStore();

// ===== Composable =====
const {
  commonTransistors,
  calculateBaseResistor,
  calculateCommonEmitter,
  findSuitableTransistors,
} = useTransistorCalc();

// ===== Mode =====
type Mode = "database" | "switch" | "amplifier" | "finder";
const mode = ref<Mode>("database");

const modes = [
  { value: "database", label: "ទិន្នន័យ", icon: "fa-solid fa-database" },
  { value: "switch", label: "Switch", icon: "fa-solid fa-toggle-on" },
  { value: "amplifier", label: "Amplifier", icon: "fa-solid fa-wave-square" },
  { value: "finder", label: "រក Part", icon: "fa-solid fa-magnifying-glass" },
] as const;

// ===== MODE 1: Database =====
const searchQuery = ref("");
const filterType = ref<"" | "NPN" | "PNP">("");

const filterChips = [
  { value: "", label: "ទាំងអស់", icon: "fa-solid fa-list" },
  { value: "NPN", label: "NPN", icon: "fa-solid fa-arrow-up" },
  { value: "PNP", label: "PNP", icon: "fa-solid fa-arrow-down" },
];

const filteredTransistors = computed(() =>
  commonTransistors.filter((t) => {
    const matchSearch =
      !searchQuery.value ||
      t.partNumber.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchType = !filterType.value || t.type === filterType.value;
    return matchSearch && matchType;
  }),
);

// ===== MODE 2: Switch =====
const sw = ref({
  vIn: 5,
  iLoad: 0.5,
  selectedPart: "2N2222",
  overdrive: 5,
});

const swResult = computed(() => {
  const t = commonTransistors.find(
    (x) => x.partNumber === sw.value.selectedPart,
  );
  if (!t) return null;
  return calculateBaseResistor(
    sw.value.vIn,
    sw.value.iLoad,
    t.hFE_min,
    t.vBE,
    t.vCE_sat,
    sw.value.overdrive,
  );
});

const saveSwitchHistory = () => {
  if (!swResult.value) return;
  historyStore.add({
    type: "transistor",
    title: `Switch (${sw.value.selectedPart})`,
    value: swResult.value.rBFormatted,
    input: { ...sw.value },
  });
};

// ===== MODE 3: Amplifier =====
const amp = ref({
  vCC: 12,
  iC_mA: 1,
  selectedPart: "2N3904",
});

const npnTransistors = computed(() =>
  commonTransistors.filter((t) => t.type === "NPN"),
);

const ampResult = computed(() => {
  const t = commonTransistors.find(
    (x) => x.partNumber === amp.value.selectedPart,
  );
  if (!t) return null;
  return calculateCommonEmitter(
    amp.value.vCC,
    amp.value.iC_mA / 1000,
    t.hFE_min,
    0.5,
    t.vBE,
  );
});

const saveAmpHistory = () => {
  if (!ampResult.value) return;
  historyStore.add({
    type: "transistor",
    title: `Amplifier (${amp.value.selectedPart})`,
    value: `Gain ${ampResult.value.gain}`,
    input: { ...amp.value },
  });
};

// ===== MODE 4: Finder =====
const finder = ref({
  vCEO: 40,
  iC: 0.2,
  type: "both" as "both" | "NPN" | "PNP",
});

const finderResults = computed(() => {
  const results = findSuitableTransistors(finder.value.vCEO, finder.value.iC);
  if (finder.value.type === "both") return results;
  return results.filter((t) => t.type === finder.value.type);
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

/* List transition for TransitionGroup */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}
.list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
.list-move {
  transition: transform 0.3s ease;
}
</style>
