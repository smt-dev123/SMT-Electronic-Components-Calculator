<template>
  <div class="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
    <span class="text-slate-400 block text-[10px]">{{ label }}:</span>
    <span :class="colorClass" class="font-bold text-xs">{{ value }}</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label: string;
  value: string | number;
  color?: "amber" | "emerald" | "purple" | "white" | "slate";
}

const props = withDefaults(defineProps<Props>(), {
  color: "white",
});

const colorClass = computed(() => {
  const map = {
    amber: "text-amber-400",
    emerald: "text-emerald-400",
    purple: "text-purple-400",
    white: "text-white",
    slate: "text-slate-300",
  };
  return map[props.color];
});
</script>
