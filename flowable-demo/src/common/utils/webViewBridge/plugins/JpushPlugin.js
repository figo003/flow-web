/*
 * @Author: tulin
 * @LastEditors  : tulin
 */

/**
  * 推送绑定
  * @param {*} jsonObject json对象  或者 空字符串
    userName 用户唯一标示
  * @param {*} callBack 成功回调函数
  */

export function bindJpush(jsonObject, callBack) {
  if (!window.bridgeObject) return;
  window.bridgeObject.callHandler("bindJpush", JSON.stringify(jsonObject), function (responseData) {
    callBack(responseData);
  });
}
