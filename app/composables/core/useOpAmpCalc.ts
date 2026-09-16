export const useOpAmpCalc = () => {
  // Non-inverting Amplifier
  const nonInverting = (r1: number, r2: number, vin: number = 1) => {
    if (r1 <= 0 || r2 <= 0) return null;

    const gain = 1 + r2 / r1;
    const vout = vin * gain;

    return {
      gain,
      gainFormatted: gain.toFixed(3) + "×",
      gainDb: 20 * Math.log10(gain),
      gainDbFormatted: (20 * Math.log10(gain)).toFixed(2) + " dB",
      vout,
      voutFormatted: vout.toFixed(3) + " V",
    };
  };

  // Inverting Amplifier
  const inverting = (r1: number, r2: number, vin: number = 1) => {
    if (r1 <= 0 || r2 <= 0) return null;

    const gain = -(r2 / r1);
    const vout = vin * gain;

    return {
      gain,
      gainFormatted: gain.toFixed(3) + "×",
      gainDb: 20 * Math.log10(Math.abs(gain)),
      gainDbFormatted: (20 * Math.log10(Math.abs(gain))).toFixed(2) + " dB",
      vout,
      voutFormatted: vout.toFixed(3) + " V",
    };
  };

  // Differential Amplifier
  const differential = (
    r1: number,
    r2: number,
    r3: number,
    r4: number,
    v1: number,
    v2: number,
  ) => {
    if (r1 <= 0 || r2 <= 0 || r3 <= 0 || r4 <= 0) return null;

    // Vout = (R2/R1) × (V2 - V1) បើ R1=R3, R2=R4
    const gain = r2 / r1;
    const vout = gain * (v2 - v1);

    return {
      gain,
      gainFormatted: gain.toFixed(3) + "×",
      vout,
      voutFormatted: vout.toFixed(3) + " V",
    };
  };

  // Active Low-Pass Filter (Sallen-Key)
  const lowPassFilter = (r: number, c: number) => {
    if (r <= 0 || c <= 0) return null;

    const fc = 1 / (2 * Math.PI * r * c);

    return {
      cutoff_Hz: fc,
      cutoffFormatted:
        fc >= 1e6
          ? (fc / 1e6).toFixed(2) + " MHz"
          : fc >= 1e3
            ? (fc / 1e3).toFixed(2) + " kHz"
            : fc.toFixed(2) + " Hz",
    };
  };

  // Integrator / Differentiator
  const integrator = (r: number, c: number, freq: number) => {
    if (r <= 0 || c <= 0 || freq <= 0) return null;

    const gain = 1 / (2 * Math.PI * freq * r * c);

    return {
      gain,
      gainFormatted: gain.toFixed(4) + "×",
    };
  };

  return { nonInverting, inverting, differential, lowPassFilter, integrator };
};
