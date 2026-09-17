<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
    <!-- Input -->
    <div class="lg:col-span-5 glass-card rounded-2xl p-5 sm:p-6 space-y-4">
      <div class="border-b border-slate-800 pb-3">
        <h2 class="text-lg font-bold text-white flex items-center gap-2">
          <LucideBarcode class="w-4 h-4 text-amber-400" />
          គណនាកូដ SMD Resistor
        </h2>
        <p class="text-xs text-slate-400">
          កូដ 3 ខ្ទង់, 4 ខ្ទង់, R Decimal, ឬ EIA-96
        </p>
      </div>

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
              class="text-3xl font-bold font-mono"
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
              :fill="
                favoritesStore.has('smd-resistor') ? 'currentColor' : 'none'
              "
            />
            {{ favoritesStore.has("smd-resistor") ? "ដកចេញ" : "ចូលចិត្ត" }}
          </button>
        </div>
      </div>
    </div>

    <!-- Info Panel -->
    <div class="lg:col-span-7 space-y-6">
      <div class="glass-card rounded-2xl p-5 sm:p-6 space-y-4">
        <h3
          class="text-base font-bold text-white border-b border-slate-800 pb-3"
        >
          <LucideBookOpen class="w-4 h-4 text-cyan-400 mr-2 inline" />
          ប្រភេទកូដ SMD
        </h3>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
          <div
            class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2"
          >
            <p class="text-cyan-400 font-bold">3-Digit Code</p>
            <p class="text-slate-400">
              ឧ. <span class="text-amber-400">103</span> = 10 x 10³ = 10 kΩ
            </p>
            <p class="text-slate-500 text-[10px]">2 ខ្ទង់ + មេគុណ</p>
          </div>

          <div
            class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2"
          >
            <p class="text-cyan-400 font-bold">4-Digit Code</p>
            <p class="text-slate-400">
              ឧ. <span class="text-amber-400">4702</span> = 470 x 10² = 47 kΩ
            </p>
            <p class="text-slate-500 text-[10px]">3 ខ្ទង់ + មេគុណ</p>
          </div>

          <div
            class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2"
          >
            <p class="text-cyan-400 font-bold">R Decimal</p>
            <p class="text-slate-400">
              ឧ. <span class="text-amber-400">2R2</span> = 2.2 Ω
            </p>
            <p class="text-slate-500 text-[10px]">R = ចំនុចទសភាគ</p>
          </div>

          <div
            class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2"
          >
            <p class="text-cyan-400 font-bold">EIA-96</p>
            <p class="text-slate-400">
              ឧ. <span class="text-amber-400">01C</span> = 100 x 100 = 10 kΩ
            </p>
            <p class="text-slate-500 text-[10px]">2 ខ្ទង់ + អក្សរ (1%)</p>
          </div>
        </div>
      </div>

      <!-- Common Values -->
      <div class="glass-card rounded-2xl p-5 sm:p-6 space-y-3">
        <h4 class="text-xs font-bold uppercase text-slate-400 tracking-wider">
          តម្លៃ SMD ដែលប្រើញឹកញាប់
        </h4>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
          <button
            v-for="item in commonSmd"
            :key="item.code"
            @click="smdInput = item.code"
            class="flex justify-between p-2 bg-slate-950 rounded-lg border border-slate-800 hover:border-cyan-500/30 transition-colors"
          >
            <span class="text-amber-400 font-bold">{{ item.code }}</span>
            <span class="text-slate-400 text-[10px]">{{ item.value }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useResistorCalc } from "~/composables/core/useResistorCalc";

// ===== Stores =====
const historyStore = useHistoryStore();
const favoritesStore = useFavoritesStore();

// ===== Composable =====
const { parseSmdCode } = useResistorCalc();

// ===== Local State =====
const smdInput = ref("103");

// ===== Data =====
const quickChips = ["103", "472", "104", "01C", "2R2", "R100", "0R0"];

const commonSmd = [
  { code: "100", value: "10 Ω" },
  { code: "101", value: "100 Ω" },
  { code: "102", value: "1 kΩ" },
  { code: "103", value: "10 kΩ" },
  { code: "104", value: "100 kΩ" },
  { code: "105", value: "1 MΩ" },
  { code: "220", value: "22 Ω" },
  { code: "221", value: "220 Ω" },
  { code: "222", value: "2.2 kΩ" },
  { code: "223", value: "22 kΩ" },
  { code: "470", value: "47 Ω" },
  { code: "471", value: "470 Ω" },
];

// ===== Computed =====
const smdResult = computed(() => parseSmdCode(smdInput.value));

// ===== Actions =====
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
