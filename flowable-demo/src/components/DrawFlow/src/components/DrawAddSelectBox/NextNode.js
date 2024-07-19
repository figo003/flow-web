/**
 * @author 肖阳
 * @time 2020-9-10
 * @dec 下一节点属性
 */
export class NextNode {
  constructor({ id, prevId, type, nodeType, title, rejectKey, completionCondition, userType, attribute, isRow }) {
    this.id = id;
    this.prevId = prevId;
    this.type = type;
    this.isRow = isRow;
    this.nodeType = nodeType;
    this.title = title;
    this.rejectKey = rejectKey;
    this.userType = userType;
    this.attribute = attribute;
    this.completionCondition = completionCondition;
  }
}
