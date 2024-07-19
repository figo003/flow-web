/**
 * @author 许明浩
 * @lasttime 2020/7/24 22:36
 * @dec 所有图片全部load完成后执行
 * @param {Array[String]} urlArr 图片url数组
 * @param {Function} callBack 所有图片加载完后回掉函数
 */
import html2canvas from "html2canvas";
export const loadImages = (urlArr, callBack) => {
  if (urlArr.length <= 0) return;
  let i = 0,
    timer = null,
    len = urlArr.length,
    load = url => {
      if (i < len) {
        const image = new Image();
        image.src = url;
        timer = setInterval(() => {
          if (image.complete) {
            console.log("complete");
            clearInterval(timer);
            load(urlArr[i++]);
          }
        }, 80);
      } else {
        callBack();
      }
    };
  load(urlArr[i]);
};

// 图片转blob
export const getImage = (url, imgId) => {
  var xhr = new XMLHttpRequest();
  xhr.open("get", url, true);
  xhr.responseType = "blob";
  xhr.onload = function() {
    if (this.status == 200) {
      document.getElementById(imgId).src = URL.createObjectURL(this.response);
    }
  };
  xhr.send();
};

// 图片转base64
export const image2Base64 = img => {
  var canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, img.width, img.height);
  var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
  var dataURL = canvas.toDataURL("image/" + ext);
  return dataURL;
};

export const getImgBase64 = (url, callback) => {
  return new Promise(resolve => {
    var img = new Image();
    img.src = url;
    img.onload = function() {
      if (callback) {
        callback(img);
      } else {
        resolve(image2Base64(img));
      }
    };
  });
};

/**
 * @author: 许明浩
 * @date: 2020-07-09 13:00:00
 * @desc: 将HTML生成图片
 * @param dom 需要生成图片的HTML
 * @param width 图片宽度
 * @param height 图片高度
 * @param height 背景颜色
 * @retrun 返回图片
 */
export const createImages = function({
  dom: dom,
  width = window.innerWidth,
  height = window.innerHeight,
  windowWidth = window.innerWidth,
  windowHeight = window.innerHeight,
  x = 0,
  y = 0,
  scrollX = 0,
  scrollY = 0,
  bgColor = "#ffffff",
  foreignObjectRendering = false,
  ignoreElements = () => false
} = {}) {
  return new Promise(resolve => {
    html2canvas(dom, {
      useCORS: true, // 如果截图的内容里有图片,可能会有跨域的情况,加上这个参数,解决文件跨域问题
      allowTaint: false, //允许跨域（图片跨域相关）
      taintTest: true, //是否在渲染前测试图片
      logging: false,
      width: width,
      height: height,
      windowWidth,
      windowHeight,
      x: x,
      y: y,
      scrollX,
      scrollY,
      foreignObjectRendering,
      ignoreElements,
      scale:
        window.devicePixelRatio && window.devicePixelRatio > 1
          ? window.devicePixelRatio
          : 1,
      backgroundColor: bgColor
    }).then(canvas => {
      let url = canvas.toDataURL("image/jpeg");
      resolve(url);
    });
  });
};

/**
 * 图片上传压缩  压缩至尺寸: 383*512
 * @param {*} img 被压缩的图片对象（示例：<img src="1.png"/>）
 * @param {*} callback
 */
export function compressImg(
  img,
  callback,
  needCompress = true,
  compressImgWidth = 383
) {
  img.onload = () => {
    let limitWidth = compressImgWidth;
    // let imageWidth = img.width;
    // let imageHeight = img.height;
    // if (imageWidth > imageHeight) {
    //     limitWidth = arguments[2] ? arguments[2] : 512;
    // } else {
    //     limitWidth = arguments[2] ? arguments[2] : 383;
    // }
    const width = needCompress
      ? img.width > limitWidth
        ? limitWidth
        : img.width
      : img.width;
    const height = needCompress
      ? img.width > limitWidth
        ? parseInt((img.height * limitWidth) / img.width)
        : img.height
      : img.height;
    console.log("width:", width, "height:", height);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = width;
    canvas.height = height;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    callback && callback(canvas.toDataURL("image/png", 1));
  };
}
