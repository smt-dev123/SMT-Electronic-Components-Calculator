<template>
  <div
    class="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden"
  >
    <ClientOnly>
      <div class="w-full relative" :style="{ height: heightPx }">
        <slot />
      </div>
      <template #fallback>
        <div
          class="w-full bg-slate-900/50 animate-pulse rounded-xl"
          :style="{ height: heightPx }"
        />
      </template>
    </ClientOnly>

    <div
      v-if="caption"
      class="mt-3 text-xs font-mono text-slate-400 text-center"
    >
      {{ caption }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  height?: number;
  caption?: string;
}

const props = withDefaults(defineProps<Props>(), {
  height: 176,
  caption: "",
});

const heightPx = computed(() => `${props.height}px`);
</script>
