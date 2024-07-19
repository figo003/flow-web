<!--
* @author 高丽萍
* @time 2022-6-30
* @dec 生成流程绘制 基本节点(审批 抄送)组装逻辑
-->
<script>
import AddNodeBtn from "./components/AddNodeBtn.vue";
import FlowNode from "./components/DrawRow/FlowNode.vue";
import NodeAttribute from "./components/NodeAttribute/NodeAttribute.vue";
import RowFactory from "./components/DrawRow/FactoryRow.js";
import FlowFactory from "./components/factory";
import {  RowNode,  ConditionNode,  CopyNode} from "./components/NodeConfigFactory/NodeFactory.js";
import { HashCode, transToTreeDat } from "./utils";



export default {
  name: "FactoryDrawFlow",
  components: {
    AddNodeBtn,
    FlowNode,
    NodeAttribute
  },
  created() {
    this.init();
    // this.creatBusNodeChange();  // 可用事件派发
  },
  props: {
    FlowConfig: {
      type: Array,
      default() {
        return [];
      }
    },
    modelType: {
      type: String,
      default() {
        return '';
      }
    },
    scaleVal: {
      type: Number,
      default() {
        return 100;
      }
    },
  },
  watch: {
    FlowConfig: {
      handler() {
        this.init();
      },
      deep: true
    },
    modelType: {
      handler() {
        this.isShowMask();
      },
      deep: true
    },
    scaleVal: {
      handler() {},
      deep: true
    },
  },
  data() {
    return {
      selfConfig: null,
      currentNode: null,
      //缓存数据
      cacheData: null,
      isShowAttribute: false,
    };
  },
  methods: {
    // 节点数据变化事件(this.currentNode 当前点击的节点)
    nodeChange(node) {
      let flag = false;
      if(node.nodeType == 'userTask'){
        this.currentNode.nodeName = node.nodeName;
        this.currentNode.processMultiInstanceUsers = node.processMultiInstanceUsers;
        this.currentNode.title = node.title;
        this.selfConfig.forEach(i => {
            if (i.id === this.currentNode.id) {
              i.nodeName = node.nodeName;
              i.attribute =  node.attribute;
              i.isAddLabel = node.isAddLabel;
              i.assignee = node.nodeName.replace(/\;/g,'');;
              i.processMultiInstanceUsers = node.processMultiInstanceUsers
              i.title = node.title
              i.rejectKey = node.rejectKey
              i.completionCondition = node.completionCondition
              i.deptKeys = node.deptKeys
              i.userType = node.userType
              i.sequential = node.sequential
              i.taskListeners = node.taskListeners
              i.businessListeners = node.businessListeners
              flag = true
            }
        });
      }else {
        this.currentNode.conditionExpression = node.conditionExpression;
        this.currentNode.title = node.title;
        this.selfConfig.forEach(i => {
            if (i.id === this.currentNode.id) {
              i.nodeName = node.nodeName
              i.title = node.title;
              i.conditionExpression = node.conditionExpression;
              flag = true
            }
        });
      }
      // this.$forceUpdate();
      return flag;
    },
    /**
     * 添加条件框
     */
    addBranch(node) {
      let newNode = new CopyNode(node[0]);
      this.selfConfig = this.selfConfig.concat([newNode]);
    },
    creatBusNodeChange() {
      // EventBus.$on("nodeChange", this.nodeChange);
    },
    getData(){
      let FlowConfig = JSON.parse(JSON.stringify(this.selfConfig));
      return FlowConfig;
    },
    getSelfConfigData(){

    },
    /**
     * 获取树状结构数据
     */
    getTreeData(){
      let list = JSON.parse(JSON.stringify(this.selfConfig));
      let data = this.transformTree(list);
      return data;
    },
    /**
     * 获取传参数据结构
     */
    getResData() {
      let list = JSON.parse(JSON.stringify(this.selfConfig));
      // let data1 = deepTraversal(data);
      list.forEach(i => {
        if (i.isRow) {
          delete i.nextNode;
        }
      });

      list = this.shakeDeleteNode(list);
      return list;
    },
    // 删除没有上级的节点
    shakeDeleteNode(list) {
      console.log(selfConfig, "list");
      let root = JSON.parse(JSON.stringify(list)).filter(i => i.isRoot)[0];
      let selfConfig = JSON.parse(JSON.stringify(list)).filter(i => !i.isRoot);
      const ids = list.map(i => i.id);
      console.log(ids, "ids");
      let hasNoPidNode = false;
      // 删除pids没有id的节点
      selfConfig.forEach(i => {
        if (i.pids.some(j => !ids.includes(j))) {
          hasNoPidNode = true;
          selfConfig = this.deleteNode(selfConfig, i);
        }
      });
      if (root) selfConfig.unshift(root);
      if (hasNoPidNode) return this.shakeDeleteNode(selfConfig);
      return selfConfig;
    },
    /**
     * 初始化 数据私有化
     */
    init() {
      this.selfConfig = JSON.parse(JSON.stringify(this.FlowConfig));
    },
    /**
     *  @param data  源数组一维数组
     *  @requires  tree 二维数组
     */
    transformTree(data) {
      return transToTreeDat(data);
    },
    setNodeName( node, selfConfig){
      
      return { node };
      
    },
    /**
     * 
     * 这里在点击某一个类型节点的处理
     */
    clickSelectBox(nextNode) {
      let { node, selfConfig } = this.getNodeFactory(nextNode);
      if(nextNode.type == 2){
        let i = 1;
        selfConfig.forEach((item)=> {
          if(item.type == 2){
            i++;
          }
        })
        node[0].title = node[0].title + i;
      }else if(nextNode.type == 4){
        let j = 1;
        selfConfig.forEach((item)=> {
          if(item.type == 4){
            j++;
          }
        })
        node[0].title = node[0].title + j;
      }      
      this.selfConfig = selfConfig.concat(node);
    },
    /**
     * 根据isRow去判断row或者rol
     */
    getNodeFactory(nextNode) {
      if (!nextNode.isRow) {
        let { node, selfConfig } = this.getColNode(nextNode);
        return { node, selfConfig };
      } else {
        let { node, selfConfig } = this.getRowNode(nextNode);
        return { node, selfConfig };
      }
    },
    /**
     * 获取row节点
     */
    getRowNode(nextNode) {
      let node = [new RowNode(nextNode)];
      let selfConfig = this.repickArr(node[0]);
      // this.clickNode(node[0]);
      return { node, selfConfig };
    },
    /**
     * 获取col节点
     */
    getColNode(nextNode) {
      
      let groupId = HashCode();
      let node = [
        new ConditionNode({ groupId, ...nextNode }),
        new ConditionNode({ groupId, ...nextNode })
      ];
      let repickConfig = {
        groupId: node[0].groupPid,
        id: node[0].id
      };
      let selfConfig = this.repickArr(repickConfig);
      this.locationScroll();
      return { node, selfConfig };
    },
    /**
     * 定位滚动条
     */
    locationScroll() {
      // window.location.hash = ".bottom-right-cover-line";
      let el = document.getElementsByClassName("dingflow-design")[0];
      setTimeout(() => {
        el.scrollLeft = el.scrollWidth - el.clientWidth + 340;
      }, 0);
    },
    /**
     * 重定位数组
     */
    repickArr(repickConfig) {
      ;
      let selfConfig = JSON.parse(JSON.stringify(this.selfConfig));
      selfConfig.forEach(i => {
        if (i.isRow) {
          if (i.groupId === repickConfig.groupId) {
            i.groupId = repickConfig.id;
          }
        } else {
          if (i.groupPid === repickConfig.groupId) {
            i.groupPid = repickConfig.id;
          }
        }
      });
      return selfConfig;
    },
    // 点击节点
    clickNode(nodeConfig) {
      
      this.currentNode = nodeConfig;
      this.$emit("clickNode", nodeConfig);
      this.isShowAttribute =  true;
    },
    //点击关闭节点
    closeNode(node) {
      let repickConfig = {};
      if (node.isRow) {
        repickConfig.groupId = node.groupId;
        repickConfig.id = node.id;
        let selfConfig = JSON.parse(JSON.stringify(this.selfConfig));
        this.selfConfig = this.deleteNode(selfConfig, node);
        this.repickDeleteArr(repickConfig);
      } else {
        this.deleteColNode(node);
      }
    },

    // 删除节点
    deleteNode(selfConfig, node) {
      selfConfig = selfConfig.map(i => i.id !== node.id && i).filter(Boolean);
      return selfConfig;
    },
    //单独删除col下node
    deleteColNode(node) {
      let selfConfig = JSON.parse(JSON.stringify(this.selfConfig));
      let nodeArr = selfConfig.filter(
        i => i.groupId === node.groupId && !i.isRow
      );
      let deleteArr = [];
      let repickConfig;
      if (nodeArr.length > 2) {
        //递归删除所有关联子节点
        deleteArr = [node];
        this.deleteLoop(selfConfig, node, deleteArr);
        repickConfig = {
          id: node.id,
          groupId: node.groupId
        };
      } else {
        //删除整个group
        let allCol = selfConfig
          .map(i => i.groupId === node.groupId && !i.isRow && i)
          .filter(Boolean);
        deleteArr = allCol;
        allCol.forEach(i => {
          this.deleteLoop(selfConfig, i, deleteArr);
        });
        repickConfig = {
          id: node.groupId,
          groupId: node.groupPid
        };
      }
      deleteArr.forEach(i => {
        selfConfig = this.deleteNode(selfConfig, i);
      });
      this.selfConfig = selfConfig;
      this.repickDeleteArr(repickConfig);
      return selfConfig;
    },
    // 循环遍历删除组下关联节点
    deleteLoop(selfConfig, node, deleteArr) {
      // 获取当前节点下所有关联节点
      let currentDeleteArr = selfConfig.filter(i => {
        if (i.isRow) {
          return i.groupId === node.id;
        } else {
          return i.groupPid === node.id || i.groupPid === node.groupId;
        }
      });
      if (currentDeleteArr.length) {
        currentDeleteArr.forEach(i => {
          deleteArr.push(i);
          this.deleteLoop(selfConfig, i, deleteArr);
        });
      } else {
        return;
      }
    },
    //判断是否是row
    judgeNodeIsRow(node) {
      return node.isRow;
    },
    //删除后重组数组
    repickDeleteArr(repickConfig) {
      let selfConfig = JSON.parse(JSON.stringify(this.selfConfig));
      selfConfig.forEach(i => {
        if (i.isRow && i.groupId === repickConfig.id) {
          i.groupId = repickConfig.groupId;
        } else if (!i.isRow && i.groupPid === repickConfig.id) {
          i.groupPid = repickConfig.groupId;
        }
      });
      this.selfConfig = selfConfig;
    },
    //绘制body
    drawBody(h, node) {
      // console.log('绘制节点方法drawBody', h, node)
      if (node.nextNode) {
        // console.log('11111111', FlowFactory.getFactory.bind(this, h, node.nextNode)())
        return FlowFactory.getFactory.bind(this, h, node.nextNode)();
      } else {
        return <div></div>;
      }
    },
    isShowMask(){
      if(this.modelType == 'see'){
        return <div class="mask"></div>
      }
    }
  },
  uuidFunction() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
          return v.toString(16);
      });
  },
  destroyed() {
    // EventBus.$off("nodeChange");
  },
  render(h) {
    let FlowConfig = JSON.parse(JSON.stringify(this.selfConfig));
    FlowConfig = this.transformTree(FlowConfig);  // 将一维数组转化为树状结构
    this.cacheData = FlowConfig;
    const root = JSON.parse(JSON.stringify(this.selfConfig[0]));
    const scale = `transform: scale(${this.scaleVal/100})`
    return (
      <div class="design-engine">
        <div class="dingflow-design">
          <div class="ie-polyfill-container">
            <div class="box-scale" id="box-scale" style={scale}>
              {RowFactory.nodeWrapRender.bind(this, h, root)()}
              {this.drawBody(h, FlowConfig[0])}
              <div class="end-node">
                <div class="end-node-circle"></div>
                <div class="end-node-text">流程结束</div>
              </div>
            </div>
             {this.isShowMask()}
          </div>
        </div>
      </div>
    );
  }
};
</script>

<style scoped lang="less">
.design-engine {
 position: relative;
  height: 93%;
  max-height: 700px;
  width: 100%;
  overflow: auto;
  .dingflow-design {
    width: 100%;
    // background-color: #f5f5f7;
    // overflow: auto;
    height: 100%;
    position: relative;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    /deep/ .ant-popover-arrow {
      display: none !important;
    }
    .ie-polyfill-container {
      display: -ms-grid;
      -ms-grid-columns: min-content;
      .box-scale {
        transform: scale(1);
        display: inline-block;
        position: relative;
        width: 100%;
        padding: 54.5px 0;
        -webkit-box-align: start;
        -ms-flex-align: start;
        align-items: flex-start;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        -ms-flex-wrap: wrap;
        flex-wrap: wrap;
        min-width: -webkit-min-content;
        min-width: -moz-min-content;
        min-width: min-content;
        // background-color: #f5f5f7;
        -webkit-transform-origin: 0 0 0;
        transform-origin: 50% 0px 0px;
        .end-node {
          border-radius: 50%;
          font-size: 14px;
          color: rgba(25, 31, 37, 0.4);
          text-align: left;
          .end-node-circle {
            width: 10px;
            height: 10px;
            margin: auto;
            border-radius: 50%;
            background: #dbdcdc;
          }
          .end-node-text {
            margin-top: 5px;
            text-align: center;
          }
        }
      }
      .mask {
        z-index: 999;
            position: absolute;
            top: 0;
            width: 100%;
            height: 100%;
        
      }
    }
  }
}
</style>
