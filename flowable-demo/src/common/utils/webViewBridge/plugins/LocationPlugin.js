/*
 * @Author: tulin
 * @LastEditors  : tulin
 */

/**
 * 定位   
 * @param {*} callBack 成功回调函数
 * "latitude"://纬度
"longitude"://经度
"formattedAddress"//详细地址
"provice"//省
"city"//市
"district"//区
"street"//街道
"streetNumber"//街道号
 */
export function getLocation(callBack) {
  if (!window.bridgeObject) return;
  window.bridgeObject.callHandler("getLocation", "", function (responseData) {
    if (responseData) {
      callBack(JSON.parse(responseData));
    } else {
      callBack("");
    }
  });
}
