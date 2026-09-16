<template>
  <div class="space-y-6">
    <!-- Hero -->
    <div class="glass-card rounded-2xl p-8 text-center">
      <div
        class="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-cyan-600 to-emerald-500 flex items-center justify-center text-slate-950 shadow-lg shadow-cyan-500/20"
      >
        <i class="fa-solid fa-microchip text-4xl"></i>
      </div>
      <h1 class="text-2xl sm:text-3xl font-bold text-white mb-2">
        អំពីកម្មវិធី
      </h1>
      <p class="text-slate-400 max-w-2xl mx-auto">
        កម្មវិធីគណនាគ្រឿងអេឡិចត្រូនិច សម្រាប់វិស្វករ និងនិស្សិត
      </p>
    </div>

    <!-- Features -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="f in features"
        :key="f.title"
        class="glass-card rounded-2xl p-5 space-y-2"
      >
        <div
          class="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center"
        >
          <i :class="[f.icon, 'text-lg']"></i>
        </div>
        <h3 class="font-bold text-white">{{ f.title }}</h3>
        <p class="text-xs text-slate-400 leading-relaxed">{{ f.desc }}</p>
      </div>
    </div>

    <!-- Tech Stack -->
    <div class="glass-card rounded-2xl p-6 space-y-4">
      <h2 class="text-lg font-bold text-white flex items-center gap-2">
        <i class="fa-solid fa-code text-cyan-400"></i>
        បច្ចេកវិទ្យាដែលប្រើ
      </h2>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div
          v-for="tech in techStack"
          :key="tech.name"
          class="bg-slate-950 border border-slate-800 rounded-xl p-3 text-center hover:border-cyan-500/30 transition-colors"
        >
          <i :class="[tech.icon, 'text-2xl mb-2', tech.color]"></i>
          <p class="text-xs font-mono text-slate-300">{{ tech.name }}</p>
          <p class="text-[10px] text-slate-500">{{ tech.version }}</p>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="glass-card rounded-2xl p-6">
      <h2 class="text-lg font-bold text-white flex items-center gap-2 mb-4">
        <i class="fa-solid fa-chart-simple text-amber-400"></i>
        ស្ថិតិ
      </h2>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="text-center p-3 bg-slate-950 rounded-xl border border-slate-800"
        >
          <div class="text-2xl font-bold font-mono text-cyan-400">
            {{ stat.value }}
          </div>
          <div class="text-[10px] text-slate-400">{{ stat.label }}</div>
        </div>
      </div>
    </div>

    <!-- Contact -->
    <div class="glass-card rounded-2xl p-6 text-center">
      <h2 class="text-lg font-bold text-white mb-2">
        <i class="fa-solid fa-envelope text-emerald-400 mr-2"></i>
        ទំនាក់ទំនង
      </h2>
      <p class="text-sm text-slate-400 mb-4">
        មានសំណួរ ឬ ការផ្ដល់យោបល់? ផ្ញើ email មកយើងខ្ញុំ
      </p>
      <a
        href="https://smt-dev123.github.io/SMT-LinkProfile/"
        target="_blank"
        class="inline-flex items-center gap-2 px-5 py-2.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-xl font-semibold hover:bg-cyan-500/20 transition-colors"
      >
        <i class="fa-solid fa-paper-plane"></i>
        ទំនាក់ទំនងខ្ញុំ
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "calculator",
  title: "អំពី",
  icon: "fa-solid fa-circle-info",
});

useSeoMeta({
  title: "អំពីកម្មវិធី",
  description: "ព័ត៌មានអំពីកម្មវិធីគណនាគ្រឿងអេឡិចត្រូនិច",
});

const features = [
  {
    icon: "fa-solid fa-bolt",
    title: "លឿន និងត្រឹមត្រូវ",
    desc: "គណនាភ្លាមៗជាមួយរូបមន្តស្តង់ដារអន្តរជាតិ",
  },
  {
    icon: "fa-solid fa-database",
    title: "Database ធំ",
    desc: "មាន database គ្រឿងអេឡិចត្រូនិចជាង ៥០ ប្រភេទ",
  },
  {
    icon: "fa-solid fa-mobile-screen",
    title: "គាំទ្រទូស័ព្ទ",
    desc: "រចនាជា responsive ដំណើរការលើគ្រប់ឧបករណ៍",
  },
  {
    icon: "fa-solid fa-language",
    title: "ភាសាខ្មែរ",
    desc: "គាំទ្រភាសាខ្មែរពេញលេញ",
  },
  {
    icon: "fa-solid fa-shield-halved",
    title: "Offline Ready",
    desc: "ប្រើបានទោះគ្មានអ៊ីនធឺណិត (localStorage)",
  },
  {
    icon: "fa-solid fa-code",
    title: "Open Source",
    desc: "កូដបើកចំហ អាចកែសម្រួលបាន",
  },
];

const techStack = [
  {
    name: "Nuxt 4",
    version: "v4.0",
    icon: "fa-brands fa-vuejs",
    color: "text-emerald-400",
  },
  {
    name: "Vue 3",
    version: "v3.5",
    icon: "fa-brands fa-vuejs",
    color: "text-emerald-400",
  },
  {
    name: "Tailwind",
    version: "v3.4",
    icon: "fa-solid fa-wind",
    color: "text-cyan-400",
  },
  {
    name: "TypeScript",
    version: "v5.4",
    icon: "fa-solid fa-code",
    color: "text-blue-400",
  },
  {
    name: "Pinia",
    version: "v2.1",
    icon: "fa-solid fa-database",
    color: "text-amber-400",
  },
  {
    name: "Canvas",
    version: "HTML5",
    icon: "fa-solid fa-palette",
    color: "text-purple-400",
  },
  {
    name: "Capacitor",
    version: "v6.0",
    icon: "fa-solid fa-mobile",
    color: "text-cyan-400",
  },
  {
    name: "Font Awesome",
    version: "v6.4",
    icon: "fa-solid fa-icons",
    color: "text-blue-400",
  },
];

const stats = [
  { label: "ម៉ាស៊ីនគណនា", value: "11" },
  { label: "ប្រភេទ Part", value: "50+" },
  { label: "ភាសា", value: "2" },
  { label: "Open Source", value: "100%" },
];
</script>
