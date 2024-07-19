<template>
    <div id="drawProcessDesign">
          <DrawFlowList :isShowCheck="isShowCheck" :params ="params"/>
      </div>
  </template>
  <script>
  export default {
    name: "Detail",
    data() {
      return {
        isShowCheck: false,
        params: {}
      };
    },
    created() {
      let { taskId, processInstanceId, deployId } = this.$route.query
      this.params.taskId = taskId
      this.params.processInstanceId = processInstanceId
      this.params.deployId = deployId
      this.isShowCheck = true
    },
    methods: {
  
    }
  };
  </script>
  <style lang="less" scoped>
  </style>
  