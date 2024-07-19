/**
 * @author 高丽萍
 * @time 2022-6-30
 * @dec col节点工厂
 */
import drawFlow from "../factory";

import "./layout.less";
function branchBoxRender(h, nodeArr) {
  let title = "添加条件";
  const colNodeArr = nodeArr.branchNodes;
  return (
    <div class="branch-wrap">
      <div class="branch-box-wrap">
        <div class="branch-box">
          <button onClick={() => this.addBranch(colNodeArr)} class="add-branch">
            {title}
          </button>
          {colBoxRender.bind(this, h, colNodeArr)()}
        </div>
        <add-node-btn
          {...{
            props: { belongToNode: nodeArr },
            on: { clickSelectBox: this.clickSelectBox }
          }}
        ></add-node-btn>
      </div>
    </div>
  );
}
/**
 * col-box
 */
function colBoxRender(h, colNodeArr) {
  return colNodeArr.map((item, idx) => {
    switch (idx) {
      case 0:
        return (
          <div class="col-box">
            <div class="top-left-cover-line"></div>
            <div class="bottom-left-cover-line"></div>
            {conditionNodeRender.bind(this, h, item)()}
          </div>
        );
      case colNodeArr.length - 1:
        return (
          <div class="col-box">
            {conditionNodeRender.bind(this, h, item)()}
            <div class="top-right-cover-line"></div>
            <div class="bottom-right-cover-line"></div>
          </div>
        );
      default:
        return (
          <div class="col-box">{conditionNodeRender.bind(this, h, item)()}</div>
        );
    }
  });
}
function closeNode(event, node) {
  event.stopPropagation();
  this.closeNode(node);
}
function conditionNodeRender(h, node) {
  
  const judegeNode = { ...node };
  
  console.log('1111judegeNode', judegeNode)
  let tep = [];
  tep.push(
    <div class="condition-node">
      <div class="condition-node-box">
        <div  class="auto-judge node_e27d_5719"  onClick={() => {
            this.clickNode(node);
          }}
        >
          <div class="sort-left"></div>
          <div class="title-wrapper">
            <span class="editable-title">{judegeNode.title}</span>
            <i  aria-label="icon: close"  tabindex="-1"  class="anticon anticon-close close">
              <i  class="el-icon-close" onClick={event => {closeNode.bind(this, event, node)();}}></i>
            </i>
          </div>
          <div class="content">{judegeNode.conditionExpression}</div>
        </div>
        <add-node-btn
          {...{
            props: { belongToNode: judegeNode },
            on: { clickSelectBox: this.clickSelectBox }
          }}
        ></add-node-btn>
      </div>
    </div>
  );

  if (node.nextNode) {
    let el = drawFlow.getFactory.bind(this, h, node.nextNode)();
    tep.push(el);
  }
  // let el = drawFlow.getFactory.bind(this, h, node)();
  // tep.push(el);
  return tep;
}
export default {
  branchBoxRender
};

// 思路：
// branchBoxRender方法：
// 1.参数nodeArr： 表示传入是根节点，他有一个字段isFlowTo: 判断是流转，还是分支
// 2.获取nodeArr.branchNodes 这个数组，去渲染对接的条件 调用colBoxRender方法
// 3.这个方法返回的dom：一个点击条件的按钮，一个条件弹框，一个加号的节点，这里还有belongToNode，这个字段？？？？？

//colBoxRender方法：
// 1.就是渲染条件里面的分支，做了三个判断
// 2. 第一个渲染最左边
// 3. 最后一个渲染最右边
// 4. 其他都按着顺序渲染中间 
// 5. 三种渲染里面的节点渲染都是用conditionNodeRender 方法


// conditionNodeRender方法：
// 里面返回的是条件的dom结构
// 如果当前这个节点有子节点，同样也是有一个递归drawFlow.getFactory.bind(this, h, node.nextNode)();




