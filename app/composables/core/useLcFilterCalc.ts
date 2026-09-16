export const useLcFilterCalc = () => {
  /**
   * LC Low-Pass Filter Cutoff
   * fc = 1 / (2π × √(L × C))
   */
  const lowPass = (inductance_uH: number, capacitance_uF: number) => {
    if (inductance_uH <= 0 || capacitance_uF <= 0) return null;

    const L = inductance_uH * 1e-6;
    const C = capacitance_uF * 1e-6;
    const fc = 1 / (2 * Math.PI * Math.sqrt(L * C));

    return {
      cutoff_Hz: fc,
      cutoffFormatted: formatFreq(fc),
    };
  };

  /**
   * LC High-Pass Filter
   * fc = 1 / (2π × √(L × C)) — same formula, different topology
   */
  const highPass = (inductance_uH: number, capacitance_uF: number) => {
    return lowPass(inductance_uH, capacitance_uF);
  };

  /**
   * LC Band-Pass Filter
   * fc = 1 / (2π × √(L × C))
   * Bandwidth = R / (2π × L)
   */
  const bandPass = (
    inductance_uH: number,
    capacitance_uF: number,
    resistance_ohm: number = 50,
  ) => {
    if (inductance_uH <= 0 || capacitance_uF <= 0 || resistance_ohm <= 0)
      return null;

    const L = inductance_uH * 1e-6;
    const C = capacitance_uF * 1e-6;
    const fc = 1 / (2 * Math.PI * Math.sqrt(L * C));
    const bw = resistance_ohm / (2 * Math.PI * L);
    const q = fc / bw;

    return {
      centerFreq_Hz: fc,
      centerFormatted: formatFreq(fc),
      bandwidth_Hz: bw,
      bandwidthFormatted: formatFreq(bw),
      q,
      qFormatted: q.toFixed(2),
    };
  };

  /**
   * Characteristic Impedance
   * Z0 = √(L / C)
   */
  const characteristicImpedance = (
    inductance_uH: number,
    capacitance_uF: number,
  ) => {
    if (inductance_uH <= 0 || capacitance_uF <= 0) return null;

    const L = inductance_uH * 1e-6;
    const C = capacitance_uF * 1e-6;
    const z0 = Math.sqrt(L / C);

    return {
      impedance_ohm: z0,
      impedanceFormatted:
        z0 >= 1e6
          ? (z0 / 1e6).toFixed(2) + " MΩ"
          : z0 >= 1e3
            ? (z0 / 1e3).toFixed(2) + " kΩ"
            : z0.toFixed(2) + " Ω",
    };
  };

  /**
   * Q Factor for Series RLC
   * Q = (1/R) × √(L/C)
   */
  const seriesQ = (
    inductance_uH: number,
    capacitance_uF: number,
    resistance_ohm: number,
  ) => {
    if (inductance_uH <= 0 || capacitance_uF <= 0 || resistance_ohm <= 0)
      return null;

    const L = inductance_uH * 1e-6;
    const C = capacitance_uF * 1e-6;
    const q = (1 / resistance_ohm) * Math.sqrt(L / C);

    return {
      q,
      qFormatted: q.toFixed(3),
    };
  };

  /**
   * Q Factor for Parallel RLC
   * Q = R × √(C/L)
   */
  const parallelQ = (
    inductance_uH: number,
    capacitance_uF: number,
    resistance_ohm: number,
  ) => {
    if (inductance_uH <= 0 || capacitance_uF <= 0 || resistance_ohm <= 0)
      return null;

    const L = inductance_uH * 1e-6;
    const C = capacitance_uF * 1e-6;
    const q = resistance_ohm * Math.sqrt(C / L);

    return {
      q,
      qFormatted: q.toFixed(3),
    };
  };

  /**
   * Damping Factor (ζ)
   * ζ = (R/2) × √(C/L)
   */
  const dampingFactor = (
    inductance_uH: number,
    capacitance_uF: number,
    resistance_ohm: number,
  ) => {
    if (inductance_uH <= 0 || capacitance_uF <= 0 || resistance_ohm <= 0)
      return null;

    const L = inductance_uH * 1e-6;
    const C = capacitance_uF * 1e-6;
    const zeta = (resistance_ohm / 2) * Math.sqrt(C / L);

    let response = "Undamped";
    if (zeta > 1) response = "Overdamped";
    else if (zeta === 1) response = "Critically Damped";
    else if (zeta > 0) response = "Underdamped";

    return {
      zeta,
      zetaFormatted: zeta.toFixed(4),
      response,
    };
  };

  /**
   * Attenuation at frequency (dB/decade)
   * For Low-Pass: -40 dB/decade after cutoff (2nd order)
   */
  const attenuation = (
    frequency_Hz: number,
    cutoff_Hz: number,
    order: number = 2,
  ) => {
    if (frequency_Hz <= 0 || cutoff_Hz <= 0) return null;

    const ratio = frequency_Hz / cutoff_Hz;
    // 2nd order: -40 dB/decade
    // nth order: -20n dB/decade
    const dbPerDecade = -20 * order;
    const decades = Math.log10(ratio);
    const attenuation_dB = dbPerDecade * decades;

    return {
      attenuation_dB,
      attenuationFormatted: attenuation_dB.toFixed(2) + " dB",
      dbPerDecade,
    };
  };

  // ===== Helpers =====
  const formatFreq = (freq: number): string => {
    if (freq >= 1e9) return (freq / 1e9).toFixed(2) + " GHz";
    if (freq >= 1e6) return (freq / 1e6).toFixed(2) + " MHz";
    if (freq >= 1e3) return (freq / 1e3).toFixed(2) + " kHz";
    return freq.toFixed(2) + " Hz";
  };

  return {
    lowPass,
    highPass,
    bandPass,
    characteristicImpedance,
    seriesQ,
    parallelQ,
    dampingFactor,
    attenuation,
  };
};
