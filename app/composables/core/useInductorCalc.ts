export interface InductorColor {
  name: string;
  khmer: string;
  hex: string;
  digit: number | null;
  multiplier: number | null;
  tolerance: number | null;
}

export const inductorColors: InductorColor[] = [
  {
    name: "black",
    khmer: "ខ្មៅ",
    hex: "#111827",
    digit: 0,
    multiplier: 1,
    tolerance: null,
  },
  {
    name: "brown",
    khmer: "ត្នោត",
    hex: "#854d0e",
    digit: 1,
    multiplier: 10,
    tolerance: 1,
  },
  {
    name: "red",
    khmer: "ក្រហម",
    hex: "#dc2626",
    digit: 2,
    multiplier: 100,
    tolerance: 2,
  },
  {
    name: "orange",
    khmer: "ទឹកក្រូច",
    hex: "#ea580c",
    digit: 3,
    multiplier: 1000,
    tolerance: 3,
  },
  {
    name: "yellow",
    khmer: "លឿង",
    hex: "#eab308",
    digit: 4,
    multiplier: 10000,
    tolerance: 4,
  },
  {
    name: "green",
    khmer: "បៃតង",
    hex: "#16a34a",
    digit: 5,
    multiplier: 100000,
    tolerance: 5,
  },
  {
    name: "blue",
    khmer: "ខៀវ",
    hex: "#2563eb",
    digit: 6,
    multiplier: 1000000,
    tolerance: 6,
  },
  {
    name: "violet",
    khmer: "ស្វាយ",
    hex: "#9333ea",
    digit: 7,
    multiplier: 10000000,
    tolerance: 7,
  },
  {
    name: "gray",
    khmer: "ប្រផេះ",
    hex: "#4b5563",
    digit: 8,
    multiplier: 100000000,
    tolerance: 8,
  },
  {
    name: "white",
    khmer: "ស",
    hex: "#f9fafb",
    digit: 9,
    multiplier: 1000000000,
    tolerance: 9,
  },
  {
    name: "gold",
    khmer: "មាស",
    hex: "#d97706",
    digit: null,
    multiplier: 0.1,
    tolerance: 5,
  },
  {
    name: "silver",
    khmer: "ប្រាក់",
    hex: "#94a3b8",
    digit: null,
    multiplier: 0.01,
    tolerance: 10,
  },
];

export const useInductorCalc = () => {
  const formatInductance = (henries: number): string => {
    if (isNaN(henries) || henries === 0) return "0 H";
    if (henries >= 1) return henries.toFixed(4).replace(/\.?0+$/, "") + " H";
    if (henries >= 1e-3)
      return (henries * 1e3).toFixed(3).replace(/\.?0+$/, "") + " mH";
    if (henries >= 1e-6)
      return (henries * 1e6).toFixed(2).replace(/\.?0+$/, "") + " µH";
    return (henries * 1e9).toFixed(1).replace(/\.?0+$/, "") + " nH";
  };

  const formatResistance = (ohms: number): string => {
    if (isNaN(ohms)) return "0 Ω";
    if (ohms >= 1e6) return (ohms / 1e6).toFixed(2) + " MΩ";
    if (ohms >= 1e3) return (ohms / 1e3).toFixed(2) + " kΩ";
    return ohms.toFixed(2) + " Ω";
  };

  const calculateByColorCode = (
    band1: InductorColor,
    band2: InductorColor,
    multiplier: InductorColor,
    tolerance?: InductorColor | null,
  ) => {
    const digits = `${band1.digit ?? 0}${band2.digit ?? 0}`;
    const baseValue = parseInt(digits, 10);
    const mult = multiplier.multiplier ?? 1;
    const inductance_uH = baseValue * mult;
    const inductance_H = inductance_uH * 1e-6;
    const tolValue = tolerance?.tolerance ?? 20;

    return {
      inductance_H,
      inductance_uH,
      formatted: formatInductance(inductance_H),
      tolerance: tolValue,
      range: {
        min: formatInductance(inductance_H * (1 - tolValue / 100)),
        max: formatInductance(inductance_H * (1 + tolValue / 100)),
      },
    };
  };

  const calculateSolenoid = (
    turns: number,
    diameter_mm: number,
    length_mm: number,
    corePermeability: number = 1,
  ) => {
    if (turns <= 0 || diameter_mm <= 0 || length_mm <= 0) return null;
    const d_inch = diameter_mm / 25.4;
    const l_inch = length_mm / 25.4;
    const L_uH =
      ((d_inch * d_inch * turns * turns) / (18 * d_inch + 40 * l_inch)) *
      corePermeability;
    const L_H = L_uH * 1e-6;
    return {
      inductance_H: L_H,
      inductance_uH: L_uH,
      formatted: formatInductance(L_H),
    };
  };

  const calculateResonantFreq = (
    inductance_H: number,
    capacitance_F: number,
  ) => {
    if (inductance_H <= 0 || capacitance_F <= 0) return null;
    const freq = 1 / (2 * Math.PI * Math.sqrt(inductance_H * capacitance_F));
    return {
      frequency_Hz: freq,
      formatted:
        freq >= 1e6
          ? (freq / 1e6).toFixed(2) + " MHz"
          : freq >= 1e3
            ? (freq / 1e3).toFixed(2) + " kHz"
            : freq.toFixed(2) + " Hz",
    };
  };

  const calculateReactance = (inductance_H: number, frequency_Hz: number) => {
    if (inductance_H <= 0 || frequency_Hz <= 0) return null;
    const XL = 2 * Math.PI * frequency_Hz * inductance_H;
    return {
      reactance_ohm: XL,
      formatted: formatResistance(XL),
    };
  };

  const calculateSeries = (inductors: number[]) => {
    const total = inductors.reduce((sum, L) => sum + L, 0);
    return { total_H: total, formatted: formatInductance(total) };
  };

  const calculateParallel = (inductors: number[]) => {
    const valid = inductors.filter((L) => L > 0);
    if (valid.length === 0) return null;
    const invSum = valid.reduce((sum, L) => sum + 1 / L, 0);
    const total = 1 / invSum;
    return { total_H: total, formatted: formatInductance(total) };
  };

  return {
    inductorColors,
    formatInductance,
    formatResistance,
    calculateByColorCode,
    calculateSolenoid,
    calculateResonantFreq,
    calculateReactance,
    calculateSeries,
    calculateParallel,
  };
};
