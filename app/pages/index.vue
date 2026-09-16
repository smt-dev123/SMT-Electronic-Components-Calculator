<template>
  <div class="space-y-6">
    <!-- Hero -->
    <div class="glass-card rounded-2xl p-8 text-center animate-fade-in">
      <div class="text-5xl mb-3 animate-pulse">⚡</div>
      <h1 class="text-2xl sm:text-3xl font-bold mb-2">
        ឧបករណ៍គណនាគ្រឿងអេឡិចត្រូនិច
      </h1>
      <p class="text-slate-400 max-w-2xl mx-auto">
        ជ្រើសរើសម៉ាស៊ីនគណនាខាងក្រោមដើម្បីចាប់ផ្ដើម
      </p>
    </div>

    <!-- Categories -->
    <div class="space-y-6">
      <div v-for="cat in categories" :key="cat.name">
        <h2
          class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2"
        >
          <i :class="cat.icon"></i>
          {{ cat.name }}
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <NuxtLink
            v-for="tool in cat.tools"
            :key="tool.path"
            :to="tool.path"
            class="glass-card rounded-2xl p-5 hover:bg-slate-800/50 hover:scale-105 transition-all duration-300 group cursor-pointer"
          >
            <div class="flex items-start gap-4">
              <div
                class="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 text-cyan-400 group-hover:scale-110 transition-transform"
              >
                <i :class="[tool.icon, 'text-2xl']"></i>
              </div>
              <div class="flex-1">
                <h3 class="font-bold text-white mb-1">{{ tool.nameKh }}</h3>
                <p class="text-xs text-slate-400 mb-2">{{ tool.desc }}</p>
                <span class="text-[10px] font-mono text-cyan-400">
                  {{ tool.nameEn }}
                </span>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Quick Links -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <NuxtLink
        to="/history"
        class="glass-card rounded-2xl p-5 hover:bg-slate-800/50 transition-colors flex items-center gap-4 group"
      >
        <div
          class="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform"
        >
          <i class="fa-solid fa-clock-rotate-left text-2xl"></i>
        </div>
        <div>
          <h3 class="font-bold text-white">ប្រវត្តិគណនា</h3>
          <p class="text-xs text-slate-400">មើលប្រវត្តិគណនាទាំងអស់</p>
        </div>
      </NuxtLink>

      <NuxtLink
        to="/favorites"
        class="glass-card rounded-2xl p-5 hover:bg-slate-800/50 transition-colors flex items-center gap-4 group"
      >
        <div
          class="p-3 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform"
        >
          <i class="fa-solid fa-star text-2xl"></i>
        </div>
        <div>
          <h3 class="font-bold text-white">ចំណូលចិត្ត</h3>
          <p class="text-xs text-slate-400">Part ដែលបានចូលចិត្ត</p>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: "ទំព័រដើម",
  icon: "fa-solid fa-house",
});

useSeoMeta({
  title: "ឧបករណ៍គណនាអេឡិចត្រូនិច",
  description:
    "ម៉ាស៊ីនគណនាគ្រឿងអេឡិចត្រូនិចពេញលេញ - Resistor, Capacitor, Diode, Transistor, MOSFET",
});

const categories = [
  {
    name: "គ្រឿងបង្គុំមូលដ្ឋាន (Passive)",
    icon: "fa-solid fa-circle-nodes text-cyan-400",
    tools: [
      {
        path: "/resistor",
        nameKh: "រេស៊ីស្តង់",
        nameEn: "Resistor Calculator",
        icon: "fa-solid fa-palette",
        desc: "គណនាតាមកូដពណ៌ (3-6 bands) និង SMD",
      },
      {
        path: "/capacitor",
        nameKh: "កាប៉ាស៊ីទ័រ",
        nameEn: "Capacitor Calculator",
        icon: "fa-solid fa-bolt",
        desc: "បម្លែងកូដ និងឯកតា",
      },
      {
        path: "/inductor",
        nameKh: "អាំងឌុចទ័រ",
        nameEn: "Inductor Calculator",
        icon: "fa-solid fa-rotate",
        desc: "កូដពណ៌, រូបមន្ត, Reactance, LC Resonance",
      },
    ],
  },
  {
    name: "ឧបករណ៍ Semiconductor",
    icon: "fa-solid fa-microchip text-amber-400",
    tools: [
      {
        path: "/diode",
        nameKh: "ឌីយ៉ូត",
        nameEn: "Diode Calculator",
        icon: "fa-solid fa-arrow-right-long",
        desc: "Database, Rectifier, Zener, Bridge",
      },
      {
        path: "/transistor",
        nameKh: "Transistor (BJT)",
        nameEn: "BJT Calculator",
        icon: "fa-solid fa-microchip",
        desc: "Database, Base Resistor, Amplifier",
      },
      {
        path: "/mosfet",
        nameKh: "MOSFET",
        nameEn: "MOSFET Calculator",
        icon: "fa-solid fa-bolt",
        desc: "Gate R, Power Loss, Heatsink",
      },
      {
        path: "/optocoupler",
        nameKh: "Optocoupler",
        nameEn: "Optocoupler Calculator",
        icon: "fa-solid fa-shield-halved",
        desc: "Input/Output Resistor, Isolator",
      },
    ],
  },
  {
    name: "សៀគ្វី និងការគណនា (Circuits)",
    icon: "fa-solid fa-diagram-project text-emerald-400",
    tools: [
      {
        path: "/ohms-law",
        nameKh: "ច្បាប់អូម",
        nameEn: "Ohm's Law",
        icon: "fa-solid fa-calculator",
        desc: "គណនា V, I, R និង Power",
      },
      {
        path: "/led",
        nameKh: "រេស៊ីស្តង់ LED",
        nameEn: "LED Resistor",
        icon: "fa-regular fa-lightbulb",
        desc: "រករេស៊ីស្តង់ការពារ LED",
      },
      {
        path: "/divider",
        nameKh: "ស៊ីគ្វីចែកតង់ស្យុង",
        nameEn: "Voltage Divider",
        icon: "fa-solid fa-sitemap",
        desc: "គណនាតង់ស្យុងចេញ (Vout)",
      },
      {
        path: "/timer-555",
        nameKh: "IC 555",
        nameEn: "555 Timer",
        icon: "fa-solid fa-clock",
        desc: "Astable Oscillator Frequency",
      },
    ],
  },
];
</script>
