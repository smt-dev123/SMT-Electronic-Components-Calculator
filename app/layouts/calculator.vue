<template>
  <div class="flex flex-col min-h-screen bg-slate-950 text-slate-100">
    <AppHeader />

    <main class="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Breadcrumb -->
      <nav class="mb-4 flex items-center gap-2 text-xs text-slate-400">
        <NuxtLink to="/" class="hover:text-cyan-400 transition-colors">
          <i class="fa-solid fa-house"></i> ដើម
        </NuxtLink>
        <i class="fa-solid fa-chevron-right text-[10px]"></i>
        <span class="text-cyan-400 font-semibold">{{ pageTitle }}</span>
      </nav>

      <!-- Title Block -->
      <div class="glass-card rounded-2xl p-5 mb-6">
        <h1
          class="text-xl sm:text-2xl font-bold text-white flex items-center gap-3"
        >
          <i :class="[pageIcon, 'text-cyan-400']"></i>
          {{ pageTitle }}
        </h1>
        <p class="text-sm text-slate-400 mt-1">{{ pageDescription }}</p>
      </div>

      <slot />
    </main>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import AppHeader from "~/components/AppHeader.vue";
import AppFooter from "~/components/AppFooter.vue";

const route = useRoute();

const pageTitle = computed(() => (route.meta.title as string) || "ម៉ាស៊ីនគណនា");
const pageIcon = computed(
  () => (route.meta.icon as string) || "fa-solid fa-calculator",
);
const pageDescription = computed(
  () => (route.meta.description as string) || "",
);
</script>
