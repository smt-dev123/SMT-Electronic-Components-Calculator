<template>
  <div class="space-y-6">
    <!-- Mode Selector -->
    <div class="glass-card rounded-2xl p-5">
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
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

    <!-- ===== MODE 1: Width Calculator ===== -->
    <div v-if="mode === 'width'" class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Inputs -->
      <div class="lg:col-span-5 glass-card rounded-2xl p-5 sm:p-6 space-y-4">
        <div class="border-b border-slate-800 pb-3">
          <h2 class="text-lg font-bold text-white flex items-center gap-2">
            <LucideRuler class="w-4 h-4 text-cyan-400" />
            PCB Trace Width (IPC-2221)
          </h2>
          <p class="text-xs text-slate-400">
            គណនាទទឹង trace សម្រាប់ចរន្តដែលចង់បាន
          </p>
        </div>

        <div class="space-y-3">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              ចរន្ត (Current - A):
            </label>
            <input
              v-model.number="width.current"
              type="number"
              step="0.1"
              min="0.01"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              ការកើនសីតុណ្ហភាព (ΔT - °C):
            </label>
            <input
              v-model.number="width.tempRise"
              type="number"
              min="1"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
            <p class="text-[10px] text-slate-500 mt-1">
              ធម្មតា: 10°C សម្រាប់ការងារទូទៅ, 20°C សម្រាប់ power
            </p>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              កម្រាស់ស្ពាន់ (Copper):
            </label>
            <select
              v-model.number="width.copperOz"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            >
              <option v-for="c in copperThicknesses" :key="c.oz" :value="c.oz">
                {{ c.label }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              Layer:
            </label>
            <div class="grid grid-cols-2 gap-2">
              <button
                @click="width.layer = 'external'"
                class="py-2 rounded-xl font-semibold text-xs transition-all"
                :class="
                  width.layer === 'external'
                    ? 'bg-cyan-500 text-slate-950'
                    : 'bg-slate-950 text-slate-400 border border-slate-800'
                "
              >
                External (Outer)
              </button>
              <button
                @click="width.layer = 'internal'"
                class="py-2 rounded-xl font-semibold text-xs transition-all"
                :class="
                  width.layer === 'internal'
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-950 text-slate-400 border border-slate-800'
                "
              >
                Internal (Inner)
              </button>
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              ប្រវែង Trace (Length - mm):
            </label>
            <input
              v-model.number="width.length"
              type="number"
              step="10"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <!-- Result -->
        <div
          v-if="widthResult"
          class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3"
        >
          <div>
            <span class="text-xs text-slate-400 font-mono block">
              Trace Width ត្រូវការ
            </span>
            <Transition name="fade-slide" mode="out-in">
              <div :key="widthResult.width_mil" class="mt-1">
                <div class="text-3xl font-bold font-mono text-cyan-400">
                  {{ widthResult.width_mil.toFixed(2) }}
                  <span class="text-lg">mil</span>
                </div>
                <div class="text-xl font-bold font-mono text-emerald-400">
                  {{ widthResult.width_mm.toFixed(3) }}
                  <span class="text-sm">mm</span>
                </div>
              </div>
            </Transition>
          </div>

          <div
            v-if="dropResult"
            class="border-t border-slate-800 pt-2 space-y-1 text-xs font-mono"
          >
            <div class="flex justify-between">
              <span class="text-slate-400">
                Resistance ({{ width.length }} mm):
              </span>
              <span class="text-slate-200">
                {{ dropResult.resistance_mOhm.toFixed(2) }} mΩ
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Voltage Drop:</span>
              <span class="text-amber-400 font-bold">
                {{ dropResult.voltageDropFormatted }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Power Loss:</span>
              <span class="text-red-400 font-bold">
                {{ dropResult.powerLoss_mW.toFixed(2) }} mW
              </span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-2">
          <button
            v-if="widthResult"
            @click="saveToHistory"
            class="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors"
          >
            <LucideSave class="w-3.5 h-3.5" />
            រក្សាទុកប្រវត្តិ
          </button>
        </div>
      </div>

      <!-- Visualization -->
      <div class="lg:col-span-7 glass-card rounded-2xl p-5 sm:p-6 space-y-4">
        <h3
          class="text-base font-bold text-white border-b border-slate-800 pb-3"
        >
          <LucideLayoutGrid class="w-4 h-4 text-amber-400 mr-2 inline" />
          រូបភាព Trace
        </h3>

        <div class="bg-slate-950 border border-slate-800 rounded-2xl p-6">
          <svg viewBox="0 0 500 260" class="w-full">
            <!-- PCB Background -->
            <rect
              x="20"
              y="20"
              width="460"
              height="220"
              fill="#064e3b"
              opacity="0.15"
              rx="8"
            />
            <text
              x="30"
              y="45"
              fill="#94a3b8"
              font-size="10"
              font-family="JetBrains Mono"
            >
              PCB Top View
            </text>

            <!-- Trace -->
            <line
              x1="60"
              y1="130"
              :x2="440"
              y2="130"
              :stroke-width="traceWidthPx"
              stroke="#fbbf24"
              stroke-linecap="round"
            />

            <!-- Pads -->
            <circle cx="60" cy="130" r="14" fill="#f59e0b" opacity="0.5" />
            <circle cx="440" cy="130" r="14" fill="#f59e0b" opacity="0.5" />
            <circle cx="60" cy="130" r="6" fill="#0f172a" />
            <circle cx="440" cy="130" r="6" fill="#0f172a" />

            <!-- Dimension line -->
            <line
              x1="250"
              y1="180"
              x2="250"
              y2="200"
              stroke="#22d3ee"
              stroke-width="1"
            />
            <line
              x1="230"
              y1="200"
              x2="270"
              y2="200"
              stroke="#22d3ee"
              stroke-width="1"
            />
            <line
              x1="250"
              y1="175"
              x2="250"
              y2="205"
              stroke="#22d3ee"
              stroke-width="1"
              stroke-dasharray="2,2"
            />
            <text
              x="252"
              y="215"
              fill="#22d3ee"
              font-size="10"
              font-family="JetBrains Mono"
            >
              {{ widthResult ? widthResult.width_mm.toFixed(3) + " mm" : "—" }}
            </text>

            <!-- Info Labels -->
            <text
              x="30"
              y="80"
              fill="#22d3ee"
              font-size="10"
              font-family="JetBrains Mono"
            >
              I = {{ width.current }} A
            </text>
            <text
              x="30"
              y="95"
              fill="#f59e0b"
              font-size="10"
              font-family="JetBrains Mono"
            >
              ΔT = {{ width.tempRise }} °C
            </text>
            <text
              x="30"
              y="110"
              fill="#10b981"
              font-size="10"
              font-family="JetBrains Mono"
            >
              Cu = {{ width.copperOz }} oz
            </text>

            <!-- Animated current -->
            <circle r="4" fill="#22d3ee">
              <animate
                attributeName="cx"
                from="60"
                to="440"
                :dur="`${Math.max(1, 4 / Math.max(width.current, 0.5))}s`"
                repeatCount="indefinite"
              />
              <animate
                attributeName="cy"
                values="130;130"
                :dur="`${Math.max(1, 4 / Math.max(width.current, 0.5))}s`"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-3 gap-3">
          <div
            class="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center"
          >
            <div class="text-[10px] text-slate-500 font-mono">Width</div>
            <div class="text-cyan-400 font-bold font-mono text-sm">
              {{
                widthResult ? widthResult.width_mil.toFixed(1) + " mil" : "—"
              }}
            </div>
          </div>
          <div
            class="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center"
          >
            <div class="text-[10px] text-slate-500 font-mono">Copper</div>
            <div class="text-amber-400 font-bold font-mono text-sm">
              {{ width.copperOz }} oz
            </div>
          </div>
          <div
            class="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center"
          >
            <div class="text-[10px] text-slate-500 font-mono">Layer</div>
            <div
              class="text-emerald-400 font-bold font-mono text-sm capitalize"
            >
              {{ width.layer }}
            </div>
          </div>
        </div>

        <!-- IPC-2221 Info -->
        <div
          class="text-xs font-mono text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800"
        >
          <p class="text-cyan-400 font-bold mb-1">IPC-2221 Formula:</p>
          <p>A = (I / (k × ΔT^0.44))^(1/0.725)</p>
          <p class="text-slate-500 mt-1">
            k = 0.048 (external), 0.024 (internal)
          </p>
        </div>
      </div>
    </div>

    <!-- ===== MODE 2: Max Current ===== -->
    <div
      v-if="mode === 'current'"
      class="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      <!-- Input -->
      <div class="glass-card rounded-2xl p-5 sm:p-6 space-y-4">
        <div class="border-b border-slate-800 pb-3">
          <h2 class="text-lg font-bold text-white flex items-center gap-2">
            <LucideZap class="w-4 h-4 text-cyan-400" />
            រកចរន្តអតិបរមាសម្រាប់ Width
          </h2>
          <p class="text-xs text-slate-400">ផ្ទុយពី Width Calculator</p>
        </div>

        <div class="space-y-3">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              Trace Width (mil):
            </label>
            <input
              v-model.number="maxCurrent.width"
              type="number"
              step="1"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
            <p class="text-[10px] text-slate-500 mt-1">
              ឧ. 10 mil ≈ 0.254 mm, 20 mil ≈ 0.508 mm
            </p>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              ការកើនសីតុណ្ហភាព (ΔT - °C):
            </label>
            <input
              v-model.number="maxCurrent.tempRise"
              type="number"
              min="1"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              Copper (oz):
            </label>
            <select
              v-model.number="maxCurrent.copperOz"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            >
              <option v-for="c in copperThicknesses" :key="c.oz" :value="c.oz">
                {{ c.label }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              Layer:
            </label>
            <div class="grid grid-cols-2 gap-2">
              <button
                @click="maxCurrent.layer = 'external'"
                class="py-2 rounded-xl font-semibold text-xs transition-all"
                :class="
                  maxCurrent.layer === 'external'
                    ? 'bg-cyan-500 text-slate-950'
                    : 'bg-slate-950 text-slate-400 border border-slate-800'
                "
              >
                External
              </button>
              <button
                @click="maxCurrent.layer = 'internal'"
                class="py-2 rounded-xl font-semibold text-xs transition-all"
                :class="
                  maxCurrent.layer === 'internal'
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-950 text-slate-400 border border-slate-800'
                "
              >
                Internal
              </button>
            </div>
          </div>
        </div>

        <div
          v-if="maxCurrentResult"
          class="bg-slate-950 p-4 rounded-xl border border-slate-800"
        >
          <span class="text-xs text-slate-400 font-mono block">
            ចរន្តអតិបរមា
          </span>
          <Transition name="fade-slide" mode="out-in">
            <div
              :key="maxCurrentResult.current_A"
              class="text-3xl font-bold font-mono text-cyan-400 mt-1"
            >
              {{ maxCurrentResult.currentFormatted }}
            </div>
          </Transition>
        </div>
      </div>

      <!-- Reference Table -->
      <div class="glass-card rounded-2xl p-5 sm:p-6 space-y-4">
        <h3
          class="text-base font-bold text-white border-b border-slate-800 pb-3"
        >
          <LucideBookOpen class="w-4 h-4 text-amber-400 mr-2 inline" />
          តារាងយោង Width vs Current (IPC-2221)
        </h3>

        <div class="overflow-x-auto">
          <table class="w-full text-xs">
            <thead class="bg-slate-950">
              <tr class="text-slate-400 font-mono">
                <th class="px-3 py-2 text-left">Width</th>
                <th class="px-3 py-2 text-right">0.5 oz</th>
                <th class="px-3 py-2 text-right">1 oz</th>
                <th class="px-3 py-2 text-right">2 oz</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800">
              <tr
                v-for="row in referenceTable"
                :key="row.width"
                class="hover:bg-slate-800/40 transition-colors"
              >
                <td class="px-3 py-2 font-mono font-bold text-cyan-400">
                  {{ row.width }} mil
                </td>
                <td class="px-3 py-2 text-right font-mono text-slate-300">
                  {{ row.c05 }} A
                </td>
                <td class="px-3 py-2 text-right font-mono text-amber-400">
                  {{ row.c1 }} A
                </td>
                <td class="px-3 py-2 text-right font-mono text-emerald-400">
                  {{ row.c2 }} A
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p class="text-[10px] text-slate-500 font-mono">
          * តម្លៃសម្រាប់ External layers, ΔT = 10°C
        </p>
      </div>
    </div>

    <!-- ===== MODE 3: Voltage Drop ===== -->
    <div v-if="mode === 'drop'" class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div class="lg:col-span-5 glass-card rounded-2xl p-5 sm:p-6 space-y-4">
        <div class="border-b border-slate-800 pb-3">
          <h2 class="text-lg font-bold text-white flex items-center gap-2">
            <LucideTrendingDown class="w-4 h-4 text-amber-400" />
            Voltage Drop Calculator
          </h2>
          <p class="text-xs text-slate-400">
            គណនា voltage drop តាមប្រវែង trace
          </p>
        </div>

        <div class="space-y-3">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              Width (mm):
            </label>
            <input
              v-model.number="drop.width"
              type="number"
              step="0.01"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              Copper (oz):
            </label>
            <select
              v-model.number="drop.copperOz"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            >
              <option v-for="c in copperThicknesses" :key="c.oz" :value="c.oz">
                {{ c.label }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              Length (mm):
            </label>
            <input
              v-model.number="drop.length"
              type="number"
              step="10"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              Current (A):
            </label>
            <input
              v-model.number="drop.current"
              type="number"
              step="0.1"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div
          v-if="dropResult"
          class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs font-mono"
        >
          <div>
            <span class="text-slate-400 block">Voltage Drop</span>
            <div class="text-2xl font-bold text-amber-400 mt-1">
              {{ dropResult.voltageDropFormatted }}
            </div>
          </div>
          <div class="border-t border-slate-800 pt-2 space-y-1">
            <div class="flex justify-between">
              <span class="text-slate-400">Resistance:</span>
              <span class="text-slate-200"
                >{{ dropResult.resistance_mOhm.toFixed(2) }} mΩ</span
              >
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Power Loss:</span>
              <span class="text-red-400"
                >{{ dropResult.powerLoss_mW.toFixed(2) }} mW</span
              >
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-7 glass-card rounded-2xl p-5 sm:p-6 space-y-4">
        <h3
          class="text-base font-bold text-white border-b border-slate-800 pb-3"
        >
          <LucideInfo class="w-4 h-4 text-cyan-400 mr-2 inline" />
          ព័ត៌មានជំនួយ
        </h3>

        <div
          class="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4 text-xs font-mono"
        >
          <div class="bg-slate-900 p-3 rounded-lg">
            <p class="text-cyan-400 mb-2">📐 រូបមន្ត:</p>
            <p class="text-slate-300">R = ρ × L / (W × T)</p>
            <p class="text-slate-300">Vdrop = I × R</p>
            <p class="text-slate-300">Ploss = I² × R</p>
          </div>

          <div class="bg-slate-900 p-3 rounded-lg">
            <p class="text-amber-400 mb-2">📊 គន្លឹះ:</p>
            <ul class="space-y-1 text-slate-400">
              <li>• Vdrop &lt; 5% នៃ Vin → ល្អ</li>
              <li>• Vdrop &gt; 10% → ត្រូវការ width ធំ</li>
              <li>• ប្រវែងវែង → Vdrop ច្រើន</li>
              <li>• ចរន្តច្រើន → Vdrop ច្រើន</li>
            </ul>
          </div>

          <div class="bg-slate-900 p-3 rounded-lg">
            <p class="text-emerald-400 mb-2">💡 ρ Copper:</p>
            <p class="text-slate-400">1.68 × 10⁻⁸ Ω·m @ 20°C</p>
            <p class="text-slate-400">2.16 × 10⁻⁸ Ω·m @ 80°C</p>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== MODE 4: Via Size ===== -->
    <div v-if="mode === 'via'" class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div class="lg:col-span-5 glass-card rounded-2xl p-5 sm:p-6 space-y-4">
        <div class="border-b border-slate-800 pb-3">
          <h2 class="text-lg font-bold text-white flex items-center gap-2">
            <LucideCircleDot class="w-4 h-4 text-cyan-400" />
            Via Size Calculator
          </h2>
          <p class="text-xs text-slate-400">
            គណនាទំហំ Via សម្រាប់ចរន្តដែលចង់បាន
          </p>
        </div>

        <div class="space-y-3">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              ចរន្តក្នុង Via (Current - A):
            </label>
            <input
              v-model.number="via.current"
              type="number"
              step="0.1"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              ការកើនសីតុណ្ហភាព (ΔT - °C):
            </label>
            <input
              v-model.number="via.tempRise"
              type="number"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              Copper (oz):
            </label>
            <select
              v-model.number="via.copperOz"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            >
              <option v-for="c in copperThicknesses" :key="c.oz" :value="c.oz">
                {{ c.label }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              កម្រាស់ PCB (Via Length - mm):
            </label>
            <input
              v-model.number="via.length"
              type="number"
              step="0.1"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
            <p class="text-[10px] text-slate-500 mt-1">
              ធម្មតា: 1.6 mm (standard PCB)
            </p>
          </div>
        </div>

        <div
          v-if="viaResult"
          class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3"
        >
          <div>
            <span class="text-xs text-slate-400 font-mono block">
              Via Dimensions ត្រូវការ
            </span>
            <div class="text-xl font-bold font-mono text-cyan-400 mt-1">
              OD: {{ viaResult.odFormatted }}
            </div>
            <div class="text-xl font-bold font-mono text-emerald-400">
              ID: {{ viaResult.idFormatted }}
            </div>
          </div>

          <div
            class="border-t border-slate-800 pt-2 space-y-1 text-xs font-mono"
          >
            <div class="flex justify-between">
              <span class="text-slate-400">Standard Drill:</span>
              <span class="text-amber-400 font-bold">
                {{ viaResult.nearestDrillFormatted }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Via Resistance:</span>
              <span class="text-slate-200">
                {{ viaResult.resistance_mOhm.toFixed(2) }} mΩ
              </span>
            </div>
          </div>

          <!-- Via Count Calculator -->
          <div class="border-t border-slate-800 pt-3">
            <label class="block text-xs font-semibold text-slate-300 mb-2">
              ចំនួន Via ត្រូវការ (សម្រាប់ចរន្តសរុប):
            </label>
            <div class="flex gap-2">
              <input
                v-model.number="via.totalCurrent"
                type="number"
                step="0.1"
                placeholder="Total A"
                class="flex-1 bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
              />
              <div
                v-if="viaCountResult"
                class="px-3 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400 font-mono text-xs font-bold"
              >
                {{ viaCountResult.countFormatted }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Visualization -->
      <div class="lg:col-span-7 glass-card rounded-2xl p-5 sm:p-6 space-y-4">
        <h3
          class="text-base font-bold text-white border-b border-slate-800 pb-3"
        >
          <LucideCircleDot class="w-4 h-4 text-amber-400 mr-2 inline" />
          រូបភាព Via
        </h3>

        <div class="bg-slate-950 border border-slate-800 rounded-2xl p-6">
          <svg viewBox="0 0 400 300" class="w-full">
            <!-- PCB Cross-section -->
            <rect
              x="40"
              y="100"
              width="320"
              height="100"
              fill="#064e3b"
              opacity="0.3"
              rx="2"
            />
            <text
              x="50"
              y="120"
              fill="#94a3b8"
              font-size="10"
              font-family="JetBrains Mono"
            >
              PCB Cross-Section
            </text>

            <!-- Top copper -->
            <rect
              x="40"
              y="100"
              width="320"
              height="8"
              fill="#f59e0b"
              opacity="0.6"
            />
            <!-- Bottom copper -->
            <rect
              x="40"
              y="192"
              width="320"
              height="8"
              fill="#f59e0b"
              opacity="0.6"
            />

            <!-- Via hole -->
            <rect
              :x="200 - (viaResult ? viaResult.od_mm * 5 : 20)"
              y="80"
              :width="viaResult ? viaResult.od_mm * 10 : 40"
              height="140"
              fill="#1e293b"
              stroke="#f59e0b"
              stroke-width="2"
            />

            <!-- Plating -->
            <rect
              :x="200 - (viaResult ? viaResult.id_mm * 5 : 15)"
              y="85"
              :width="viaResult ? viaResult.id_mm * 10 : 30"
              height="130"
              fill="#0f172a"
            />

            <!-- Pad -->
            <rect
              :x="200 - (viaResult ? viaResult.od_mm * 8 : 30)"
              y="90"
              :width="viaResult ? viaResult.od_mm * 16 : 60"
              height="10"
              fill="#f59e0b"
              opacity="0.8"
            />
            <rect
              :x="200 - (viaResult ? viaResult.od_mm * 8 : 30)"
              y="180"
              :width="viaResult ? viaResult.od_mm * 16 : 60"
              height="10"
              fill="#f59e0b"
              opacity="0.8"
            />

            <!-- Labels -->
            <text
              x="220"
              y="80"
              fill="#22d3ee"
              font-size="10"
              font-family="JetBrains Mono"
            >
              OD: {{ viaResult ? viaResult.od_mm.toFixed(2) + " mm" : "—" }}
            </text>
            <text
              x="220"
              y="200"
              fill="#10b981"
              font-size="10"
              font-family="JetBrains Mono"
            >
              ID: {{ viaResult ? viaResult.id_mm.toFixed(2) + " mm" : "—" }}
            </text>

            <!-- Animated current -->
            <circle r="3" fill="#22d3ee">
              <animate
                attributeName="cy"
                from="80"
                to="220"
                dur="1.5s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="cx"
                values="200;200"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </div>

        <div
          class="text-xs font-mono text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800"
        >
          <p class="text-cyan-400 font-bold mb-1">Via គណនាតាម IPC-2221:</p>
          <p>Area = π × D_avg × Plating Thickness</p>
          <p class="text-slate-500 mt-1">Plating: 25 µm (1 mil) ជាធម្មតា</p>
        </div>
      </div>
    </div>

    <!-- ===== MODE 5: Hole Size ===== -->
    <div v-if="mode === 'hole'" class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div class="lg:col-span-5 glass-card rounded-2xl p-5 sm:p-6 space-y-4">
        <div class="border-b border-slate-800 pb-3">
          <h2 class="text-lg font-bold text-white flex items-center gap-2">
            <LucideCircle class="w-4 h-4 text-cyan-400" />
            Hole & Pad Size Calculator
          </h2>
          <p class="text-xs text-slate-400">
            គណនា Hole និង Pad ពី Lead Diameter
          </p>
        </div>

        <div class="space-y-3">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              Lead Diameter (mm):
            </label>
            <input
              v-model.number="hole.leadDiameter"
              type="number"
              step="0.1"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              Plating Thickness (mm):
            </label>
            <input
              v-model.number="hole.plating"
              type="number"
              step="0.005"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
            <p class="text-[10px] text-slate-500 mt-1">
              ធម្មតា: 0.025 mm (25 µm)
            </p>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              Tolerance (mm):
            </label>
            <input
              v-model.number="hole.tolerance"
              type="number"
              step="0.05"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
            <p class="text-[10px] text-slate-500 mt-1">
              ធម្មតា: 0.1 mm (drill tolerance)
            </p>
          </div>
        </div>

        <div
          v-if="holeResult"
          class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2"
        >
          <div>
            <span class="text-xs text-slate-400 font-mono block">
              Hole Diameter
            </span>
            <div class="text-2xl font-bold font-mono text-cyan-400 mt-1">
              {{ holeResult.holeFormatted }}
            </div>
          </div>
          <div class="border-t border-slate-800 pt-2">
            <span class="text-xs text-slate-400 font-mono block">
              Pad Diameter (recommended)
            </span>
            <div class="text-2xl font-bold font-mono text-emerald-400 mt-1">
              {{ holeResult.padFormatted }}
            </div>
          </div>
          <div class="border-t border-slate-800 pt-2 text-xs font-mono">
            <div class="flex justify-between">
              <span class="text-slate-400">Annular Ring:</span>
              <span class="text-amber-400 font-bold">
                {{ holeResult.annularRingFormatted }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Annular Ring Calculator -->
      <div class="lg:col-span-7 glass-card rounded-2xl p-5 sm:p-6 space-y-4">
        <h3
          class="text-base font-bold text-white border-b border-slate-800 pb-3"
        >
          <LucideCircleDashed class="w-4 h-4 text-amber-400 mr-2 inline" />
          Annular Ring Checker
        </h3>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              Pad Diameter (mm):
            </label>
            <input
              v-model.number="ring.padDiameter"
              type="number"
              step="0.1"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              Hole Diameter (mm):
            </label>
            <input
              v-model.number="ring.holeDiameter"
              type="number"
              step="0.1"
              class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div
          v-if="ringResult"
          class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2"
        >
          <div>
            <span class="text-xs text-slate-400 font-mono block">
              Annular Ring
            </span>
            <div class="text-2xl font-bold font-mono text-cyan-400 mt-1">
              {{ ringResult.ringFormatted }}
            </div>
          </div>
          <div class="border-t border-slate-800 pt-2 text-xs font-mono">
            <div class="flex justify-between">
              <span class="text-slate-400">IPC Class:</span>
              <span
                :class="{
                  'text-emerald-400': ringResult.ipcClass === 'Class 3',
                  'text-amber-400': ringResult.ipcClass === 'Class 2',
                  'text-red-400': ringResult.ipcClass.includes('មិន'),
                }"
                class="font-bold"
              >
                {{ ringResult.ipcClass }}
              </span>
            </div>
          </div>
        </div>

        <!-- Visualization -->
        <div class="bg-slate-950 border border-slate-800 rounded-2xl p-6">
          <svg viewBox="0 0 300 200" class="w-full max-w-xs mx-auto">
            <!-- Pad -->
            <circle
              cx="150"
              cy="100"
              :r="padRadiusPx"
              fill="#f59e0b"
              opacity="0.4"
            />
            <!-- Hole -->
            <circle
              cx="150"
              cy="100"
              :r="holeRadiusPx"
              fill="#0f172a"
              stroke="#22d3ee"
              stroke-width="2"
            />
            <!-- Ring indicator -->
            <circle
              cx="150"
              cy="100"
              :r="ringRadiusPx"
              fill="none"
              stroke="#10b981"
              stroke-width="1"
              stroke-dasharray="3,3"
            />
            <!-- Labels -->
            <text
              x="155"
              y="30"
              fill="#f59e0b"
              font-size="10"
              font-family="JetBrains Mono"
            >
              Pad
            </text>
            <text
              x="155"
              y="180"
              fill="#22d3ee"
              font-size="10"
              font-family="JetBrains Mono"
            >
              Hole
            </text>
            <text
              x="155"
              y="195"
              fill="#10b981"
              font-size="10"
              font-family="JetBrains Mono"
            >
              Ring
            </text>
          </svg>
        </div>

        <div
          class="text-xs font-mono text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800"
        >
          <p class="text-cyan-400 font-bold mb-1">IPC Standards:</p>
          <p>• Class 1: ≥ 0.05 mm (2 mils)</p>
          <p>• Class 2: ≥ 0.05 mm (2 mils)</p>
          <p>• Class 3: ≥ 0.10 mm (4 mils)</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePcbTraceCalc } from "~/composables/core/usePcbTraceCalc";

const historyStore = useHistoryStore();
const {
  copperThicknesses,
  calculateWidth,
  calculateMaxCurrent,
  calculateVoltageDrop,
  calculateVia,
  calculateViaCount,
  calculateHoleFromLead,
  calculateAnnularRing,
} = usePcbTraceCalc();

type Mode = "width" | "current" | "drop" | "via" | "hole";
const mode = ref<Mode>("width");

const modes = [
  { value: "width", label: "Width", icon: "LucideRuler" },
  { value: "current", label: "Max Current", icon: "LucideZap" },
  { value: "drop", label: "Voltage Drop", icon: "LucideTrendingDown" },
  { value: "via", label: "Via Size", icon: "LucideCircleDot" },
  { value: "hole", label: "Hole Size", icon: "LucideCircle" },
] as const;

// ===== MODE 1: Width =====
const width = ref({
  current: 1,
  tempRise: 10,
  copperOz: 1,
  layer: "external" as "external" | "internal",
  length: 100,
});

const widthResult = computed(() =>
  calculateWidth(
    width.value.current,
    width.value.tempRise,
    width.value.copperOz,
    width.value.layer,
  ),
);

const dropResult = computed(() => {
  if (!widthResult.value) return null;
  return calculateVoltageDrop(
    widthResult.value.width_mm,
    width.value.copperOz,
    width.value.length,
    width.value.current,
  );
});

const traceWidthPx = computed(() => {
  if (!widthResult.value) return 2;
  // Scale: 0.1mm = 1px, min 3px, max 40px
  return Math.max(3, Math.min(40, widthResult.value.width_mm * 5));
});

// ===== MODE 2: Max Current =====
const maxCurrent = ref({
  width: 20,
  tempRise: 10,
  copperOz: 1,
  layer: "external" as "external" | "internal",
});

const maxCurrentResult = computed(() =>
  calculateMaxCurrent(
    maxCurrent.value.width,
    maxCurrent.value.tempRise,
    maxCurrent.value.copperOz,
    maxCurrent.value.layer,
  ),
);

// Reference table
const referenceTable = computed(() => {
  const widths = [5, 10, 15, 20, 30, 40, 50, 75, 100];
  return widths.map((w) => ({
    width: w,
    c05: (calculateMaxCurrent(w, 10, 0.5, "external")?.current_A ?? 0).toFixed(
      2,
    ),
    c1: (calculateMaxCurrent(w, 10, 1, "external")?.current_A ?? 0).toFixed(2),
    c2: (calculateMaxCurrent(w, 10, 2, "external")?.current_A ?? 0).toFixed(2),
  }));
});

// ===== MODE 3: Voltage Drop =====
const drop = ref({
  width: 0.5,
  copperOz: 1,
  length: 100,
  current: 1,
});

// ===== MODE 4: Via =====
const via = ref({
  current: 0.5,
  tempRise: 10,
  copperOz: 1,
  length: 1.6,
  totalCurrent: 1,
});

const viaResult = computed(() =>
  calculateVia(
    via.value.current,
    via.value.tempRise,
    via.value.copperOz,
    via.value.length,
  ),
);

const viaCountResult = computed(() => {
  if (!viaResult.value) return null;
  return calculateViaCount(via.value.totalCurrent, via.value.current);
});

// ===== MODE 5: Hole =====
const hole = ref({
  leadDiameter: 0.8,
  plating: 0.025,
  tolerance: 0.1,
});

const holeResult = computed(() =>
  calculateHoleFromLead(
    hole.value.leadDiameter,
    hole.value.plating,
    hole.value.tolerance,
  ),
);

const ring = ref({
  padDiameter: 1.8,
  holeDiameter: 0.8,
});

const ringResult = computed(() =>
  calculateAnnularRing(ring.value.padDiameter, ring.value.holeDiameter),
);

// SVG scaling (mm → px)
const padRadiusPx = computed(() => {
  if (!ring.value.padDiameter) return 50;
  return Math.min(90, ring.value.padDiameter * 30);
});

const holeRadiusPx = computed(() => {
  if (!ring.value.holeDiameter) return 20;
  return Math.min(60, ring.value.holeDiameter * 30);
});

const ringRadiusPx = computed(() => {
  return (padRadiusPx.value + holeRadiusPx.value) / 2;
});

const dropResultManual = computed(() =>
  calculateVoltageDrop(
    drop.value.width,
    drop.value.copperOz,
    drop.value.length,
    drop.value.current,
  ),
);

// ===== Actions =====
const saveToHistory = () => {
  if (!widthResult.value) return;
  historyStore.add({
    type: "transistor",
    title: `PCB Trace ${width.value.current}A`,
    value: `${widthResult.value.width_mil.toFixed(1)} mil / ${widthResult.value.width_mm.toFixed(2)} mm`,
    input: { ...width.value },
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
