<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
    <div class="lg:col-span-5 glass-card rounded-2xl p-5 sm:p-6 space-y-4">
      <div>
        <h2 class="text-lg font-bold text-white flex items-center gap-2">
          <LucideRotateCw class="w-4 h-4 text-cyan-400" />
          គណនាតាមរូបមន្ត Wheeler
        </h2>
        <p class="text-xs text-slate-400">សម្រាប់ Air-core coil</p>
      </div>

      <div class="space-y-3">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            ចំនួនរង្វង់ (Turns - N):
          </label>
          <input
            v-model.number="solenoid.turns"
            type="number"
            min="1"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            អង្កត់ផ្ចិត (Diameter - mm):
          </label>
          <input
            v-model.number="solenoid.diameter"
            type="number"
            step="0.1"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            ប្រវែង (Length - mm):
          </label>
          <input
            v-model.number="solenoid.length"
            type="number"
            step="0.1"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            Permeability (μr):
          </label>
          <select
            v-model.number="solenoid.permeability"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          >
            <option :value="1">Air / ខ្យល់ (μr = 1)</option>
            <option :value="100">Ferrite Low (μr = 100)</option>
            <option :value="1000">Ferrite High (μr = 1000)</option>
            <option :value="5000">Iron Powder (μr = 5000)</option>
          </select>
        </div>
      </div>

      <div class="bg-slate-950 p-4 rounded-xl border border-slate-800">
        <span class="text-xs text-slate-400 font-mono block">
          តម្លៃអាំងឌុចទ័រ
        </span>
        <Transition name="fade-slide" mode="out-in">
          <div
            :key="solenoidResult?.formatted || '0'"
            class="text-3xl font-bold font-mono text-cyan-400 mt-1"
          >
            {{ solenoidResult?.formatted || "0 H" }}
          </div>
        </Transition>
      </div>
    </div>

    <div class="lg:col-span-7 glass-card rounded-2xl p-5 sm:p-6 space-y-4">
      <h3 class="text-base font-bold text-white border-b border-slate-800 pb-3">
        <LucideSquare class="w-4 h-4 text-amber-400 mr-2 inline" />
        រូបមន្ត Wheeler
      </h3>

      <div
        class="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-center space-y-3"
      >
        <p class="text-slate-300 font-mono text-base">
          L(µH) = (d² × N²) / (18d + 40l) × μr
        </p>
        <div class="text-xs text-slate-500 space-y-1 font-mono">
          <p>d = អង្កត់ផ្ចិត (inch)</p>
          <p>l = ប្រវែង (inch)</p>
          <p>N = ចំនួនរង្វង់</p>
          <p>μr = Permeability</p>
        </div>
      </div>

      <!-- Visual Coil -->
      <div class="bg-slate-950 border border-slate-800 rounded-2xl p-4">
        <svg viewBox="0 0 300 100" class="w-full">
          <g stroke="#cbd5e1" stroke-width="2.5" fill="none">
            <ellipse cx="50" cy="50" rx="8" ry="22" />
            <ellipse cx="75" cy="50" rx="8" ry="22" />
            <ellipse cx="100" cy="50" rx="8" ry="22" />
            <ellipse cx="125" cy="50" rx="8" ry="22" />
            <ellipse cx="150" cy="50" rx="8" ry="22" />
            <ellipse cx="175" cy="50" rx="8" ry="22" />
            <ellipse cx="200" cy="50" rx="8" ry="22" />
            <ellipse cx="225" cy="50" rx="8" ry="22" />
            <ellipse cx="250" cy="50" rx="8" ry="22" />
          </g>
          <line
            x1="0"
            y1="50"
            x2="42"
            y2="50"
            stroke="#64748b"
            stroke-width="3"
          />
          <line
            x1="258"
            y1="50"
            x2="300"
            y2="50"
            stroke="#64748b"
            stroke-width="3"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useInductorCalc } from "~/composables/core/useInductorCalc";

// ===== Composable =====
const { calculateSolenoid } = useInductorCalc();

// ===== Solenoid =====
const solenoid = ref({
  turns: 20,
  diameter: 10,
  length: 20,
  permeability: 1,
});

const solenoidResult = computed(() =>
  calculateSolenoid(
    solenoid.value.turns,
    solenoid.value.diameter,
    solenoid.value.length,
    solenoid.value.permeability,
  ),
);
</script>
