<template>
    <div class="container">
          <div class="headContainer">
            <span class="model-name">我发起的列表</span>
            <div class="btns"><el-button type="primary"  @click="handleAdd()">发起请假</el-button></div>
          </div>
          <el-table  class="tableContainer" :data="tableData" stripe  min-height="550"  max-height="950" border style="width: 100%">
            <el-table-column  prop="name"  label="发起人"  width="180"></el-table-column>
            <el-table-column  prop="day"  label="请假天数" width="180"></el-table-column>
            <el-table-column  prop="modelKey"  label="请假模型"  width="180"></el-table-column>
            <el-table-column  prop="reason"  label="请假事由"  ></el-table-column>
            <el-table-column  prop="createDate"  label="发布时间" width="180"></el-table-column>
            <el-table-column  prop="status"  label="状态" width="180">
              <template slot-scope="scope">
                {{statusArry[scope.row.status]}}
              </template>
            </el-table-column>
            <el-table-column  fixed="right"  label="操作"  width="180">
                <template slot-scope="scope">
                  <el-button  v-if="scope.row.status == 1" size="mini"  @click="handleEdit(scope.row)">编辑</el-button>
                  <el-button v-if="scope.row.status == 0"   size="mini"  type="primary" @click="handleRecall(scope.row)">撤回</el-button>
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
  </template>
  
  <script>
  import axios from 'axios'
    export default {
      name: "List",
     data() {
          return {
            tableData: [],
            currentPage: 1,
            pageSize: 10,
            totalNum: 0,
            statusArry: {
               // 0发起 1撤回  2通过 3终止
               0: '发起',
               1: '撤回',
               2: '通过',
               3: '终止',
            }
          }
      },
      created() {
          this.initData();
      },
      mounted(){
      },
      methods: {
          // 点击列表查看详情
          handleClick(row) {
              console.log(row);
          },
          // 获取列表数据
          initData(){
              axios.post(`/other/findAllForm`).then(res => {
                  if(res && res.data && res.data.code == 200){
                      this.tableData = res.data.data;
                      this.totalNum = res.total || 10;
                      return false;
                  }
              })
              .then(err => {
                  console.log(err)
              })
          },
          // 新增模型数据
          handleAdd(){
            this.$router.push({path:"/launch-form", query: {type: 'add'}})
          },
          // 编辑按钮
          handleEdit(row){
            this.$router.push({path:"/launch-form",
                query: {
                    type: 'edit',
                    name:row.name, 
                    day:row.day,
                    reason: row.reason,
                    modelKey: row.modelKey,
                    id: row.id
                }
            })
  
          },
          // 撤回按钮
          handleRecall(row){
            this.$confirm('确定要撤回发起的流程吗？', {
                confirmButtonText: '确认',
                cancelButtonText: '取消'
              }).then(() => {
                axios.post(`/other/recall?id=${row.id}`, {id: row.id }).then(res => {
                      if(res && res.data && res.data.code == 200){
                          this.$message({
                            type: 'success',
                            message: '撤回成功'
                          });
                          this.initData()
                          return false;
                      }else {
                        this.$message({
                            type: 'error',
                            message: res.data.msg
                          });
                      }
                  })
                  .then(err => {
                      console.log(err)
                  })
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