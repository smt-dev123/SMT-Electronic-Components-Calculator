export const formatResistance = (ohms: number): string => {
  if (isNaN(ohms)) return "0 Ω";
  if (ohms >= 1e6) return (ohms / 1e6).toFixed(2).replace(/\.00$/, "") + " MΩ";
  if (ohms >= 1e3) return (ohms / 1e3).toFixed(2).replace(/\.00$/, "") + " kΩ";
  return ohms.toFixed(2).replace(/\.00$/, "") + " Ω";
};

export const formatCapacitance = (pF: number): string => {
  if (pF >= 1e6) return (pF / 1e6).toFixed(2) + " µF";
  if (pF >= 1e3) return (pF / 1e3).toFixed(2) + " nF";
  return pF.toFixed(0) + " pF";
};
