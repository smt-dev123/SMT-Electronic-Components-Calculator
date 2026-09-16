<template>
  <div class="glass-card rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
    <!-- Header -->
    <div
      class="border-b border-slate-800 pb-3 flex justify-between items-center"
    >
      <div>
        <h3 class="text-base font-bold text-white flex items-center gap-2">
          <LucideBarcode class="w-4 h-4 text-amber-400" />
          គណនាកូដ SMD Resistor
        </h3>
        <p class="text-xs text-slate-400">
          កូដ 3 ខ្ទង់, 4 ខ្ទង់, R Decimal, ឬ EIA-96
        </p>
      </div>
      <span
        class="px-2 py-1 text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-lg"
      >
        SMD Code
      </span>
    </div>

    <!-- Input -->
    <div class="space-y-3">
      <div>
        <label class="block text-xs font-semibold text-slate-300 mb-1.5">
          បញ្ចូលកូដ SMD (ឧ. 103, 4702, 01C, 2R2):
        </label>
        <div class="relative">
          <input
            v-model="smdInput"
            type="text"
            placeholder="e.g. 103"
            maxlength="10"
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-white font-mono uppercase tracking-wider focus:outline-none focus:border-cyan-500 transition-colors"
          />
          <button
            v-if="smdInput"
            @click="smdInput = ''"
            class="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-500 hover:text-slate-300 rounded-lg transition-colors"
          >
            <LucideX class="w-3 h-3" />
          </button>
        </div>
      </div>

      <!-- Quick Chips -->
      <div class="flex flex-wrap gap-1.5">
        <button
          v-for="chip in quickChips"
          :key="chip"
          @click="smdInput = chip"
          class="px-2 py-1 text-[10px] font-mono rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-colors"
        >
          {{ chip }}
        </button>
      </div>

      <!-- Result -->
      <Transition name="fade-slide" mode="out-in">
        <div
          :key="smdResult.value"
          class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1"
        >
          <div class="text-[11px] text-slate-400 font-mono">
            តម្លៃ SMD Resistor:
          </div>
          <div
            class="text-2xl font-bold font-mono"
            :class="
              smdResult.value === 'កូដមិនត្រឹមត្រូវ'
                ? 'text-red-400'
                : 'text-amber-400'
            "
          >
            {{ smdResult.value }}
          </div>
          <div class="text-xs text-slate-400 font-mono">
            {{ smdResult.details }}
          </div>
        </div>
      </Transition>

      <!-- Actions -->
      <div class="flex items-center gap-2 pt-2 border-t border-slate-800">
        <button
          @click="saveToHistory"
          :disabled="smdResult.value === 'កូដមិនត្រឹមត្រូវ'"
          class="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <LucideSave class="w-3.5 h-3.5" />
          រក្សាទុក
        </button>
        <button
          @click="toggleFavorite"
          class="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl border transition-colors"
          :class="
            favoritesStore.has('smd-resistor')
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
          "
        >
          <LucideStar
            class="w-3.5 h-3.5"
            :fill="favoritesStore.has('smd-resistor') ? 'currentColor' : 'none'"
          />
          {{ favoritesStore.has("smd-resistor") ? "ដកចេញ" : "ចូលចិត្ត" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useResistorCalc } from "~/composables/core/useResistorCalc";

const historyStore = useHistoryStore();
const favoritesStore = useFavoritesStore();

const { parseSmdCode } = useResistorCalc();

const smdInput = ref("103");

const quickChips = ["103", "472", "104", "01C", "2R2", "R100", "0R0"];

const smdResult = computed(() => parseSmdCode(smdInput.value));

const saveToHistory = () => {
  if (smdResult.value.value === "កូដមិនត្រឹមត្រូវ") return;
  historyStore.add({
    type: "resistor",
    title: `SMD Code: ${smdInput.value}`,
    value: smdResult.value.value,
    input: { code: smdInput.value },
  });
};

const toggleFavorite = () => {
  favoritesStore.toggle("smd-resistor", "SMD", "transistor");
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
