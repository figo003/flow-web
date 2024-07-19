/*
 * @Author: tulin
 * @LastEditors  : tulin
 */

/**
  * 分享到微信
  * @param {*} jsonObject json对象  或者 空字符串
  title:'分享标题',
  content:'分享内容',
  url:,//分享链接
  image://图片url完整地址
  * @param {*} callBack 成功回调函数
  */
export function shareToWechat(jsonObject, callBack) {
  if (!window.bridgeObject) return;
  window.bridgeObject.callHandler("shareToWechat", JSON.stringify(jsonObject), function (responseData) {
    // callBack(responseData);
    if (responseData) {
      callBack(JSON.parse(responseData));
    } else {
      callBack("");
    }
  });
}
