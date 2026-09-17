<template>
  <div class="glass-card rounded-2xl p-5 sm:p-6 space-y-4">
    <!-- Header -->
    <div class="border-b border-slate-800 pb-3">
      <h2 class="text-lg font-bold text-white flex items-center gap-2">
        <LucideDatabase class="w-4 h-4 text-cyan-400" />
        ទិន្នន័យ Diode ទូទៅ (Diode Database)
      </h2>
      <p class="text-xs text-slate-400">
        ស្វែងរក និងពិនិត្យលក្ខណៈពិសេសរបស់ Diode ទូទៅ
      </p>
    </div>

    <!-- Filters (Search + Type Only) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <label class="block text-xs font-semibold text-slate-300 mb-1">
          ស្វែងរក (Search):
        </label>
        <div class="relative">
          <LucideSearch
            class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500"
          />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="e.g. 1N4007, SS34..."
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-white font-mono uppercase text-sm focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-300 mb-1">
          ប្រភេទ (Type):
        </label>
        <select
          v-model="filterType"
          class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
        >
          <option value="">ទាំងអស់ ({{ commonDiodes.length }})</option>
          <option v-for="t in diodeTypes" :key="t.value" :value="t.value">
            {{ t.label }} ({{ countByType(t.value) }})
          </option>
        </select>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto border border-slate-800 rounded-xl">
      <table class="w-full text-xs">
        <thead class="bg-slate-950 sticky top-0 z-10">
          <tr class="text-slate-400 font-mono">
            <th class="px-3 py-2 text-left">Part</th>
            <th class="px-3 py-2 text-left">Type</th>
            <th class="px-3 py-2 text-right">Vf (V)</th>
            <th class="px-3 py-2 text-right">Vr (V)</th>
            <th class="px-3 py-2 text-right">If (A)</th>
            <th class="px-3 py-2 text-right">Pd (W)</th>
            <th class="px-3 py-2 text-right">trr (ns)</th>
            <th class="px-3 py-2 text-right">Cj (pF)</th>
            <th class="px-3 py-2 text-left">Package</th>
            <th class="px-3 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-800">
          <tr
            v-for="d in pagination.paginatedItems.value"
            :key="d.partNumber"
            class="hover:bg-slate-800/40 transition-colors"
          >
            <td class="px-3 py-2 font-mono font-bold text-cyan-400">
              {{ d.partNumber }}
            </td>
            <td class="px-3 py-2 text-slate-300 text-[10px]">{{ d.typeKh }}</td>
            <td class="px-3 py-2 text-right font-mono text-amber-400">
              {{ d.vForward?.toFixed(2) ?? "—" }}
            </td>
            <td class="px-3 py-2 text-right font-mono text-emerald-400">
              {{ d.vReverse }}
            </td>
            <td class="px-3 py-2 text-right font-mono text-slate-300">
              {{ d.iForward_max }}
            </td>
            <td class="px-3 py-2 text-right font-mono text-purple-400">
              {{ d.powerMax ?? "—" }}
            </td>
            <td class="px-3 py-2 text-right font-mono text-slate-400">
              {{ d.recoveryTime || "—" }}
            </td>
            <td class="px-3 py-2 text-right font-mono text-slate-400">
              {{ d.capacitance || "—" }}
            </td>
            <td class="px-3 py-2 font-mono text-slate-500 text-[10px]">
              {{ d.package }}
            </td>
            <td class="px-3 py-2 text-center whitespace-nowrap">
              <button
                @click="selectedDiode = d"
                class="bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700/50 text-cyan-400 hover:text-cyan-300 px-2 py-1 rounded-lg font-mono text-[10px] transition-all flex items-center gap-1 mx-auto"
                title="មើល Datasheet"
              >
                <LucideFileText class="w-3 h-3" />
                Datasheet
              </button>
            </td>
          </tr>
          <tr v-if="filteredDiodes.length === 0">
            <td colspan="10" class="text-center py-8 text-slate-500 font-mono">
              <LucideFrown class="w-8 h-8 mx-auto mb-2 text-slate-700" />
              រកមិនឃើញទិន្នន័យដែលត្រូវគ្នា
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination (Dropdown ក្រោម + Page Numbers) -->
    <TablePagination
      :current-page="pagination.currentPage.value"
      :total-pages="pagination.totalPages.value"
      :start-index="pagination.startIndex.value"
      :end-index="pagination.endIndex.value"
      :total-items="filteredDiodes.length"
      :all-items="commonDiodes.length"
      :items-per-page="pagination.itemsPerPage.value"
      :visible-pages="pagination.visiblePages.value"
      @first="pagination.firstPage"
      @prev="pagination.prevPage"
      @next="pagination.nextPage"
      @last="pagination.lastPage"
      @go-to="pagination.goToPage"
      @update:items-per-page="pagination.itemsPerPage.value = $event"
    />

    <!-- Modal -->
    <UiDetailModal
      v-if="selectedDiode"
      :title="selectedDiode.partNumber"
      :subtitle="`${selectedDiode.typeKh} • ${selectedDiode.package}`"
      icon="LucideCpu"
      @close="selectedDiode = null"
    >
      <div class="grid grid-cols-2 gap-3">
        <UiSpecCard
          label="Forward Voltage (Vf)"
          :value="`${selectedDiode.vForward} V`"
          color="amber"
        />
        <UiSpecCard
          label="Reverse Voltage (Vr)"
          :value="`${selectedDiode.vReverse} V`"
          color="emerald"
        />
        <UiSpecCard
          label="Forward Current (If)"
          :value="`${selectedDiode.iForward_max} A`"
          color="white"
        />
        <UiSpecCard
          label="Power Rating (Pd)"
          :value="selectedDiode.powerMax ? `${selectedDiode.powerMax} W` : '—'"
          color="purple"
        />
        <UiSpecCard
          label="Reverse Recovery"
          :value="
            selectedDiode.recoveryTime
              ? `${selectedDiode.recoveryTime} ns`
              : '—'
          "
          color="slate"
        />
        <UiSpecCard
          label="Junction Capacitance"
          :value="
            selectedDiode.capacitance ? `${selectedDiode.capacitance} pF` : '—'
          "
          color="slate"
        />
      </div>

      <div
        v-if="selectedDiode.application"
        class="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs"
      >
        <span class="text-slate-400 block mb-1">
          ការប្រើប្រាស់ទូទៅ (Applications):
        </span>
        <p class="text-slate-300">{{ selectedDiode.application }}</p>
      </div>

      <template #footer>
        <div class="flex justify-end">
          <a
            :href="`https://www.alldatasheet.com/view.jsp?Searchword=${selectedDiode.partNumber}`"
            target="_blank"
            class="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-colors flex items-center gap-2"
          >
            <LucideExternalLink class="w-3.5 h-3.5" />
            ស្វែងរក PDF លើ Web
          </a>
        </div>
      </template>
    </UiDetailModal>
  </div>
</template>

<script setup lang="ts">
import TablePagination from "~/components/ui/TablePagination.vue";
import { useDiode } from "~/composables/core/useDiode";

// ===== Data =====
const { commonDiodes } = useDiode();

// ===== Filters =====
const searchQuery = ref("");
const filterType = ref("");

const diodeTypes = [
  { value: "rectifier", label: "Rectifier" },
  { value: "schottky", label: "Schottky" },
  { value: "zener", label: "Zener" },
  { value: "switching", label: "Switching" },
  { value: "fast", label: "Fast Recovery" },
  { value: "led", label: "LED" },
];

const countByType = (type: string) =>
  commonDiodes.filter((d) => d.type === type).length;

// ===== Filtered =====
const filteredDiodes = computed(() => {
  const q = searchQuery.value.toLowerCase().trim();
  const type = filterType.value;

  return commonDiodes.filter((d) => {
    const matchSearch =
      !q ||
      d.partNumber.toLowerCase().includes(q) ||
      d.typeKh.toLowerCase().includes(q);
    const matchType = !type || d.type === type;
    return matchSearch && matchType;
  });
});

// ===== Pagination =====
const pagination = useTablePagination(filteredDiodes, {
  itemsPerPage: 10,
  resetOn: () => [searchQuery.value, filterType.value],
});

// ===== Modal =====
const selectedDiode = ref<any>(null);
</script>
