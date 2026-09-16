export const drawRoundRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void => {
  const ctxExt = ctx as CanvasRenderingContext2D & {
    roundRect?: (
      x: number,
      y: number,
      w: number,
      h: number,
      radii?: number | number[],
    ) => void;
  };

  if (typeof ctxExt.roundRect === "function") {
    ctxExt.roundRect(x, y, w, h, r);
  } else {
    ctx.rect(x, y, w, h);
  }
};
