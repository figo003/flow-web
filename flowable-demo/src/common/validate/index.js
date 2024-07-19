/**
 * @author 明浩
 * @time 2020-8-14
 * @dec 表单验证
 */

/**
 * 表单验证
 */
import {
  // 姓名
  validName,
  // 手机号
  validateMobile,
  // 邮箱
  validateEmail,
  // 金额
  validateMoney,
  // 数字
  validateNumber,
  // 身份证
  validateIDCard,
  // 座机
  validateLandLine
} from "./validate";

/**
 * 非空校验
 * @param  {Object} rule 规则对象
 * @param  {Number||String} value入参的值
 * @param  {Function} callback 回调函数返回值
 */
export function checkNull(rule, value, callback) {
  if (
    String(value).replace(/^\s+|\s+$/gm, "") === "" ||
    (value instanceof Array && value[0] === "") ||
    value === null ||
    value === undefined
  ) {
    callback(new Error(rule.message || "内容不能为空!"));
  } else {
    callback();
  }
}

/**
 * 姓名校验
 * @param  {Object} rule 规则对象
 * @param  {Number||String} value 入参的值
 * @param  {Function} callback 回调函数返回值
 * @dec 姓名不能在2，10未
 */
export function checkName(rule, value, callback) {
  if (value && !validName(value).status) {
    callback(new Error(rule.message || validName(value).msg));
  } else {
    callback();
  }
}

/**
 * 手机号校验
 * @param  {Object} rule 规则对象
 * @param  {Number||String} value 入参的值
 * @param  {Function} callback 回调函数返回值
 */
export function checkMobile(rule, value, callback) {
  if (value && !validateMobile(value).status) {
    callback(new Error(rule.message || validateMobile(value).msg));
  } else {
    callback();
  }
}

/**
 * 邮箱校验
 * @param  {Object} rule 规则对象
 * @param  {Number||String} value 入参的值
 * @param  {Function} callback 回调函数返回值
 */
export function checkEmail(rule, value, callback) {
  if (value && !validateEmail(value).status) {
    callback(new Error(rule.message || validateEmail(value).msg));
  } else {
    callback();
  }
}

/**
 * 金额校验
 * @param  {Object} rule 规则对象
 * @param  {Number||String} value 入参的值
 * @param  {Function} callback 回调函数返回值
 */
export function checkMoney(rule, value, callback) {
  if (value && !validateMoney(value).status) {
    callback(new Error(rule.message || validateMoney(value).msg));
  } else {
    callback();
  }
}
/**
 * 身份证校验
 * @param  {Object} rule 规则对象
 * @param  {Number||String} value 入参的值
 * @param  {Function} callback 回调函数返回值
 */
export function checkIDCard(rule, value, callback) {
  if (value && !validateIDCard(value).status) {
    callback(new Error(rule.message || validateIDCard(value).msg));
  } else {
    callback();
  }
}

/**
 * 数字校验
 * @param  {Object} rule 规则对象
 * @param  {Number||String} value 入参的值
 * @param  {Function} callback 回调函数返回值
 */
export function checkNum(rule, value, callback) {
  if (value && !validateNumber(value).status) {
    callback(new Error(rule.message || validateNumber(value).msg));
  } else {
    callback();
  }
}
/**
 * 座机校验
 * @param  {Object} rule 规则对象
 * @param  {Number||String} value 入参的值
 * @param  {Function} callback 回调函数返回值
 */
export function checkLandLine(rule, value, callback) {
  if (value && !validateLandLine(value).status) {
    callback(new Error(rule.message || validateLandLine(value).msg));
  } else {
    callback();
  }
}
/**
 * 校验小数保留位数
 * @param  {Object} rule 规则对象
 * @param  {Number||String} value 入参的值
 * @param  {Function} callback 回调函数返回值
 */
export function checkDecimal(rule, value, callback) {
  let reg = new RegExp(
    `^([+ -]?(([1-9]\\d*)|(0)))([.]\\d{0,${rule.precision}})?$`
  );
  if (!reg.test(value)) {
    callback(new Error(rule.message || "请输入有效的数字！"));
  } else {
    callback();
  }
}
