<template>
  <div
    class="bg-slate-900/90 border border-slate-800 rounded-xl p-4 transition-all duration-300 hover:border-cyan-500/30"
  >
    <span class="text-[11px] text-slate-400 font-mono block">
      {{ label }}
    </span>

    <Transition name="fade-slide" mode="out-in">
      <div :key="String(value)" class="mt-1">
        <p class="font-bold font-mono" :class="[sizeClass, colorClass]">
          {{ value }}
        </p>
      </div>
    </Transition>

    <p v-if="subtext" class="text-[10px] text-slate-500 font-mono mt-1">
      {{ subtext }}
    </p>

    <div v-if="badges && badges.length" class="flex flex-wrap gap-2 mt-2">
      <span
        v-for="(badge, i) in badges"
        :key="i"
        class="px-2 py-0.5 text-[10px] font-mono rounded-full bg-white/5 border border-white/10 text-slate-300"
      >
        {{ badge }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label: string;
  value: string | number;
  subtext?: string;
  color?: "cyan" | "amber" | "emerald" | "purple" | "slate";
  size?: "sm" | "md" | "lg" | "xl";
  badges?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  color: "cyan",
  size: "lg",
  subtext: "",
  badges: () => [],
});

const colorClass = computed(() => {
  const map = {
    cyan: "text-cyan-400",
    amber: "text-amber-400",
    emerald: "text-emerald-400",
    purple: "text-purple-400",
    slate: "text-slate-200",
  };
  return map[props.color];
});

const sizeClass = computed(() => {
  const map = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
    xl: "text-3xl",
  };
  return map[props.size];
});
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.25s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
