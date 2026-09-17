<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="glass-card rounded-2xl p-5 sm:p-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-lg font-bold text-white flex items-center gap-2">
            <LucideBookOpen class="w-4 h-4 text-cyan-400" />
            តារាងកូដពណ៌ពេញលេញ
          </h2>
          <p class="text-xs text-slate-400 mt-1">
            ព័ត៌មានលម្អិតអំពីកូដពណ៌រេស៊ីស្តង់ទាំងអស់
          </p>
        </div>

        <!-- Search -->
        <div class="relative hidden sm:block">
          <LucideSearch
            class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500"
          />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="ស្វែងរក..."
            class="bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white font-mono w-40 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>
    </div>

    <!-- Color Table -->
    <div class="glass-card rounded-2xl p-5 sm:p-6 space-y-4">
      <div class="overflow-x-auto border border-slate-800 rounded-xl">
        <table class="w-full text-xs">
          <thead class="bg-slate-950 sticky top-0">
            <tr class="text-slate-400 font-mono">
              <th class="px-3 py-3 text-left">ពណ៌</th>
              <th class="px-3 py-3 text-center">Digit</th>
              <th class="px-3 py-3 text-center">Multiplier</th>
              <th class="px-3 py-3 text-center">Tolerance</th>
              <th class="px-3 py-3 text-center">PPM/K</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800">
            <tr
              v-for="c in filteredColors"
              :key="c.nameEn"
              class="hover:bg-slate-800/40 transition-colors"
            >
              <td class="px-3 py-2">
                <span class="flex items-center gap-2">
                  <span
                    class="w-4 h-4 rounded-full border border-slate-600 transition-transform hover:scale-125 shrink-0"
                    :style="{ backgroundColor: c.hex }"
                  ></span>
                  <span class="text-slate-200">{{ c.nameKh }}</span>
                  <span class="text-slate-500 text-[10px]"
                    >({{ c.nameEn }})</span
                  >
                </span>
              </td>
              <td class="px-3 py-2 text-center font-mono text-slate-300">
                {{ c.val !== null ? c.val : "—" }}
              </td>
              <td class="px-3 py-2 text-center font-mono text-cyan-400">
                {{ c.multStr }}
              </td>
              <td class="px-3 py-2 text-center font-mono text-amber-400">
                {{ c.tol !== null ? `±${c.tol}%` : "—" }}
              </td>
              <td class="px-3 py-2 text-center font-mono text-emerald-400">
                {{ c.ppm !== null ? c.ppm : "—" }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="text-[10px] text-slate-500 font-mono">
        បង្ហាញ {{ filteredColors.length }} / {{ colorMasterList.length }}
      </p>
    </div>

    <!-- Examples -->
    <div class="glass-card rounded-2xl p-5 sm:p-6 space-y-4">
      <h3 class="text-base font-bold text-white border-b border-slate-800 pb-3">
        <LucideLightbulb class="w-4 h-4 text-amber-400 mr-2 inline" />
        ឧទាហរណ៍ការអាន
      </h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="example in examples"
          :key="example.title"
          class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3"
        >
          <div class="flex items-center justify-between">
            <h4 class="text-sm font-bold text-white">{{ example.title }}</h4>
            <span
              class="text-[10px] font-mono px-2 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-lg"
            >
              {{ example.bands }} Bands
            </span>
          </div>

          <!-- Color Bands Visual -->
          <div class="flex items-center gap-2">
            <span class="text-xs text-slate-500 font-mono">ពណ៌:</span>
            <div class="flex gap-1.5">
              <span
                v-for="(color, i) in example.colors"
                :key="i"
                class="w-6 h-6 rounded-full border border-slate-600"
                :style="{ backgroundColor: color }"
              ></span>
            </div>
          </div>

          <!-- Result -->
          <div
            class="border-t border-slate-800 pt-2 space-y-1 text-xs font-mono"
          >
            <div class="flex justify-between">
              <span class="text-slate-400">តម្លៃ:</span>
              <span class="text-cyan-400 font-bold">{{ example.value }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Tolerance:</span>
              <span class="text-amber-400">±{{ example.tolerance }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { colorMasterList } from "~/composables/core/useResistorCalc";

// ===== Search =====
const searchQuery = ref("");

const filteredColors = computed(() => {
  const q = searchQuery.value.toLowerCase().trim();
  if (!q) return colorMasterList;
  return colorMasterList.filter(
    (c) =>
      c.nameKh.toLowerCase().includes(q) || c.nameEn.toLowerCase().includes(q),
  );
});

// ===== Examples =====
const examples = [
  {
    title: "1 kΩ ±5%",
    bands: 4,
    colors: ["#854d0e", "#111827", "#dc2626", "#d97706"],
    value: "1 kΩ",
    tolerance: 5,
  },
  {
    title: "10 kΩ ±1%",
    bands: 5,
    colors: ["#854d0e", "#111827", "#111827", "#dc2626", "#854d0e"],
    value: "10 kΩ",
    tolerance: 1,
  },
  {
    title: "220 Ω ±2%",
    bands: 4,
    colors: ["#dc2626", "#dc2626", "#854d0e", "#dc2626"],
    value: "220 Ω",
    tolerance: 2,
  },
  {
    title: "4.7 kΩ ±1% + PPM",
    bands: 6,
    colors: ["#eab308", "#9333ea", "#dc2626", "#854d0e", "#854d0e", "#dc2626"],
    value: "4.7 kΩ",
    tolerance: 1,
  },
];
</script>
