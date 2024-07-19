/**
 * @author 明浩
 * @time 2020-8-14
 * @dec 全局API插件
 */
import axios from "axios";
import Cookie from "js-cookie";
import message from "ant-design-vue/es/message";

// 跨域认证信息 header 名
const TOKEN = "UTOKEN";

axios.defaults.timeout = 20000;

// 自定义配置新建一个axios实例
const service = axios.create({});
/**
 * 添加请求拦截器
 */
service.interceptors.request.use(config => {
  const token = getAuthorization(TOKEN);
  // 如果 token 存在
  // 让每个请求携带自定义 token 请根据实际情况自行修改
  if (token) {
    config.headers[TOKEN] = token;
  }
  return config;
});
/**
 * 添加响应拦截器
 */
// 重新登录
const logout = () => {
  // 从 localstorage 获取 token
  const token = getAuthorization(TOKEN);
  if (token) {
    removeAuthorization();
    window.location.reload();
  }
};
service.interceptors.response.use(
  response => {
    if (
      response.headers["content-type"] ===
      "application/vnd.ms-excel;charset=utf-8"
    ) {
      return Promise.resolve(response);
    }
    if (response.data.code !== 0) {
      if (response.data.code === 402) {
        logout();
        message.warning("登录失效请重新登录");
        return Promise.reject(response);
      }
      message.warning(response.data.msg);
      return Promise.reject(response);
    } else {
      return Promise.resolve(response);
    }
  },
  error => {
    if (!error.response) {
      message.warning("抱歉，服务器走丢了！");
      return Promise.reject(error);
    }
    switch (error.response.status) {
      case 400:
        error.message = "请求错误！";
        break;
      case 401:
        error.message = "登录超时！";
        logout();
        break;
      case 402:
        error.message = "认证失败！";
        logout();
        break;
      case 403:
        error.message = "拒绝访问！";
        break;
      case 404:
        error.message = "请求地址出错！";
        break;
      case 408:
        error.message = "请求超时！";
        break;
      case 500:
        error.message = "服务器内部错误！";
        break;
      case 501:
        error.message = "服务未实现！";
        break;
      case 502:
        error.message = "网关错误！";
        break;
      case 503:
        error.message = "服务不可用！";
        break;
      case 504:
        error.message = "网关超时！";
        break;
      case 505:
        error.message = "HTTP版本不受支持！";
        break;
      default:
    }
    message.warning("error.message！");
    return Promise.reject(error);
  }
);

/**
 * 设置认证信息
 * @param auth {Object}
 * @param authType {AUTH_TYPE} 认证类型，默认：{AUTH_TYPE.BEARER}
 */
export function setAuthorization(auth) {
  Cookie.set(TOKEN, auth.token, {
    expires: auth.expireAt
  });
}

/**
 * 设置认证信息
 * @param auth {Object}
 * @param authType {AUTH_TYPE} 认证类型，默认：{AUTH_TYPE.BEARER}
 */
export function getAuthorization() {
  return Cookie.get(TOKEN);
}
/**
 * 移出认证信息
 * @param authType {AUTH_TYPE} 认证类型
 */
export function removeAuthorization() {
  Cookie.remove(TOKEN);
}

/**
 * 检查认证信息
 * @param authType
 * @returns {boolean}
 */
export function checkAuthorization() {
  if (Cookie.get(TOKEN)) {
    return true;
  }
}

/**
 * API请求封装
 * @param  {String} url api请求url
 * @param  {String} method 请求方法，默认为post
 * @param  {String} middle
 * @param  {Object} params 入参
 * @param  {String} isPost 请求方法
 * @return 返回一个经加工的axios实例
 */
export default function({
  url,
  method,
  middle,
  params = {},
  isPost,
  headers = {},
  responseType
}) {
  let _config = {
    url: url,
    method: method,
    headers,
    responseType
  };
  let _params = params
    ? middle
      ? middle.request(JSON.parse(JSON.stringify(params)))
      : params
    : "";
  if (method.toLowerCase() === "post" || isPost) {
    _config.data = _params;
  } else {
    _config.params = _params;
  }
  return new Promise((resolve, reject) => {
    return service(_config)
      .then(response => {
        resolve(middle ? middle.response(response.data) : response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
}
