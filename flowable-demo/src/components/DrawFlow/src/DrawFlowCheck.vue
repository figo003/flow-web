<template>
  <div id="drawProcessDesign">
    <!-- 流程图 -->
    <div class="container">
      <div class="flow-container">
        <div class="scale-slider">
          <i class="btn el-icon-minus"   @click="changeScale(-step)"></i>
          <span style="font-size:14px;">{{scaleVal}}%</span>
          <i class="btn el-icon-plus"  @click="changeScale(step)"></i>
        </div>
        <FactoryDrawFlow
          @clickNode="clickNode"
          ref="flow"
          :FlowConfig="FlowConfig"
          modelType="see"
          :scaleVal="scaleVal"
        ></FactoryDrawFlow>
      </div>
      <div class="examine" v-if="isCustomcheck"><slot></slot></div>
      <div class="examine" v-if="!isCustomcheck">
          <div>
            <h4>审核历史</h4>
            <el-timeline :reverse="reverse">
              <el-timeline-item
                v-for="(item, index) in activities"
                :key="index"
                color="#0bbd87"
                :timestamp="item.createTime">
                <div>
                  <p>{{item.taskName?item.taskName:'发起人' }}：{{item.userName}}</p>
                  <p>审核结果：{{commentType[item.type]}}</p>
                  <p>审核意见：{{item.comment}}</p>
                </div>
              </el-timeline-item>
            </el-timeline>
          </div>
      </div>
    </div>

  </div>
</template>
<script>
import axios from 'axios'
import FactoryDrawFlow from "./DrawFlow.vue";
export default {
  name: "DrawFlowCheck",
   components: {
     FactoryDrawFlow
  },
  data() {
    return {
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
        reverse: true,
        activities: [],
        commentType: {
            1: "通过",
            2: "驳回",
            3: "退回",
            4: "委派",
            5: "转办",
            6: "终止",
            7: "抄送",
            8: "向前加签",
            9: "向后加签",
        },
        scaleVal: 100, // 流程图缩放比例 100%
        step: 5, // 缩放步长

    };
  },
    created() {
        this.init();
    },
    props: {
        params: {
            type: Object,
            default() {
                return {};
            }
        },
        isCustomcheck: {
            type: Boolean,
            default() {
                return {};
            }
        },
    },
    watch: {
        params: {
            handler() {
                this.init();
            },
            deep: true
        },
        isCustomcheck: {
            handler() {
                this.init();
            },
            deep: true
        }
    },
    methods: {
        // 初始化（判断进入这个页面是查看）
        init() {
            if(!this.params.deployId){return false}
            let { taskId, processInstanceId,deployId } = this.params
            this.getModelData( taskId, processInstanceId,deployId );
        },
        // 获取模型流程图数据
        getModelData( taskId, processInstanceId,deployId ){
            // 通过id获取流程表单
            axios.get(`/flowable/task/flowViewer?taskId=${taskId}&processInstanceId=${processInstanceId}&deployId=${deployId}`).then(res => {
                console.log(res)
                if(res && res.data && res.data.code == 200){
                let { flowProcDefRes, flowProgressResList, flowCommentResList } = res.data.data;
                let data = JSON.parse(flowProcDefRes.json);
                let processData = data.list
                processData.forEach(item => {
                    item.status = 0;
                    for(let i = 0; i < flowProgressResList.length; i++){
                    if(flowProgressResList[i].id == item.id){
                        item.comment = flowProgressResList[i].comment || ''
                        if(flowProgressResList[i].completed === false){
                        item.status = 1;
                        }else if (flowProgressResList[i].completed === true){
                        item.status = 2;
                        }
                    }
                    }
                });
                
                this.activities = flowCommentResList || []
                this.FlowConfig = processData
                this.$forceUpdate();
                return false;
                }
            })
            .then(err => {
                console.log(err)
            })
        
        },
        // 返回
        jumpGo(){
            this.$router.back()
        },
        clickNode(){},
         /**
         * 控制流程图缩放
         * @param { Object } val - 缩放增量 是step的倍数 可正可负
         */
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
  margin: 40px 0 ;
  font-size: 24px;
  line-height: 30px;
}
.form-container {
  width: 1200px;
  margin: 0 auto;
}
.process-container {
  width: 100%;
  background-color:red;
}
.container {
  display: flex;
}
.flow-container {
  flex: 1;
  width: 700px;
  height: 700px;
  // overflow-y: hidden;
  background-color: #f0f2f5;
}
.examine {
  width: 300px;
  max-height: 700px;
  overflow: auto;
  border: 1px solid #ccc;
  
}
.el-timeline {
  padding: 20px;
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