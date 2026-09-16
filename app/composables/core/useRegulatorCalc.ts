export const useRegulatorCalc = () => {
  // LM317 Adjustable Regulator
  const lm317 = (r1: number, r2: number) => {
    if (r1 <= 0 || r2 <= 0) return null;
    // Vout = 1.25 × (1 + R2/R1)
    const vout = 1.25 * (1 + r2 / r1);
    return {
      vout,
      voutFormatted: vout.toFixed(2) + " V",
    };
  };

  // LM7805 Series Fixed
  const fixedRegulator = (vin: number, vout: number, iLoad: number) => {
    if (vin <= vout || iLoad <= 0) return null;
    const powerLoss = (vin - vout) * iLoad;
    const efficiency = (vout / vin) * 100;
    return {
      powerLoss,
      powerLossFormatted: powerLoss.toFixed(3) + " W",
      efficiency,
      efficiencyFormatted: efficiency.toFixed(1) + " %",
      needsHeatsink: powerLoss > 1,
    };
  };

  return { lm317, fixedRegulator };
};
