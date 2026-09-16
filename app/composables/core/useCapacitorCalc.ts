export interface CapacitorResult {
  primary: string;
  pF: string;
  nF: string;
  uF: string;
  tolerance: string;
}

export const useCapacitorCalc = () => {
  const parseCapCode = (raw: string): CapacitorResult => {
    let code = raw.trim().toUpperCase();
    if (!code) {
      return { primary: "0 F", pF: "0", nF: "0", uF: "0", tolerance: "N/A" };
    }

    let tolChar = "";
    if (/[JKMFGZ]$/.test(code)) {
      tolChar = code.charAt(code.length - 1);
      code = code.slice(0, -1);
    }

    if (/^\d{3,4}$/.test(code)) {
      const digits = parseInt(code.substring(0, code.length - 1), 10);
      const exp = parseInt(code.charAt(code.length - 1), 10);
      const pF = digits * Math.pow(10, exp);
      const nF = pF / 1000;
      const uF = pF / 1000000;

      const primaryStr =
        uF >= 1 ? `${uF} µF` : nF >= 1 ? `${nF} nF` : `${pF} pF`;
      const tolMap: Record<string, string> = {
        J: "±5%",
        K: "±10%",
        M: "±20%",
        F: "±1%",
        G: "±2%",
        Z: "+80%/-20%",
      };

      // ✅ ប្រើ toFixed ជំនួស toLocaleString (SSR-safe)
      const pFFormatted =
        pF >= 1000
          ? pF.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " pF"
          : pF.toFixed(0) + " pF";

      return {
        primary: primaryStr,
        pF: pFFormatted,
        nF: nF.toFixed(nF < 1 ? 2 : 1) + " nF",
        uF: uF.toFixed(uF < 0.01 ? 4 : 2) + " µF",
        tolerance:
          tolChar && tolMap[tolChar]
            ? `${tolMap[tolChar]} (Letter '${tolChar}')`
            : "មិនបានបញ្ជាក់",
      };
    }

    return {
      primary: "កូដមិនត្រឹមត្រូវ",
      pF: "-",
      nF: "-",
      uF: "-",
      tolerance: "-",
    };
  };

  const convertUnit = (value: number, from: string, to: string): number => {
    if (isNaN(value) || value === 0) return 0;

    const toPico = (v: number, u: string) => {
      if (u === "pF") return v;
      if (u === "nF") return v * 1e3;
      return v * 1e6; // µF
    };
    const pico = toPico(value, from);
    if (to === "pF") return pico;
    if (to === "nF") return pico / 1e3;
    return pico / 1e6;
  };

  const calculateSeries = (caps: number[]): number => {
    const valid = caps.filter((c) => c > 0);
    if (valid.length === 0) return 0;
    const invSum = valid.reduce((s, c) => s + 1 / c, 0);
    return invSum > 0 ? 1 / invSum : 0;
  };

  const calculateParallel = (caps: number[]): number => {
    return caps.filter((c) => c > 0).reduce((s, c) => s + c, 0);
  };

  const formatCapacitance = (farads: number): string => {
    if (isNaN(farads) || farads === 0) return "0 F";
    if (farads >= 1) return farads.toFixed(2) + " F";
    if (farads >= 1e-3) return (farads * 1e3).toFixed(2) + " mF";
    if (farads >= 1e-6) return (farads * 1e6).toFixed(2) + " µF";
    if (farads >= 1e-9) return (farads * 1e9).toFixed(1) + " nF";
    return (farads * 1e12).toFixed(1) + " pF";
  };

  return {
    parseCapCode,
    convertUnit,
    calculateSeries,
    calculateParallel,
    formatCapacitance,
  };
};
