/**
 * @author 明浩
 * @time 2020-8-14
 * @dec 工具包
 * @dec throttle 节流，debounce 防抖动，请调用 throttle-debounce 插件
 */

import moment from "moment";
/**
 * 获取URL指定参数
 * @param {String} name 参数名称
 * @param {String} url 目标URL地址
 * @return {String|null} 参数值
 */
export function getQueryString(name, url) {
  let _url = url || window.location.href;
  if (_url.includes("?") && _url.includes(name)) {
    let arr = _url
      .split("?")
      .filter(x => x.includes(name))
      .join()
      .split("&");
    return arr
      .find(_ => {
        return _.includes(name);
      })
      .split("=")[1];
  } else {
    return null;
  }
}

/**
 * 获取URL参数
 * @param {String} url 目标URL地址
 * @return {Object} 参数对象
 */
export function getQueryObject(url) {
  const search = url.split("?")[1];
  if (!search) {
    return {};
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"') +
      '"}'
  );
}

/**
 * 非空判断
 * @param {String} value 目标值
 * @return {Boolean} 是否为空
 */
export function isEmpty(value) {
  return typeof value === "undefined" || value === "" || value === null;
}
window.isEmpty = isEmpty;

/**
 * merge对象
 * @param {Object} source 源对象
 * @param {Object} target 要merge的对象
 * @return {Object} merge后的source
 */
export function objectMerge(source, target) {
  if (typeof source !== "object") {
    source = {};
  }
  if (Array.isArray(target)) {
    return target.slice();
  }
  for (const property in target) {
    if (Object.prototype.hasOwnProperty.call(target, property)) {
      const targetProperty = target[property];
      if (
        typeof targetProperty === "object" &&
        !moment.isMoment(targetProperty)
      ) {
        source[property] = objectMerge(source[property], targetProperty);
        continue;
      }
      source[property] = targetProperty;
    }
  }
  return source;
}

/**
 * 数据深拷
 * @param {Array|Object} 要拷贝的对象
 * @return {Array|Object} 返回拷贝的新对象
 */
export function deepClone(source) {
  if (!source && typeof source !== "object") {
    throw new Error("error arguments", "shallowClone");
  }
  const targetObj = source.constructor === Array ? [] : {};
  for (const keys in source) {
    if (Object.prototype.hasOwnProperty.call(source, keys)) {
      if (
        source[keys] &&
        typeof source[keys] === "object" &&
        !moment.isMoment(source[keys])
      ) {
        targetObj[keys] = source[keys].constructor === Array ? [] : {};
        targetObj[keys] = deepClone(source[keys]);
      } else {
        targetObj[keys] = source[keys];
      }
    }
  }
  return targetObj;
}

/**
 * 添加事件
 * @param {Element} el 目标DOM
 * @param {String} type 事件类型
 * @param {Function} fn 事件方法
 * @param {Boolean} capture true为事件捕获/false为事件冒泡 IE678不支持事件捕获，不填默认事件冒泡
 */
export function addEvent(el, type, fn, capture) {
  if (window.addEventListener) {
    if (type === "mousewheel" && document.mozHidden !== undefined) {
      type = "DOMMouseScroll";
    }
    el.addEventListener(type, fn, !!capture);
  } else if (window.attachEvent) {
    el.attachEvent("on" + type, fn);
  }
}

/**
 * 移除事件
 * @param {Element} el 目标DOM
 * @param {String} type 事件类型
 * @param {Function} fn 事件方法
 * @param {Boolean} capture true为事件捕获/false为事件冒泡 IE678不支持事件捕获，不填默认事件冒泡
 */
export function removeEvent(el, type, fn, capture) {
  if (window.removeEventListener) {
    if (type === "mousewheel" && document.mozHidden !== undefined) {
      type = "DOMMouseScroll";
    }
    el.removeEventListener(type, fn, !!capture);
  } else if (window.detachEvent) {
    el.detachEvent("on" + type, fn);
  }
}

/**
 * 解决浮点型计算精度问题
 * @param {Number} f 计算表达式
 * @param {Number} digit 保留小数点几位
 * @param {Boolean} isNotRound false为四舍五路
 * @return {Number} 计算后的表达式结果
 */
export function formatFloat(f, digit = 2, isNotRound) {
  if (arguments.length === 2 && typeof arguments[1] === "boolean") {
    isNotRound = arguments[1];
    digit = 2;
  }
  if (isNaN(Number(f))) {
    throw new Error("parameters cannot be non-numeric for formatFloat method");
  } else {
    if (typeof f === "string") {
      f = Number(f);
    }
  }
  f = f.toFixed(10);
  let m = Math.pow(10, digit);
  if (isNotRound) {
    return parseInt(f * m, 10) / m;
  }
  let _abs = 1;
  if (f < 0) {
    f = Math.abs(f);
    _abs = -1;
  }
  return (Math.round(f * m, 10) / m) * _abs;
}

/**
 * 深冻结
 * @param {Object} o 要冻结的对象
 * @return {Object} 冻结后的源对象
 */
export function deepFreeze(o) {
  var prop, propKey;
  Object.freeze(o);
  for (propKey in o) {
    prop = o[propKey];
    if (
      !Object.prototype.hasOwnProperty.call(o, propKey) ||
      !(typeof prop === "object") ||
      Object.isFrozen(prop)
    ) {
      continue;
    }
    deepFreeze(prop);
  }
}

/**
 * 获取随机数
 * @param {String} str 随机数开头字母
 * @param {Number} n 随机数个数
 * @return {String} 生成的随机数
 */
export function getRandomNum(str = "", n = 12) {
  if (typeof n === "string") {
    n = Number(n);
  }
  n += 2;
  return str + String(Math.random()).slice(2, n);
}

/**
 * trigger 扩展dispatchEvent事件语法,兼容IE
 * @param {Element} element 目标DOM
 * @param {String} event 事件类型
 */
export function trigger(element, event) {
  if (document.createEventObject) {
    // IE浏览器支持fireEvent方法
    let evt = document.createEventObject();
    evt.dispatchEvent = true;
    return element.fireEvent("on" + event, evt);
  } else {
    // 其他标准浏览器使用dispatchEvent方法
    let evt = document.createEvent("HTMLEvents");
    evt.initEvent(event, true, true);
    evt.dispatchEvent = true;
    return !element.dispatchEvent(evt);
  }
}

/**
 * 格式化children
 * @param {Array} data 格式化数据
 * @param {String} clearEmptyChildren string为child的key命名 去除空数组的children对象
 */
export function formatChildren({ data, clearEmptyChildren }) {
  if (clearEmptyChildren) {
    data = data.map(item => {
      if (item[clearEmptyChildren]) {
        if (item[clearEmptyChildren].length < 1) {
          delete item[clearEmptyChildren];
        } else {
          item[clearEmptyChildren] = formatChildren({
            data: item[clearEmptyChildren],
            clearEmptyChildren
          });
        }
      }
      return item;
    });
  }
  return data;
}

/**
 * 设别判断
 * @returns string
 */
export function getDevice() {
  const u = navigator.userAgent;
  // console.log(u)
  let device = "";
  if (u.indexOf("Android") > -1 || u.indexOf("Linux") > -1) {
    // console.log('android')
    device = "android";
  } else if (u.indexOf("iPhone") > -1 && u.indexOf("Safari") === -1) {
    // console.log('ios', 11111)
    device = "ios";
  } else if (u.indexOf("MicroMessenger") > -1) {
    // console.log('wechat')
    device = "wechat";
  } else {
    // console.log('web',2222)
    device = "web";
  }
  return device;
}

/**
 * 将文件转化为base64
 * @author wfyuan 2020-02-27
 * @param {*} file 待转换的文件
 * @returns base64文件流
 */
export function fileToBase64(file) {
  let reader = new FileReader();
  reader.readAsDataURL(file[0]);
  reader.onload = function() {
    return this.result;
  };
}

/**
 * 将base64转换为文件
 * @param {*} dataurl base64数据
 * @param {*} filename 文件名（示例:img.jpg）
 */
export function convertBase64UrlToFile(dataurl, filename) {
  let arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

/**
 * 给对象注入属性
 * @param keys 属性key数组， 如 keys = ['config', 'path'] , 则会给对象注入 object.config.path 的属性
 * @param value 属性值
 * @returns {Object}
 */
Object.defineProperty(Object.prototype, "assignProps", {
  writable: false,
  enumerable: false,
  configurable: true,
  value: function(keys, value) {
    let props = this;
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      if (i == keys.length - 1) {
        props[key] = value;
      } else {
        props[key] = props[key] == undefined ? {} : props[key];
        props = props[key];
      }
    }
    return this;
  }
});

/**
 * 非空判断
 */
export function isDef(v) {
  return v !== undefined && v !== null;
}
/**
 * 从数组中删除.
 */
export function remove(arr, item) {
  if (arr.length) {
    const index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1);
    }
  }
}
const _toString = Object.prototype.toString;
/**
 * 是否为正则
 */
export function isRegExp(v) {
  return _toString.call(v) === "[object RegExp]";
}

/**
 * 把对象按照 js配置文件的格式进行格式化
 * @param obj 格式化的对象
 * @param dep 层级，此项无需传值
 * @returns {string}
 */
export function formatConfig(obj, dep) {
  dep = dep || 1;
  const LN = "\n",
    TAB = "  ";
  let indent = "";
  for (let i = 0; i < dep; i++) {
    indent += TAB;
  }
  let isArray = false,
    arrayLastIsObj = false;
  let str = "",
    prefix = "{",
    subfix = "}";
  if (Array.isArray(obj)) {
    isArray = true;
    prefix = "[";
    subfix = "]";
    str = obj
      .map((item, index) => {
        let format = "";
        if (typeof item == "function") {
          //
        } else if (typeof item == "object") {
          arrayLastIsObj = true;
          format = `${LN}${indent}${formatConfig(item, dep + 1)},`;
        } else if (
          (typeof item == "number" && !isNaN(item)) ||
          typeof item == "boolean"
        ) {
          format = `${item},`;
        } else if (typeof item == "string") {
          format = `'${item}',`;
        }
        if (index == obj.length - 1) {
          format = format.substring(0, format.length - 1);
        } else {
          arrayLastIsObj = false;
        }
        return format;
      })
      .join("");
  } else if (typeof obj != "function" && typeof obj == "object") {
    str = Object.keys(obj)
      .map((key, index, keys) => {
        const val = obj[key];
        let format = "";
        if (typeof val == "function") {
          //
        } else if (typeof val == "object") {
          format = `${LN}${indent}${key}: ${formatConfig(val, dep + 1)},`;
        } else if (
          (typeof val == "number" && !isNaN(val)) ||
          typeof val == "boolean"
        ) {
          format = `${LN}${indent}${key}: ${val},`;
        } else if (typeof val == "string") {
          format = `${LN}${indent}${key}: '${val}',`;
        }
        if (index == keys.length - 1) {
          format = format.substring(0, format.length - 1);
        }
        return format;
      })
      .join("");
  }
  const len = TAB.length;
  if (indent.length >= len) {
    indent = indent.substring(0, indent.length - len);
  }
  if (!isArray || arrayLastIsObj) {
    subfix = LN + indent + subfix;
  }
  return `${prefix}${str}${subfix}`;
}

/**
 * 清理空值，对象
 * @param children
 * @returns {*[]}
 */
export function filterEmpty(children = []) {
  return children.filter(c => c.tag || (c.text && c.text.trim() !== ""));
}

/**
 * 获取字符串长度，英文字符 长度1，中文字符长度2
 * @param {*} str
 */
export const getStrFullLength = (str = "") =>
  str.split("").reduce((pre, cur) => {
    const charCode = cur.charCodeAt(0);
    if (charCode >= 0 && charCode <= 128) {
      return pre + 1;
    }
    return pre + 2;
  }, 0);

/**
 * 截取字符串，根据 maxLength 截取后返回
 * @param {*} str
 * @param {*} maxLength
 */
export const cutStrByFullLength = (str = "", maxLength) => {
  let showLength = 0;
  return str.split("").reduce((pre, cur) => {
    const charCode = cur.charCodeAt(0);
    if (charCode >= 0 && charCode <= 128) {
      showLength += 1;
    } else {
      showLength += 2;
    }
    if (showLength <= maxLength) {
      return pre + cur;
    }
    return pre;
  }, "");
};

/**
 * @author 明浩
 * @time 2020-08-21
 * @dec 将parentId 转 children
 */
export function translateDataToTree(data) {
  let parents = data.filter(
    value =>
      value.parentId === undefined ||
      value.parentId === null ||
      value.parentId === "" ||
      value.parentId === "0"
  );
  let children = data.filter(
    value =>
      value.parentId !== "undefined" &&
      value.parentId !== null &&
      value.parentId !== "" &&
      value.parentId !== "0"
  );
  let translator = (parents, children) => {
    parents.forEach(parent => {
      children.forEach((current, index) => {
        if (current.parentId === parent.id) {
          let temp = JSON.parse(JSON.stringify(children));
          temp.splice(index, 1);
          translator([current], temp);
          typeof parent.children !== "undefined"
            ? parent.children.push(current)
            : (parent.children = [current]);
        }
      });
    });
  };

  translator(parents, children);

  return parents;
}

/**
 * contentd导出数据,fileName文件名
 */
export function exportDownload(content, fileName) {
  const blob = new Blob([content], {
    type: "application/vnd.ms-excel;charset=utf-8"
  }); // 构造一个blob对象来处理数据
  if ("download" in document.createElement("a")) {
    // 支持a标签download的浏览器
    const link = document.createElement("a"); // 创建a标签
    link.download = fileName; // a标签添加属性导出文件名
    link.style.display = "none";
    link.href = URL.createObjectURL(blob);
    document.body.appendChild(link);
    link.click(); // 执行下载
    URL.revokeObjectURL(link.href); // 释放url
    document.body.removeChild(link); // 释放标签
  } else {
    // 其他浏览器
    navigator.msSaveBlob(blob, fileName);
  }
}
