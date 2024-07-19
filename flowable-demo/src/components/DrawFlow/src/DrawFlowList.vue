<template>
  <div class="container">
        <div v-if="!isShowCheck && !isSowFlowChart">
            <div class="headContainer">
            <span class="model-name">模型列表</span>
            <div class="btns"><el-button type="primary"  @click="handleAdd()">新增</el-button></div>
            </div>
            <el-table  class="tableContainer" :data="tableData" stripe  min-height="550"  max-height="950" border style="width: 100%">
            <el-table-column  prop="name"  label="模型名称"  width="180"></el-table-column>
            <el-table-column  prop="modelType"  label="模型类型"  width="180"></el-table-column>
            <el-table-column  prop="des"  label="模型简介"  ></el-table-column>
            <el-table-column  prop="deploymentTime"  label="发布时间" width="180"></el-table-column>
            <el-table-column  prop="version"  label="版本" width="100"></el-table-column>
            <el-table-column  prop="suspensionState" label="状态" width="100">
                <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" :content="scope.row.suspensionState==1?'启用':'禁用'" placement="right-start">
                    <el-switch
                        v-model="scope.row.suspensionState"
                        active-color="#13ce66"
                        inactive-color="#ccc"
                        :active-value="1"
                        :inactive-value="2"
                        @change="changeModelStatus(scope.row)"
                    >
                    </el-switch>
                </el-tooltip>
                
                </template>
            </el-table-column>
            <el-table-column  fixed="right"  label="操作"  width="220">
                <template slot-scope="scope">
                    <el-button  size="mini"  @click="handleDetail(scope.row)">查看</el-button>
                    <el-button  size="mini"  type="primary" @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button  size="mini"  type="danger"  @click="handleDelete(scope.row)" >删除</el-button>
                </template>
            </el-table-column>
            </el-table>
            <el-pagination
            style="text-align: right; margin-top: 20px;"
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            layout="sizes, prev, pager, next"
            :total="totalNum">
            </el-pagination>
        </div>
        <div v-if="!isShowCheck && isSowFlowChart">
            <DrawFlowChart :flowId="flowId" :flowType="flowType" @setFlowChart="setFlowChart"></DrawFlowChart>
        </div>
        <div v-if="isShowCheck">
            <DrawFlowCheck :params="params" :isCustomcheck="isCustomcheck"><div v-if="isCustomcheck"><slot name="checkHistory"></slot></div></DrawFlowCheck>
        </div>
    </div>
</template>

<script>
import DrawFlowChart from "./DrawFlowChart.vue";
import DrawFlowCheck from "./DrawFlowCheck.vue";
import axios from 'axios'
  export default {
    name: "DrawFlowList",
     components: {
        DrawFlowChart,
        DrawFlowCheck
    },
    data() {
          return {
            tableData: [],
            currentPage: 1,
            pageSize: 10,
            totalNum: 0,
            isSowFlowChart: false,
            flowId:'',
            flowType: '',
          }
    },
    props: {
      isShowCheck: {
        type: Boolean,
          default() {
            return false;
          }
      },
      isCustomcheck: {
        type: Boolean,
          default() {
            return false;
          }
      },
      params: {
        type: Object,
          default() {
            return {};
          }
      },
    },
    watch: {
      isShowCheck: {
        handler() {},
        deep: true
      },
      isCustomcheck: {
        handler() {},
        deep: true
      },
      params: {
        handler() { },
        deep: true
      },
    },
    created() {
        this.initData();
    },
    methods: {
        // 点击列表查看详情
        handleClick(row) {
            // console.log(row);
        },
        // 获取列表数据
        initData(){
            axios.get(`/flowable/definition/list?pageNum=${this.currentPage}&pageSize=${this.pageSize}`).then(res => {
                if(res && res.data && res.data.code == 200){
                    this.tableData = res.data.data.data;
                    this.totalNum = res.data.data.total;
                    return false;
                }
            })
            .then(err => {
                console.log(err)
            })
        },
        // 新增模型数据
        handleAdd(){
            this.flowId = '';
            this.flowType = '';
            this.isSowFlowChart = true;
        },
        // 查看
        handleDetail(row){
            this.flowId = row.deploymentId;
            this.flowType = 'see'
            this.isSowFlowChart = true;
        },
        // 编辑
        handleEdit(row){
            this.flowId = row.deploymentId;
            this.flowType = 'edit'
            this.isSowFlowChart = true;
        },
        setFlowChart(){
            this.isSowFlowChart = false;
            this.initData();
        },
        // 删除
        handleDelete(row){
           this.$confirm('确定要删除该模型吗？', {
              confirmButtonText: '确认',
              cancelButtonText: '取消'
            }).then(() => {
              axios.delete(`/flowable/definition/delete?modelKey=${row.modelKey}`).then(res => {
                if(res && res.data && res.data.code == 200){
                  this.$message({
                    type: 'success',
                    message: '删除成功'
                  });
                  this.initData();
                  return false;
                }
              }).then(err => {
                  console.log(err)
              })
            }).catch(action => {});
        },
        // 修改状态
        changeModelStatus(row){
          axios.put(`/flowable/definition/updateState?deploymentId=${row.deploymentId}&state=${row.suspensionState}`).then(res => {
              if(res && res.data && res.data.code == 200){
                  this.$message({
                    type: 'success',
                    message: '操作成功'
                  });
                  this.initData();
                  return false;
              }
          })
          .then(err => {
              console.log(err)
          })
        },
        // 修改size
        handleSizeChange(val) {
          this.pageSize = val;
          this.initData();
        },
        // 修改当前页
        handleCurrentChange(val) {
          this.currentPage = val;
          this.initData();
        }
    },
  }
</script>

<style  scoped lang="less">
.container {
  margin: 60px auto;
  width: 1200px;
}
.headContainer {
  .model-name {
    display: inline-block;
    float: left;
    font-size: 20px;
  }
  .btns {
    margin-bottom: 10px;
    display: inline-block;
    float: right;
  }
}
</style>