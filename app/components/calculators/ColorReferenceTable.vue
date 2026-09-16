<template>
  <div class="glass-card rounded-2xl p-5 sm:p-6 shadow-xl space-y-3">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h4
        class="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-2"
      >
        <LucideBookOpen class="w-3.5 h-3.5 text-cyan-400" />
        តារាងសង្ខេបកូដពណ៌
      </h4>
      <button
        @click="expanded = !expanded"
        class="text-[10px] text-cyan-400 hover:text-cyan-300 font-mono transition-colors"
      >
        {{ expanded ? "បង្រួម" : "ពង្រីក" }}
      </button>
    </div>

    <!-- Table -->
    <div
      class="overflow-y-auto border border-slate-800 rounded-xl divide-y divide-slate-800 text-xs transition-all duration-300"
      :class="expanded ? 'max-h-[500px]' : 'max-h-52'"
    >
      <div
        class="grid grid-cols-3 px-3 py-2 bg-slate-950 font-bold text-slate-400 sticky top-0 z-10"
      >
        <span>ពណ៌ (Color)</span>
        <span>លេខ (Digit)</span>
        <span>មេគុណ (Multiplier)</span>
      </div>

      <div
        v-for="c in colorMasterList"
        :key="c.nameEn"
        class="grid grid-cols-3 px-3 py-1.5 items-center hover:bg-slate-800/40 transition-colors group cursor-default"
      >
        <span class="flex items-center gap-2">
          <span
            class="w-3 h-3 rounded-full border border-slate-600 inline-block transition-transform group-hover:scale-125"
            :style="{ backgroundColor: c.hex }"
          ></span>
          <span class="text-slate-200">{{ c.nameKh }}</span>
        </span>
        <span class="font-mono text-slate-300">
          {{ c.val !== null ? c.val : "-" }}
        </span>
        <span class="font-mono text-cyan-400">
          {{ c.multStr }}
        </span>
      </div>
    </div>

    <!-- Legend -->
    <div class="pt-2 text-[10px] text-slate-500 font-mono space-y-0.5">
      <p>• ចំនួនកង់ស្តង់ដារ៖ 4, 5, 6</p>
      <p>• កង់ចុងក្រោយ = កម្រិតលំអៀង (Tolerance)</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { colorMasterList } from "~/composables/core/useResistorCalc";

const expanded = ref(false);
</script>
