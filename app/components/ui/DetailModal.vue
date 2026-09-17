<template>
  <div
    class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
    @click.self="$emit('close')"
  >
    <div
      class="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto"
    >
      <!-- Close -->
      <button
        @click="$emit('close')"
        class="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800"
      >
        <LucideX class="w-5 h-5" />
      </button>

      <!-- Header -->
      <div class="flex items-center gap-3 border-b border-slate-800 pb-3">
        <div
          class="p-2 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-emerald-500/20 text-cyan-400"
        >
          <component :is="icon" class="w-5 h-5" />
        </div>
        <div>
          <h3 class="text-lg font-bold text-white font-mono">
            {{ title }}
          </h3>
          <p class="text-xs text-slate-400">{{ subtitle }}</p>
        </div>
      </div>

      <!-- Content -->
      <slot />

      <!-- Footer -->
      <div v-if="$slots.footer" class="pt-2 border-t border-slate-800">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  subtitle?: string;
  icon?: any;
}

withDefaults(defineProps<Props>(), {
  subtitle: "",
  icon: "LucideInfo",
});

defineEmits<{ close: [] }>();
</script>
