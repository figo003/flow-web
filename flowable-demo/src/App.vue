<template>
  <div id="app">
      <div class="all">
        <div class="left">
          <el-menu default-active="1"  class="el-menu-vertical-demo">
            <el-menu-item index="1"><span slot="title"><router-link to="/home1">示例：流程列表</router-link></span></el-menu-item>
            <el-menu-item index="2"><span slot="title"><router-link to="/home2">示例：审批流程展示</router-link></span></el-menu-item>

            <el-menu-item index="4"><span slot="title"><router-link to="/launch">（demo）发起请假</router-link></span></el-menu-item>
            <el-menu-item index="5"><span slot="title"><router-link to="/preson1">（demo）张三（开发主管）</router-link></span></el-menu-item>
            <el-menu-item index="6"><span slot="title"><router-link to="/preson2">（demo）李四（部门主管）</router-link></span></el-menu-item>
            <el-menu-item index="7"><span slot="title"><router-link to="/preson3">（demo）王五（行政主管）</router-link></span></el-menu-item>
          </el-menu>
        </div>
        <div class="right">
          <router-view />
        </div>
      </div>
  </div>
</template>
<script>
export default {
  name: "index",
};
</script>
<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.all {
  overflow: auto;
  .left {
    position: absolute;
    width: 220px;
    height: 100%;
        background: #eee;
    // background: #fff;
  }
  .right {
    position: absolute;
    left: 233px;
    top: 0;
    bottom: 0;
    right: 10px;
  }
}

</style>


