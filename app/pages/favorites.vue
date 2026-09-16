<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="glass-card rounded-2xl p-5 sm:p-6">
      <div
        class="flex items-center justify-between border-b border-slate-800 pb-3"
      >
        <div>
          <h1 class="text-xl font-bold text-white flex items-center gap-2">
            <i class="fa-solid fa-star text-amber-400"></i>
            ចំណូលចិត្ត
          </h1>
          <p class="text-xs text-slate-400 mt-1">
            សរុប {{ favoritesStore.total }} ធាតុ
          </p>
        </div>
        <button
          v-if="favoritesStore.total > 0"
          @click="confirmClear"
          class="px-3 py-1.5 text-xs font-semibold rounded-xl bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-colors"
        >
          <i class="fa-solid fa-trash mr-1"></i> សម្អាតទាំងអស់
        </button>
      </div>

      <!-- Category Filter -->
      <div v-if="favoritesStore.total > 0" class="flex flex-wrap gap-2 mt-4">
        <button
          @click="filterCategory = ''"
          class="px-3 py-1.5 text-[11px] font-mono rounded-lg border transition-colors"
          :class="
            filterCategory === ''
              ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
              : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
          "
        >
          ទាំងអស់ ({{ favoritesStore.total }})
        </button>
        <button
          v-for="cat in availableCategories"
          :key="cat.category"
          @click="filterCategory = cat.category"
          class="px-3 py-1.5 text-[11px] font-mono rounded-lg border transition-colors"
          :class="
            filterCategory === cat.category
              ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
              : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
          "
        >
          {{ cat.category }} ({{ cat.count }})
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="favoritesStore.total === 0"
      class="glass-card rounded-2xl p-12 text-center"
    >
      <i class="fa-regular fa-star text-6xl text-slate-700 mb-4"></i>
      <h3 class="text-lg font-bold text-slate-300 mb-2">
        មិនទាន់មានចំណូលចិត្ត
      </h3>
      <p class="text-sm text-slate-500 mb-6">
        ចុច ⭐ លើ Part ដែលអ្នកចូលចិត្ត ដើម្បីរក្សាទុកនៅទីនេះ
      </p>
      <NuxtLink
        to="/transistor"
        class="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold rounded-xl hover:scale-105 transition-all"
      >
        <i class="fa-solid fa-microchip"></i>
        រក Part ដែលចូលចិត្ត
      </NuxtLink>
    </div>

    <!-- Favorites List -->
    <div v-else class="space-y-2">
      <TransitionGroup name="list" tag="div" class="space-y-2">
        <div
          v-for="fav in filteredFavorites"
          :key="fav.partNumber"
          class="glass-card rounded-xl p-4 flex items-center justify-between hover:border-amber-500/30 transition-colors group"
        >
          <div class="flex items-center gap-3">
            <i class="fa-solid fa-star text-amber-400 text-lg"></i>
            <div>
              <p class="font-bold text-cyan-400 font-mono">
                {{ fav.partNumber }}
              </p>
              <p class="text-[10px] text-slate-500 font-mono">
                {{ fav.category }} • {{ fav.type }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-[10px] text-slate-500 font-mono hidden sm:inline">
              {{ formatDate(fav.addedAt) }}
            </span>
            <button
              @click="favoritesStore.remove(fav.partNumber)"
              class="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
              title="ដកចេញ"
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
  title: "ចំណូលចិត្ត",
  icon: "fa-solid fa-star",
});

const favoritesStore = useFavoritesStore();
const filterCategory = ref("");

const availableCategories = computed(() => {
  const counts = new Map<string, number>();
  favoritesStore.items.forEach((item) => {
    counts.set(item.category, (counts.get(item.category) || 0) + 1);
  });
  return Array.from(counts.entries()).map(([category, count]) => ({
    category,
    count,
  }));
});

const filteredFavorites = computed(() => {
  if (!filterCategory.value) return favoritesStore.items;
  return favoritesStore.items.filter(
    (f) => f.category === filterCategory.value,
  );
});

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString("km-KH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const confirmClear = () => {
  if (confirm("តើអ្នកប្រាកដជាចង់សម្អាតចំណូលចិត្តទាំងអស់ទេ?")) {
    favoritesStore.clear();
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
