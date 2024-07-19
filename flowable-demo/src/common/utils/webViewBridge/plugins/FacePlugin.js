/*
 * @Author: tulin
 * @LastEditors  : tulin
 */
/**
  * 活体检测
  * @param {*} jsonObject json对象  或者 空字符串
  * @param {*} callBack 成功回调函数 
    返回参数：
    code 是否成功 0 失败 1 成功
    image_env 最清晰的一张全图
    image_best 最清晰的一张半图
    image_action1 第一个动作的图 本地相对路径
    image_action2 第二个动作的图 本地相对路径
    image_action3 第三个动作的图 本地相对路径
    delta 加密数据
  */
export function startFaceDistinguish(jsonObject, callBack) {
  if (!window.bridgeObject) return;
  window.bridgeObject.callHandler("startFaceDistinguish", JSON.stringify(jsonObject), function (responseData) {
    if (responseData) {
      callBack(JSON.parse(responseData));
    } else {
      callBack("");
    }
  });
}
