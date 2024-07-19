import store from "../store";

export function getCurrentContext() {
  const u = navigator.userAgent;
  if (u.match(/WxWork/i) == "wxwork") {
    return "workwechat";
  }
  if (
    u.match(/MicroMessenger/i) &&
    u.match(/MicroMessenger/i)[0] &&
    u.match(/MicroMessenger/i)[0].toLowerCase() == "micromessenger"
  ) {
    return "wechat";
  }
  return "aclient";
}
// 企业微信,微信功能初始化
export let newData = null;
export async function wxConfig(argjsApiList, callback) {
  let jsApiList = [
    "hideOptionMenu",
    "invoke",
    "shareAppMessage",
    "shareWechatMessage",
    "selectExternalContact",
    "onMenuShareAppMessage",
  ];
  const isEwechat = isInEwechat();
  console.log("wxConfig", `${isEwechat}_失败的话不走企业微信`);
  if (!isEwechat) {
    return false;
  }
  // 登录时间超过1小时50分调用wxConfig会重新获取签名data，或主动清除data
  if (newData && newData.startTime + 110 * 60 * 1000 <= new Date().getTime()) {
    newData = null;
  }
  if (!newData) {
    let { data } = await getEwechatConfig();
    newData = { ...data, startTime: new Date().getTime() };
  }
  // let {appid, signature, timestamp, nonceStr} = store.getters.eWechatInfo
  argjsApiList = argjsApiList || [];
  wx.config({
    beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId: newData.appId, // 必填，企业微信的corpID
    timestamp: newData.timestamp, // 必填，生成签名的时间戳
    nonceStr: newData.nonceStr, // 必填，生成签名的随机串
    signature: newData.signature, // 必填，签名，见 附录-JS-SDK使用权限签名算法
    jsApiList: [...jsApiList, ...argjsApiList], // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
  });
  wx.ready(function () {
    wx.hideOptionMenu();
    callback && callback();
    store.dispatch("setEwechatInfo", {
      eWxConfigStatus: true,
      startTime: newData.startTime,
    });
    console.log("wx_ready");
  });
  wx.error(function (err) {
    //通过error接口处理失败验证
    // config信息验证失败会执行error
    store.dispatch("setEwechatInfo", {
      eWxConfigStatus: false,
      startTime: newData.startTime,
    });
    console.log("执行失败", err);
  });
}

export const listenerGoBack = {
  add: (fn) => {
    window.addEventListener("popstate", fn, false);
  },
  remove: (fn) => {
    window.removeEventListener("popstate", fn, false);
  },
};

export function isWindowpushState(callback) {
  if (getCurrentContext() !== "aclient") {
    // c端环境
    if (getCurrentContext() === "wechat") {
      wx.miniProgram.getEnv((res) => {
        // 微信内
        if (!res.miniprogram) {
          callback(true);
          // 小程序内
        } else {
          callback(false);
        }
      });
    } else {
      // 企业微信
      callback(true);
    }
  } else {
    callback(false);
  }
}
