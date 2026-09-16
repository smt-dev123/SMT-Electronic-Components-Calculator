<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="glass-card rounded-2xl p-5 sm:p-6">
      <div
        class="flex items-center justify-between border-b border-slate-800 pb-3"
      >
        <div>
          <h1 class="text-xl font-bold text-white flex items-center gap-2">
            <i class="fa-solid fa-clock-rotate-left text-cyan-400"></i>
            ប្រវត្តិគណនា
          </h1>
          <p class="text-xs text-slate-400 mt-1">
            សរុប {{ historyStore.total }} កំណត់ត្រា
          </p>
        </div>
        <button
          v-if="!historyStore.isEmpty"
          @click="confirmClear"
          class="px-3 py-1.5 text-xs font-semibold rounded-xl bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-colors"
        >
          <i class="fa-solid fa-trash mr-1"></i> សម្អាតទាំងអស់
        </button>
      </div>

      <!-- Filter Chips -->
      <div v-if="!historyStore.isEmpty" class="flex flex-wrap gap-2 mt-4">
        <button
          @click="filterType = ''"
          class="px-3 py-1.5 text-[11px] font-mono rounded-lg border transition-colors"
          :class="
            filterType === ''
              ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
              : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
          "
        >
          ទាំងអស់ ({{ historyStore.total }})
        </button>
        <button
          v-for="t in availableTypes"
          :key="t.type"
          @click="filterType = t.type"
          class="px-3 py-1.5 text-[11px] font-mono rounded-lg border transition-colors"
          :class="
            filterType === t.type
              ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
              : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
          "
        >
          {{ t.type }} ({{ t.count }})
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="historyStore.isEmpty"
      class="glass-card rounded-2xl p-12 text-center"
    >
      <i class="fa-solid fa-inbox text-6xl text-slate-700 mb-4"></i>
      <h3 class="text-lg font-bold text-slate-300 mb-2">
        មិនទាន់មានប្រវត្តិគណនា
      </h3>
      <p class="text-sm text-slate-500 mb-6">
        ចាប់ផ្ដើមគណនាដើម្បីឃើញប្រវត្តិនៅទីនេះ
      </p>
      <NuxtLink
        to="/"
        class="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-cyan-600 text-slate-950 font-bold rounded-xl hover:scale-105 transition-all"
      >
        <i class="fa-solid fa-plus"></i>
        ចាប់ផ្ដើមគណនា
      </NuxtLink>
    </div>

    <!-- Records List -->
    <div v-else class="space-y-2">
      <TransitionGroup name="list" tag="div" class="space-y-2">
        <div
          v-for="record in filteredRecords"
          :key="record.id"
          class="glass-card rounded-xl p-4 flex items-center justify-between hover:border-cyan-500/30 transition-colors group"
        >
          <div class="flex items-center gap-3 min-w-0 flex-1">
            <span
              class="flex-shrink-0 px-2 py-1 rounded-lg text-[10px] font-bold font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
            >
              {{ record.type }}
            </span>
            <div class="min-w-0 flex-1">
              <p class="text-sm text-slate-200 truncate">{{ record.title }}</p>
              <p class="text-[10px] text-slate-500 font-mono">
                {{ formatDate(record.timestamp) }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-3 flex-shrink-0">
            <span class="font-mono font-bold text-cyan-400 text-sm">
              {{ record.value }}
            </span>
            <button
              @click="historyStore.remove(record.id)"
              class="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
              title="លុប"
            >
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "calculator",
  title: "ប្រវត្តិគណនា",
  icon: "fa-solid fa-clock-rotate-left",
});

const historyStore = useHistoryStore();
const filterType = ref("");

const availableTypes = computed(() => {
  const counts = new Map<string, number>();
  historyStore.items.forEach((item) => {
    counts.set(item.type, (counts.get(item.type) || 0) + 1);
  });
  return Array.from(counts.entries()).map(([type, count]) => ({ type, count }));
});

const filteredRecords = computed(() => {
  if (!filterType.value) return historyStore.items;
  return historyStore.items.filter((r) => r.type === filterType.value);
});

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleString("km-KH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const confirmClear = () => {
  if (confirm("តើអ្នកប្រាកដជាចង់សម្អាតប្រវត្តិទាំងអស់ទេ?")) {
    historyStore.clear();
  }
};
</script>

<style scoped>
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
