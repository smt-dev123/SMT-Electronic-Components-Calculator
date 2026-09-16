export const useTransformerCalc = () => {
  const calculate = (
    vPrimary: number,
    vSecondary: number,
    iSecondary: number,
    nPrimary: number = 0,
  ) => {
    if (vPrimary <= 0 || vSecondary <= 0) return null;

    const turnsRatio = vPrimary / vSecondary;
    const iPrimary = iSecondary / turnsRatio;
    const power = vSecondary * iSecondary;
    const nSecondary = nPrimary > 0 ? nPrimary / turnsRatio : 0;

    return {
      turnsRatio,
      turnsRatioFormatted: turnsRatio.toFixed(3),
      iPrimary,
      iPrimaryFormatted: iPrimary.toFixed(3) + " A",
      power,
      powerFormatted: power.toFixed(2) + " VA",
      nSecondary,
      nSecondaryFormatted:
        nSecondary > 0 ? nSecondary.toFixed(0) + " turns" : "N/A",
    };
  };

  return { calculate };
};
