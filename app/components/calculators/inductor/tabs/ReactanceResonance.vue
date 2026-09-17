<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <!-- Reactance -->
    <div class="glass-card rounded-2xl p-5 sm:p-6 space-y-4">
      <h2 class="text-lg font-bold text-white flex items-center gap-2">
        <LucideAudioLines class="w-4 h-4 text-cyan-400" />
        គណនា Reactance (XL)
      </h2>
      <p class="text-xs text-slate-400">XL = 2πfL</p>

      <div class="space-y-3">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            Inductance L (µH):
          </label>
          <input
            v-model.number="reactance.inductance_uH"
            type="number"
            step="0.1"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            Frequency f (Hz):
          </label>
          <input
            v-model.number="reactance.frequency"
            type="number"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      <div class="bg-slate-950 p-4 rounded-xl border border-slate-800">
        <span class="text-xs text-slate-400 font-mono block"
          >Reactance (XL)</span
        >
        <Transition name="fade-slide" mode="out-in">
          <div
            :key="reactanceResult?.formatted || '0'"
            class="text-3xl font-bold font-mono text-cyan-400 mt-1"
          >
            {{ reactanceResult?.formatted || "0 Ω" }}
          </div>
        </Transition>
      </div>
    </div>

    <!-- Resonance -->
    <div class="glass-card rounded-2xl p-5 sm:p-6 space-y-4">
      <h2 class="text-lg font-bold text-white flex items-center gap-2">
        <LucideZap class="w-4 h-4 text-amber-400" />
        គណនា LC Resonance
      </h2>
      <p class="text-xs text-slate-400">f = 1 / (2π√(LC))</p>

      <div class="space-y-3">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            Inductance L (µH):
          </label>
          <input
            v-model.number="resonance.inductance_uH"
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
            v-model.number="resonance.capacitance_uF"
            type="number"
            step="0.001"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      <div class="bg-slate-950 p-4 rounded-xl border border-slate-800">
        <span class="text-xs text-slate-400 font-mono block">
          Resonant Frequency
        </span>
        <Transition name="fade-slide" mode="out-in">
          <div
            :key="resonanceResult?.formatted || '0'"
            class="text-3xl font-bold font-mono text-amber-400 mt-1"
          >
            {{ resonanceResult?.formatted || "0 Hz" }}
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useInductorCalc } from "~/composables/core/useInductorCalc";

// ===== Composable =====
const { calculateResonantFreq, calculateReactance } = useInductorCalc();

// ===== Reactance & Resonance =====
const reactance = ref({
  inductance_uH: 100,
  frequency: 1000,
});

const reactanceResult = computed(() =>
  calculateReactance(
    reactance.value.inductance_uH * 1e-6,
    reactance.value.frequency,
  ),
);

const resonance = ref({
  inductance_uH: 100,
  capacitance_uF: 0.1,
});

const resonanceResult = computed(() =>
  calculateResonantFreq(
    resonance.value.inductance_uH * 1e-6,
    resonance.value.capacitance_uF * 1e-6,
  ),
);
</script>
