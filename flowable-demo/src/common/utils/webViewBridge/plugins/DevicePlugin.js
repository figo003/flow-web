/*
 * @Author: tulin
 * @LastEditors  : tulin
 */
/**
 * 定位
 * @param {*} callBack 成功回调函数
 * 返回参数：
 * platform  DJDD 代表壳子
 * system 系统 ios android
 * systemVersion 系统版本
 * appVersion app版本号
 */
export function getDeviceInfo(callBack) {
  if (!window.bridgeObject) return;
  window.bridgeObject.callHandler("getDeviceInfo", "", function (responseData) {
    if (responseData) {
      callBack(JSON.parse(responseData));
    } else {
      callBack("");
    }
  });
}
