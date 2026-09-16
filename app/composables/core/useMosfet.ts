export interface MosfetSpec {
  partNumber: string;
  type: "N-Channel" | "P-Channel";
  typeKh: string;
  vDS: number; // Drain-Source Voltage (V)
  iD_max: number; // Max Drain Current (A)
  rDS_on: number; // On-Resistance (Ω)
  vGS_th: number; // Gate Threshold Voltage (V)
  vGS_max: number; // Max Gate Voltage (V)
  qG: number; // Total Gate Charge (nC)
  pMax: number; // Max Power (W)
  package: string;
  usage: string;
}

export const commonMosfets: MosfetSpec[] = [
  // N-Channel Logic Level
  {
    partNumber: "IRLZ44N",
    type: "N-Channel",
    typeKh: "N-Ch Logic",
    vDS: 55,
    iD_max: 47,
    rDS_on: 0.022,
    vGS_th: 2,
    vGS_max: 16,
    qG: 48,
    pMax: 110,
    package: "TO-220",
    usage: "Logic Level Switch",
  },
  {
    partNumber: "IRL540N",
    type: "N-Channel",
    typeKh: "N-Ch Logic",
    vDS: 100,
    iD_max: 36,
    rDS_on: 0.044,
    vGS_th: 2,
    vGS_max: 16,
    qG: 44,
    pMax: 130,
    package: "TO-220",
    usage: "High Power Switch",
  },
  {
    partNumber: "IRF3205",
    type: "N-Channel",
    typeKh: "N-Ch Power",
    vDS: 55,
    iD_max: 110,
    rDS_on: 0.008,
    vGS_th: 4,
    vGS_max: 20,
    qG: 146,
    pMax: 200,
    package: "TO-220",
    usage: "High Current",
  },
  {
    partNumber: "IRFZ44N",
    type: "N-Channel",
    typeKh: "N-Ch Power",
    vDS: 55,
    iD_max: 49,
    rDS_on: 0.0175,
    vGS_th: 4,
    vGS_max: 20,
    qG: 63,
    pMax: 94,
    package: "TO-220",
    usage: "Power Switching",
  },
  {
    partNumber: "2N7000",
    type: "N-Channel",
    typeKh: "N-Ch Small",
    vDS: 60,
    iD_max: 0.2,
    rDS_on: 5,
    vGS_th: 2.1,
    vGS_max: 20,
    qG: 1.5,
    pMax: 0.4,
    package: "TO-92",
    usage: "Small Signal",
  },
  {
    partNumber: "BS170",
    type: "N-Channel",
    typeKh: "N-Ch Small",
    vDS: 60,
    iD_max: 0.5,
    rDS_on: 5,
    vGS_th: 2.1,
    vGS_max: 20,
    qG: 1.3,
    pMax: 0.83,
    package: "TO-92",
    usage: "Small Signal",
  },

  // N-Channel High Voltage
  {
    partNumber: "IRF840",
    type: "N-Channel",
    typeKh: "N-Ch HV",
    vDS: 500,
    iD_max: 8,
    rDS_on: 0.85,
    vGS_th: 4,
    vGS_max: 20,
    qG: 63,
    pMax: 125,
    package: "TO-220",
    usage: "High Voltage",
  },
  {
    partNumber: "IRFP460",
    type: "N-Channel",
    typeKh: "N-Ch HV",
    vDS: 500,
    iD_max: 20,
    rDS_on: 0.27,
    vGS_th: 4,
    vGS_max: 20,
    qG: 210,
    pMax: 280,
    package: "TO-247",
    usage: "HV High Power",
  },

  // P-Channel
  {
    partNumber: "IRF9540N",
    type: "P-Channel",
    typeKh: "P-Ch Power",
    vDS: 100,
    iD_max: 23,
    rDS_on: 0.117,
    vGS_th: -4,
    vGS_max: 20,
    qG: 97,
    pMax: 150,
    package: "TO-220",
    usage: "High Side Switch",
  },
  {
    partNumber: "IRF4905",
    type: "P-Channel",
    typeKh: "P-Ch Power",
    vDS: 55,
    iD_max: 74,
    rDS_on: 0.02,
    vGS_th: -4,
    vGS_max: 20,
    qG: 120,
    pMax: 200,
    package: "TO-220",
    usage: "High Side Switch",
  },
  {
    partNumber: "IRLML6402",
    type: "P-Channel",
    typeKh: "P-Ch Logic",
    vDS: 20,
    iD_max: 3.7,
    rDS_on: 0.065,
    vGS_th: -0.9,
    vGS_max: 12,
    qG: 6,
    pMax: 1.3,
    package: "SOT-23",
    usage: "Logic Level",
  },
];

export const useMosfet = () => {
  // គណនា Gate Resistor
  const calculateGateResistor = (
    vDrive: number,
    qG_nC: number,
    targetRiseTime_ns: number = 100,
  ) => {
    if (vDrive <= 0 || qG_nC <= 0 || targetRiseTime_ns <= 0) return null;

    // Rg = t_rise / (2.2 × Ciss) ≈ t_rise × Vdrive / (2.2 × Qg)
    const qG = qG_nC * 1e-9;
    const tRise = targetRiseTime_ns * 1e-9;
    const rG = tRise / (2.2 * (qG / vDrive));

    return {
      rG,
      rGFormatted: formatResistance(rG),
      peakCurrent: vDrive / rG,
      peakCurrentFormatted: (vDrive / rG).toFixed(2) + " A",
    };
  };

  // គណនាការសាយភាយកម្ដៅ (Power Dissipation)
  const calculatePowerLoss = (
    iD: number,
    rDS_on: number,
    switching_freq: number = 0,
    qG_nC: number = 0,
    vDrive: number = 10,
    qrr_nC: number = 0,
    vDS: number = 0,
  ) => {
    if (iD < 0 || rDS_on < 0) return null;

    // Conduction Loss: P = I² × Rds(on)
    const pConduction = iD * iD * rDS_on;

    // Switching Loss: P = 0.5 × Vds × Id × (tr + tf) × f
    // ជាប្រហែល: Psw ≈ Qg × Vdrive × f
    const pGate = qG_nC > 0 ? qG_nC * 1e-9 * vDrive * switching_freq : 0;
    const pSwitching = pGate; // ជាប្រហែល

    // Output Cap Loss
    const pOutputCap = qrr_nC > 0 ? qrr_nC * 1e-9 * vDS * switching_freq : 0;

    const pTotal = pConduction + pSwitching + pOutputCap;

    return {
      pConduction,
      pConductionFormatted: formatWatt(pConduction),
      pSwitching,
      pSwitchingFormatted: formatWatt(pSwitching),
      pTotal,
      pTotalFormatted: formatWatt(pTotal),
    };
  };

  // គណនា Heatsink ត្រូវការ
  const calculateHeatsink = (
    pDissipation: number,
    tAmbient: number = 25,
    tJunction_max: number = 150,
    rThetaJC: number = 1.5, // Junction to Case
    rThetaCS: number = 0.5, // Case to Heatsink
  ) => {
    if (pDissipation <= 0) return null;

    const tRise = tJunction_max - tAmbient;
    const rThetaJA_max = tRise / pDissipation;
    const rThetaSA_max = rThetaJA_max - rThetaJC - rThetaCS;

    return {
      rThetaJA_max,
      rThetaJA_maxFormatted: rThetaJA_max.toFixed(2) + " °C/W",
      rThetaSA_max,
      rThetaSA_maxFormatted:
        rThetaSA_max > 0
          ? rThetaSA_max.toFixed(2) + " °C/W"
          : "មិនចាំបាច់ Heatsink",
      needsHeatsink: rThetaSA_max > 0,
    };
  };

  // ជ្រើសរើស MOSFET សមស្រប
  const findSuitableMosfets = (
    requiredVDS: number,
    requiredID: number,
    requiredRDSon: number = Infinity,
    preferLogicLevel: boolean = false,
  ) => {
    return commonMosfets.filter((m) => {
      if (m.vDS < requiredVDS * 1.2) return false;
      if (m.iD_max < requiredID * 1.5) return false;
      if (m.rDS_on > requiredRDSon) return false;
      if (preferLogicLevel && Math.abs(m.vGS_th) > 2.5) return false;
      return true;
    });
  };

  const formatResistance = (ohms: number): string => {
    if (isNaN(ohms)) return "0 Ω";
    if (ohms >= 1e6) return (ohms / 1e6).toFixed(2) + " MΩ";
    if (ohms >= 1e3) return (ohms / 1e3).toFixed(2) + " kΩ";
    return ohms.toFixed(2) + " Ω";
  };

  const formatWatt = (w: number): string => {
    if (isNaN(w)) return "0 W";
    if (w >= 1) return w.toFixed(2) + " W";
    if (w >= 1e-3) return (w * 1e3).toFixed(2) + " mW";
    return (w * 1e6).toFixed(1) + " µW";
  };

  return {
    commonMosfets,
    calculateGateResistor,
    calculatePowerLoss,
    calculateHeatsink,
    findSuitableMosfets,
    formatResistance,
    formatWatt,
  };
};
