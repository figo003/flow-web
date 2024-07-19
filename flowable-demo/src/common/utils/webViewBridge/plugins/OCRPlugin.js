/*
 * @Author: tulin
 * @LastEditors  : tulin
 */

/**
  * OCR识别
  * @param {*} jsonObject json对象  或者 空字符串
  * @param {*} callBack 成功回调函数
  *返回参数：
    code 是否成功 0 失败 1 成功
    msg：失败原因
    resultData 识别返回的信息
  */
export function getOCRData(jsonObject, callBack) {
  if (!window.bridgeObject) return;
  window.bridgeObject.callHandler("getOCRData", JSON.stringify(jsonObject), function (responseData) {
    if (responseData) {
      callBack(JSON.parse(responseData));
    } else {
      callBack("");
    }
  });
}
