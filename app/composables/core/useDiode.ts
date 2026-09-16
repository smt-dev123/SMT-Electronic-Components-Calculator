// ទិន្នន័យ Diode ទូទៅ
export interface DiodeSpec {
  partNumber: string;
  type: "rectifier" | "schottky" | "zener" | "led" | "switching" | "fast";
  typeKh: string;
  vForward: number; // Vf (V)
  vReverse: number; // Vr / Vz (V)
  iForward_max: number; // If max (A)
  iReverse: number; // Ir (µA)
  recoveryTime: number; // trr (ns)
  package: string;
}

export const commonDiodes: DiodeSpec[] = [
  // Rectifier
  {
    partNumber: "1N4001",
    type: "rectifier",
    typeKh: "Rectifier",
    vForward: 1.0,
    vReverse: 50,
    iForward_max: 1,
    iReverse: 5,
    recoveryTime: 2000,
    package: "DO-41",
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
    package: "DO-41",
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
    package: "DO-201",
  },

  // Schottky
  {
    partNumber: "1N5819",
    type: "schottky",
    typeKh: "Schottky",
    vForward: 0.45,
    vReverse: 40,
    iForward_max: 1,
    iReverse: 100,
    recoveryTime: 0,
    package: "DO-41",
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
    package: "DO-201",
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
    package: "SMA",
  },

  // Zener
  {
    partNumber: "1N4733",
    type: "zener",
    typeKh: "Zener",
    vForward: 0.7,
    vReverse: 5.1,
    iForward_max: 0.049,
    iReverse: 10,
    recoveryTime: 0,
    package: "DO-41",
  },
  {
    partNumber: "1N4735",
    type: "zener",
    typeKh: "Zener",
    vForward: 0.7,
    vReverse: 6.2,
    iForward_max: 0.041,
    iReverse: 10,
    recoveryTime: 0,
    package: "DO-41",
  },
  {
    partNumber: "1N4742",
    type: "zener",
    typeKh: "Zener",
    vForward: 0.7,
    vReverse: 12,
    iForward_max: 0.021,
    iReverse: 5,
    recoveryTime: 0,
    package: "DO-41",
  },

  // Switching
  {
    partNumber: "1N4148",
    type: "switching",
    typeKh: "Switching",
    vForward: 0.72,
    vReverse: 100,
    iForward_max: 0.2,
    iReverse: 0.025,
    recoveryTime: 4,
    package: "DO-35",
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
    package: "DO-35",
  },

  // Fast recovery
  {
    partNumber: "1N4937",
    type: "fast",
    typeKh: "Fast Recovery",
    vForward: 1.2,
    vReverse: 600,
    iForward_max: 1,
    iReverse: 5,
    recoveryTime: 200,
    package: "DO-41",
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
    package: "DO-41",
  },

  // LED
  {
    partNumber: "LED-RED",
    type: "led",
    typeKh: "LED ក្រហម",
    vForward: 2.0,
    vReverse: 5,
    iForward_max: 0.02,
    iReverse: 10,
    recoveryTime: 0,
    package: "T-1¾",
  },
  {
    partNumber: "LED-GREEN",
    type: "led",
    typeKh: "LED បៃតង",
    vForward: 2.2,
    vReverse: 5,
    iForward_max: 0.02,
    iReverse: 10,
    recoveryTime: 0,
    package: "T-1¾",
  },
  {
    partNumber: "LED-BLUE",
    type: "led",
    typeKh: "LED ខៀវ",
    vForward: 3.2,
    vReverse: 5,
    iForward_max: 0.02,
    iReverse: 10,
    recoveryTime: 0,
    package: "T-1¾",
  },
];

export const useDiode = () => {
  // គណនា Diode សម្រាប់ Rectifier
  const calculateRectifier = (
    vIn: number,
    iLoad: number,
    safetyFactor: number = 1.5,
  ) => {
    if (vIn <= 0 || iLoad <= 0) return null;

    return {
      requiredVReverse: vIn * safetyFactor,
      requiredIForward: iLoad * safetyFactor,
      vReverseFormatted: vIn * safetyFactor + " V",
      iForwardFormatted: (iLoad * safetyFactor).toFixed(2) + " A",
    };
  };

  // គណនា Zener Diode (Voltage Regulator)
  const calculateZenerResistor = (
    vIn: number,
    vZener: number,
    iLoad: number,
  ) => {
    if (vIn <= vZener || iLoad < 0) return null;

    // ជ្រើសរើស Iz ត្រឹមត្រូវ (ធម្មតា 10% នៃ iLoad ឬ 5mA អប្បបរមា)
    const iZ_min = Math.max(iLoad * 0.1, 0.005);
    const iZ_max = iLoad * 0.5;

    // គណនា R ជាមួយ iZ_max (ពេល Load តូច)
    const r_min = (vIn - vZener) / (iZ_max + iLoad);
    // គណនា R ជាមួយ iZ_min (ពេល Load ធំ)
    const r_max = (vIn - vZener) / (iZ_min + iLoad);

    const rRecommended = (r_min + r_max) / 2;

    // អានុភាព
    const pResistor = Math.pow(vIn - vZener, 2) / rRecommended;
    const pZener = vZener * iZ_max;

    return {
      rMin: r_min,
      rMax: r_max,
      rRecommended,
      rFormatted: formatOhm(rRecommended),
      pResistor: pResistor,
      pResistorFormatted: formatWatt(pResistor),
      pZener: pZener,
      pZenerFormatted: formatWatt(pZener),
      iZmin: iZ_min,
      iZmax: iZ_max,
    };
  };

  // គណនា Diode Bridge Rectifier
  const calculateBridge = (vAcIn: number, iLoad: number) => {
    if (vAcIn <= 0 || iLoad <= 0) return null;

    // តង់ស្យុងកំពូល (Peak) = Vrms × √2
    const vPeak = vAcIn * Math.SQRT2;
    // តង់ស្យុង DC ជាមធ្យម (គ្មាន Filter) = 2Vpeak / π
    const vDcAvg = (2 * vPeak) / Math.PI;
    // តង់ស្យុង DC ជាមួយ 2 diode drops
    const vDcReal = vDcAvg - 1.4;

    // ប្រេកង់ ripple = 2 × ប្រេកង់ AC
    const rippleFreq = 100; // សម្រាប់ 50Hz → 100Hz

    return {
      vPeak: vPeak,
      vPeakFormatted: vPeak.toFixed(2) + " V",
      vDcAvg: vDcAvg,
      vDcFormatted: vDcAvg.toFixed(2) + " V",
      vDcReal: vDcReal,
      vDcRealFormatted: vDcReal.toFixed(2) + " V",
      vReverseEach: vPeak,
      vReverseFormatted: vPeak.toFixed(2) + " V",
      rippleFreq: rippleFreq,
    };
  };

  // គណនា Filter Capacitor សម្រាប់ Rectifier
  const calculateFilterCap = (
    iLoad: number,
    rippleVoltage: number,
    frequency: number = 100,
  ) => {
    if (iLoad <= 0 || rippleVoltage <= 0 || frequency <= 0) return null;

    // C = I / (2 × f × Vripple)  (សម្រាប់ full-wave)
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

  // បម្លែងឯកតា
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
    calculateRectifier,
    calculateZenerResistor,
    calculateBridge,
    calculateFilterCap,
    formatOhm,
    formatWatt,
  };
};
