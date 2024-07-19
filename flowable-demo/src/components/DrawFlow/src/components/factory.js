import RowFactory from "./DrawRow/FactoryRow";
import ColFactory from "./DrawCol/FactoryCol";
function getFactory(h, item) {
  console.log('绘制节点方法drawBody', h, item)
  // ;
  let tep = [];
  
  // 这个type用来判断里面是否有条件的
  if (item.nodeType === "exclusiveGateway") {
    
    //多节点
    tep.push(ColFactory.branchBoxRender.bind(this, h, item)());
    if (item.nextNode) {
      tep.push(getFactory.bind(this, h, item.nextNode)());
    }
  }
  if (item.nodeType !== "exclusiveGateway") {
    tep.push(RowFactory.nodeWrapRender.bind(this, h, item)());
  }
  return tep;
}
export default {  getFactory };


// 思路：
// 参数： h： item：就是TreeNode结构数据
// 定义一个空数组tep
// 判断当前节点类型type? route
// 1.根节点的话 ：tep.push(getFactory.bind(this, h, item.nextNode)());
//   这里的根节点的意思： 当前的下一级是有分支的（条件分支）
// 2.不是根节点： tep.push(RowFactory.nodeWrapRender.bind(this, h, item)());
// 最后返回这个数据tep
// 注意： 这个tep最后是一个dom结构