/*
 * @Author: tulin
 * @LastEditors  : tulin
 */

/**
 * 设置头部颜色
 * @param {*} jsonObject
 * headColor 头部颜色 示例：d34115
 */
export function setHeadColor(jsonObject) {
  if (!window.bridgeObject) return;
  window.bridgeObject.callHandler("setHeadColor", JSON.stringify(jsonObject), function (responseData) {});
}
