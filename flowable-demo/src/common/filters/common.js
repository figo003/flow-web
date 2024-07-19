/**
 * @author 明浩
 * @time 2020-8-14
 * @dec 核心字符过滤转换方法
 */

import moment from "moment";
import * as utils from "@/common/utils";
/**
 * 格式化时间
 * @param {Date|String} date 格式化日期对象
 * @param {String} cFormat 格式化日期的格式YYYY-MM-DD
 * @return {String} 格式化后的日期
 */
export const parseDate = function(val, { format = "Y-MM-DD" } = {}) {
  if (!val) return "";
  return moment(val).format(format);
};

/**
 * 过滤空
 * @param  {undefined||null||String||Number} val 入参
 * @param  {undefined} str
 * @return {String||Number} 入参如果为undefined||null||""则返回"-",否则返回val
 */
export function empty(val, str) {
  if (utils.isEmpty(val)) {
    return str || "-";
  } else {
    return val;
  }
}

/**
 * 转换金额
 * @param  {String||Number} val 入参为需要转换的金额
 * @return {String} _amount 如果val为空则返回"-",否则返回转换之后的金额
 */
export function amount(val) {
  val = Number(val);
  if (isNaN(val)) {
    return "-";
  }
  let _amount;
  if (val >= 10000 && val < 100000000) {
    _amount = utils.formatFloat(val / 10000) + " 万元";
  } else if (val >= 100000000) {
    _amount = utils.formatFloat(val / 100000000) + " 亿元";
  } else {
    _amount = utils.formatFloat(val) + "元";
  }
  return _amount;
}

/**
 * 转换数字
 * @param {Number|String} val 目标数据
 * @param {Number} digit 保留小数
 * @param {Boolean} isNotRound 是否四舍五入
 * @param {Array} [individual tenThousand, Billion] 分别对应转换单位中文描述，默认“万”/“亿”
 * @param {Boolean} retrunArray 如果为true，则返回一个数组，分别为值和单位
 */
export function conversionUnit({
  val,
  digit = 2,
  isNotRound = false,
  unit = ["", " 万", " 亿"],
  retrunArray = false
}) {
  let _n;
  val = Number(val);
  if (!retrunArray) {
    if (val >= 10000 && val < 100000000) {
      _n = utils.formatFloat(val / 10000, digit, isNotRound) + unit[1];
    } else if (val >= 100000000) {
      _n = utils.formatFloat(val / 100000000, digit, isNotRound) + unit[2];
    } else {
      _n = utils.formatFloat(val, digit, isNotRound) + unit[0];
    }
    return _n;
  } else {
    if (val >= 10000 && val < 100000000) {
      return [utils.formatFloat(val / 10000, digit, isNotRound), unit[1]];
    } else if (val >= 100000000) {
      return [utils.formatFloat(val / 100000000, digit, isNotRound), unit[2]];
    } else {
      return [utils.formatFloat(val, digit, isNotRound), unit[0]];
    }
  }
}

/**
 * 根据出生日期计算年龄
 * @param {Date|String} birthday
 */
export function getAge(birthday) {
  let age;
  if (!birthday) return 0;
  birthday =
    birthday.indexOf("-") >= 0
      ? birthday
      : moment(birthday).format("YYYY-MM-DD");
  const birthdayArr = birthday.split("-");
  const birthdayYear = birthdayArr[0];
  const birthdayMonth = parseInt(birthdayArr[1]);
  const birthdayDay = parseInt(birthdayArr[2]);
  const today = new Date();
  const nowYear = today.getFullYear();
  const nowMonth = today.getMonth() + 1;
  const nowDay = today.getDate();
  if (nowYear == birthdayYear) {
    age = 0; // 同年 则为0岁
  } else {
    const ageDiff = nowYear - birthdayYear; // 年之差
    if (ageDiff > 0) {
      if (nowMonth === birthdayMonth) {
        const dayDiff = nowDay - birthdayDay; // 日之差
        if (dayDiff < 0) {
          age = ageDiff - 1;
        } else if (dayDiff > 0) {
          age = ageDiff;
        } else {
          age = ageDiff;
        }
      } else {
        const monthDiff = nowMonth - birthdayMonth; // 月之差
        if (monthDiff < 0) {
          age = ageDiff - 1;
        } else if (monthDiff > 0) {
          age = ageDiff;
        } else {
          age = ageDiff;
        }
      }
    } else {
      age = "未知"; // 0岁
    }
  }
  return age; // 返回周岁年龄
}

/**
 * 字符串千分位格式化
 * @export
 * @param {*} string 要格式化的字符串
 * @returns
 */
export function commafy(string) {
  return string
    ? string.toString().replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")
    : "";
}
/**
 * 千分位字符串还原
 * @export
 * @param {*} num
 * @returns
 */
export function delcommafy(num) {
  //去除千分位中的‘，’
  if (num && num != "undefined" && num != "null") {
    let numS = num;
    numS = numS.toString();
    numS = numS.replace(/,/gi, "");
    return numS;
  } else {
    return num;
  }
}

/**
 * 数字转大写
 * @export
 * @param {*} str
 * @returns
 */
export function numberChinese(str) {
  try {
    let num = parseFloat(str);
    let strOutput = "",
      strUnit = "仟佰拾亿仟佰拾万仟佰拾元角分";
    num += "00";
    let intPos = num.indexOf(".");
    if (intPos >= 0) {
      num = num.substring(0, intPos) + num.substr(intPos + 1, 2);
    }
    strUnit = strUnit.substr(strUnit.length - num.length);
    for (let i = 0; i < num.length; i++) {
      strOutput +=
        "零壹贰叁肆伍陆柒捌玖".substr(num.substr(i, 1), 1) +
        strUnit.substr(i, 1);
    }
    return strOutput
      .replace(/零角零分$/, "整")
      .replace(/零[仟佰拾]/g, "零")
      .replace(/零{2,}/g, "零")
      .replace(/零([亿|万])/g, "$1")
      .replace(/零+元/, "元")
      .replace(/亿零{0,3}万/, "亿")
      .replace(/^元/, "零元");
  } catch (error) {
    return str;
  }
}

/**
 * 手机号脱敏
 * @param number 手机号
 * */
export const cellphoneNumberDesensitization = number => {
  if (!number) return "";
  const pat = /(\d{3})\d*(\d{4})/;
  return number.replace(pat, "$1****$2");
};

/**
 * 身份证号脱敏
 * @param number 身份证号
 * */
export const idNumberDesensitization = number => {
  if (!number) return "";
  return number.replace(/^(.{6})(?:\d+)(.{2})(?:\d)$/, "$1********$2**");
};

/**
 * 根据时间换算是否是今天明天后天
 * @param {Date|String} date 日期
 * @param {String} format 日期格式
 */
export const isToday = (date, format) => {
  if (typeof date === "string") {
    date = date.replace(/-/g, "/");
  }
  date = new Date(date);
  let ptime = date.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;
  const day = new Date().getDate();
  const today = `${year}/${month}/${day}`;
  const todayTime = new Date(today).getTime();
  if (ptime >= todayTime) {
    return "今天";
  } else if ((todayTime - ptime) / oneDay <= 1) {
    return "昨天";
  } else {
    return parseDate(date, { format: format || "YYYY年MM月DD" });
  }
};

/**
 * 换算几分钟前，刚刚
 * @param {Date|String} date 日期
 * @param {String} format 日期格式
 * */

export const timeago = (date, format) => {
  if (typeof date === "string") {
    date = date.replace(/-/g, "/");
  }
  if (isToday(date) === "今天") {
    let minute = 1000 * 60;
    let hour = minute * 60;
    let time1 = new Date().getTime(); //当前的时间戳
    let time2 = new Date(date).getTime(); //指定时间的时间戳
    let time = time1 - time2;
    let result = null;
    if (time < 0) {
      result = parseDate(date, { format: format || "HH:mm:ss" });
    } else if (time / hour >= 1) {
      result = parseInt(time / hour) + "小时前";
    } else if (time / minute >= 1) {
      result = parseInt(time / minute) + "分钟前";
    } else {
      result = "刚刚";
    }
    return result;
  } else {
    return parseDate(date, { format: format || "HH:mm:ss" });
  }
};

/**
 * 过滤HTML
 * @param {String} val html片段
 */
export function html2Text(val) {
  const div = document.createElement("div");
  div.innerHTML = val;
  return div.textContent || div.innerText;
}
