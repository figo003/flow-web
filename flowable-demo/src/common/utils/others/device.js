/**
 * @author 明浩
 * @time 2020-8-16
 * @dec 响应式监听工具，当浏览器宽度改变时触发某方法
 */
import enquireJs from "enquire.js";

const enquireScreen = function(call) {
  const hanlder = {
    match: function() {
      call && call(true);
    },
    unmatch: function() {
      call && call(false);
    }
  };
  enquireJs.register("only screen and (max-width: 767.99px)", hanlder);
};

export default enquireScreen;
