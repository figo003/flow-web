/**
 * 状态码配置
 */
export const STATUS = {
  // 某某状态
  someStatus: [
    {
      name: "生效中",
      value: 1
    },
    {
      name: "未生效",
      value: 2
    },
    {
      name: "已失效",
      value: 0
    }
  ]
};
/**
 * 全局状态码过滤
 * @param  {Number||String} val 状态码
 * @return {String} 返回code对应的value值
 */
export function statusFilters(val, type) {
  if (STATUS[type]) {
    return STATUS[type].filter(item => item.value === val)[0].name;
  } else {
    return "";
  }
}
