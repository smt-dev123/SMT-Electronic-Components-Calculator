<template>
  <div class="pt-3 border-t border-slate-800">
    <!-- Info Row -->
    <div
      class="flex items-center justify-between text-xs text-slate-400 font-mono"
    >
      <div>
        បង្ហាញ
        <span class="text-cyan-400 font-bold">{{ startIndex + 1 }}</span>
        -
        <span class="text-cyan-400 font-bold">{{ endIndex }}</span>
        នៃ
        <span class="text-slate-300 font-bold">{{ totalItems }}</span>
        ធាតុ (សរុប {{ allItems }})
      </div>

      <div class="flex gap-4">
        <!-- Items per page dropdown -->
        <div class="flex items-center gap-2">
          <span class="hidden sm:inline">បង្ហាញ:</span>
          <select
            :value="itemsPerPage"
            @change="
              $emit(
                'update:itemsPerPage',
                Number(($event.target as HTMLSelectElement).value),
              )
            "
            class="bg-slate-950 border border-slate-700/80 rounded-lg px-2 py-1 text-white font-mono text-[11px] focus:outline-none focus:border-cyan-500"
          >
            <option v-for="n in [5, 10, 20, 50]" :key="n" :value="n">
              {{ n }}
            </option>
          </select>
        </div>
        <!-- Pagination Controls -->
        <div
          v-if="totalPages > 1"
          class="flex items-center justify-center gap-1 flex-wrap"
        >
          <!-- First -->
          <PaginationButton
            :disabled="currentPage === 1"
            @click="$emit('first')"
            title="ទំព័រដំបូង"
          >
            <LucideChevronsLeft class="w-3.5 h-3.5" />
          </PaginationButton>
          <!-- Prev -->
          <PaginationButton
            :disabled="currentPage === 1"
            @click="$emit('prev')"
            title="មុន"
          >
            <LucideChevronLeft class="w-3.5 h-3.5" />
          </PaginationButton>
          <!-- Page Numbers -->
          <template v-for="(page, i) in visiblePages" :key="`page-${i}`">
            <span
              v-if="page === '...'"
              class="px-2 py-1 text-slate-500 font-mono select-none"
            >
              ...
            </span>
            <button
              v-else
              @click="$emit('goTo', page as number)"
              class="px-2.5 py-1 rounded-lg font-mono text-xs border transition-all"
              :class="
                currentPage === page
                  ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-slate-950 font-bold border-cyan-500 shadow-md shadow-cyan-500/20 scale-105'
                  : 'bg-slate-900 text-slate-400 border-slate-700 hover:bg-slate-800 hover:text-white'
              "
            >
              {{ page }}
            </button>
          </template>
          <!-- Next -->
          <PaginationButton
            :disabled="currentPage === totalPages"
            @click="$emit('next')"
            title="បន្ទាប់"
          >
            <LucideChevronRight class="w-3.5 h-3.5" />
          </PaginationButton>
          <!-- Last -->
          <PaginationButton
            :disabled="currentPage === totalPages"
            @click="$emit('last')"
            title="ទំព័រចុងក្រោយ"
          >
            <LucideChevronsRight class="w-3.5 h-3.5" />
          </PaginationButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  totalItems: number;
  allItems: number;
  itemsPerPage: number;
  visiblePages: (number | string)[];
}

defineProps<Props>();

defineEmits<{
  first: [];
  prev: [];
  next: [];
  last: [];
  goTo: [page: number];
  "update:itemsPerPage": [value: number];
}>();
</script>
