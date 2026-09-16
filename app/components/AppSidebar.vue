<template>
  <!-- Overlay -->
  <Transition name="fade">
    <div
      v-if="isOpen"
      @click="close"
      class="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 lg:hidden"
    />
  </Transition>

  <!-- Sidebar Panel -->
  <Transition name="slide">
    <aside
      v-if="isOpen"
      class="fixed top-0 left-0 h-full w-72 bg-slate-950/95 backdrop-blur-md border-r border-slate-800 z-50 lg:hidden overflow-y-auto"
    >
      <div class="p-4">
        <!-- Header -->
        <div
          class="flex items-center justify-between mb-6 pb-4 border-b border-slate-800"
        >
          <div class="flex items-center gap-2">
            <div
              class="p-2 bg-gradient-to-tr from-cyan-600 to-emerald-500 rounded-lg text-slate-950"
            >
              <LucideCpu />
            </div>
            <span class="font-bold text-white">ឧបករណ៍គណនា</span>
          </div>
          <button
            @click="close"
            class="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-all"
          >
            <LucideX />
          </button>
        </div>

        <!-- Navigation -->
        <nav class="space-y-1">
          <NuxtLink
            v-for="item in menuItems"
            :key="item.path"
            :to="item.path"
            @click="close"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200"
            :class="
              route.path === item.path
                ? 'bg-gradient-to-r from-cyan-500/20 to-cyan-600/20 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            "
          >
            <component :is="item.icon" class="w-5 text-center" />
            <span class="text-sm font-medium">{{ item.nameKh }}</span>
          </NuxtLink>
        </nav>

        <!-- Info Card -->
        <div
          class="mt-6 p-4 bg-slate-900/60 rounded-xl border border-slate-800"
        >
          <h4 class="text-xs font-bold text-cyan-400 mb-2">
            <LucideLightbulb class="w-4 h-4 mr-1" />គន្លឹះ
          </h4>
          <p class="text-[11px] text-slate-400 leading-relaxed">
            ចុចលើ Tab នៅផ្នែកខាងលើ ដើម្បីប្តូរម៉ាស៊ីនគណនា។
          </p>
        </div>
      </div>
    </aside>
  </Transition>
</template>

<script setup lang="ts">
const route = useRoute();
const isOpen = useState<boolean>("sidebar-open", () => false);

const close = () => {
  isOpen.value = false;
};

const menuItems = [
  { path: "/", nameKh: "ទំព័រដើម", icon: "LucideHome" },
  { path: "/resistor", nameKh: "រេស៊ីស្តង់", icon: "LucidePalette" },
  { path: "/capacitor", nameKh: "កាប៉ាស៊ីទ័រ", icon: "LucideBolt" },
  { path: "/inductor", nameKh: "អាំងឌុចទ័រ", icon: "LucideRotateCcw" },
  { path: "/diode", nameKh: "ឌីយ៉ូត", icon: "LucideArrowRight" },
  { path: "/transistor", nameKh: "Transistor", icon: "LucideCpu" },
  { path: "/mosfet", nameKh: "MOSFET", icon: "LucideBolt" },
  {
    path: "/optocoupler",
    nameKh: "Optocoupler",
    icon: "LucideShield",
  },
  { path: "/ohms-law", nameKh: "ច្បាប់អូម", icon: "LucideCalculator" },
  { path: "/led", nameKh: "LED", icon: "LucideLightbulb" },
  { path: "/divider", nameKh: "ចែកតង់ស្យុង", icon: "LucideSitemap" },
  { path: "/timer-555", nameKh: "IC 555", icon: "LucideClock" },
  {
    path: "/history",
    nameKh: "ប្រវត្តិ",
    icon: "LucideClock",
  },
  { path: "/favorites", nameKh: "ចំណូលចិត្ត", icon: "LucideStar" },
  { path: "/tools", nameKh: "ឧបករណ៍ផ្សេងៗ", icon: "LucideToolbox" },
  { path: "/about", nameKh: "អំពី", icon: "LucideInfo" },
];

// បិទ sidebar ពេលប្តូរ route
watch(
  () => route.path,
  () => {
    if (isOpen.value) isOpen.value = false;
  },
);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
