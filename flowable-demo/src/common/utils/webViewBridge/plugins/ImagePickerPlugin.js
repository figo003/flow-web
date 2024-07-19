/*
 * @Author: tulin
 * @LastEditors  : tulin
 */
/**
 * 根据 宽高 获取图片
 * @param {*} callBack 成功回调函数
 * 返回参数：
 * width  宽度 类型 字符串
 * height 高度  类型 字符串
 */
export function getCustomCropImage(jsonObject, callBack) {
  if (!window.bridgeObject) return;
  window.bridgeObject.callHandler("getCustomCropImage", JSON.stringify(jsonObject), function (responseData) {
    if (responseData) {
      callBack(JSON.parse(responseData));
    } else {
      callBack("");
    }
  });
}
