<!--
* @author 肖阳
* @time 2020-9-10
* @dec 添加新增节点按钮
-->
<script>
/* eslint-disable no-unused-vars */
import "./addBox.less";
import { NextNode } from "./NextNode";
export default {
  name: "AddBox",
  props: {
    nodeConfig: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      boxArr: [
        {
          type: "2",
          nodeType: 'userTask',
          value: "审批人",
          isRow: true,
          calssName: "approver",
          icon: "el-icon-user"
        },
        {
          type: "4",
          nodeType: 'userTask',
          value: "抄送人",
          isRow: true,
          calssName: "notifier",
          icon: "el-icon-edit"
        },
        {
          type: "3",
          nodeType: 'exclusiveGateway',
          value: "条件分支",
          isRow: false,
          calssName: "route",
          icon: "el-icon-s-operation"
        }
      ]
    };
  },
  methods: {
    clickSelectBox(item) {
      this.getNexttBox(item);
    },
    getNexttBox(item) {
      const nodeConfig = this.nodeConfig;
      let { id, prevId } = Object.assign(nodeConfig, item);
      let { type, isRow, value, nodeType, rejectKey, completionCondition, userType, attribute } = item;
      let nextNode = new NextNode({ id, prevId, type, nodeType, title:value, rejectKey, completionCondition: type == 4 ? '${nrOfCompletedInstances/nrOfInstances >= 1}':'' , userType, attribute, isRow });
      this.$emit("clickSelectBox", nextNode);
    },
    renderAddSBox() {
      return (
        <div class="add-node-popover">
          <div class="add-node-popover-body">
            {this.boxArr.map(item => {
              return (
                <a
                  onClick={() => {
                    this.clickSelectBox(item);
                  }}
                  class={["add-node-popover-item", item.calssName]}
                >
                  <div class="item-wrapper">
                    <i class={`iconfont ` + item.icon}></i>
                  </div>
                  <span>{item.value}</span>
                </a>
              );
            })}
          </div>
        </div>
      );
    }
  },
  render() {
    return this.renderAddSBox();
  }
};
</script>
