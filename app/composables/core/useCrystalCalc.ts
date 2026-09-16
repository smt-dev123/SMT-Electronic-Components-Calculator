export interface CrystalSpec {
  frequency_Hz: number;
  loadCapacitance_pF: number; // CL
  esr_ohm: number; // Equivalent Series Resistance
  shuntCapacitance_pF: number; // C0
  motionalCapacitance_fF: number; // C1
  motionalInductance_mH: number; // L1
  tolerance_ppm: number;
  package: string;
}

// Common crystal frequencies
export const commonCrystals = [
  { freq: 32768, label: "32.768 kHz (RTC)", package: "Cylinder/SMD" },
  { freq: 1e6, label: "1 MHz", package: "HC-49" },
  { freq: 4e6, label: "4 MHz", package: "HC-49" },
  { freq: 8e6, label: "8 MHz (Arduino)", package: "HC-49" },
  { freq: 10e6, label: "10 MHz", package: "HC-49" },
  { freq: 12e6, label: "12 MHz", package: "HC-49" },
  { freq: 16e6, label: "16 MHz (Arduino Uno)", package: "HC-49" },
  { freq: 20e6, label: "20 MHz", package: "HC-49" },
  { freq: 25e6, label: "25 MHz (Ethernet)", package: "HC-49" },
  { freq: 32e6, label: "32 MHz", package: "SMD 3225" },
  { freq: 50e6, label: "50 MHz", package: "SMD 3225" },
];

export const useCrystalCalc = () => {
  /**
   * គណនា Load Capacitors សម្រាប់ Crystal
   * CL = (C1 × C2) / (C1 + C2) + Cstray
   * បើ C1 = C2 → CL = C1/2 + Cstray
   * → C1 = C2 = 2 × (CL - Cstray)
   */
  const calculateLoadCaps = (loadCap_pF: number, strayCap_pF: number = 5) => {
    if (loadCap_pF <= 0) return null;

    const c1 = 2 * (loadCap_pF - strayCap_pF);

    if (c1 <= 0) {
      return {
        c1: 0,
        c2: 0,
        c1Formatted: "—",
        c2Formatted: "—",
        error: "Load capacitance តូចជាង stray capacitance!",
      };
    }

    // Find nearest standard value
    const standardValues = [
      5, 6.8, 8.2, 10, 12, 15, 18, 20, 22, 27, 30, 33, 39, 47, 56, 68, 82, 100,
    ];
    const nearest = standardValues.reduce((prev, curr) =>
      Math.abs(curr - c1) < Math.abs(prev - c1) ? curr : prev,
    );

    return {
      c1,
      c2: c1,
      c1Formatted: c1.toFixed(2) + " pF",
      c2Formatted: c1.toFixed(2) + " pF",
      nearestStandard: nearest,
      nearestFormatted: nearest + " pF",
      actualCL: nearest / 2 + strayCap_pF,
      actualCLFormatted: (nearest / 2 + strayCap_pF).toFixed(2) + " pF",
      error: null,
    };
  };

  /**
   * គណនា Series Resonant Frequency (Fs)
   * Fs = 1 / (2π × √(L1 × C1))
   */
  const calculateSeriesResonance = (
    inductance_mH: number,
    capacitance_fF: number,
  ) => {
    if (inductance_mH <= 0 || capacitance_fF <= 0) return null;

    const L1 = inductance_mH * 1e-3;
    const C1 = capacitance_fF * 1e-15;
    const fs = 1 / (2 * Math.PI * Math.sqrt(L1 * C1));

    return {
      frequency_Hz: fs,
      frequencyFormatted:
        fs >= 1e6
          ? (fs / 1e6).toFixed(3) + " MHz"
          : fs >= 1e3
            ? (fs / 1e3).toFixed(2) + " kHz"
            : fs.toFixed(2) + " Hz",
    };
  };

  /**
   * គណនា Parallel Resonant Frequency (Fp)
   * Fp = Fs × √(1 + C1/C0)
   */
  const calculateParallelResonance = (
    seriesFreq_Hz: number,
    motionalCap_fF: number,
    shuntCap_pF: number,
  ) => {
    if (seriesFreq_Hz <= 0 || motionalCap_fF <= 0 || shuntCap_pF <= 0)
      return null;

    const C1 = motionalCap_fF * 1e-15;
    const C0 = shuntCap_pF * 1e-12;
    const fp = seriesFreq_Hz * Math.sqrt(1 + C1 / C0);

    return {
      frequency_Hz: fp,
      frequencyFormatted:
        fp >= 1e6
          ? (fp / 1e6).toFixed(3) + " MHz"
          : fp >= 1e3
            ? (fp / 1e3).toFixed(2) + " kHz"
            : fp.toFixed(2) + " Hz",
    };
  };

  /**
   * គណនា Pullability
   * ΔF/F = (C1/2) × (1/(C0+CL) − 1/(C0+CL0))
   */
  const calculatePullability = (
    nominalFreq_Hz: number,
    motionalCap_fF: number,
    shuntCap_pF: number,
    loadCap1_pF: number,
    loadCap2_pF: number,
  ) => {
    if (
      nominalFreq_Hz <= 0 ||
      motionalCap_fF <= 0 ||
      shuntCap_pF <= 0 ||
      loadCap1_pF <= 0 ||
      loadCap2_pF <= 0
    )
      return null;

    const C1 = motionalCap_fF * 1e-15;
    const C0 = shuntCap_pF * 1e-12;
    const CL1 = loadCap1_pF * 1e-12;
    const CL2 = loadCap2_pF * 1e-12;

    const deltaF_F = (C1 / 2) * (1 / (C0 + CL1) - 1 / (C0 + CL2));
    const deltaF_Hz = deltaF_F * nominalFreq_Hz;

    return {
      deltaF_F,
      deltaF_ppm: deltaF_F * 1e6,
      deltaF_Hz,
      deltaFFormatted: (deltaF_F * 1e6).toFixed(2) + " ppm",
      deltaHzFormatted:
        Math.abs(deltaF_Hz) >= 1e3
          ? (deltaF_Hz / 1e3).toFixed(2) + " kHz"
          : deltaF_Hz.toFixed(2) + " Hz",
    };
  };

  /**
   * គណនា ESR Power Dissipation
   * P = I² × ESR ដែល I = 2π × F × V × C1
   */
  const calculateDrivePower = (
    frequency_Hz: number,
    driveVoltage_V: number,
    motionalCap_fF: number,
    esr_ohm: number,
  ) => {
    if (
      frequency_Hz <= 0 ||
      driveVoltage_V <= 0 ||
      motionalCap_fF <= 0 ||
      esr_ohm <= 0
    )
      return null;

    const C1 = motionalCap_fF * 1e-15;
    const current = 2 * Math.PI * frequency_Hz * driveVoltage_V * C1;
    const power_uW = current * current * esr_ohm * 1e6;

    return {
      current_mA: current * 1000,
      currentFormatted: (current * 1000).toFixed(4) + " mA",
      power_uW,
      powerFormatted:
        power_uW < 1000
          ? power_uW.toFixed(2) + " µW"
          : (power_uW / 1000).toFixed(3) + " mW",
    };
  };

  /**
   * គណនា Pierce Oscillator (Common configuration)
   * ត្រូវការ C1, C2 និង Rf (feedback resistor)
   */
  const pierceOscillator = (
    frequency_Hz: number,
    loadCap_pF: number,
    strayCap_pF: number = 5,
  ) => {
    const caps = calculateLoadCaps(loadCap_pF, strayCap_pF);
    if (!caps || caps.error) return null;

    // Recommended Rf: 1M for 32kHz, 10M for MHz
    const rf = frequency_Hz < 100e3 ? 10e6 : 1e6;
    // Recommended Rs (series): 100-1000Ω for MHz, 100k-1M for 32kHz
    const rs = frequency_Hz < 100e3 ? 220e3 : 470;

    return {
      c1: caps.nearestStandard,
      c2: caps.nearestStandard,
      c1Formatted: caps.nearestStandard + " pF",
      c2Formatted: caps.nearestStandard + " pF",
      rf,
      rfFormatted: rf >= 1e6 ? rf / 1e6 + " MΩ" : rf / 1e3 + " kΩ",
      rs,
      rsFormatted: rs >= 1e3 ? (rs / 1e3).toFixed(0) + " kΩ" : rs + " Ω",
    };
  };

  return {
    commonCrystals,
    calculateLoadCaps,
    calculateSeriesResonance,
    calculateParallelResonance,
    calculatePullability,
    calculateDrivePower,
    pierceOscillator,
  };
};
