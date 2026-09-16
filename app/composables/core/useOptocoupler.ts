export interface OptocouplerSpec {
  partNumber: string;
  typeKh: string;
  vF: number; // Forward Voltage (V)
  iF_max: number; // Max Forward Current (mA)
  ctr_min: number; // Current Transfer Ratio min (%)
  ctr_max: number; // Current Transfer Ratio max (%)
  vCEO: number; // Output Collector-Emitter Voltage (V)
  iC_max: number; // Max Output Current (mA)
  vISO: number; // Isolation Voltage (Vrms)
  speed: string; // Speed: Slow, Fast, Very Fast
  package: string;
}

export const commonOptocouplers: OptocouplerSpec[] = [
  {
    partNumber: "PC817",
    typeKh: "General Purpose",
    vF: 1.2,
    iF_max: 50,
    ctr_min: 50,
    ctr_max: 600,
    vCEO: 35,
    iC_max: 50,
    vISO: 5000,
    speed: "Slow",
    package: "DIP-4",
  },
  {
    partNumber: "PC817A",
    typeKh: "General Purpose",
    vF: 1.2,
    iF_max: 50,
    ctr_min: 80,
    ctr_max: 160,
    vCEO: 35,
    iC_max: 50,
    vISO: 5000,
    speed: "Slow",
    package: "DIP-4",
  },
  {
    partNumber: "PC817B",
    typeKh: "General Purpose",
    vF: 1.2,
    iF_max: 50,
    ctr_min: 130,
    ctr_max: 260,
    vCEO: 35,
    iC_max: 50,
    vISO: 5000,
    speed: "Slow",
    package: "DIP-4",
  },
  {
    partNumber: "PC817D",
    typeKh: "General Purpose",
    vF: 1.2,
    iF_max: 50,
    ctr_min: 300,
    ctr_max: 600,
    vCEO: 35,
    iC_max: 50,
    vISO: 5000,
    speed: "Slow",
    package: "DIP-4",
  },

  {
    partNumber: "4N25",
    typeKh: "General Purpose",
    vF: 1.15,
    iF_max: 60,
    ctr_min: 20,
    ctr_max: 20,
    vCEO: 30,
    iC_max: 100,
    vISO: 5000,
    speed: "Slow",
    package: "DIP-6",
  },
  {
    partNumber: "4N35",
    typeKh: "General Purpose",
    vF: 1.15,
    iF_max: 60,
    ctr_min: 100,
    ctr_max: 100,
    vCEO: 30,
    iC_max: 100,
    vISO: 5000,
    speed: "Slow",
    package: "DIP-6",
  },

  {
    partNumber: "6N137",
    typeKh: "High Speed",
    vF: 1.4,
    iF_max: 20,
    ctr_min: 1000,
    ctr_max: 1000,
    vCEO: 7,
    iC_max: 50,
    vISO: 3750,
    speed: "Very Fast",
    package: "DIP-8",
  },
  {
    partNumber: "6N136",
    typeKh: "High Speed",
    vF: 1.4,
    iF_max: 25,
    ctr_min: 19,
    ctr_max: 19,
    vCEO: 20,
    iC_max: 8,
    vISO: 3750,
    speed: "Very Fast",
    package: "DIP-8",
  },

  {
    partNumber: "MOC3021",
    typeKh: "Triac Driver",
    vF: 1.5,
    iF_max: 60,
    ctr_min: 0,
    ctr_max: 0,
    vCEO: 400,
    iC_max: 100,
    vISO: 5000,
    speed: "N/A",
    package: "DIP-6",
  },
  {
    partNumber: "MOC3023",
    typeKh: "Triac Driver",
    vF: 1.5,
    iF_max: 60,
    ctr_min: 0,
    ctr_max: 0,
    vCEO: 400,
    iC_max: 100,
    vISO: 5000,
    speed: "N/A",
    package: "DIP-6",
  },

  {
    partNumber: "MOC3063",
    typeKh: "Zero-Cross Triac",
    vF: 1.5,
    iF_max: 60,
    ctr_min: 0,
    ctr_max: 0,
    vCEO: 600,
    iC_max: 100,
    vISO: 5000,
    speed: "N/A",
    package: "DIP-6",
  },

  {
    partNumber: "LTV-817",
    typeKh: "General Purpose",
    vF: 1.2,
    iF_max: 50,
    ctr_min: 50,
    ctr_max: 600,
    vCEO: 35,
    iC_max: 50,
    vISO: 5000,
    speed: "Slow",
    package: "DIP-4",
  },
  {
    partNumber: "EL817",
    typeKh: "General Purpose",
    vF: 1.2,
    iF_max: 60,
    ctr_min: 50,
    ctr_max: 600,
    vCEO: 35,
    iC_max: 50,
    vISO: 5000,
    speed: "Slow",
    package: "DIP-4",
  },
];

export const useOptocoupler = () => {
  // គណនា Input Resistor (LED side)
  const calculateInputResistor = (
    vIn: number,
    vF: number = 1.2,
    iF_mA: number = 10,
  ) => {
    if (vIn <= vF || iF_mA <= 0) return null;

    const iF = iF_mA / 1000;
    const r = (vIn - vF) / iF;
    const pR = Math.pow(vIn - vF, 2) / r;

    return {
      r,
      rFormatted: formatResistance(r),
      pR,
      pRFormatted: formatWatt(pR),
      iF_mA,
    };
  };

  // គណនា Output Load Resistor (transistor side)
  const calculateOutputResistor = (vCC: number, iC_target_mA: number = 5) => {
    if (vCC <= 0.4 || iC_target_mA <= 0) return null;

    const iC = iC_target_mA / 1000;
    const rL = (vCC - 0.4) / iC; // Vce_sat ≈ 0.4V
    const pR = Math.pow(vCC - 0.4, 2) / rL;

    return {
      rL,
      rLFormatted: formatResistance(rL),
      pR,
      pRFormatted: formatWatt(pR),
      iC_mA: iC_target_mA,
    };
  };

  // គណនា Collector Current ពី Input
  const calculateCollectorCurrent = (
    vIn: number,
    rIn: number,
    ctr_percent: number,
    vF: number = 1.2,
  ) => {
    if (vIn <= vF || rIn <= 0 || ctr_percent <= 0) return null;

    const iF = (vIn - vF) / rIn;
    const iC = iF * (ctr_percent / 100);

    return {
      iF,
      iF_mA: iF * 1000,
      iF_mAFormatted: (iF * 1000).toFixed(2) + " mA",
      iC,
      iC_mA: iC * 1000,
      iC_mAFormatted: (iC * 1000).toFixed(2) + " mA",
    };
  };

  // ជ្រើសរើស Optocoupler សមស្រប
  const findSuitableOptocouplers = (
    requiredCTR: number = 0,
    requiredSpeed: "Slow" | "Fast" | "Very Fast" | "Any" = "Any",
    requiredVCEO: number = 0,
  ) => {
    return commonOptocouplers.filter((o) => {
      if (requiredCTR > 0 && o.ctr_min < requiredCTR) return false;
      if (requiredVCEO > 0 && o.vCEO < requiredVCEO) return false;
      if (requiredSpeed !== "Any" && o.speed !== requiredSpeed) return false;
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
    commonOptocouplers,
    calculateInputResistor,
    calculateOutputResistor,
    calculateCollectorCurrent,
    findSuitableOptocouplers,
    formatResistance,
    formatWatt,
  };
};
