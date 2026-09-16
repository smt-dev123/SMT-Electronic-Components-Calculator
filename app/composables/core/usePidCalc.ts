export interface PidParams {
  kp: number;
  ki: number;
  kd: number;
}

export const usePidCalc = () => {
  // ===== Ziegler-Nichols Tuning Methods =====

  const zieglerNicholsOpen = (K: number, L: number, T: number) => {
    if (K <= 0 || L <= 0 || T <= 0) return null;

    const kp = (1.2 * T) / (K * L);
    const ti = 2 * L;
    const td = 0.5 * L;
    const ki = kp / ti;
    const kd = kp * td;

    return {
      kp,
      ki,
      kd,
      ti,
      td,
      kpFormatted: kp.toFixed(4),
      kiFormatted: ki.toFixed(4),
      kdFormatted: kd.toFixed(4),
      tiFormatted: ti.toFixed(3) + " s",
      tdFormatted: td.toFixed(3) + " s",
    };
  };

  const zieglerNicholsClosed = (
    ku: number,
    pu: number,
    type: "classic" | "someOvershoot" | "noOvershoot" = "classic",
  ) => {
    if (ku <= 0 || pu <= 0) return null;

    let kp = 0;
    let ti = 0;
    let td = 0;

    if (type === "classic") {
      kp = 0.6 * ku;
      ti = pu / 2;
      td = pu / 8;
    } else if (type === "someOvershoot") {
      kp = 0.33 * ku;
      ti = pu / 2;
      td = pu / 3;
    } else {
      kp = 0.2 * ku;
      ti = pu / 2;
      td = pu / 3;
    }

    const ki = ti > 0 ? kp / ti : 0;
    const kd = kp * td;

    return {
      kp,
      ki,
      kd,
      ti,
      td,
      kpFormatted: kp.toFixed(4),
      kiFormatted: ki.toFixed(4),
      kdFormatted: kd.toFixed(4),
      tiFormatted: ti.toFixed(3) + " s",
      tdFormatted: td.toFixed(3) + " s",
    };
  };

  const cohenCoon = (K: number, L: number, T: number) => {
    if (K <= 0 || L <= 0 || T <= 0) return null;

    const tau = T;
    const r = L / tau;

    const kp = (1 / K) * (tau / L) * (1.35 + 0.27 * r);
    const ti = L * ((2.5 - 2 * r) / (1 - 0.39 * r));
    const td = L * (0.37 / (1 - 0.81 * r));

    const ki = kp / ti;
    const kd = kp * td;

    return {
      kp,
      ki,
      kd,
      ti,
      td,
      kpFormatted: kp.toFixed(4),
      kiFormatted: ki.toFixed(4),
      kdFormatted: kd.toFixed(4),
      tiFormatted: ti.toFixed(3) + " s",
      tdFormatted: td.toFixed(3) + " s",
    };
  };

  // ===== Simulation (FOPDT) =====
  const simulateFopdt = (
    params: PidParams,
    K: number,
    L: number,
    T: number,
    setpoint: number = 1,
    duration: number = 10,
    dt: number = 0.01,
  ) => {
    if (K <= 0 || L <= 0 || T <= 0 || duration <= 0 || dt <= 0) return null;

    const steps = Math.floor(duration / dt);
    const y: number[] = [];
    const u: number[] = [];
    const t: number[] = [];

    // ✅ Dead-time buffer — បង្កើតជា tuple ជាមួយ default 0
    const deadSteps = Math.max(1, Math.round(L / dt));
    const buffer: number[] = new Array(deadSteps).fill(0);

    let output = 0;
    let integral = 0;
    let prevError = 0;
    let bufferIndex = 0;

    for (let i = 0; i < steps; i++) {
      const currentTime = i * dt;
      const error = setpoint - output;

      // PID
      integral += error * dt;
      const derivative = (error - prevError) / dt;

      // Anti-windup
      integral = Math.max(-10, Math.min(10, integral));

      let control =
        params.kp * error + params.ki * integral + params.kd * derivative;
      control = Math.max(-10, Math.min(10, control));

      // ✅ Dead-time — ប្រើ `?? 0` ដើម្បីជៀសវាង undefined
      const delayedControl = buffer[bufferIndex] ?? 0;

      // Update buffer
      buffer[bufferIndex] = control;
      bufferIndex = (bufferIndex + 1) % deadSteps;

      // First-order dynamics
      output += (dt / T) * (K * delayedControl - output);

      y.push(output);
      u.push(control);
      t.push(currentTime);
      prevError = error;
    }

    // Metrics
    let maxOvershoot = 0;
    for (let i = 0; i < y.length; i++) {
      const val = y[i];
      if (val !== undefined && val > maxOvershoot) maxOvershoot = val;
    }

    const steadyState = y[y.length - 1] ?? setpoint;

    // Settling time
    const tolerance = 0.02 * setpoint;
    let settlingIndex = -1;
    for (let i = y.length - 1; i >= 0; i--) {
      const val = y[i];
      if (val !== undefined && Math.abs(val - setpoint) > tolerance) {
        settlingIndex = i;
        break;
      }
    }

    const settlingTime = settlingIndex >= 0 ? (t[settlingIndex] ?? 0) + dt : 0;

    // Rise time (10% - 90%)
    const y10 = 0.1 * setpoint;
    const y90 = 0.9 * setpoint;
    let riseStart = -1;
    let riseEnd = -1;

    for (let i = 0; i < y.length; i++) {
      const val = y[i];
      if (val === undefined) continue;
      if (riseStart === -1 && val >= y10) riseStart = i;
      if (riseEnd === -1 && val >= y90) {
        riseEnd = i;
        break;
      }
    }

    const riseTime =
      riseStart >= 0 && riseEnd >= 0 ? (riseEnd - riseStart) * dt : 0;

    return {
      time: t,
      output: y,
      control: u,
      setpoint,
      metrics: {
        steadyState,
        steadyStateFormatted: steadyState.toFixed(4),
        overshoot:
          maxOvershoot > setpoint
            ? ((maxOvershoot - setpoint) / setpoint) * 100
            : 0,
        overshootFormatted:
          maxOvershoot > setpoint
            ? (((maxOvershoot - setpoint) / setpoint) * 100).toFixed(2) + " %"
            : "0.00 %",
        riseTime,
        riseTimeFormatted: riseTime.toFixed(3) + " s",
        settlingTime,
        settlingTimeFormatted: settlingTime.toFixed(3) + " s",
        steadyStateError: Math.abs(setpoint - steadyState),
        steadyStateErrorFormatted: Math.abs(setpoint - steadyState).toFixed(4),
      },
    };
  };

  return {
    zieglerNicholsOpen,
    zieglerNicholsClosed,
    cohenCoon,
    simulateFopdt,
  };
};
