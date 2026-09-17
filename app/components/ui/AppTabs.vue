<template>
  <div class="space-y-6">
    <!-- Tab Buttons -->
    <div class="glass-card rounded-2xl p-5" role="tablist">
      <div class="grid gap-2" :class="gridColsClass">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          type="button"
          role="tab"
          :aria-selected="modelValue === tab.value"
          @click="selectTab(tab.value)"
          class="py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-300"
          :class="
            modelValue === tab.value
              ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-slate-950 shadow-md shadow-cyan-500/20 scale-105'
              : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800'
          "
        >
          <component :is="tab.icon" v-if="tab.icon" class="w-3.5 h-3.5" />
          <span>{{ tab.label }}</span>
        </button>
      </div>
    </div>

    <!-- Tab Content -->
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"; // Import ប្រសិនបើមិនបានប្រើ Auto-Import

interface Tab {
  value: string;
  label: string;
  icon?: any;
}

interface Props {
  tabs: readonly Tab[];
  modelValue: string;
  cols?: 2 | 3 | 4 | 5;
}

const props = withDefaults(defineProps<Props>(), {
  cols: 4,
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const gridColsClass = computed(() => {
  const map: Record<number, string> = {
    2: "grid-cols-2",
    3: "grid-cols-2 sm:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-4",
    5: "grid-cols-2 sm:grid-cols-5",
  };
  return map[props.cols] || "grid-cols-2 sm:grid-cols-4";
});

const selectTab = (value: string) => {
  emit("update:modelValue", value);
};
</script>
