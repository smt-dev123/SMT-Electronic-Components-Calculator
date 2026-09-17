# ⚡ Electronics Calculator Suite

> កម្មវិធីគណនាគ្រឿងអេឡិចត្រូនិចពេញលេញ — សរសេរជាភាសាខ្មែរ ជាមួយ Nuxt 4 + Tailwind CSS

[![Nuxt](https://img.shields.io/badge/Nuxt-4.x-00DC82?logo=nuxt.js&logoColor=white)](https://nuxt.com)
[![Vue](https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vue.js&logoColor=white)](https://vuejs.org)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.x-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📖 អំពីគម្រោង

**Electronics Calculator Suite** គឺជាកម្មវិធីគណនាគ្រឿងអេឡិចត្រូនិចដែលបង្កើតឡើងសម្រាប់៖

- 👨‍🔧 **វិស្វករអេឡិចត្រូនិច** — គណនាតម្លៃគ្រឿងបង្គុំបានលឿន
- 🎓 **និស្សិត** — រៀនអំពីគ្រឿងអេឡិចត្រូនិច
- 🔬 **Hobbyist** — រចនាសៀគ្វីដោយខ្លួនឯង
- KH **ជនជាតិខ្មែរ** — ប្រើភាសាខ្មែរទាំងស្រុង

---

## ✨ លក្ខណៈពិសេស

### 🎯 ម៉ាស៊ីនគណនា ២០+

#### 🔵 គ្រឿងបង្គុំមូលដ្ឋាន (Passive)

- **រេស៊ីស្តង់ (Resistor)** — កូដពណ៌ (4/5/6 bands), SMD Code, Series/Parallel, Power Distribution
- **កាប៉ាស៊ីទ័រ (Capacitor)** — កូដ 3/4 ខ្ទង់, បំប្លែងឯកតា, Series/Parallel
- **អាំងឌុចទ័រ (Inductor)** — កូដពណ៌, រូបមន្ត Wheeler, Reactance, LC Resonance

#### 🟢 ឧបករណ៍ Semiconductor

- **ឌីយ៉ូត (Diode)** — Database, Rectifier, Zener, Bridge
- **Transistor (BJT)** — Database, Switch, Amplifier, Finder
- **MOSFET** — Database, Gate R, Power Loss, Heatsink
- **Optocoupler** — Database, Input/Output R, Circuit

#### 🟡 សៀគ្វី និងការគណនា

- **ច្បាប់អូម (Ohm's Law)** — V, I, R, P
- **រេស៊ីស្តង់ LED** — Current-Limiting Resistor
- **ស៊ីគ្វីចែកតង់ស្យុង (Voltage Divider)** — Vout Calculation

#### 🟣 ICs និង Modules

- **IC 555 Timer** — Astable, Monostable, Frequency Finder
- **Op-Amp** — Non-Inverting, Inverting, Low-Pass Filter
- **Voltage Regulator** — LM317, 78XX Fixed

#### 🟠 ថាមពល និង Magnetic

- **Relay Driver** — Driver Transistor & Flyback Diode
- **Battery Life** — Runtime & Charging Time
- **Transformer** — Turns Ratio, Current, Power

#### 🔴 RF & Timing

- **Crystal Oscillator** — Load Caps, Resonance, Pullability
- **LC Filter** — Cutoff, Q Factor, Band-Pass, Attenuation

#### ⚙️ Engineering Tools

- **PID Controller** — ZN Open/Closed, Cohen-Coon, Simulation
- **PCB Trace Width** — IPC-2221, Via Size, Hole Size

### 🎨 លក្ខណៈ UI/UX

- ✅ **Dark/Light Mode** — Toggle តាម localStorage
- ✅ **Responsive** — ដំណើរការលើទូស័ព្ទ តាប្លែត និងកុំព្យូទ័រ
- ✅ **Canvas Animations** — ចលនារលូនដោយ HTML5 Canvas
- ✅ **SVG Visualizations** — ដ្យាក្រាមសៀគ្វី
- ✅ **Lucide Icons** — រូបតំណាងស្អាត
- ✅ **Khmer Language** — ភាសាខ្មែរពេញលេញ
- ✅ **Offline Support** — localStorage cache
- ✅ **History & Favorites** — រក្សាទុកប្រវត្តិ

---

## 🛠️ បច្ចេកវិទ្យា

| បច្ចេកវិទ្យា     | ជំនាន់ | ការប្រើ          |
| ---------------- | ------ | ---------------- |
| **Nuxt**         | 4.x    | Framework សំខាន់ |
| **Vue**          | 3.5    | UI Library       |
| **TypeScript**   | 5.x    | Type Safety      |
| **Tailwind CSS** | 3.x    | Styling          |
| **Pinia**        | 2.x    | State Management |
| **Lucide Icons** | Latest | Icons            |

---

## 🚀 ការដំឡើង

### 1. Clone Repository

```bash
git clone https://github.com/your-username/electronics-calculator.git
cd electronics-calculator
```

### 2. ដំឡើង Dependencies

```
### ប្រើ pnpm (ណែនាំ)
pnpm install

# ឬ npm

npm install

# ឬ bun

bun install
```

### 3. Run Development Server

```
pnpm dev
```

បើក http://localhost:3000 🎉 📦 Build for Production

### សម្រាប់ Web (SSR)

```
pnpm build
pnpm preview
```

សម្រាប់ Static Site (SSG)

```

pnpm generate

Output ស្ថិតក្នុង .output/public/
```

### Development

```
pnpm dev # ចាប់ផ្ដើម dev server
```

### Build

```
pnpm build # Build for SSR
pnpm generate # Generate static site
pnpm preview # Preview production build
```

បន្ថែម Calculator ថ្មី

```
បង្កើត Composable → app/composables/core/use<Name>Calc.ts

បង្កើត Calculator → app/components/calculators/<name>/<Name>Calculator.vue

បង្កើត Tabs (បើចាំបាច់) → app/components/calculators/<name>/tabs/

បង្កើត Page → app/pages/<name>.vue

បន្ថែមទៅ Menu → AppHeader.vue, AppSidebar.vue, index.vue
```

🌐 Browser Support
Browser ជំនាញ
Chrome ≥ 90
Firefox ≥ 88
Safari ≥ 14
Edge ≥ 90
Mobile Safari iOS ≥ 14
Chrome Android ≥ 90
🤝 ការចូលរួម

សូមស្វាគមន៍ការចូលរួម! 🎉
ជំហាន

    Fork repository

    បង្កើត Branch (git checkout -b feature/amazing-feature)

    Commit (git commit -m 'Add amazing feature')

    Push (git push origin feature/amazing-feature)

    បើក Pull Request

ច្បាប់

    ប្រើ TypeScript ជានិច្ច

    គោរព Composition API style

    សរសេរ comments ជាភាសាខ្មែរ ឬ អង់គ្លេស

    រក្សា responsive design

🐛 រាយការណ៍ Bug

រកឃើញ bug? សូមបើក Issue ជាមួយ៖

    ពិពណ៌នា — តើមានបញ្ហាអ្វី

    ជំហាន — របៀប reproduce

    Expected — លទ្ធផលដែលរំពឹង

    Screenshot — បើមាន

    Environment — Browser, OS, version

📄 License

គម្រោងនេះចេញផ្សាយក្រោម MIT License — មើល LICENSE សម្រាប់ព័ត៌មានលម្អិត។
text

MIT License

Copyright (c) 2026 Electronics Calculator Suite

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...

### 🌐 Live Demo

Website: [kh-electronics-calculator.com](https://smt-electronic-components-calculato.vercel.app/)

Contact: [SMT-LinkProfile](https://smt-dev123.github.io/SMT-LinkProfile/)
