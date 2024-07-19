/**
 * @author 明浩
 * @time 2020-8-14
 * @dec canvas 常用方法
 */

/**
 * 画线的方法
 * @param {Number} xa 起点坐标x
 * @param {Number} ya 起点坐标y
 * @param {Number} xb 终点坐标x
 * @param {Number} yb 终点坐标y
 */
export function drawLine({
  ctx,
  xa = 0,
  ya = 0,
  xb,
  yb,
  gradient = { color: "#000" }
}) {
  ctx.fillStyle = gradient.color;
  ctx.strokeStyle = gradient.color;
  ctx.beginPath();
  ctx.moveTo(xa, ya);
  ctx.lineTo(xb, yb);
  ctx.stroke();
  ctx.closePath();
}

/**
 * 绘制方块
 * @param {Number} xa 起点坐标x
 * @param {Number} ya 起点坐标y
 * @param {Number} xb 终点坐标x
 * @param {Number} yb 终点坐标y
 * @param {Object} mousePosition 是否是鼠标滑过 position x y为鼠标滑过坐标
 * @param {Object} gradient 填充颜色 color为默认颜色，hover为渐变颜色
 */
export function drawRect({
  ctx,
  xa = 0,
  ya = 0,
  xb,
  yb,
  mousePosition = null,
  gradient
}) {
  let ishover = false;
  ctx.beginPath();
  ctx.rect(xa, ya, xb, yb);
  ctx.fillStyle = gradient.color;
  ctx.strokeStyle = gradient.color;
  // 如果是鼠标移动的到柱状图上，重新绘制图表
  if (mousePosition && ctx.isPointInPath(mousePosition.x, mousePosition.y)) {
    ishover = true;
    ctx.fillStyle = gradient.hover;
  }

  ctx.fill();
  ctx.closePath();
  return ishover;
}

/**
 * 绘制文本
 * @param {Number} xa 起点坐标x
 * @param {Number} ya 起点坐标y
 * @param {Number} xb 终点坐标x
 * @param {Number} yb 终点坐标y
 * @param {Object} textStyle 文本颜色 bgcolor 背景 borderColor 边框颜色 color字体颜色 data 数据
 */
export function drawText({ ctx, xa = 0, ya = 0, textStyle }) {
  ctx.beginPath();
  drawRadiusRect({
    ctx,
    x: xa,
    y: ya,
    width: textStyle.width,
    height: textStyle.height,
    radius: 4
  });
  ctx.fillStyle = textStyle.bgcolor;
  ctx.strokeStyle = textStyle.borderColor;
  ctx.fill();
  ctx.font = textStyle.font;
  ctx.fillStyle = textStyle.color;
  ctx.textAlign = "center";
  ctx.fillText(
    textStyle.data,
    xa + textStyle.width / 2,
    ya + textStyle.height / 2 + textStyle.fontSize / 3
  ); // 文字
  ctx.closePath();
}

/**
 * 获取圆角矩形
 */
export function drawRadiusRect({ ctx, x = 0, y = 0, width, height, radius }) {
  ctx.beginPath();
  ctx.arc(x + radius, y + radius, radius, Math.PI, (Math.PI * 3) / 2);
  ctx.lineTo(width - radius + x, y);
  ctx.arc(
    width - radius + x,
    radius + y,
    radius,
    (Math.PI * 3) / 2,
    Math.PI * 2
  );
  ctx.lineTo(width + x, height + y - radius);
  ctx.arc(
    width - radius + x,
    height - radius + y,
    radius,
    0,
    (Math.PI * 1) / 2
  );
  ctx.lineTo(radius + x, height + y);
  ctx.arc(radius + x, height - radius + y, radius, (Math.PI * 1) / 2, Math.PI);
  ctx.closePath();
}

/**
 * 解决canvas在retina高清屏（Mac）下失真问题
 */
export function getPixelRatio(context) {
  let backingStore =
    context.backingStorePixelRatio ||
    context.webkitBackingStorePixelRatio ||
    context.mozBackingStorePixelRatio ||
    context.msBackingStorePixelRatio ||
    context.oBackingStorePixelRatio ||
    context.backingStorePixelRatio ||
    1;
  return (window.devicePixelRatio || 1) / backingStore;
}
export function canvasFromRetina(ctx, canvas) {
  let ratio = getPixelRatio(ctx);
  canvas.style.width = canvas.width + "px";
  canvas.style.height = canvas.height + "px";
  canvas.width = canvas.width * ratio;
  canvas.height = canvas.height * ratio;
  ctx.scale(ratio, ratio);
  return ratio;
}

/**
 * 消除锯齿
 */
export function retina(canvasEl) {
  const canvas = canvasEl;
  const ctx = canvas.getContext("2d");
  const devicePixelRatio = window.devicePixelRatio || 1;
  const backingStorePixelRatio =
    ctx.webkitBackingStorePixelRatio ||
    ctx.mozBackingStorePixelRatio ||
    ctx.msBackingStorePixelRatio ||
    ctx.oBackingStorePixelRatio ||
    ctx.backingStorePixelRatio ||
    1;

  const ratio = devicePixelRatio / backingStorePixelRatio;
  if (devicePixelRatio !== backingStorePixelRatio) {
    const oldWidth = canvas.width;
    const oldHeight = canvas.height;

    canvas.width = oldWidth * ratio;
    canvas.height = oldHeight * ratio;

    canvas.style.width = `${oldWidth}px`;
    canvas.style.height = `${oldHeight}px`;
    ctx.scale(ratio, ratio);
  }
}
