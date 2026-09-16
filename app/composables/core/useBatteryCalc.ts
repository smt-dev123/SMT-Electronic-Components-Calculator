export const useBatteryCalc = () => {
  const calculateLife = (capacity_mAh: number, current_mA: number) => {
    if (capacity_mAh <= 0 || current_mA <= 0) return null;

    const hours = capacity_mAh / current_mA;
    const days = hours / 24;

    return {
      hours,
      hoursFormatted: hours.toFixed(2) + " hours",
      days,
      daysFormatted: days.toFixed(2) + " days",
      minutesFormatted: (hours * 60).toFixed(0) + " minutes",
    };
  };

  const calculateCharging = (
    capacity_mAh: number,
    chargeRate_mA: number,
    efficiency: number = 0.85,
  ) => {
    if (capacity_mAh <= 0 || chargeRate_mA <= 0) return null;

    const hours = capacity_mAh / (chargeRate_mA * efficiency);
    return {
      hours,
      hoursFormatted: hours.toFixed(2) + " hours",
      minutesFormatted: (hours * 60).toFixed(0) + " minutes",
    };
  };

  return { calculateLife, calculateCharging };
};
