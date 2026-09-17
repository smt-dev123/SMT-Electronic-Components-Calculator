// ===== Type Definition =====
export interface DiodeSpec {
  partNumber: string;
  type: "rectifier" | "schottky" | "zener" | "led" | "switching" | "fast";
  typeKh: string;
  vForward: number; // Vf (V)
  vReverse: number; // Vr / Vz (V)
  iForward_max: number; // If max (A)
  iReverse: number; // Ir (µA)
  recoveryTime: number; // trr (ns)
  powerMax: number; // Pmax (W)
  capacitance: number; // Cj (pF)
  package: string;
  application?: string; // ការប្រើប្រាស់
}

// ===== Diode Database =====
export const commonDiodes: DiodeSpec[] = [
  // ===== Rectifier Diodes =====
  {
    partNumber: "1N4001",
    type: "rectifier",
    typeKh: "Rectifier",
    vForward: 1.0,
    vReverse: 50,
    iForward_max: 1,
    iReverse: 5,
    recoveryTime: 2000,
    powerMax: 3,
    capacitance: 15,
    package: "DO-41",
    application: "General purpose rectification, protection",
  },
  {
    partNumber: "1N4002",
    type: "rectifier",
    typeKh: "Rectifier",
    vForward: 1.0,
    vReverse: 100,
    iForward_max: 1,
    iReverse: 5,
    recoveryTime: 2000,
    powerMax: 3,
    capacitance: 15,
    package: "DO-41",
    application: "General rectification",
  },
  {
    partNumber: "1N4004",
    type: "rectifier",
    typeKh: "Rectifier",
    vForward: 1.0,
    vReverse: 400,
    iForward_max: 1,
    iReverse: 5,
    recoveryTime: 2000,
    powerMax: 3,
    capacitance: 15,
    package: "DO-41",
    application: "Rectification, reverse protection",
  },
  {
    partNumber: "1N4007",
    type: "rectifier",
    typeKh: "Rectifier",
    vForward: 1.0,
    vReverse: 1000,
    iForward_max: 1,
    iReverse: 5,
    recoveryTime: 2000,
    powerMax: 3,
    capacitance: 15,
    package: "DO-41",
    application: "High voltage rectification",
  },
  {
    partNumber: "1N5408",
    type: "rectifier",
    typeKh: "Rectifier",
    vForward: 1.2,
    vReverse: 1000,
    iForward_max: 3,
    iReverse: 5,
    recoveryTime: 2000,
    powerMax: 6.25,
    capacitance: 30,
    package: "DO-201",
    application: "Power rectification",
  },
  {
    partNumber: "1N5822",
    type: "schottky",
    typeKh: "Schottky",
    vForward: 0.525,
    vReverse: 40,
    iForward_max: 3,
    iReverse: 100,
    recoveryTime: 0,
    powerMax: 6,
    capacitance: 200,
    package: "DO-201",
    application: "Switching power supply, high frequency",
  },

  // ===== Schottky Diodes =====
  {
    partNumber: "1N5817",
    type: "schottky",
    typeKh: "Schottky",
    vForward: 0.45,
    vReverse: 20,
    iForward_max: 1,
    iReverse: 100,
    recoveryTime: 0,
    powerMax: 0.5,
    capacitance: 125,
    package: "DO-41",
    application: "Low voltage rectification",
  },
  {
    partNumber: "1N5819",
    type: "schottky",
    typeKh: "Schottky",
    vForward: 0.45,
    vReverse: 40,
    iForward_max: 1,
    iReverse: 100,
    recoveryTime: 0,
    powerMax: 0.5,
    capacitance: 120,
    package: "DO-41",
    application: "High frequency switching, reverse protection",
  },
  {
    partNumber: "SS34",
    type: "schottky",
    typeKh: "Schottky",
    vForward: 0.5,
    vReverse: 40,
    iForward_max: 3,
    iReverse: 100,
    recoveryTime: 0,
    powerMax: 2.5,
    capacitance: 180,
    package: "SMA/DO-214AC",
    application: "SMD switching power",
  },
  {
    partNumber: "SS14",
    type: "schottky",
    typeKh: "Schottky",
    vForward: 0.5,
    vReverse: 40,
    iForward_max: 1,
    iReverse: 100,
    recoveryTime: 0,
    powerMax: 0.5,
    capacitance: 110,
    package: "SMA/DO-214AC",
    application: "SMD low power switching",
  },
  {
    partNumber: "MBR20100",
    type: "schottky",
    typeKh: "Schottky",
    vForward: 0.75,
    vReverse: 100,
    iForward_max: 20,
    iReverse: 100,
    recoveryTime: 0,
    powerMax: 100,
    capacitance: 600,
    package: "TO-220",
    application: "High current rectification",
  },

  // ===== Zener Diodes =====
  {
    partNumber: "1N4728A",
    type: "zener",
    typeKh: "Zener 3.3V",
    vForward: 0.7,
    vReverse: 3.3,
    iForward_max: 0.138,
    iReverse: 100,
    recoveryTime: 0,
    powerMax: 1,
    capacitance: 300,
    package: "DO-41",
    application: "Voltage reference 3.3V",
  },
  {
    partNumber: "1N4733A",
    type: "zener",
    typeKh: "Zener 5.1V",
    vForward: 0.7,
    vReverse: 5.1,
    iForward_max: 0.098,
    iReverse: 10,
    recoveryTime: 0,
    powerMax: 1,
    capacitance: 250,
    package: "DO-41",
    application: "Voltage reference 5.1V",
  },
  {
    partNumber: "1N4735A",
    type: "zener",
    typeKh: "Zener 6.2V",
    vForward: 0.7,
    vReverse: 6.2,
    iForward_max: 0.081,
    iReverse: 10,
    recoveryTime: 0,
    powerMax: 1,
    capacitance: 200,
    package: "DO-41",
    application: "Voltage reference 6.2V",
  },
  {
    partNumber: "1N4742A",
    type: "zener",
    typeKh: "Zener 12V",
    vForward: 0.7,
    vReverse: 12,
    iForward_max: 0.021,
    iReverse: 5,
    recoveryTime: 0,
    powerMax: 1,
    capacitance: 110,
    package: "DO-41",
    application: "Voltage regulation 12V",
  },
  {
    partNumber: "1N4749A",
    type: "zener",
    typeKh: "Zener 24V",
    vForward: 0.7,
    vReverse: 24,
    iForward_max: 0.0105,
    iReverse: 5,
    recoveryTime: 0,
    powerMax: 1,
    capacitance: 60,
    package: "DO-41",
    application: "Voltage regulation 24V",
  },
  {
    partNumber: "BZX55C5V1",
    type: "zener",
    typeKh: "Zener 5.1V",
    vForward: 0.7,
    vReverse: 5.1,
    iForward_max: 0.098,
    iReverse: 5,
    recoveryTime: 0,
    powerMax: 0.5,
    capacitance: 200,
    package: "DO-35",
    application: "Low power voltage reference",
  },
  {
    partNumber: "BZX84C12",
    type: "zener",
    typeKh: "Zener 12V SMD",
    vForward: 0.9,
    vReverse: 12,
    iForward_max: 0.021,
    iReverse: 1,
    recoveryTime: 0,
    powerMax: 0.3,
    capacitance: 85,
    package: "SOT-23",
    application: "SMD voltage regulation",
  },

  // ===== Switching Diodes =====
  {
    partNumber: "1N4148",
    type: "switching",
    typeKh: "Switching",
    vForward: 0.72,
    vReverse: 100,
    iForward_max: 0.2,
    iReverse: 0.025,
    recoveryTime: 4,
    powerMax: 0.5,
    capacitance: 4,
    package: "DO-35",
    application: "Signal switching, small signal",
  },
  {
    partNumber: "1N4148W",
    type: "switching",
    typeKh: "Switching SMD",
    vForward: 0.72,
    vReverse: 100,
    iForward_max: 0.3,
    iReverse: 0.05,
    recoveryTime: 4,
    powerMax: 0.4,
    capacitance: 4,
    package: "SOD-123",
    application: "SMD signal switching",
  },
  {
    partNumber: "1N914",
    type: "switching",
    typeKh: "Switching",
    vForward: 0.72,
    vReverse: 100,
    iForward_max: 0.075,
    iReverse: 0.025,
    recoveryTime: 4,
    powerMax: 0.5,
    capacitance: 4,
    package: "DO-35",
    application: "High speed switching",
  },
  {
    partNumber: "BAV99",
    type: "switching",
    typeKh: "Dual Switching SMD",
    vForward: 0.715,
    vReverse: 70,
    iForward_max: 0.215,
    iReverse: 0.03,
    recoveryTime: 6,
    powerMax: 0.35,
    capacitance: 1.5,
    package: "SOT-23",
    application: "Dual series switching",
  },
  {
    partNumber: "BAT54",
    type: "schottky",
    typeKh: "Schottky SMD",
    vForward: 0.32,
    vReverse: 30,
    iForward_max: 0.2,
    iReverse: 2,
    recoveryTime: 5,
    powerMax: 0.15,
    capacitance: 10,
    package: "SOT-23",
    application: "Low voltage SMD switching",
  },

  // ===== Fast Recovery Diodes =====
  {
    partNumber: "1N4937",
    type: "fast",
    typeKh: "Fast Recovery",
    vForward: 1.2,
    vReverse: 600,
    iForward_max: 1,
    iReverse: 5,
    recoveryTime: 200,
    powerMax: 3,
    capacitance: 25,
    package: "DO-41",
    application: "Switching power supplies",
  },
  {
    partNumber: "UF4007",
    type: "fast",
    typeKh: "Ultra Fast",
    vForward: 1.7,
    vReverse: 1000,
    iForward_max: 1,
    iReverse: 5,
    recoveryTime: 75,
    powerMax: 3,
    capacitance: 20,
    package: "DO-41",
    application: "High frequency rectification",
  },
  {
    partNumber: "UF4004",
    type: "fast",
    typeKh: "Ultra Fast",
    vForward: 1.0,
    vReverse: 400,
    iForward_max: 1,
    iReverse: 5,
    recoveryTime: 50,
    powerMax: 3,
    capacitance: 20,
    package: "DO-41",
    application: "Fast switching",
  },
  {
    partNumber: "FR107",
    type: "fast",
    typeKh: "Fast Recovery",
    vForward: 1.3,
    vReverse: 1000,
    iForward_max: 1,
    iReverse: 5,
    recoveryTime: 500,
    powerMax: 3,
    capacitance: 15,
    package: "DO-41",
    application: "Fast rectification",
  },

  // ===== LEDs =====
  {
    partNumber: "LED-RED-5MM",
    type: "led",
    typeKh: "LED ក្រហម",
    vForward: 2.0,
    vReverse: 5,
    iForward_max: 0.02,
    iReverse: 10,
    recoveryTime: 0,
    powerMax: 0.1,
    capacitance: 50,
    package: "T-1¾ (5mm)",
    application: "Indicators, displays",
  },
  {
    partNumber: "LED-GREEN-5MM",
    type: "led",
    typeKh: "LED បៃតង",
    vForward: 2.2,
    vReverse: 5,
    iForward_max: 0.02,
    iReverse: 10,
    recoveryTime: 0,
    powerMax: 0.1,
    capacitance: 50,
    package: "T-1¾ (5mm)",
    application: "Indicators",
  },
  {
    partNumber: "LED-BLUE-5MM",
    type: "led",
    typeKh: "LED ខៀវ",
    vForward: 3.2,
    vReverse: 5,
    iForward_max: 0.02,
    iReverse: 10,
    recoveryTime: 0,
    powerMax: 0.1,
    capacitance: 100,
    package: "T-1¾ (5mm)",
    application: "Indicators, blue displays",
  },
  {
    partNumber: "LED-WHITE-5MM",
    type: "led",
    typeKh: "LED ស",
    vForward: 3.2,
    vReverse: 5,
    iForward_max: 0.02,
    iReverse: 10,
    recoveryTime: 0,
    powerMax: 0.1,
    capacitance: 100,
    package: "T-1¾ (5mm)",
    application: "Lighting, indicators",
  },
  {
    partNumber: "LED-YELLOW-5MM",
    type: "led",
    typeKh: "LED លឿង",
    vForward: 2.1,
    vReverse: 5,
    iForward_max: 0.02,
    iReverse: 10,
    recoveryTime: 0,
    powerMax: 0.1,
    capacitance: 50,
    package: "T-1¾ (5mm)",
    application: "Indicators",
  },
  {
    partNumber: "WS2812B",
    type: "led",
    typeKh: "RGB LED Smart",
    vForward: 5.0,
    vReverse: 5,
    iForward_max: 0.06,
    iReverse: 1,
    recoveryTime: 0,
    powerMax: 0.3,
    capacitance: 100,
    package: "SMD 5050",
    application: "Addressable RGB LED",
  },

  // ===== Power Diodes =====
  {
    partNumber: "1N5820",
    type: "schottky",
    typeKh: "Schottky Power",
    vForward: 0.475,
    vReverse: 20,
    iForward_max: 3,
    iReverse: 100,
    recoveryTime: 0,
    powerMax: 6,
    capacitance: 200,
    package: "DO-201AD",
    application: "Power switching",
  },
  {
    partNumber: "MUR1560",
    type: "fast",
    typeKh: "Ultra Fast Power",
    vForward: 1.5,
    vReverse: 600,
    iForward_max: 15,
    iReverse: 10,
    recoveryTime: 60,
    powerMax: 100,
    capacitance: 150,
    package: "TO-220",
    application: "High power switching",
  },
  {
    partNumber: "BYV26E",
    type: "fast",
    typeKh: "Ultra Fast HV",
    vForward: 2.5,
    vReverse: 1000,
    iForward_max: 1,
    iReverse: 5,
    recoveryTime: 75,
    powerMax: 10,
    capacitance: 25,
    package: "SOD-57",
    application: "High voltage fast switching",
  },
];

// ===== Composable =====
export const useDiode = () => {
  // Filter by type
  const getByType = (type: DiodeSpec["type"]) => {
    return commonDiodes.filter((d) => d.type === type);
  };

  // Get unique types
  const getTypes = (): DiodeSpec["type"][] => {
    return [...new Set(commonDiodes.map((d) => d.type))];
  };

  // Find by part number
  const findByPartNumber = (partNumber: string) => {
    return commonDiodes.find(
      (d) => d.partNumber.toLowerCase() === partNumber.toLowerCase(),
    );
  };

  // Search by part number
  const search = (query: string) => {
    const q = query.toLowerCase().trim();
    if (!q) return commonDiodes;
    return commonDiodes.filter(
      (d) =>
        d.partNumber.toLowerCase().includes(q) ||
        d.typeKh.toLowerCase().includes(q),
    );
  };

  // Calculate rectifier requirements
  const calculateRectifier = (
    vIn: number,
    iLoad: number,
    safetyFactor: number = 1.5,
  ) => {
    if (vIn <= 0 || iLoad <= 0) return null;

    return {
      requiredVReverse: vIn * safetyFactor,
      requiredIForward: iLoad * safetyFactor,
      vReverseFormatted: (vIn * safetyFactor).toFixed(2) + " V",
      iForwardFormatted: (iLoad * safetyFactor).toFixed(2) + " A",
    };
  };

  // Calculate Zener resistor
  const calculateZenerResistor = (
    vIn: number,
    vZener: number,
    iLoad: number,
  ) => {
    if (vIn <= vZener || iLoad < 0) return null;

    const iZ_min = Math.max(iLoad * 0.1, 0.005);
    const iZ_max = iLoad * 0.5;

    const r_min = (vIn - vZener) / (iZ_max + iLoad);
    const r_max = (vIn - vZener) / (iZ_min + iLoad);
    const rRecommended = (r_min + r_max) / 2;

    // គណនា Power
    const pResistor = Math.pow(vIn - vZener, 2) / rRecommended; // អានុភាព R
    const pZener = vZener * iZ_max; // អានុភាព Zener

    return {
      rMin: r_min,
      rMax: r_max,
      rRecommended,
      rFormatted: formatOhm(rRecommended),
      rMinFormatted: formatOhm(r_min),
      rMaxFormatted: formatOhm(r_max),
      pResistor,
      pResistorFormatted: formatWatt(pResistor),
      pZener,
      pZenerFormatted: formatWatt(pZener),
      iZmin: iZ_min,
      iZmax: iZ_max,
    };
  };

  // Calculate bridge rectifier
  const calculateBridge = (vAcIn: number, iLoad: number) => {
    if (vAcIn <= 0 || iLoad <= 0) return null;

    const vPeak = vAcIn * Math.SQRT2;
    const vDcAvg = (2 * vPeak) / Math.PI;
    const vDcReal = vDcAvg - 1.4;

    return {
      vPeak,
      vPeakFormatted: vPeak.toFixed(2) + " V",
      vDcAvg,
      vDcFormatted: vDcAvg.toFixed(2) + " V",
      vDcReal,
      vDcRealFormatted: vDcReal.toFixed(2) + " V",
      vReverseFormatted: vPeak.toFixed(2) + " V",
    };
  };

  // Calculate filter capacitor
  const calculateFilterCap = (
    iLoad: number,
    rippleVoltage: number,
    frequency: number = 100,
  ) => {
    if (iLoad <= 0 || rippleVoltage <= 0) return null;

    const c = iLoad / (2 * frequency * rippleVoltage);

    return {
      capacitance_F: c,
      capacitance_uF: c * 1e6,
      formatted:
        c >= 1e-3
          ? (c * 1e3).toFixed(2) + " mF"
          : c >= 1e-6
            ? (c * 1e6).toFixed(2) + " µF"
            : (c * 1e9).toFixed(1) + " nF",
    };
  };

  // Helpers
  const formatOhm = (ohms: number): string => {
    if (ohms >= 1e6) return (ohms / 1e6).toFixed(2) + " MΩ";
    if (ohms >= 1e3) return (ohms / 1e3).toFixed(2) + " kΩ";
    return ohms.toFixed(2) + " Ω";
  };

  const formatWatt = (w: number): string => {
    if (w >= 1) return w.toFixed(2) + " W";
    if (w >= 1e-3) return (w * 1e3).toFixed(2) + " mW";
    return (w * 1e6).toFixed(1) + " µW";
  };

  return {
    commonDiodes,
    getByType,
    getTypes,
    findByPartNumber,
    search,
    calculateRectifier,
    calculateZenerResistor,
    calculateBridge,
    calculateFilterCap,
    formatOhm,
    formatWatt,
  };
};
