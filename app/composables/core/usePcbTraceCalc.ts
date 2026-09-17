export interface PcbTraceResult {
  width_mil: number;
  width_mm: number;
  widthFormatted: string;
  resistance_mOhm: number;
  voltageDrop_mV: number;
  powerLoss_mW: number;
  temperatureRise: number;
}

// IPC-2221 Constants
const IPC_2221_K = {
  external: 0.048,
  internal: 0.024,
} as const;

// Standard copper thickness (oz → µm)
export const copperThicknesses = [
  { oz: 0.5, um: 17.5, label: "0.5 oz (17.5 µm)" },
  { oz: 1, um: 35, label: "1 oz (35 µm) — Standard" },
  { oz: 2, um: 70, label: "2 oz (70 µm) — Power" },
  { oz: 3, um: 105, label: "3 oz (105 µm)" },
  { oz: 4, um: 140, label: "4 oz (140 µm)" },
  { oz: 6, um: 210, label: "6 oz (210 µm)" },
];

export const usePcbTraceCalc = () => {
  /**
   * គណនា Width តាម IPC-2221
   * A = (I / (k × ΔT^0.44))^(1/0.725)
   * ដែល A = cross-sectional area in mils²
   *     k = 0.048 (external), 0.024 (internal)
   */
  const calculateWidth = (
    current_A: number,
    tempRise_C: number = 10,
    copperThickness_oz: number = 1,
    layer: "external" | "internal" = "external",
  ): PcbTraceResult | null => {
    if (current_A <= 0 || tempRise_C <= 0 || copperThickness_oz <= 0) {
      return null;
    }

    const k = IPC_2221_K[layer];

    // Cross-sectional area in mils²
    const area_mils2 = Math.pow(
      current_A / (k * Math.pow(tempRise_C, 0.44)),
      1 / 0.725,
    );

    // Copper thickness in mils (1 oz = 1.378 mils)
    const thickness_mils = copperThickness_oz * 1.378;

    // Width in mils
    const width_mil = area_mils2 / thickness_mils;
    const width_mm = width_mil * 0.0254;

    // Resistance (standard 100mm length)
    const length_m = 0.1;
    const thickness_m = copperThickness_oz * 35e-6;
    const width_m = width_mm * 1e-3;
    const area_m2 = width_m * thickness_m;
    const rho = 1.68e-8; // copper resistivity at 20°C

    const resistance_ohm = (rho * length_m) / area_m2;
    const resistance_mOhm = resistance_ohm * 1000;

    // Voltage drop & power loss
    const voltageDrop_mV = resistance_ohm * current_A * 1000;
    const powerLoss_mW = resistance_ohm * current_A * current_A * 1000;

    return {
      width_mil,
      width_mm,
      widthFormatted: `${width_mil.toFixed(2)} mil / ${width_mm.toFixed(3)} mm`,
      resistance_mOhm,
      voltageDrop_mV,
      powerLoss_mW,
      temperatureRise: tempRise_C,
    };
  };

  /**
   * គណនា Current អតិបរមាសម្រាប់ Width ដែលផ្ដល់
   */
  const calculateMaxCurrent = (
    width_mil: number,
    tempRise_C: number = 10,
    copperThickness_oz: number = 1,
    layer: "external" | "internal" = "external",
  ) => {
    if (width_mil <= 0 || tempRise_C <= 0 || copperThickness_oz <= 0) {
      return null;
    }

    const k = IPC_2221_K[layer];
    const thickness_mils = copperThickness_oz * 1.378;
    const area_mils2 = width_mil * thickness_mils;
    const current_A =
      k * Math.pow(tempRise_C, 0.44) * Math.pow(area_mils2, 0.725);

    return {
      current_A,
      currentFormatted: current_A.toFixed(3) + " A",
    };
  };

  /**
   * MIL-STD-275 (standard ចាស់)
   */
  const calculateMilStd275 = (
    current_A: number,
    copperThickness_oz: number = 1,
    external: boolean = true,
    deltaT: number = 10,
  ) => {
    if (current_A <= 0 || deltaT <= 0) return null;

    const k = external ? 0.03 : 0.015;
    const thickness_mils = copperThickness_oz * 1.378;

    const area_mils2 = Math.pow(
      current_A / (k * Math.pow(deltaT, 0.545)),
      1 / 0.734,
    );
    const width_mil = area_mils2 / thickness_mils;

    return {
      width_mil,
      width_mm: width_mil * 0.0254,
      widthFormatted: `${width_mil.toFixed(2)} mil / ${(width_mil * 0.0254).toFixed(3)} mm`,
    };
  };

  /**
   * គណនា Voltage Drop សម្រាប់ Length ជាក់លាក់
   */
  const calculateVoltageDrop = (
    width_mm: number,
    copperThickness_oz: number,
    length_mm: number,
    current_A: number,
  ) => {
    if (width_mm <= 0 || length_mm <= 0 || current_A <= 0) return null;

    const width_m = width_mm * 1e-3;
    const length_m = length_mm * 1e-3;
    const thickness_m = copperThickness_oz * 35e-6;
    const area_m2 = width_m * thickness_m;
    const rho = 1.68e-8;

    const resistance_ohm = (rho * length_m) / area_m2;
    const drop_mV = resistance_ohm * current_A * 1000;
    const powerLoss_mW = resistance_ohm * current_A * current_A * 1000;

    return {
      resistance_mOhm: resistance_ohm * 1000,
      voltageDrop_mV: drop_mV,
      powerLoss_mW,
      voltageDropFormatted:
        drop_mV < 1000
          ? drop_mV.toFixed(2) + " mV"
          : (drop_mV / 1000).toFixed(3) + " V",
    };
  };

  /**
   * គណនា Via Size តាម IPC-2221
   * Via ត្រូវការ current capacity ដូច trace ធម្មតា
   * Area = π × (OD² - ID²) / 4
   */
  const calculateVia = (
    current_A: number,
    tempRise_C: number = 10,
    copperThickness_oz: number = 1,
    viaLength_mm: number = 1.6, // កម្រាស់ PCB
  ) => {
    if (current_A <= 0 || tempRise_C <= 0 || copperThickness_oz <= 0) {
      return null;
    }

    const k = IPC_2221_K.external;

    // Required cross-sectional area (mils²) — ដូច trace
    const area_mils2 = Math.pow(
      current_A / (k * Math.pow(tempRise_C, 0.44)),
      1 / 0.725,
    );

    // Copper thickness in mils
    const thickness_mils = copperThickness_oz * 1.378;

    // សម្រាប់ via cylindrical shape:
    // Area = π × D_avg × T
    // ដែល D_avg = (OD + ID) / 2
    // សន្មត ID = OD - 2 × plating_thickness
    // plating_thickness = 25 µm (1 mil) ជាធម្មតា

    const plating_mils = 1; // 25 µm
    // Area = π × D_avg × plating
    // D_avg = area_mils2 / (π × plating)
    const dAvg_mils = area_mils2 / (Math.PI * plating_mils);
    // OD = D_avg + plating
    const od_mils = dAvg_mils + plating_mils;
    // ID = OD - 2 × plating
    const id_mils = od_mils - 2 * plating_mils;

    const od_mm = od_mils * 0.0254;
    const id_mm = id_mils * 0.0254;

    // Standard drill sizes (mm)
    const standardDrills = [
      0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.2, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0,
      5.0,
    ];
    const nearestDrill = standardDrills.reduce((prev, curr) =>
      Math.abs(curr - id_mm) < Math.abs(prev - id_mm) ? curr : prev,
    );

    // Via resistance (approximation)
    const length_m = viaLength_mm * 1e-3;
    const rho = 1.68e-8;
    const area_m2 =
      (Math.PI *
        ((od_mm * 1e-3) / 2 + (id_mm * 1e-3) / 2) *
        (plating_mils * 0.0254 * 1e-3)) /
      2;
    const resistance_ohm = area_m2 > 0 ? (rho * length_m) / area_m2 : 0;

    return {
      od_mils,
      id_mils,
      od_mm,
      id_mm,
      odFormatted: od_mils.toFixed(1) + " mil / " + od_mm.toFixed(2) + " mm",
      idFormatted: id_mils.toFixed(1) + " mil / " + id_mm.toFixed(2) + " mm",
      nearestDrill,
      nearestDrillFormatted: nearestDrill.toFixed(2) + " mm",
      resistance_mOhm: resistance_ohm * 1000,
    };
  };

  /**
   * គណនាចំនួន Via ត្រូវការសម្រាប់ចរន្ត
   * បែងចែក current ជាច្រើន via
   */
  const calculateViaCount = (totalCurrent_A: number, viaCurrent_A: number) => {
    if (totalCurrent_A <= 0 || viaCurrent_A <= 0) return null;

    const count = Math.ceil(totalCurrent_A / viaCurrent_A);

    return {
      count,
      countFormatted: count + " vias",
      currentPerVia: totalCurrent_A / count,
      currentPerViaFormatted: (totalCurrent_A / count).toFixed(3) + " A",
    };
  };

  /**
   * គណនា Annular Ring
   * Ring = (Pad Diameter - Hole Diameter) / 2
   */
  const calculateAnnularRing = (
    padDiameter_mm: number,
    holeDiameter_mm: number,
  ) => {
    if (padDiameter_mm <= 0 || holeDiameter_mm <= 0) return null;
    if (padDiameter_mm <= holeDiameter_mm) {
      return {
        ring_mm: 0,
        ring_mils: 0,
        ringFormatted: "0 mm",
        ipcClass: "Invalid",
        error: "Pad តូចជាង Hole!",
      };
    }

    const ring_mm = (padDiameter_mm - holeDiameter_mm) / 2;
    const ring_mils = ring_mm * 39.3701;

    // IPC Class 2: min 0.05 mm (2 mils)
    // IPC Class 3: min 0.10 mm (4 mils)
    let ipcClass = "Class 1";
    if (ring_mils >= 4) ipcClass = "Class 3";
    else if (ring_mils >= 2) ipcClass = "Class 2";
    else ipcClass = "Class 1 (មិនត្រូវបានណែនាំ)";

    return {
      ring_mm,
      ring_mils,
      ringFormatted:
        ring_mils.toFixed(2) + " mil / " + ring_mm.toFixed(3) + " mm",
      ipcClass,
      error: null,
    };
  };

  /**
   * គណនា Hole Size តាម Lead Diameter
   * IPC-2222: Hole = Lead + 0.15 mm (minimum)
   *           + plating 0.05 mm
   *           + tolerance
   */
  const calculateHoleFromLead = (
    leadDiameter_mm: number,
    plating_mm: number = 0.025,
    tolerance_mm: number = 0.1,
  ) => {
    if (leadDiameter_mm <= 0) return null;

    const hole_mm = leadDiameter_mm + 2 * plating_mm + tolerance_mm;
    const pad_mm = hole_mm * 2; // Common ratio
    const annularRing = (pad_mm - hole_mm) / 2;

    return {
      hole_mm,
      holeFormatted: hole_mm.toFixed(2) + " mm",
      pad_mm,
      padFormatted: pad_mm.toFixed(2) + " mm",
      annularRing,
      annularRingFormatted: annularRing.toFixed(3) + " mm",
    };
  };

  return {
    copperThicknesses,
    calculateWidth,
    calculateMaxCurrent,
    calculateMilStd275,
    calculateVoltageDrop,
    calculateVia,
    calculateViaCount,
    calculateAnnularRing,
    calculateHoleFromLead,
  };
};
