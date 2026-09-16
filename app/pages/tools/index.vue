<template>
  <div class="space-y-6">
    <div class="glass-card rounded-2xl p-6">
      <h1 class="text-2xl font-bold text-white flex items-center gap-3 mb-2">
        <i class="fa-solid fa-toolbox text-cyan-400"></i>
        ឧបករណ៍ផ្សេងៗ
      </h1>
      <p class="text-sm text-slate-400">
        ឧបករណ៍ជំនួយសម្រាប់ការគណនា និងការរចនាសៀគ្វី
      </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <NuxtLink
        v-for="tool in tools"
        :key="tool.slug"
        :to="`/tools/${tool.slug}`"
        class="glass-card rounded-2xl p-5 hover:bg-slate-800/50 hover:scale-105 transition-all duration-300 group"
      >
        <div class="flex items-start gap-4">
          <div
            class="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 text-cyan-400 group-hover:scale-110 transition-transform"
          >
            <i :class="[tool.icon, 'text-2xl']"></i>
          </div>
          <div class="flex-1">
            <h3 class="font-bold text-white mb-1">{{ tool.name }}</h3>
            <p class="text-xs text-slate-400">{{ tool.desc }}</p>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "calculator",
  title: "ឧបករណ៍ផ្សេងៗ",
  icon: "fa-solid fa-toolbox",
});

const tools = [
  {
    slug: "smd-resistor",
    name: "SMD Resistor Code",
    desc: "គណនាកូដ SMD Resistor ទាំងអស់",
    icon: "fa-solid fa-microchip",
  },
  {
    slug: "smd-capacitor",
    name: "SMD Capacitor Code",
    desc: "គណនាកូដ SMD Capacitor",
    icon: "fa-solid fa-bolt",
  },
  {
    slug: "resistor-network",
    name: "Resistor Network",
    desc: "គណនារេស៊ីស្តង់សេរី/ប៉ារ៉ាឡែល",
    icon: "fa-solid fa-network-wired",
  },
  {
    slug: "capacitor-network",
    name: "Capacitor Network",
    desc: "គណនាកាប៉ាស៊ីទ័រសេរី/ប៉ារ៉ាឡែល",
    icon: "fa-solid fa-diagram-project",
  },
  {
    slug: "resonance",
    name: "LC Resonance",
    desc: "គណនាប្រេកង់ Resonant",
    icon: "fa-solid fa-wave-square",
  },
  {
    slug: "attenuator",
    name: "Attenuator Calculator",
    desc: "គណនា Pi/T Attenuator",
    icon: "fa-solid fa-signal",
  },
];
</script>
