<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div
      class="glass-card rounded-2xl p-8 text-center max-w-md animate-bounce-in"
    >
      <div class="text-6xl mb-4 animate-pulse">🔌</div>
      <h1 class="text-6xl font-bold text-cyan-400 mb-3 font-mono">404</h1>
      <h2 class="text-xl font-bold mb-3">រកមិនឃើញទំព័រ</h2>
      <p class="text-slate-400 text-sm mb-6">
        ទំព័រដែលអ្នកកំពុងស្វែងរកមិនមានទេ ឬត្រូវបានផ្លាស់ប្ដូរ។
      </p>
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <NuxtLink
          to="/"
          class="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-cyan-600 text-slate-950 font-bold rounded-xl hover:scale-105 transition-all"
        >
          <i class="fa-solid fa-house"></i>
          ត្រឡប់ទំព័រដើម
        </NuxtLink>
        <button
          @click="$router.back()"
          class="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 text-slate-300 border border-slate-800 rounded-xl font-semibold hover:bg-slate-800 transition-colors"
        >
          <i class="fa-solid fa-arrow-left"></i>
          ត្រឡប់ក្រោយ
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "blank",
});

useSeoMeta({
  title: "រកមិនឃើញទំព័រ (404)",
});
</script>
