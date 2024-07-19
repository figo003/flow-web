<template>
    <div id="drawProcessDesign">
          <DrawFlowList :isShowCheck="isShowCheck" :params ="params" :isCustomcheck="isCustomcheck">
            <!-- 自定义插槽的内容， 注意：最外层的div需要加上slot="checkHistory"-->
            <div slot="checkHistory">
                具体内容
            </div>
          </DrawFlowList>
      </div>
  </template>
  <script>
  export default {
    name: "Detail",
    data() {
      return {
        isCustomcheck: false, // 是否自定义审核历史展示
        isShowCheck: true,
        params: {
          taskId:'f4898485-1745-11ef-aba8-808897535054',
          processInstanceId:'b83e2fee-1745-11ef-aba8-808897535054',
          deployId:'a5b5c59a-1745-11ef-aba8-808897535054'
        }
      };
    },
    created() {
    },
    methods: {
  
    }
  };
  </script>
  <style lang="less" scoped>
  </style>
  