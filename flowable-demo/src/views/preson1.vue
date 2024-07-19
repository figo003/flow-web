<template>
    <div class="container">
      <div class="panel-content">
          <div class="panel">
              <h3>待办列表</h3>
              <el-table  class="tableContainer" :data="incompleteList" stripe  min-height="550"  max-height="950" border style="width: 100%">
                  <el-table-column  prop="name"  label="名称"  width="480">
                      <template slot-scope="scope">
                          {{scope.row.procVars.title || ''}}
                      </template>
                  </el-table-column>
                  <el-table-column  fixed="right"  label="操作"  width="220">
                      <template slot-scope="scope">
                          <el-button  size="mini"  @click="jumpFlowPic(scope.row)">查看流程图</el-button>
                          <el-button  size="mini"  type="primary" @click="clickCheck(scope.row)">操作</el-button>
                      </template>
                  </el-table-column>
              </el-table>
          </div>
          <div class="panel">
              <h3>已办列表</h3>
              <el-table  class="tableContainer" :data="completeList" stripe  min-height="550"  max-height="950" border style="width: 100%">
                  <el-table-column  prop="name"  label="名称"  width="480">
                      <template slot-scope="scope">
                          {{scope.row.procVars.title || ''}}
                      </template>
                  </el-table-column>
                  <el-table-column  fixed="right"  label="操作"  width="220">
                      <template slot-scope="scope">
                          <el-button  size="mini"  @click="jumpFlowPic(scope.row)">查看流程图</el-button>
                      </template>
                  </el-table-column>
              </el-table>
          </div>
       </div>
          <el-dialog
              title="待办详情"
              :visible.sync="visible"
              width="30%"
              center>
                  <div class="operate-detail">
                      <div class="content">
                          <h3>请假流程单</h3>
                          <div>请假人：{{name}}</div>
                          <div>请假天数：{{day}}天</div>
                          <div>请假事由：{{reason}}</div>
                      </div>
                      <div v-if="type!=4" style="margin-top: 30px;">审批意见：<el-input type="textarea" v-model="checkMessage" placeholder="请输入审批意见"  :autosize="{ minRows: 4, maxRows: 4}" show-word-limit></el-input>
                      </div>
                  </div>
                  <span slot="footer" class="dialog-footer">
                      <el-button v-if="type!=4" @click="clickRefuse">拒绝</el-button>
                      <el-button v-if="type!=4" @click="clickReject">驳回</el-button>
                      <el-button v-if="type!=4" type="primary" @click="clickAgree">同意</el-button>
                      <el-button v-if="type!=4 && isShowAdd" @click="clickPreAdd">向前加签</el-button>
                      <el-button v-if="type!=4 && isShowAdd" @click="clickNextAdd">向后加签</el-button>
                      <!-- 抄送的情况 -->
                      <el-button v-if="type==4" type="primary" @click="clickSee">已阅</el-button> 
                  </span>
          </el-dialog>
           <el-dialog
              title="已办详情"
              :visible.sync="completeVisible"
              width="30%"
              center>
                  <div class="operate-detail">
                      <div class="content">
                          <h3>请假流程单</h3>
                          <div>请假人：{{name}}</div>
                          <div>请假天数：{{day}}天</div>
                          <div>请假事由：{{reason}}</div>
                          <div>审批情况：通过</div>
                          <div>审批意见：按时打卡士大夫</div>
                      </div>
                  </div>
                  <span slot="footer" class="dialog-footer">
                      <el-button type="primary" @click="completeVisible = false">确 定</el-button>
                  </span>
          </el-dialog>
          <el-dialog
              :title="addLabelTitle"
              :visible.sync="isShowAddLable"
              width="30%"
              center>
                  <div class="operate-detail">
                    <el-select  v-model="selectUser"  multiple  placeholder="请选择">
                        <el-option
                        v-for="( item, index ) in userList"
                        :key="index"
                        :label="item.name"
                        :value="item.key"
                        >
                        <span style="float: left">{{ item.name }}</span>
                        </el-option>
                    </el-select>          
                  </div>
                  <span slot="footer" class="dialog-footer">
                      <el-button type="primary" @click="submitAddLabel">确 定</el-button>
                      <el-button  @click="isShowAddLable = false">取 消</el-button>
                  </span>
          </el-dialog>
       </div>
  </template>
  <script>
  import { renderJson }  from './utils'
  import axios from 'axios'
  export default {
    name: "Leave",
    data() {
      return {
        json:'',
        completeList:[],
        incompleteList:[],
        visible: false,
        completeVisible: false,
        user: '13',
        type:'', // 用来判断是否为抄送节点
        checkMessage:'',
        taskId:'',
        taskDefKey:'',  // 节点id
        processInstanceId:'',
        name:'',
        day:'',
        reason:'',
        isShowAddLable: false, // 是否显示加签弹框
        addLabelType:'1', // 1: 向前加签 2: 向后加签
        addLabelTitle: '',
        userList:[], // 可以加签的人员
        selectUser:[], // 选中的加签的人员
        isShowAdd: false
  
      }
    },
    created() {
      this.init();
    },
    methods: {
      init(){
          this.getCompleteList();
          this.getInCompleteList();
          this.getUserList();
      },
      // 获取已办
      getCompleteList(){
          axios.get(`/flowable/task/finishedList?pageNum=1&pageSize=100&userKey=${this.user}`).then(res => {
              if(res && res.data && res.data.code == 200){
                  this.completeList = res.data.data.data;
                  return false;
              }
          })
          .then(err => {
              console.log(err)
          })
      },
      // 获取待办
      getInCompleteList(){
          axios.get(`/flowable/task/todoList?pageNum=1&pageSize=100&userKey=${this.user}`).then(res => {
              if(res && res.data && res.data.code == 200){
                  this.incompleteList = res.data.data.data;
                  return false;
              }
          })
          .then(err => {
              console.log(err)
          })
      },
       // 获取人员列表
       getUserList(){
            // 这个业务方可以根据自己的接口去实现人员选择
            axios.get(`/flowable/definition/infoList?type=1`).then(res => {
                if(res && res.data && res.data.code == 200){
                    this.userList = res.data.data
                }
            })
            .then(err => {
                console.log(err)
            })
        },
      // 点击审核
      clickCheck(row){
          this.visible =  true;
          this.taskId = row.taskId
          this.taskDefKey = row.taskDefKey
          this.deployId = row.deployId
          this.processInstanceId = row.processInstanceId
          this.name = '张三'
          this.type = row.procVars.type ? row.procVars.type : ''
          this.day = row.procVars.day
          this.reason = '请假回家'
          this.renderPower(row.taskDefKey, row.json)
      },
      renderPower(taskDefKey, nodeData){
        let data = JSON.parse(nodeData).list;
        this.json = JSON.parse(nodeData)
        let node = data.filter(item => {
            return item.id == taskDefKey
        });
        if(node.length){
            this.isShowAdd = node[0].isAddLabel == 1 ? false: true
        }
        
      },
      // 同意
      clickAgree(){
          let params = {
              taskId: this.taskId,
              processInstanceId: this.processInstanceId,
              comment: this.checkMessage,
              userKey: this.user
          }
          axios.post(`/flowable/task/complete`, params).then(res => {
              if(res && res.data && res.data.code == 200){
                  this.getCompleteList();
                  this.getInCompleteList();
                  this.visible =  false;
                  return false;
              }
          })
          .then(err => {
              console.log(err)
          })
      },
      // 拒绝
      clickRefuse(){
          let params = {
              taskId: this.taskId,
              processInstanceId: this.processInstanceId,
              comment: this.checkMessage,
              userKey: this.user
          }
          axios.post(`/flowable/task/stopProcess`, params).then(res => {
              if(res && res.data && res.data.code == 200){
                  this.getCompleteList();
                  this.getInCompleteList();
                  this.visible =  false;
                  return false;
              }
          })
          .then(err => {
              console.log(err)
          })
      },
      // 驳回
      clickReject(){
          let params = {
              taskId: this.taskId,
              processInstanceId: this.processInstanceId,
              comment: this.checkMessage,
               userKey: this.user
          }
          axios.post(`/flowable/task/return`, params).then(res => {
              if(res && res.data && res.data.code == 200){
                  this.getCompleteList();
                  this.getInCompleteList();
                  this.visible =  false;
                  return false;
              }
          })
          .then(err => {
              console.log(err)
          })
      },
      // 已阅
      clickSee(){
           let params = {
              taskId: this.taskId,
              processInstanceId: this.processInstanceId,
          }
           axios.post(`/flowable/task/readTask `, params).then(res => {
              if(res && res.data && res.data.code == 200){
                  this.getCompleteList();
                  this.getInCompleteList();
                  this.visible =  false;
                  return false;
              }
          })
          .then(err => {
              console.log(err)
          })
      },
      // 向前加签
      clickPreAdd(){
            this.isShowAddLable= true
            this.addLabelType = '1'
            this.addLabelTitle = "向前加签"
            this.getUserList()
        },
        // 向后加签
        clickNextAdd(){
            this.isShowAddLable= true
            this.addLabelType = '2'
            this.addLabelTitle = "向后加签"
            this.getUserList()
        },
        
        submitAddLabel(){
            // 加签的人名字
            let selectUserName = []
            if(this.selectUser.length){
                for(let i = 0; i < this.selectUser.length; i++){
                    for(let j = 0; j < this.userList.length; j++){
                        if(this.selectUser[i] == this.userList[j].key ){
                            selectUserName.push(this.userList[j].name)
                        }
                    }   
                }
            }
            let { json, currentNode, firstNode, secondNode, addNode } = renderJson(this.addLabelType, this.taskDefKey, selectUserName, this.json)
            this.json = json
            let params = {
                taskId: this.taskId,
                processInstanceId: this.processInstanceId,
                comment: this.checkMessage,
                userKey: this.user,
                afterFlag: this.addLabelType == 1 ? false: true,
                signPersonIds: this.selectUser,
                currentDefinitionKey: currentNode.id, // 当前节点key
                signDefinitionKey: this.addLabelType == 1 ? firstNode.id : addNode.id, // 第一个key
                signName: this.addLabelType == 1 ? firstNode.title : addNode.title, // 第一个key
                json: JSON.stringify(this.json)
            }
            if(this.addLabelType == 1){
                params.signAfterDefinitionKey = secondNode.id // 第二个节点key // afterFlag 为 false，向前加，需要参数
                params.signAfterName = secondNode.title // 第二个节点name
            }

            axios.post(`/flowable/task/addSignTask`, params).then(res => {
                if(res && res.data && res.data.code == 200){
                    this.isShowAddLable= false
                    this.visible = false
                    this.$message({
                        type: 'success',
                        message: res.data.msg
                    });
                    this.getCompleteList();
                    this.getInCompleteList()
                }else {
                    this.$message({
                        type: 'error',
                        message: '加签失败'
                    });
                }
            })
            .then(err => {
                console.log(err)
            })
        },
        // 查看流程图
        jumpFlowPic(row){
            if(row.procVars.type == 4){ // 抄送
                this.$router.push({path:"/detail-history", 
                    query: {
                        taskId:row.procVars.parentTaskId, 
                        processInstanceId:row.procVars.parentProcessInstanceId,
                        deployId: row.procVars.parentDeployId
                    }
                })
            }else {
                this.$router.push({path:"/detail-history", 
                query: {
                    taskId:row.taskId, 
                    processInstanceId:row.processInstanceId,
                    deployId: row.deployId
                }
            })
            }
            
        },
    }
  }
  </script>
  <style lang="less">
  .container {
      height: 100%;
      // background-color: #eee;
      
      .panel-content {
          display: flex;
      }
  }
  .panel {
      margin: 10px 20px;
      min-height: 300px;
      height: 300px;
      background-color: #FFF;
      border-radius: 10px
  }
  .list {
      margin-top: 40px;
  }
  .list-item {
      width: 100%;
      display: flex;
      .name {
          margin-left: 10px;
          flex: 1;
          text-align: left;
      }
      .time {
          width: 100px;
  
      }
      .create {
          width: 100px;
      }
      .operate {
          width: 200px;
      }
  
  }
  .empty-data {
      margin: 50px 20px;
  }
  .operate-detail {
      width: 500px;
      display: block;
      height: 300px;
      background-color: #FFF;
      border-radius: 10px
      
  }
  .content {
      div {
          font-size: 16px;
      }
  }
  </style>
  
  
  