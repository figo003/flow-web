/**
 * @author 明浩
 * @time 2020-8-14
 * @dec 表单验证常用方法
 */
/*
 * 合法uri
 */
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
  if (urlregex.test(textval)) {
    return { status: true };
  } else {
    return { status: false };
  }
}
/*
 * 小写字母
 */
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/;
  if (reg.test(str)) {
    return { status: true };
  } else {
    return { status: false };
  }
}
/*
 * 大写字母
 */
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/;
  if (reg.test(str)) {
    return { status: true };
  } else {
    return { status: true };
  }
}
/*
 * 大小写字母
 */
export function validatAlphabets(str) {
  const reg = /^[A-Za-z]+$/;
  if (reg.test(str)) {
    return { status: true };
  } else {
    return { status: false };
  }
}
/*
 * 邮箱
 */
export function validateEmail(email) {
  const re = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
  // if (email.length === 0) {
  //   return { status: false, msg: "邮箱不能为空！" };
  // }
  if (!re.test(email)) {
    return { status: false, msg: "请输入有效的邮箱！" };
  }
  return { status: true };
}
/*
 * 座机
 */
export function validateLandLine(landLine) {
  const re = /^(0\d{2,3}-\d{7,8})$/;
  if (!re.test(landLine)) {
    return { status: false, msg: "请输入有效的座机号！例：0377-66668888" };
  }
  return { status: true };
}
/*
 * 验证手机号
 */
export function validateMobile(mobile) {
  // if (mobile.length === 0) {
  //   return { status: false, msg: "手机号码不能为空！" };
  // }
  if (mobile.length !== 11) {
    return { status: false, msg: "请输入有效的手机号码，需是11位！" };
  }

  // let myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8}|(19[0-9]{1}))+\d{8})$/
  let myreg = /^(1[0-9]{10})$/;
  if (!myreg.test(mobile)) {
    return { status: false, msg: "请输入有效的手机号码！" };
  }
  return { status: true };
}
/*
 * 验证身份证
 */
export function validateIDCard(id) {
  // 1 "验证通过!", 0 //校验不通过
  let format = /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/;
  // 号码规则校验
  if (!format.test(id)) {
    return { status: false, msg: "身份证号码不合规" };
  }
  // 区位码校验
  // 出生年月日校验   前正则限制起始年份为1900;
  let year = id.substr(6, 4); // 身份证年
  let month = id.substr(10, 2); // 身份证月
  let date = id.substr(12, 2); // 身份证日
  let time = Date.parse(month + "-" + date + "-" + year); // 身份证日期时间戳date
  let nowTime = Date.parse(new Date()); // 当前时间戳
  let dates = new Date(year, month, 0).getDate(); // 身份证当月天数
  if (time > nowTime || date > dates) {
    return { status: false, msg: "出生日期不合规" };
  }
  // 校验码判断
  let c = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]; // 系数
  let b = ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"]; // 校验码对照表
  let idArray = id.split("");
  let sum = 0;
  for (let k = 0; k < 17; k++) {
    sum += parseInt(idArray[k]) * parseInt(c[k]);
  }
  if (idArray[17].toUpperCase() !== b[sum % 11].toUpperCase()) {
    return { status: false, msg: "身份证校验码不合规" };
  }
  return { status: true, msg: "校验通过" };
}
/*
 * 是否为正整数
 */
export function validateInteger(val) {
  let regNum = /^[1-9]\d*$/; // 正整数
  if (regNum.test(val)) {
    return { status: true };
  } else {
    return { status: false, msg: "必须为正整数" };
  }
}
/*
 * 是否为整数 (包括正负)
 */
export function validateInt(val) {
  let regNum = /^(0|[1-9][0-9]*|-[1-9][0-9]*)$/; // 整数包括正负
  if (regNum.test(val)) {
    return { status: true };
  } else {
    return { status: false, msg: "必须为整数" };
  }
}
/*
 * 是否为数字
 */
export function validateNumber(val) {
  let n = Number(val);
  if (!isNaN(n)) {
    return { status: true };
  } else {
    return { status: false, msg: "必须为数字" };
  }
}
/*
 * 匹配由数字和26个英文字母组成的字符串
 */
export function validateUpperCaseNumber(str) {
  if (str.length === 0) {
    return { status: false, msg: "不能为空！" };
  }
  let myreg = /^[A-Za-z0-9]+$/;
  if (!myreg.test(str)) {
    return { status: false, msg: "请输入正确的格式！" };
  }
  return { status: true };
}
/*
 * 验证金额
 */
export function validateMoney(obj) {
  let reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
  if (!reg.test(obj)) {
    return { status: false, msg: "请输入有效的金额！" };
  }
  return { status: true };
}
/*
 * 验证最多保留两位小数的正数
 */
export function validateDecimal(num) {
  let reg = /^\d+(?:\.\d{1,2})?$/;
  if (!reg.test(num)) {
    return { status: false, msg: "请输入有效的数字！" };
  }
  return { status: true };
}
/*
 * 验证最多保留两位小数的正数或负数
 */
export function validateDecimals(num) {
  let reg = /^([+ -]?(([1-9]\d*)|(0)))([.]\d{0,2})?$/;
  if (!reg.test(num)) {
    return { status: false, msg: "请输入有效的数字！" };
  }
  return { status: true };
}

/**
 * 是否正确的URL
 * @param {string} url
 * @returns {Boolean}
 */
export function validURL(url) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
  if (!reg.test(url)) {
    return { status: false, msg: "请输入正确的URL！" };
  }
  return { status: true };
}

/**
 * 验证姓名
 */
export function checkUseName(name) {
  const reg = /^(([a-zA-Z+\s\\.?\\·?a-zA-Z+]{2,15}$)|([\u4e00-\u9fa5+\\·?\u4e00-\u9fa5+]{2,15}$))/;
  if (!reg.test(name)) {
    return { status: false, msg: "请输入正确的姓名！" };
  }
  return { status: true };
}

/**
 * 验证用户姓名
 * 仅是中文或者仅是英文，不能混合，英文不少于4个字符可以包含空格，中文不少于2个字符不包含空格
 * @author wfyuan 2020-3-2
 */
export function validName(name) {
  if (!window.isEmpty(name)) {
    let num = /[1-9]+/;
    let en = /[A-Za-z]+/;
    let ch = /[\u4e00-\u9fa5·]+/;
    let num_res = name.search(num);
    let en_res = name.search(en);
    let ch_res = name.search(ch);
    if (en_res >= 0 || ch_res >= 0) {
      if (en_res >= 0 && ch_res >= 0) {
        return { status: false, msg: "不能既有中文又有英文！" };
      } else if (
        en_res == -1 &&
        ch_res >= 0 &&
        (name.length < 1 || name.length > 15 || /\s+/.test(name))
      ) {
        //
        return {
          status: false,
          msg: "中文长度大于1且小于15且不能包含空格！"
        };
      } else if (num_res >= 0) {
        return { status: false, msg: "不能包含数字！" };
        //
      } else if (
        en_res >= 0 &&
        ch_res == -1 &&
        (name.length < 3 || name.length > 30)
      ) {
        return { status: false, msg: "英文长度大于3且小于30！" };
      } else {
        return { status: true };
      }
    } else {
      return { status: false, msg: "请输入正确姓名！" };
    }
  } else {
    return { status: true };
  }
}

/**
 * 验证是否含有特殊符号或者表情
 */
export function isEmojiCharacter(string) {
  const reg = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/;
  if (!reg.test(string)) {
    return { status: false, msg: "输入内容不能含有特殊符号或表情！" };
  }
  return { status: true };
}

/**
 * 验证是否含有特殊符号或者表情
 */
export function isEmojiCharacterAnother(substring) {
  if (substring) {
    let reg = new RegExp("[~#^$@%&!?%*]", "g");
    if (substring.match(reg)) {
      return true;
    }
    for (let i = 0; i < substring.length; i++) {
      let hs = substring.charCodeAt(i);
      if (0xd800 <= hs && hs <= 0xdbff) {
        if (substring.length > 1) {
          let ls = substring.charCodeAt(i + 1);
          let uc = (hs - 0xd800) * 0x400 + (ls - 0xdc00) + 0x10000;
          if (0x1d000 <= uc && uc <= 0x1f77f) {
            return true;
          }
        }
      } else if (substring.length > 1) {
        let ls = substring.charCodeAt(i + 1);
        if (ls == 0x20e3) {
          return true;
        }
      } else {
        if (0x2100 <= hs && hs <= 0x27ff) {
          return true;
        } else if (0x2b05 <= hs && hs <= 0x2b07) {
          return true;
        } else if (0x2934 <= hs && hs <= 0x2935) {
          return true;
        } else if (0x3297 <= hs && hs <= 0x3299) {
          return true;
        } else if (
          hs == 0xa9 ||
          hs == 0xae ||
          hs == 0x303d ||
          hs == 0x3030 ||
          hs == 0x2b55 ||
          hs == 0x2b1c ||
          hs == 0x2b1b ||
          hs == 0x2b50
        ) {
          return true;
        }
      }
    }
  }
}

/**
 * 验证银行卡号
 * @author: wangyuhong 2020-03-03
 * @action: boolean
 */
export function checkBankNumber(number) {
  const reg = /^[0-9]{15,20}$/.test(number);
  if (!reg.test(number)) {
    return { status: false, msg: "请输入正确的银行卡号！" };
  }
  return { status: true };
}
