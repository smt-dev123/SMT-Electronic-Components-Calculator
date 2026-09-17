<template>
  <button
    :disabled="disabled"
    class="px-2.5 py-1 rounded-lg border border-slate-700 bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps<{ disabled?: boolean }>();
</script>
