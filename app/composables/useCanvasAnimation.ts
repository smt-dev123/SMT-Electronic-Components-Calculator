export const useCanvasAnimation = () => {
  const animTime = ref(0);
  let animFrameId: number | null = null;
  const callbacks: (() => void)[] = [];
  const isRunning = ref(false);

  const register = (cb: () => void) => {
    callbacks.push(cb);
  };

  const setupCanvas = (cvs: HTMLCanvasElement | null) => {
    // ✅ SSR guard
    if (!cvs || !import.meta.client) return null;
    const ctx = cvs.getContext("2d");
    if (!ctx) return null;
    if (cvs.width !== cvs.clientWidth || cvs.height !== cvs.clientHeight) {
      cvs.width = cvs.clientWidth;
      cvs.height = cvs.clientHeight;
    }
    return { ctx, w: cvs.width, h: cvs.height };
  };

  const loop = () => {
    animTime.value += 0.03;
    callbacks.forEach((cb) => {
      try {
        cb();
      } catch {
        // Silent fail
      }
    });
    animFrameId = requestAnimationFrame(loop);
  };

  const start = () => {
    // ✅ SSR guard
    if (!import.meta.client) return;
    if (animFrameId === null) {
      isRunning.value = true;
      loop();
    }
  };

  const stop = () => {
    if (animFrameId !== null) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
      isRunning.value = false;
    }
  };

  return { animTime, isRunning, register, setupCanvas, start, stop };
};
