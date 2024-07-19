<template>
  <div id="drawProcessDesign">
        <DrawFlowList :isShowCheck="isShowCheck" ></DrawFlowList>
    </div>
</template>
<script>
export default {
  name: "Detail",
  data() {
    return {
      isShowCheck: false,
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
