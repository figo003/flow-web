/* eslint-disable no-unused-vars */
/**
 * @author 肖阳
 * @time 2020-9-10
 * @dec 各种节点类
 */
import { HashCode } from "../../utils";
export class Node {
  groupId;
  processMultiInstanceUsers;
  type;
  nextNode;
  title;
  nodeName;
  nodeType;
  branchNodes;
  constructor({ id, type, isRow, nodeType, title,  rejectKey, completionCondition, userType, attribute}) {
    this.groupId = id;
    this.id = HashCode();
    this.type = type;
    this.title = title;
    this.nodeName = '请选择';
    this.assignee = '';
    this.nodeType = nodeType;
    this.isRow = isRow;
    this.rejectKey = rejectKey;
    this.completionCondition = completionCondition;
    this.userType = userType;
    this.attribute = attribute
  }
}
export class ConditionNode {
  // data = {};
  constructor({ groupId, type, id, isRow, nodeType, title }) {
    this.id = HashCode();
    this.groupId = groupId;
    this.type = type;
    this.conditionExpression = '请设置';
    this.groupPid = id;
    this.title = title;
    this.nodeType = nodeType;
    this.nodeName = title;
    this.isRow = isRow;
  }
}
export class RowNode extends Node {
  // data = {};
  constructor({ id, type, isRow, nodeType, title, rejectKey, completionCondition, userType, attribute }) {
    super({ id, type, isRow, nodeType, title , rejectKey, completionCondition, userType, attribute});
  }
}
export class CopyNode {
  title = "标题";
  id = HashCode();
  nodeName = "内容";
  // data = {};
  constructor({ id, nextNode, ...node }) {
    return Object.assign(node, this);
  }
}
