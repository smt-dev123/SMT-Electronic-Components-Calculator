// ===== Local Data =====
export interface TransistorSpec {
  partNumber: string;
  type: "NPN" | "PNP";
  typeKh: string;
  vCEO: number;
  iC_max: number;
  hFE_min: number;
  hFE_max: number;
  pMax: number;
  vCE_sat: number;
  vBE: number;
  package: string;
  usage: string;
}

export const commonTransistors: TransistorSpec[] = [
  {
    partNumber: "2N3904",
    type: "NPN",
    typeKh: "NPN ទូទៅ",
    vCEO: 40,
    iC_max: 0.2,
    hFE_min: 100,
    hFE_max: 300,
    pMax: 0.625,
    vCE_sat: 0.2,
    vBE: 0.7,
    package: "TO-92",
    usage: "Signal",
  },
  {
    partNumber: "2N2222",
    type: "NPN",
    typeKh: "NPN ទូទៅ",
    vCEO: 40,
    iC_max: 0.8,
    hFE_min: 100,
    hFE_max: 300,
    pMax: 0.625,
    vCE_sat: 0.3,
    vBE: 0.7,
    package: "TO-92",
    usage: "Switching",
  },
  {
    partNumber: "BC547",
    type: "NPN",
    typeKh: "NPN ទូទៅ",
    vCEO: 45,
    iC_max: 0.1,
    hFE_min: 110,
    hFE_max: 800,
    pMax: 0.5,
    vCE_sat: 0.25,
    vBE: 0.7,
    package: "TO-92",
    usage: "Audio",
  },
  {
    partNumber: "BC337",
    type: "NPN",
    typeKh: "NPN ទូទៅ",
    vCEO: 45,
    iC_max: 0.8,
    hFE_min: 100,
    hFE_max: 630,
    pMax: 0.625,
    vCE_sat: 0.7,
    vBE: 0.7,
    package: "TO-92",
    usage: "Medium Load",
  },
  {
    partNumber: "S8050",
    type: "NPN",
    typeKh: "NPN ថាមពល",
    vCEO: 25,
    iC_max: 0.7,
    hFE_min: 85,
    hFE_max: 300,
    pMax: 0.625,
    vCE_sat: 0.6,
    vBE: 0.7,
    package: "TO-92",
    usage: "General",
  },
  {
    partNumber: "TIP41C",
    type: "NPN",
    typeKh: "NPN ថាមពល",
    vCEO: 100,
    iC_max: 6,
    hFE_min: 15,
    hFE_max: 75,
    pMax: 65,
    vCE_sat: 1.5,
    vBE: 1.5,
    package: "TO-220",
    usage: "Power",
  },
  {
    partNumber: "TIP122",
    type: "NPN",
    typeKh: "Darlington NPN",
    vCEO: 100,
    iC_max: 5,
    hFE_min: 1000,
    hFE_max: 1000,
    pMax: 65,
    vCE_sat: 2.0,
    vBE: 2.5,
    package: "TO-220",
    usage: "High Gain",
  },
  {
    partNumber: "2N3055",
    type: "NPN",
    typeKh: "NPN ថាមពល",
    vCEO: 60,
    iC_max: 15,
    hFE_min: 20,
    hFE_max: 70,
    pMax: 115,
    vCE_sat: 3.0,
    vBE: 1.5,
    package: "TO-3",
    usage: "High Power",
  },
  {
    partNumber: "BD139",
    type: "NPN",
    typeKh: "NPN ថាមពល",
    vCEO: 80,
    iC_max: 1.5,
    hFE_min: 25,
    hFE_max: 250,
    pMax: 12.5,
    vCE_sat: 0.5,
    vBE: 1.0,
    package: "TO-126",
    usage: "Driver",
  },
  {
    partNumber: "2N3906",
    type: "PNP",
    typeKh: "PNP ទូទៅ",
    vCEO: 40,
    iC_max: 0.2,
    hFE_min: 100,
    hFE_max: 300,
    pMax: 0.625,
    vCE_sat: 0.25,
    vBE: 0.7,
    package: "TO-92",
    usage: "Signal",
  },
  {
    partNumber: "BC557",
    type: "PNP",
    typeKh: "PNP ទូទៅ",
    vCEO: 45,
    iC_max: 0.1,
    hFE_min: 110,
    hFE_max: 800,
    pMax: 0.5,
    vCE_sat: 0.25,
    vBE: 0.7,
    package: "TO-92",
    usage: "Audio",
  },
  {
    partNumber: "TIP42C",
    type: "PNP",
    typeKh: "PNP ថាមពល",
    vCEO: 100,
    iC_max: 6,
    hFE_min: 15,
    hFE_max: 75,
    pMax: 65,
    vCE_sat: 1.5,
    vBE: 1.5,
    package: "TO-220",
    usage: "Power",
  },
  {
    partNumber: "TIP127",
    type: "PNP",
    typeKh: "Darlington PNP",
    vCEO: 100,
    iC_max: 5,
    hFE_min: 1000,
    hFE_max: 1000,
    pMax: 65,
    vCE_sat: 2.0,
    vBE: 2.5,
    package: "TO-220",
    usage: "High Gain",
  },
];

// ===== Composable =====
export const useTransistorCalc = () => {
  const formatResistance = (ohms: number): string => {
    if (isNaN(ohms)) return "0 Ω";
    if (ohms >= 1e6) return (ohms / 1e6).toFixed(2) + " MΩ";
    if (ohms >= 1e3) return (ohms / 1e3).toFixed(2) + " kΩ";
    return ohms.toFixed(2) + " Ω";
  };

  const formatCurrent = (amps: number): string => {
    if (isNaN(amps)) return "0 A";
    if (amps >= 1) return amps.toFixed(3) + " A";
    if (amps >= 1e-3) return (amps * 1e3).toFixed(2) + " mA";
    return (amps * 1e6).toFixed(1) + " µA";
  };

  const formatWatt = (w: number): string => {
    if (isNaN(w)) return "0 W";
    if (w >= 1) return w.toFixed(2) + " W";
    if (w >= 1e-3) return (w * 1e3).toFixed(2) + " mW";
    return (w * 1e6).toFixed(1) + " µW";
  };

  const calculateBaseResistor = (
    vIn: number,
    iLoad: number,
    hFE: number,
    vBE = 0.7,
    vCE_sat = 0.2,
    overdrive = 5,
  ) => {
    if (vIn <= vBE || iLoad <= 0 || hFE <= 0) return null;

    const iB_min = iLoad / hFE;
    const iB_actual = iB_min * overdrive;
    const rB = (vIn - vBE) / iB_actual;
    const pR = Math.pow(vIn - vBE, 2) / rB;

    return {
      iB_min,
      iB_actual,
      iB_minFormatted: formatCurrent(iB_min),
      iB_actualFormatted: formatCurrent(iB_actual),
      rB,
      rBFormatted: formatResistance(rB),
      pR,
      pRFormatted: formatWatt(pR),
      overdrive,
    };
  };

  const calculateCommonEmitter = (
    vCC: number,
    iC_target: number,
    hFE: number,
    vCE_target = 0.5,
    vBE = 0.7,
  ) => {
    if (vCC <= 0 || iC_target <= 0 || hFE <= 0) return null;

    const vCE_actual = vCC * vCE_target;
    const rC = (vCC - vCE_actual) / iC_target;
    const rE = rC * 0.1;
    const vB = vBE + iC_target * rE;
    const vE = vB - vBE;
    const iB = iC_target / hFE;
    const iDivider = iB * 10;
    const r1 = (vCC - vB) / (iDivider + iB);
    const r2 = vB / iDivider;
    const gain = -(rC / rE);

    return {
      rC,
      rCFormatted: formatResistance(rC),
      rE,
      rEFormatted: formatResistance(rE),
      r1,
      r1Formatted: formatResistance(r1),
      r2,
      r2Formatted: formatResistance(r2),
      vB: vB.toFixed(2) + " V",
      vE: vE.toFixed(2) + " V",
      iB: formatCurrent(iB),
      gain: gain.toFixed(1) + "×",
      vCE_actual: vCE_actual.toFixed(2) + " V",
    };
  };

  const findSuitableTransistors = (
    requiredVCEO: number,
    requiredIC: number,
    requiredP = 0,
  ) => {
    return commonTransistors.filter(
      (t) =>
        t.vCEO >= requiredVCEO * 1.2 &&
        t.iC_max >= requiredIC * 1.5 &&
        (requiredP === 0 || t.pMax >= requiredP * 1.5),
    );
  };

  return {
    commonTransistors,
    formatResistance,
    formatCurrent,
    formatWatt,
    calculateBaseResistor,
    calculateCommonEmitter,
    findSuitableTransistors,
  };
};
