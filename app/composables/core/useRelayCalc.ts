export const useRelayCalc = () => {
  const calculateDriver = (
    vCoil: number,
    rCoil: number,
    vDrive: number,
    hFE: number = 100,
    overdrive: number = 3,
  ) => {
    if (vCoil <= 0 || rCoil <= 0 || vDrive <= 0 || hFE <= 0) return null;

    const iCoil = vCoil / rCoil;
    const iB_min = iCoil / hFE;
    const iB_actual = iB_min * overdrive;
    const rB = (vDrive - 0.7) / iB_actual;
    const pR = Math.pow(vDrive - 0.7, 2) / rB;

    return {
      iCoil_mA: iCoil * 1000,
      iCoilFormatted: (iCoil * 1000).toFixed(2) + " mA",
      rB,
      rBFormatted:
        rB >= 1e3 ? (rB / 1e3).toFixed(2) + " kΩ" : rB.toFixed(0) + " Ω",
      pRFormatted: pR.toFixed(3) + " W",
      diode: "1N4148 ឬ 1N4007 (Flyback Diode)",
    };
  };

  return { calculateDriver };
};
