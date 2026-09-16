<template>
  <header
    class="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 transition-colors"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- ===== Top Row: Logo + Actions ===== -->
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center space-x-3 group">
          <div
            class="p-2.5 bg-gradient-to-tr from-cyan-600 to-emerald-500 rounded-xl text-slate-950 shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform duration-300"
          >
            <LucideCpu class="text-xl" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h1
                class="font-bold text-lg sm:text-xl text-white tracking-tight"
              >
                ឧបករណ៍គណនាអេឡិចត្រូនិក
              </h1>
              <span
                class="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full font-semibold"
              >
                Nuxt 4
              </span>
            </div>
            <p class="text-[11px] text-slate-400">
              Electronics Component Calculator Suite Pro
            </p>
          </div>
        </NuxtLink>

        <!-- Actions -->
        <div class="flex items-center space-x-2 sm:space-x-3">
          <!-- Mobile Menu Toggle -->
          <button
            @click="toggleSidebar"
            class="lg:hidden p-2.5 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition-all"
          >
            <LucideMenu />
          </button>

          <!-- Theme Toggle -->
          <button
            class="p-2.5 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition-all"
            :title="isDark ? 'Light Mode' : 'Dark Mode'"
          >
            <LucideSun v-if="isDark" class="text-amber-400" />
            <LucideMoon v-else class="text-cyan-400" />
          </button>

          <!-- Favorites Link -->
          <NuxtLink
            to="/favorites"
            class="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-semibold transition-all"
          >
            <LucideStar /> ចំណូលចិត្ត
          </NuxtLink>

          <!-- History Link -->
          <NuxtLink
            to="/history"
            class="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-xl text-xs font-semibold transition-all"
          >
            <LucideClock /> ប្រវត្តិ
          </NuxtLink>
        </div>
      </div>

      <!-- ===== Navigation Tabs with Scroll ===== -->
      <div class="relative border-t border-slate-800/50">
        <!-- Left Arrow -->
        <Transition name="fade">
          <button
            v-show="canScrollLeft"
            @click="scrollLeft"
            class="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-slate-950/95 backdrop-blur-sm border border-slate-800 rounded-full text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all shadow-lg -ml-1"
            aria-label="Scroll left"
          >
            <LucideChevronLeft class="text-xs" />
          </button>
        </Transition>

        <!-- Right Arrow -->
        <Transition name="fade">
          <button
            v-show="canScrollRight"
            @click="scrollRight"
            class="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-slate-950/95 backdrop-blur-sm border border-slate-800 rounded-full text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all shadow-lg -mr-1"
            aria-label="Scroll right"
          >
            <LucideChevronRight class="text-xs" />
          </button>
        </Transition>

        <!-- Left Fade Gradient -->
        <Transition name="fade">
          <div
            v-show="canScrollLeft"
            class="absolute left-0 top-0 bottom-0 w-12 z-[5] bg-gradient-to-r from-slate-950/90 to-transparent pointer-events-none"
          />
        </Transition>

        <!-- Right Fade Gradient -->
        <Transition name="fade">
          <div
            v-show="canScrollRight"
            class="absolute right-0 top-0 bottom-0 w-12 z-[5] bg-gradient-to-l from-slate-950/90 to-transparent pointer-events-none"
          />
        </Transition>

        <!-- Scrollable Tabs Container -->
        <nav
          ref="tabsContainer"
          class="flex items-center gap-1 overflow-x-auto py-2 px-6 scroll-smooth scrollbar-hide"
          @scroll="updateScrollState"
        >
          <NuxtLink
            v-for="tab in tabs"
            :key="tab.path"
            :to="tab.path"
            class="flex-shrink-0 px-3.5 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all duration-200 text-xs font-semibold"
            :class="
              isActive(tab.path)
                ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            "
          >
            <!-- <component :is="tab.icon" class="text-sm" /> -->
            <span>{{ tab.nameKh }}</span>
            <span class="text-[10px] opacity-75 font-mono hidden sm:inline">
              ({{ tab.nameEn }})
            </span>
          </NuxtLink>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const isDark = useState<boolean>("isDark", () => false);
const route = useRoute();

// ===== Sidebar State =====
const isSidebarOpen = useState<boolean>("sidebar-open", () => false);
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

// ===== Tabs Data =====
const tabs = [
  {
    path: "/resistor",
    nameKh: "រេស៊ីស្តង់",
    nameEn: "Resistor",
    icon: "LucidePalette",
  },
  {
    path: "/capacitor",
    nameKh: "កាប៉ាស៊ីទ័រ",
    nameEn: "Capacitor",
    icon: "LucideBolt",
  },
  {
    path: "/inductor",
    nameKh: "អាំងឌុចទ័រ",
    nameEn: "Inductor",
    icon: "LucideRotateCcw",
  },
  {
    path: "/diode",
    nameKh: "ឌីយ៉ូត",
    nameEn: "Diode",
    icon: "LucideArrowRight",
  },
  {
    path: "/transistor",
    nameKh: "Transistor",
    nameEn: "BJT",
    icon: "LucideCpu",
  },
  {
    path: "/mosfet",
    nameKh: "MOSFET",
    nameEn: "FET",
    icon: "LucideBolt",
  },
  {
    path: "/optocoupler",
    nameKh: "Optocoupler",
    nameEn: "Opto",
    icon: "LucideShield",
  },
  {
    path: "/ohms-law",
    nameKh: "ច្បាប់អូម",
    nameEn: "Ohm's Law",
    icon: "LucideCalculator",
  },
  {
    path: "/led",
    nameKh: "LED",
    nameEn: "LED",
    icon: "LucideLightbulb",
  },
  {
    path: "/divider",
    nameKh: "ចែកតង់ស្យុង",
    nameEn: "Divider",
    icon: "LucideSitemap",
  },
  {
    path: "/timer-555",
    nameKh: "IC 555",
    nameEn: "Timer",
    icon: "LucideClock",
  },
];

const isActive = (path: string) => route.path === path;

// ===== Scroll Logic (W3School Style) =====
const tabsContainer = ref<HTMLElement | null>(null);
const canScrollLeft = ref(false);
const canScrollRight = ref(false);

const SCROLL_AMOUNT = 240; // ចម្ងាយ scroll ពេលចុច arrow

const updateScrollState = () => {
  if (!tabsContainer.value) return;

  const el = tabsContainer.value;
  const scrollLeft = el.scrollLeft;
  const scrollWidth = el.scrollWidth;
  const clientWidth = el.clientWidth;

  // អាច scroll ទៅឆ្វេង បើ scrollLeft > 0
  canScrollLeft.value = scrollLeft > 5;

  // អាច scroll ទៅស្តាំ បើនៅមិនទាន់ដល់ចុង
  canScrollRight.value = scrollLeft + clientWidth < scrollWidth - 5;
};

const scrollLeft = () => {
  if (!tabsContainer.value) return;
  tabsContainer.value.scrollBy({
    left: -SCROLL_AMOUNT,
    behavior: "smooth",
  });
};

const scrollRight = () => {
  if (!tabsContainer.value) return;
  tabsContainer.value.scrollBy({
    left: SCROLL_AMOUNT,
    behavior: "smooth",
  });
};

// ===== Auto-scroll Active Tab into View =====
const scrollActiveIntoView = () => {
  if (!tabsContainer.value) return;

  const activeEl = tabsContainer.value.querySelector(
    'a[aria-current="page"]',
  ) as HTMLElement | null;

  if (activeEl) {
    activeEl.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }
};

// ===== Mouse Wheel Horizontal Scroll =====
const handleWheel = (e: WheelEvent) => {
  if (!tabsContainer.value) return;
  // បើ user scroll ដោយ wheel ធម្មតា និងមិនមែន horizontal
  if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
    e.preventDefault();
    tabsContainer.value.scrollLeft += e.deltaY;
  }
};

// ===== Lifecycle =====
onMounted(() => {
  nextTick(() => {
    updateScrollState();
    scrollActiveIntoView();
  });

  window.addEventListener("resize", updateScrollState);
  tabsContainer.value?.addEventListener("wheel", handleWheel, {
    passive: false,
  });
});

onUnmounted(() => {
  window.removeEventListener("resize", updateScrollState);
  tabsContainer.value?.removeEventListener("wheel", handleWheel);
});

// ===== Watch route changes → scroll active tab into view =====
watch(
  () => route.path,
  () => {
    nextTick(() => scrollActiveIntoView());
  },
);
</script>

<style scoped>
/* លាក់ scrollbar ប៉ុន្តែនៅតែអាច scroll បាន */
.scrollbar-hide {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
