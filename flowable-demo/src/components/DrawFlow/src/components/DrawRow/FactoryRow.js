/**
 * @author 高丽萍
 * @time 2022-6-30
 * @dec row节点包裹框
 */
import "./row.less";
import drawFlow from "../factory";
export default {
  /**
   *
   * @param {creatElement} h
   * @param {Object} nodeConfig
   */
  nodeWrapRender(h, nodeConfig) {
    let tep = [];
    console.log('2222222222nodeConfig', nodeConfig)
    tep.push(
      <div class="node-wrap">
        <flow-node
          {...{
            props: { nodeConfig },
            on: {
              clickNode: this.clickNode,
              closeNode: this.closeNode
            }
          }}
        ></flow-node>
        <add-node-btn
          {...{
            props: { belongToNode: nodeConfig },
            on: {
              clickSelectBox: this.clickSelectBox
            }
          }}
        ></add-node-btn>
      </div>
    );
    if (nodeConfig.isRoot) {
      return tep;
    }
    if (nodeConfig.nextNode) {
      let el = drawFlow.getFactory.bind(this, h, nodeConfig.nextNode)();
      tep.push(el);
    }
    return tep;
  }
};
// 思路：
// 1.定义一个tep
// 2.通过在这个tip里面添加div，div包裹了flow-node，这个是节点dom ，另外一个add-node-btn，这个是按钮
// 这个flow-node 是通过传入当前节点的数据，然后生成一系列的dom
// 3.还得判断这个是否有孩子节点，如果有的话，则进行递归的处理
