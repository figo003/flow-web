import store from "../store";
import { sdkwxConfig } from "@/api/common";
export const getCurrentContext = () => {
  const u = navigator.userAgent;
  if (
    u.match(/MicroMessenger/i) &&
    u.match(/MicroMessenger/i)[0] &&
    u.match(/MicroMessenger/i)[0].toLowerCase() == "micromessenger"
  ) {
    console.log("运行环境 version: DEV_20200731_V1.1 ====== 微信");
    return "wechat";
  }
  return "";
};
// 微信功能初始化
const jsApiList = [
  "hideOptionMenu",
  "invoke",
  "shareAppMessage",
  "shareWechatMessage",
  "selectExternalContact",
  "getCurExternalContact",
  "onMenuShareAppMessage",
  "updateAppMessageShareData",
  "hideMenuItems",
  "showMenuItems"
];
export let newData = null;
export const wxConfig = async (argjsApiList, callback) => {
  const isWechat = getCurrentContext() === "wechat";
  if (!isWechat) {
    return false;
  }
  // 登录时间超过1小时50分调用wxConfig会重新获取签名data，或主动清除data
  if (newData && newData.startTime + 110 * 60 * 1000 <= new Date().getTime()) {
    newData = null;
  }
  if (!newData) {
    let { data } = await sdkwxConfig();
    newData = { ...data, startTime: new Date().getTime() };
  }
  // let {appid, signature, timestamp, nonceStr} = store.getters.eWechatInfo

  console.log("开始初始化微信参数，入参为--------" + JSON.stringify(newData));
  argjsApiList = argjsApiList || [];
  window.wx.config({
    beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId: newData.appId, // 必填，企业微信的corpID
    timestamp: newData.timestamp, // 必填，生成签名的时间戳
    nonceStr: newData.nonceStr, // 必填，生成签名的随机串
    signature: newData.signature, // 必填，签名，见 附录-JS-SDK使用权限签名算法
    jsApiList: [...jsApiList, ...argjsApiList] // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
  });
  window.wx.ready(function(data) {
    console.log("初始化微信config成功------" + JSON.stringify(data));
    window.wx.hideMenuItems({
      menuList: [
        //分享到朋友圈:
        "menuItem:share:timeline",
        //分享到QQ:
        "menuItem:share:qq",
        //分享到Weibo:
        "menuItem:share:weiboApp",
        //收藏: "menuItem:favorite"
        //分享到FB:
        "menuItem:share:facebook",
        //分享到 QQ 空间
        "menuItem:share:QZone",

        // 以下为保护类
        //编辑标签:
        "menuItem:editTag",
        //删除:
        "menuItem:delete",
        //复制链接:
        "menuItem:copyUrl",
        //原网页:
        "menuItem:originPage",
        //阅读模式:
        "menuItem:readMode",
        //在QQ浏览器中打开:
        "menuItem:openWithQQBrowser",
        //在Safari中打开:
        "menuItem:openWithSafari",
        //邮件:
        "menuItem:share:email",
        //一些特殊公众号:
        "menuItem:share:brand"
      ] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
    });
    // 展示按钮
    window.wx.showMenuItems({
      menuList: ["menuItem:share:appMessage"] // 要显示的菜单项，所有menu项见附录3
    });
    callback && callback();
    store.dispatch("setEwechatInfo", {
      eWxConfigStatus: true,
      startTime: newData.startTime
    });
  });
  window.wx.error(function(err) {
    //通过error接口处理失败验证
    console.log("初始化微信config失败--------" + JSON.stringify(err));
    // config信息验证失败会执行error
    store.dispatch("setEwechatInfo", {
      eWxConfigStatus: false,
      startTime: newData.startTime
    });
  });
};

const wechatOnShare = shareData => {
  if (!wx) return;
  // 展示按钮
  wx.showMenuItems({
    menuList: ["menuItem:share:appMessage"] // 要显示的菜单项，所有menu项见附录3
  });
  let wxVersion = navigator.userAgent.match(/MicroMessenger\/([\d\.]+)/i)[1];
  if (wxVersion >= "6.7.2") {
    // 1.4以上版本sdk, 微信版本6.7.2以上
    wx.updateAppMessageShareData({
      title: shareData.title, // 分享标题
      desc: shareData.desc, // 分享描述
      link: shareData.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: shareData.imgUrl, // 分享图标
      success: function() {
        console.log("分享成功" + JSON.stringify(shareData));
        // 设置成功
      }
    });
    return false;
  }
  // 即将废弃
  wx.onMenuShareAppMessage({
    title: shareData.title, // 分享标题
    desc: shareData.desc, // 分享描述
    link: shareData.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    imgUrl: shareData.imgUrl, // 分享图标
    type: "", // 分享类型,music、video或link，不填默认为link
    dataUrl: "", // 如果type是music或video，则要提供数据链接，默认为空
    success: function() {
      // 用户点击了分享后执行的回调函数
      console.log("分享成功-老得分享方法" + JSON.stringify(shareData));
    }
  });
};
