<template>
  <div id="drawProcessDesign">
    <div class="process-container">
        <div class="editType"><i class="el-icon-back" @click="jumpBack"></i></div>
        <div class="form-container">
          <el-form ref="mainform"  :model="form" label-width="110px" :rules="formRules">
            <el-row :gutter="24">
              <el-col :span="6">
                  <el-form-item label="模型名称:"  prop="processName">
                    <el-input v-model="form.processName"  placeholder="请输入模型名称" :disabled="type == 'see'"></el-input>
                  </el-form-item>
              </el-col>
              <el-col :span="6">
                  <el-form-item label="模型类型:" prop="processType">
                    <el-select v-model="form.processType" placeholder="请选择模型类型" :disabled="type == 'see'">
                      <el-option
                        v-for="( item, index ) in processTypeList"
                        :key="index"
                        :label="item.name"
                        :value="item.id"
                        >
                        <span style="float: left">{{ item.name }}</span>
                      </el-option>
                    </el-select>
                  </el-form-item>
              </el-col>
              <el-col :span="8">
                  <el-form-item label="模型简介:"  prop="processDes">
                    <el-input type="textarea" :disabled="type == 'see'" v-model="form.processDes" placeholder="请输入模型简介"  :autosize="{ minRows: 2, maxRows: 4}" show-word-limit></el-input>
                  </el-form-item>
              </el-col>
              <el-col :span="4"><el-button type="primary"  @click="submitData()" :disabled="type == 'see'">发布模型</el-button></el-col>
            </el-row>
          </el-form>
        </div>
    </div>
    <div class="scale-slider">
      <i class="btn el-icon-minus"   @click="changeScale(-step)"></i>
      <span style="font-size:14px;">{{scaleVal}}%</span>
      <i class="btn el-icon-plus"  @click="changeScale(step)"></i>
    </div>
    <!-- 流程图 -->
    <FactoryDrawFlow
      @clickNode="clickNode"
      ref="flow"
      :FlowConfig="FlowConfig"
      :modelType="type"
      :scaleVal="scaleVal"
    ></FactoryDrawFlow>
    <!-- 属性面板 -->
    <el-drawer
      title="设置节点属性"
      :before-close="handleClose"
      :visible.sync="isShowAttribute"
      direction="rtl"
      custom-class="demo-drawer"
      ref="drawer">
        <NodeAttribute @cancel="handleClose" :nodeData="nodeData"  :nodeList="nodeList" @nodeChange="nodeChange($event)"/>
    </el-drawer>

  </div>
</template>
<script>
import NodeAttribute from "./components/NodeAttribute/NodeAttribute.vue";
import FactoryDrawFlow from "./DrawFlow.vue";
import axios from 'axios'
export default {
  name: "DrawFlowChart",
  components: {
     NodeAttribute,
     FactoryDrawFlow
  },
  data() {
    return {
      isShowAttribute: false, // 是否显示属性
      nodeData: null, // 当前点击的node对象
      nodeList: null, // 流程图所有的节点列表
      // 默认的流程图发起人
      FlowConfig: [
        {
          id: 'a78x4anxe',
          groupId: null,
          pids: [null],
          groupPid: null,
          groupId: null,
          type: "1",
          title: "发起人",
          nodeName: "发起人",
          nodeType: "userTask",
          assignee: "${INITIATOR}",
          oiginator: true,
          isRow: true,
          isRoot: true,
        }
      ],
      modelId:'', // 模型id
      modelType:'', // 模型类型
      processTypeList:[], // 模型类型列表
      form: {
        processName: '',
        processDes:'',
        processType:'',
        processId:'',
      },
      formRules: {
        processName: [ {required: true, message: "请输入模型名称", trigger: "blur"}],
        processDes: [ {required: true, message: "请输入模型简介", trigger: "blur"}],
        processType: [ {required: true, message: "请选择模型类型", trigger: "blur"}]
      },
      scaleVal: 100, // 流程图缩放比例 100%
      step: 5, // 缩放步长
    };
  },
  created() {
    this.init();
  },
  props: {
    flowId: {
      type: String,
      default() {
        return '';
      }
    },
    flowType: {
      type: String,
      default() {
        return '';
      }
    }
  },
  watch: {
    flowId: {
      handler() {
        this.init();
      },
      deep: true
    },
    flowType: {
      handler() {
        this.init();
      },
      deep: true
    }
  },
  methods: {
    handleClose() {
      this.isShowAttribute = false;
    },
    // 初始化（判断进入这个页面是查看，编辑，新增）
    init() {
      if(!this.flowId){
        this.type = 'add';
        this.$forceUpdate();
      }else {
        this.modelId = this.flowId;
        this.type = this.flowType;
        this.getModelData();
      }
      this.getModeList();
    },
    // 获取模型列表
    getModeList(){
        axios.get(`/flowable/definition/categoryList`).then(res => {

            if(res && res.data && res.data.code == 200){
              this.processTypeList = res.data.data
              this.form.processType = this.processTypeList[0].id
            }
        })
        .then(err => {
            console.log(err)
        })
    },
    // 获取模型流程图数据
    getModelData(){
        // 通过id获取流程表单
        axios.put(`/flowable/definition/detail/${this.modelId}`)
        .then(res => {
          
            if(res && res.data && res.data.code == 200){
              let { des, json, modelType, modelKey, processId } = res.data.data;
              let processData = JSON.parse(json);
              this.form = {
                processName: processData.process.name,
                processDes: des,
                processType: modelType,
                processId: processData.process.processId || '',
              } 
              this.FlowConfig = processData.list
              this.$forceUpdate();
              return false;
            }
        })
        .then(err => {
            console.log(err)
        })
       
    },
    // 点击某一个节点
    clickNode(node) {
      if(node.oiginator){
        return false;
      }
      this.nodeData = node;
      this.nodeList =  this.$refs.flow.getData();
      this.isShowAttribute = true
      this.$forceUpdate();
      console.log("当前点击节点", node);
    },
    // 改变某一个节点,并对节点进行验证
    nodeChange(params) {
      if(params.type == 'userTask'){
        const { nodeName, attribute, processMultiInstanceUsers, title, rejectKey, completionCondition, deptKeys, userType,  sequential, className , businessName, isAddLabel } = params;
        this.nodeData.nodeName = nodeName;
        this.nodeData.attribute = attribute;
        this.nodeData.isAddLabel = isAddLabel;
        this.nodeData.assignee = nodeName;
        this.nodeData.processMultiInstanceUsers = processMultiInstanceUsers;
        this.nodeData.title = title;
        this.nodeData.rejectKey = rejectKey;
        this.nodeData.completionCondition = completionCondition;
        this.nodeData.deptKeys = deptKeys;
        this.nodeData.userType = userType;
        this.nodeData.sequential = sequential
        this.nodeData.taskListeners = className
        this.nodeData.businessListeners = businessName
      }else {
        const { nodeName, conditionExpression, title } = params;
        this.nodeData.nodeName = nodeName;
        this.nodeData.title = title;
        this.nodeData.conditionExpression = conditionExpression;
      }

      let flag = this.$refs.flow.nodeChange(this.nodeData);
      if(flag){ 
        this.isShowAttribute = false; 
      }
    },
    // 获取提交模型的参数
    getParams(){
      let that = this;
      let flag =  true;
      that.$refs['mainform'].validate(valid => {
          if (valid) {
              let res =  that.$refs.flow.getData();
              for(let i=0; i < res.length; i++ ){
                let item = res[i];
                if(item.nodeType == "userTask" && !item.oiginator){ // 人物节点
                    if(!item.processMultiInstanceUsers.length){
                      this.errorTip();
                      flag = false
                    }
                } else if(item.nodeType == "exclusiveGateway" && !item.conditionExpression){ // 条件节点，必须保证条件节点有表达式，条件
                    if(!item.conditionExpression){
                      this.errorTip();
                      flag = false
                    }
                }
              }
          }else{
              flag = false
          }
      })
      if(flag){
        let res =  this.$refs.flow.getTreeData();
        let list =  {
          des: this.form.processDes,
          modelType: this.form.processType,
          modelDefinition: {
            process: {
              processId:this.form.processId,
              name: this.form.processName
            },
            processNode: res[0] || {},
            list: this.$refs.flow.getData()
          }
        }
        return list;
      }else {
        return false;
      }
      
    },
    // 发布模型
    submitData() {
      let params = this.getParams();
      if(!params){
        return false
      }
      axios.post("/flowable/definition/deploy", params).then(res => {
          if(res && res.data && res.data.code == 200){
            this.$emit('setFlowChart');
          }else {
              this.$message({
                type: 'error',
                message: '流程图发布失败'
              });
          }
      })
      .then(err => {
          console.log(err)
      })
    },
    jumpBack(){
        this.$emit('setFlowChart');
    },
    // 错误提示
    errorTip(){
      this.$message({
          type: 'error',
          message: '流程图未填写完整'
        });
    },
    changeScale(val) {
        let v = this.scaleVal + val;
        if (v > 0 && v <= 200) {
            // 缩放介于0%~200%
            this.scaleVal = v;
        }
        this.$forceUpdate();
    }
  }
};
</script>
<style lang="less" scoped>
.editType {
  margin: 20px 0 20px;
  font-size: 30px;
  line-height: 30px;
  text-align: left;
  cursor: pointer;
}
.form-container {
  width: 1200px;
  margin: 0 auto;
}
.process-container {
  // height: 100px;
  width: 100%;
  background-color:#fff;
}
#drawProcessDesign {
  background: #f0f2f5;
}
.scale-slider {
    margin-top: 20px;
}
.btn {
    display: inline-block;
    padding: 4px;
    border: 1px solid #cacaca;
    border-radius: 3px;
    background: #FFF;
    margin-left: 10px;
    margin-right: 10px;
    cursor: pointer;
  }
</style>