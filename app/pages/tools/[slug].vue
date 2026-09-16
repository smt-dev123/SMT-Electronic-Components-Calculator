<template>
  <div class="space-y-6">
    <!-- Breadcrumb -->
    <nav class="flex items-center gap-2 text-xs text-slate-400">
      <NuxtLink to="/tools" class="hover:text-cyan-400 transition-colors">
        <i class="fa-solid fa-toolbox"></i> ឧបករណ៍
      </NuxtLink>
      <i class="fa-solid fa-chevron-right text-[10px]"></i>
      <span class="text-cyan-400 font-semibold">{{ toolName }}</span>
    </nav>

    <div class="glass-card rounded-2xl p-8 text-center">
      <div class="text-6xl mb-4">🚧</div>
      <h1 class="text-2xl font-bold text-white mb-2">{{ toolName }}</h1>
      <p class="text-slate-400 mb-6">មុខងារនេះនឹងត្រូវបានបន្ថែមនៅពេលក្រោយ</p>
      <NuxtLink
        to="/tools"
        class="inline-flex items-center gap-2 px-5 py-2.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-xl font-semibold hover:bg-cyan-500/20 transition-colors"
      >
        <i class="fa-solid fa-arrow-left"></i>
        ត្រឡប់ទៅបញ្ជីឧបករណ៍
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const slug = computed(() => route.params.slug as string);

// Map slug → tool name
const toolMap: Record<string, string> = {
  "smd-resistor": "SMD Resistor Code",
  "smd-capacitor": "SMD Capacitor Code",
  "resistor-network": "Resistor Network",
  "capacitor-network": "Capacitor Network",
  resonance: "LC Resonance",
  attenuator: "Attenuator Calculator",
};

const toolName = computed(() => toolMap[slug.value] || slug.value);

definePageMeta({
  layout: "calculator",
});

useSeoMeta({
  title: () => `${toolName.value}`,
  description: () => `ឧបករណ៍ ${toolName.value}`,
});

// Validate slug — បើមិនស្គាល់ → 404
if (!toolMap[slug.value]) {
  throw createError({
    statusCode: 404,
    statusMessage: "រកមិនឃើញឧបករណ៍នេះទេ",
  });
}
</script>
