<template>
  <footer
    class="mt-auto border-t border-slate-800/80 bg-slate-950/90 py-5 text-center text-xs text-slate-500"
  >
    <div
      class="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-3"
    >
      <div class="flex items-center gap-2">
        <span class="p-1.5 bg-cyan-500/10 text-cyan-400 rounded-lg">
          <i class="fa-solid fa-microchip"></i>
        </span>
        <span>© 2026 SMT-DEV</span>
      </div>

      <nav class="flex items-center gap-4">
        <NuxtLink to="/about" class="hover:text-cyan-400 transition-colors">
          <i class="fa-solid fa-circle-info mr-1"></i>អំពី
        </NuxtLink>
        <NuxtLink to="/tools" class="hover:text-cyan-400 transition-colors">
          <i class="fa-solid fa-toolbox mr-1"></i>ឧបករណ៍
        </NuxtLink>
      </nav>
    </div>
  </footer>
</template>

<script setup lang="ts">
// No logic needed
</script>
