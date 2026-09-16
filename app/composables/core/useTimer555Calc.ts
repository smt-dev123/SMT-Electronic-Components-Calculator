export const useTimer555Calc = () => {
  // Astable Mode
  const astable = (r1: number, r2: number, c_uF: number) => {
    if (r1 <= 0 || r2 <= 0 || c_uF <= 0) return null;

    const c = c_uF / 1e6;
    const freq = 1.44 / ((r1 + 2 * r2) * c);
    const duty = ((r1 + r2) / (r1 + 2 * r2)) * 100;
    const period = 1 / freq;
    const tHigh = 0.693 * (r1 + r2) * c;
    const tLow = 0.693 * r2 * c;

    return {
      frequency_Hz: freq,
      frequencyFormatted:
        freq >= 1e6
          ? (freq / 1e6).toFixed(3) + " MHz"
          : freq >= 1e3
            ? (freq / 1e3).toFixed(2) + " kHz"
            : freq.toFixed(2) + " Hz",
      dutyCycle: duty,
      dutyFormatted: duty.toFixed(2) + " %",
      period_s: period,
      periodFormatted:
        period < 0.001
          ? (period * 1e6).toFixed(2) + " µs"
          : period < 1
            ? (period * 1000).toFixed(2) + " ms"
            : period.toFixed(3) + " s",
      tHighFormatted:
        tHigh < 0.001
          ? (tHigh * 1e6).toFixed(2) + " µs"
          : (tHigh * 1000).toFixed(2) + " ms",
      tLowFormatted:
        tLow < 0.001
          ? (tLow * 1e6).toFixed(2) + " µs"
          : (tLow * 1000).toFixed(2) + " ms",
    };
  };

  // Monostable Mode (One-shot)
  const monostable = (r: number, c_uF: number) => {
    if (r <= 0 || c_uF <= 0) return null;

    const c = c_uF / 1e6;
    const pulseWidth = 1.1 * r * c;

    return {
      pulseWidth_s: pulseWidth,
      pulseWidthFormatted:
        pulseWidth < 0.001
          ? (pulseWidth * 1e6).toFixed(2) + " µs"
          : pulseWidth < 1
            ? (pulseWidth * 1000).toFixed(2) + " ms"
            : pulseWidth.toFixed(3) + " s",
    };
  };

  // Frequency divider formula
  const findResistorsForFreq = (targetFreq: number, c_uF: number) => {
    if (targetFreq <= 0 || c_uF <= 0) return null;

    const c = c_uF / 1e6;
    // R2 = 0.693 / (f × C) × 0.5 for 50% duty (approximation)
    const rTotal = 1.44 / (targetFreq * c);
    // សន្មត R1 = R2 → freq = 1.44 / (3R × C)
    const r = rTotal / 3;

    return {
      r1: r,
      r2: r,
      r1Formatted:
        r >= 1e6
          ? (r / 1e6).toFixed(2) + " MΩ"
          : r >= 1e3
            ? (r / 1e3).toFixed(2) + " kΩ"
            : r.toFixed(2) + " Ω",
      r2Formatted:
        r >= 1e6
          ? (r / 1e6).toFixed(2) + " MΩ"
          : r >= 1e3
            ? (r / 1e3).toFixed(2) + " kΩ"
            : r.toFixed(2) + " Ω",
    };
  };

  return { astable, monostable, findResistorsForFreq };
};
