/**
 * @author 明浩
 * @time 2020-8-14
 * @dec 全局指令，该页面指令会在全局引入vue
 */
// import store from "@/data/store";
export default {
  // 是否有按钮权限判定,自定义按钮权限指令
  btnPermission: {
    /**
     * @param  el 指令所绑定的元素，可以用来直接操作DOM
     * @param  {Object} binding 对象
     * @param  vnode Vue编译生成的虚拟节点
     */
    inserted() {
      // 设置vnode key 强制更新指令
      // vnode.key = Math.random()
      //   .toString()
      //   .replace("0.", "_");
      // if (
      //   !store.getters.permission.btnPermissions.includes(binding.expression)
      // ) {
      //   el.style.display = "none";
      // } else {
      //   el.style.display = "block";
      // }
    }
  }
};
