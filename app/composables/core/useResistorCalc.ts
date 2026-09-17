// ===== Constants =====
export interface ColorMaster {
  colorIndex: number;
  nameKh: string;
  nameEn: string;
  hex: string;
  val: number | null;
  mult: number | null;
  multStr: string;
  tol: number | null;
  ppm: number | null;
}

export const colorMasterList: ColorMaster[] = [
  {
    colorIndex: 0,
    nameKh: "ខ្មៅ",
    nameEn: "Black",
    hex: "#111827",
    val: 0,
    mult: 1,
    multStr: "×1",
    tol: null,
    ppm: null,
  },
  {
    colorIndex: 1,
    nameKh: "ត្នោត",
    nameEn: "Brown",
    hex: "#854d0e",
    val: 1,
    mult: 10,
    multStr: "×10",
    tol: 1,
    ppm: 100,
  },
  {
    colorIndex: 2,
    nameKh: "ក្រហម",
    nameEn: "Red",
    hex: "#dc2626",
    val: 2,
    mult: 100,
    multStr: "×100",
    tol: 2,
    ppm: 50,
  },
  {
    colorIndex: 3,
    nameKh: "ទឹកក្រូច",
    nameEn: "Orange",
    hex: "#ea580c",
    val: 3,
    mult: 1000,
    multStr: "×1k",
    tol: null,
    ppm: 15,
  },
  {
    colorIndex: 4,
    nameKh: "លឿង",
    nameEn: "Yellow",
    hex: "#eab308",
    val: 4,
    mult: 10000,
    multStr: "×10k",
    tol: null,
    ppm: 25,
  },
  {
    colorIndex: 5,
    nameKh: "បៃតង",
    nameEn: "Green",
    hex: "#16a34a",
    val: 5,
    mult: 100000,
    multStr: "×100k",
    tol: 0.5,
    ppm: 20,
  },
  {
    colorIndex: 6,
    nameKh: "ខៀវ",
    nameEn: "Blue",
    hex: "#2563eb",
    val: 6,
    mult: 1000000,
    multStr: "×1M",
    tol: 0.25,
    ppm: 10,
  },
  {
    colorIndex: 7,
    nameKh: "ស្វាយ",
    nameEn: "Violet",
    hex: "#9333ea",
    val: 7,
    mult: 10000000,
    multStr: "×10M",
    tol: 0.1,
    ppm: 5,
  },
  {
    colorIndex: 8,
    nameKh: "ប្រផេះ",
    nameEn: "Grey",
    hex: "#4b5563",
    val: 8,
    mult: 100000000,
    multStr: "×100M",
    tol: 0.05,
    ppm: 1,
  },
  {
    colorIndex: 9,
    nameKh: "ស",
    nameEn: "White",
    hex: "#f9fafb",
    val: 9,
    mult: 1000000000,
    multStr: "×1G",
    tol: null,
    ppm: null,
  },
  {
    colorIndex: 10,
    nameKh: "មាស",
    nameEn: "Gold",
    hex: "#d97706",
    val: null,
    mult: 0.1,
    multStr: "×0.1",
    tol: 5,
    ppm: null,
  },
  {
    colorIndex: 11,
    nameKh: "ប្រាក់",
    nameEn: "Silver",
    hex: "#94a3b8",
    val: null,
    mult: 0.01,
    multStr: "×0.01",
    tol: 10,
    ppm: null,
  },
];

// ===== Formatters =====
export const formatResistance = (ohms: number): string => {
  if (isNaN(ohms) || ohms === 0) return "0 Ω";
  if (ohms >= 1e6) return (ohms / 1e6).toFixed(2).replace(/\.00$/, "") + " MΩ";
  if (ohms >= 1e3) return (ohms / 1e3).toFixed(2).replace(/\.00$/, "") + " kΩ";
  return ohms.toFixed(2).replace(/\.00$/, "") + " Ω";
};

// ===== Types =====
export type BandIndices = [number, number, number, number, number, number];

// ===== Pure Composable =====
export const useResistorCalc = () => {
  const filterColorsForBand = (
    bandCount: 4 | 5 | 6,
    pos: number,
  ): ColorMaster[] => {
    return colorMasterList.filter((c) => {
      if (bandCount === 4) {
        if (pos < 2) return c.val !== null;
        if (pos === 2) return c.mult !== null;
        if (pos === 3) return c.tol !== null;
      } else if (bandCount === 5) {
        if (pos < 3) return c.val !== null;
        if (pos === 3) return c.mult !== null;
        if (pos === 4) return c.tol !== null;
      } else {
        if (pos < 3) return c.val !== null;
        if (pos === 3) return c.mult !== null;
        if (pos === 4) return c.tol !== null;
        if (pos === 5) return c.ppm !== null;
      }
      return true;
    });
  };

  const calculateOhms = (bands: BandIndices, bandCount: 4 | 5 | 6): number => {
    const d1 = colorMasterList[bands[0] ?? 0]?.val ?? 0;
    const d2 = colorMasterList[bands[1] ?? 0]?.val ?? 0;
    let digits = "";
    let mult = 1;

    if (bandCount === 4) {
      digits = `${d1}${d2}`;
      mult = colorMasterList[bands[2] ?? 2]?.mult ?? 1;
    } else {
      const d3 = colorMasterList[bands[2] ?? 0]?.val ?? 0;
      digits = `${d1}${d2}${d3}`;
      mult = colorMasterList[bands[3] ?? 2]?.mult ?? 1;
    }
    return parseInt(digits, 10) * mult;
  };

  const getTolerance = (bands: BandIndices, bandCount: 4 | 5 | 6): number => {
    const idx = bandCount === 4 ? (bands[3] ?? 10) : (bands[4] ?? 10);
    return colorMasterList[idx]?.tol ?? 0;
  };

  const getPPM = (bands: BandIndices, bandCount: 4 | 5 | 6): number | null => {
    if (bandCount !== 6) return null;
    const idx = bands[5];
    if (idx === undefined) return null;
    return colorMasterList[idx]?.ppm ?? null;
  };

  const getActiveBandIndices = (bandCount: 4 | 5 | 6): number[] => {
    if (bandCount === 4) return [0, 1, 3, 4];
    if (bandCount === 5) return [0, 1, 2, 3, 4];
    return [0, 1, 2, 3, 4, 5];
  };

  const getBandTitle = (bandCount: 4 | 5 | 6, pos: number): string => {
    const titles = [
      "កង់ទី១ (Digit 1)",
      "កង់ទី២ (Digit 2)",
      "កង់ទី៣ (Digit 3)",
      "មេគុណ (Multiplier)",
      "លំអៀង (Tolerance)",
      "សីតុណ្ហភាព (PPM)",
    ];
    if (bandCount === 4 && pos === 2) return titles[3]!;
    if (bandCount === 4 && pos === 3) return titles[4]!;
    return titles[pos] ?? "";
  };

  const getResistorRange = (bands: BandIndices, bandCount: 4 | 5 | 6) => {
    const ohms = calculateOhms(bands, bandCount);
    const tol = getTolerance(bands, bandCount) || 0;
    const min = ohms * (1 - tol / 100);
    const max = ohms * (1 + tol / 100);
    return `${formatResistance(min)} - ${formatResistance(max)}`;
  };

  // SMD Code parsing
  const parseSmdCode = (code: string): { value: string; details: string } => {
    const c = code.trim().toUpperCase();
    if (!c) return { value: "0 Ω", details: "សូមបញ្ចូលកូដ SMD" };

    const eia96Codes: Record<string, number> = {
      "01": 100,
      "02": 102,
      "03": 105,
      "04": 107,
      "05": 110,
      "06": 113,
      "07": 115,
      "08": 118,
      "09": 121,
      "10": 124,
      "11": 127,
      "12": 130,
      "13": 133,
      "14": 137,
      "15": 140,
      "16": 143,
      "17": 147,
      "18": 150,
      "19": 154,
      "20": 158,
      "21": 162,
      "22": 165,
      "23": 169,
      "24": 174,
      "25": 178,
      "26": 182,
      "27": 187,
      "28": 191,
      "29": 196,
      "30": 200,
    };
    const eia96Mults: Record<string, number> = {
      Z: 0.001,
      Y: 0.01,
      X: 0.1,
      A: 1,
      B: 10,
      C: 100,
      D: 1000,
      E: 10000,
      F: 100000,
    };

    if (
      c.length === 3 &&
      eia96Codes[c.substring(0, 2)] &&
      eia96Mults[c.charAt(2)]
    ) {
      return {
        value: formatResistance(
          eia96Codes[c.substring(0, 2)]! * eia96Mults[c.charAt(2)]!,
        ),
        details: "EIA-96 Code Precision 1%",
      };
    }

    if (c.includes("R")) {
      const val = parseFloat(c.replace("R", "."));
      if (!isNaN(val)) {
        return {
          value: formatResistance(val),
          details: "Decimal Code (R = .)",
        };
      }
    }

    if (/^\d{3,4}$/.test(c)) {
      const digits = c.substring(0, c.length - 1);
      const exp = parseInt(c.charAt(c.length - 1), 10);
      const val = parseInt(digits, 10) * Math.pow(10, exp);
      return {
        value: formatResistance(val),
        details: `${c.length}-Digit Code`,
      };
    }

    return { value: "កូដមិនត្រឹមត្រូវ", details: "Invalid Format" };
  };

  // ===== Series / Parallel Calculations =====

  /**
   * គណនា Resistors សេរី (Series)
   * R_total = R1 + R2 + R3 + ...
   */
  const calculateSeries = (resistors: number[]) => {
    const valid = resistors.filter((r) => r > 0);
    if (valid.length === 0) return null;

    const total = valid.reduce((sum, r) => sum + r, 0);
    return {
      total,
      totalFormatted: formatResistance(total),
      count: valid.length,
    };
  };

  /**
   * គណនា Resistors ប៉ារ៉ាឡែល (Parallel)
   * 1/R_total = 1/R1 + 1/R2 + 1/R3 + ...
   * ឬ R_total = (R1 × R2) / (R1 + R2) សម្រាប់ ២ តែប៉ុណ្ណោះ
   */
  const calculateParallel = (resistors: number[]) => {
    const valid = resistors.filter((r) => r > 0);
    if (valid.length === 0) return null;

    const invSum = valid.reduce((sum, r) => sum + 1 / r, 0);
    const total = invSum > 0 ? 1 / invSum : 0;

    return {
      total,
      totalFormatted: formatResistance(total),
      count: valid.length,
    };
  };

  /**
   * គណនា Series-Parallel Combination
   * ឧ. R1 សេរីជាមួយ (R2 ប៉ារ៉ាឡែល R3)
   */
  const calculateCombination = (
    seriesResistors: number[],
    parallelResistors: number[],
  ) => {
    const seriesTotal = seriesResistors
      .filter((r) => r > 0)
      .reduce((sum, r) => sum + r, 0);

    const parallelValid = parallelResistors.filter((r) => r > 0);
    let parallelTotal = 0;
    if (parallelValid.length > 0) {
      const invSum = parallelValid.reduce((sum, r) => sum + 1 / r, 0);
      parallelTotal = invSum > 0 ? 1 / invSum : 0;
    }

    const total = seriesTotal + parallelTotal;

    return {
      seriesTotal,
      seriesFormatted: formatResistance(seriesTotal),
      parallelTotal,
      parallelFormatted: formatResistance(parallelTotal),
      total,
      totalFormatted: formatResistance(total),
    };
  };

  /**
   * ជ្រើសរើស Resistor Combination ពី Standard Values
   * ដើម្បីទទួលបាន Target Resistance ជិតបំផុត
   */
  const findCombination = (
    target: number,
    mode: "series" | "parallel" | "both" = "both",
  ) => {
    // E24 Standard Values
    const e24 = [
      1.0, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 2.0, 2.2, 2.4, 2.7, 3.0, 3.3, 3.6, 3.9,
      4.3, 4.7, 5.1, 5.6, 6.2, 6.8, 7.5, 8.2, 9.1,
    ];

    const generateValues = (): number[] => {
      const values: number[] = [];
      for (let decade = -1; decade <= 5; decade++) {
        const multiplier = Math.pow(10, decade);
        for (const base of e24) {
          values.push(base * multiplier);
        }
      }
      return values.sort((a, b) => a - b);
    };

    const values = generateValues();
    const targetTolerance = 0.05; // 5%

    let best: {
      r1: number;
      r2: number;
      value: number;
      error: number;
      errorPercent: number;
      mode: string;
    } | null = null;

    // Series
    if (mode === "series" || mode === "both") {
      for (let i = 0; i < values.length; i++) {
        for (let j = i; j < values.length; j++) {
          const r1 = values[i]!;
          const r2 = values[j]!;
          const sum = r1 + r2;
          const error = Math.abs(sum - target);
          if (!best || error < best.error) {
            best = {
              r1,
              r2,
              value: sum,
              error,
              errorPercent: (error / target) * 100,
              mode: "series",
            };
          }
        }
      }
    }

    // Parallel
    if (mode === "parallel" || mode === "both") {
      for (let i = 0; i < values.length; i++) {
        for (let j = i; j < values.length; j++) {
          const r1 = values[i]!;
          const r2 = values[j]!;
          const parallel = (r1 * r2) / (r1 + r2);
          const error = Math.abs(parallel - target);
          if (!best || error < best.error) {
            best = {
              r1,
              r2,
              value: parallel,
              error,
              errorPercent: (error / target) * 100,
              mode: "parallel",
            };
          }
        }
      }
    }

    if (!best) return null;

    return {
      ...best,
      valueFormatted: formatResistance(best.value),
      r1Formatted: formatResistance(best.r1),
      r2Formatted: formatResistance(best.r2),
      errorPercentFormatted: best.errorPercent.toFixed(3) + " %",
      isWithinTolerance: best.errorPercent <= targetTolerance * 100,
    };
  };

  /**
   * គណនា Power Dissipation ក្នុង Resistor នីមួយៗ
   */
  const calculatePowerDistribution = (
    resistors: number[],
    mode: "series" | "parallel",
    totalVoltage: number = 0,
    totalCurrent: number = 0,
  ) => {
    if (resistors.length === 0) return null;

    const results: {
      resistance: number;
      voltage: number;
      current: number;
      power: number;
    }[] = [];

    if (mode === "series" && totalVoltage > 0) {
      const totalR = resistors.reduce((sum, r) => sum + r, 0);
      const current = totalVoltage / totalR;
      for (const r of resistors) {
        const voltage = current * r;
        const power = voltage * current;
        results.push({ resistance: r, voltage, current, power });
      }
    } else if (mode === "parallel" && totalCurrent > 0) {
      const invSum = resistors.reduce((sum, r) => sum + 1 / r, 0);
      const totalR = invSum > 0 ? 1 / invSum : 0;
      const voltage = totalCurrent * totalR;
      for (const r of resistors) {
        const current = voltage / r;
        const power = voltage * current;
        results.push({ resistance: r, voltage, current, power });
      }
    }

    return {
      results: results.map((r) => ({
        resistance: r.resistance,
        resistanceFormatted: formatResistance(r.resistance),
        voltage: r.voltage,
        voltageFormatted: r.voltage.toFixed(3) + " V",
        current: r.current,
        currentFormatted:
          r.current >= 1
            ? r.current.toFixed(3) + " A"
            : (r.current * 1000).toFixed(2) + " mA",
        power: r.power,
        powerFormatted:
          r.power >= 1
            ? r.power.toFixed(3) + " W"
            : (r.power * 1000).toFixed(2) + " mW",
      })),
    };
  };

  // ===== បន្ថែមទៅ return =====
  return {
    colorMasterList,
    formatResistance,
    filterColorsForBand,
    calculateOhms,
    getTolerance,
    getPPM,
    getActiveBandIndices,
    getBandTitle,
    getResistorRange,
    parseSmdCode,
    calculateSeries,
    calculateParallel,
    calculateCombination,
    findCombination,
    calculatePowerDistribution,
  };
};
