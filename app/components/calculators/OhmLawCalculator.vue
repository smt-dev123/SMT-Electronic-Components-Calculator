<template>
  <div class="glass-card rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
    <div
      class="border-b border-slate-800 pb-3 flex justify-between items-center"
    >
      <div>
        <h2 class="text-lg font-bold text-white flex items-center gap-2">
          <i class="fa-solid fa-calculator text-cyan-400"></i>
          គណនាច្បាប់អូម (Ohm's Law & Power Solver)
        </h2>
        <p class="text-xs text-slate-400">
          បញ្ចូលយ៉ាងហោចណាស់ ២ តម្លៃ ដើម្បីគណនាតម្លៃអគ្គិសនីដែលសល់ (V, I, R, P)
        </p>
      </div>
      <button
        @click="resetOhm"
        class="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs px-3 py-1.5 rounded-xl border border-slate-700 transition-all"
      >
        <i class="fa-solid fa-rotate-right mr-1"></i> Reset
      </button>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2"
      >
        <label
          class="text-xs font-semibold text-cyan-400 flex items-center justify-between"
        >
          <span>តង់ស្យុង (Voltage - V)</span>
          <span class="font-mono">Volts (V)</span>
        </label>
        <input
          v-model.number="ohm.v"
          type="number"
          step="any"
          placeholder="e.g. 12"
          @input="calculateOhm('v')"
          class="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
        />
      </div>

      <div
        class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2"
      >
        <label
          class="text-xs font-semibold text-amber-400 flex items-center justify-between"
        >
          <span>ចរន្ត (Current - I)</span>
          <span class="font-mono">Amperes (A)</span>
        </label>
        <input
          v-model.number="ohm.i"
          type="number"
          step="any"
          placeholder="e.g. 0.05"
          @input="calculateOhm('i')"
          class="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
        />
      </div>

      <div
        class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2"
      >
        <label
          class="text-xs font-semibold text-emerald-400 flex items-center justify-between"
        >
          <span>រេស៊ីស្តង់ (Resistance - R)</span>
          <span class="font-mono">Ohms (Ω)</span>
        </label>
        <input
          v-model.number="ohm.r"
          type="number"
          step="any"
          placeholder="e.g. 240"
          @input="calculateOhm('r')"
          class="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
        />
      </div>

      <div
        class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2"
      >
        <label
          class="text-xs font-semibold text-purple-400 flex items-center justify-between"
        >
          <span>អានុភាព (Power - P)</span>
          <span class="font-mono">Watts (W)</span>
        </label>
        <input
          v-model.number="ohm.p"
          type="number"
          step="any"
          placeholder="e.g. 0.6"
          @input="calculateOhm('p')"
          class="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-purple-500"
        />
      </div>
    </div>

    <div
      class="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-slate-400 grid grid-cols-2 md:grid-cols-4 gap-2 text-center"
    >
      <div class="p-2 bg-slate-900/50 rounded-lg">V = I × R</div>
      <div class="p-2 bg-slate-900/50 rounded-lg">I = V / R</div>
      <div class="p-2 bg-slate-900/50 rounded-lg">R = V / I</div>
      <div class="p-2 bg-slate-900/50 rounded-lg">P = V × I = I² × R</div>
    </div>
  </div>
</template>

<script setup lang="ts">
const ohm = ref<{
  v: number | null;
  i: number | null;
  r: number | null;
  p: number | null;
}>({
  v: 12,
  i: 0.05,
  r: 240,
  p: 0.6,
});

const calculateOhm = (changed: "v" | "i" | "r" | "p") => {
  const { v, i, r, p } = ohm.value;

  if (changed === "v" || changed === "i") {
    if (v && i) {
      ohm.value.r = parseFloat((v / i).toFixed(2));
      ohm.value.p = parseFloat((v * i).toFixed(2));
    }
  } else if (changed === "r") {
    if (v && r) {
      ohm.value.i = parseFloat((v / r).toFixed(4));
      ohm.value.p = parseFloat(((v * v) / r).toFixed(2));
    }
  } else if (changed === "p") {
    if (p && v) {
      ohm.value.i = parseFloat((p / v).toFixed(4));
      ohm.value.r = parseFloat(((v * v) / p).toFixed(2));
    }
  }
};

const resetOhm = () => {
  ohm.value = { v: null, i: null, r: null, p: null };
};
</script>
