/*
 * @Author: tulin
 * @LastEditors  : tulin
 */

/**
 * 打开PDF
 * @param {*} jsonObject json对象  或者 空字符串
   pdfUrl：PDF链接
   pdfName：PDF名字
   pdfId：PDF id
 * @param {*} callBack 成功回调函数
 */
export function openPdf(jsonObject, callBack) {
  if (!window.bridgeObject) return;
  window.bridgeObject.callHandler("openPDF", JSON.stringify(jsonObject), function (responseData) {
    if (responseData) {
      callBack(JSON.parse(responseData));
    } else {
      callBack("");
    }
  });
}

/**
 * 生成PDF
 * @param {*} jsonObject json对象  或者 空字符串
   placeholder：PDF水印
 * @param {*} callBack 成功回调函数
 返回参数
  pdfFilePath ：pdf路径
 */
export function generatePDF(jsonObject, callBack) {
  if (!window.bridgeObject) return;
  window.bridgeObject.callHandler("generatePDF", JSON.stringify(jsonObject), function (responseData) {
    if (responseData) {
      callBack(JSON.parse(responseData));
    } else {
      callBack("");
    }
  });
}
