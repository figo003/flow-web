
export function compose(...funcs) {
    if (funcs.length === 0) {
      return arg => arg;
    }
    if (funcs.length === 1) {
      return funcs[0];
    }
    return funcs.reduce((a, b) => (...args) => a(b(...args)));
  }

  /**
   * 转化为el-tree树形结构数据
   */
  export function transToTreeDat(arr) {

    let list = arr;
    let colNodes = list.filter(i => !i.isRow);
    let colNodesGroup = getColNode(colNodes);
    let allNodes = list.concat(colNodesGroup);
    let tree = transTree(allNodes);
    getPidArr(arr);
    return tree;
  }
  export function getColNode(colNodeArrs) {

    let colNodes = colNodeArrs;
    let map = {};
    colNodes.forEach(i => {
      if (!map[i.groupId]) {
        map[i.groupId] = [];
      }
      map[i.groupId].push(i);
    });
    let colNodesArr = [];
    for (const groupId in map) {
      let obj = {
        id: groupId,
        groupId: map[groupId][0].groupPid,
        nodeType:"exclusiveGateway",
        isRow: true,
        branchNodes: map[groupId]
      };
      colNodesArr.push(obj);
    }
    return colNodesArr;
  }
  /**
   *
   * @param {allNodes} arr 所有的整行元素
   * @param {*} list  所有的节点元素
   */
  export function getPidArr(list) {
    let colNodes = list.filter(i => !i.isRow);
    let rowNodes = list.filter(i => i.isRow);
    let colNodesGroup = getColNode(colNodes, list);
    let arr = colNodesGroup.concat(rowNodes);
    let map = {}; //所有整行元素的字典对象
    for (let item of arr) {
      map[item.id] = item;
    }
    //获取节点所在行
    for (let lis of list) {
      lis.pids = [];
      if (!lis.isRow) {
        let p = map[lis.groupPid];
        if (lis.groupPid === "root") {
          lis.pids.push(p.id);
          continue;
        }
        //当上一层为rowNode
        getColPid(p, lis);
      } else {
        let p = map[lis.groupId];
        getRowPid(p, lis);
      }
    }
  }
  //获取row的父节点id
  function getRowPid(p, lis) {

    if (!p) {
      lis.pids.push(lis.groupId);
    } else {
      if (p.branchNodes) {
        p.branchNodes.forEach(i => {
          loopGetPid(i, lis);
        });
      } else {
        lis.pids.push(p.id);
      }
    }
  }
  /**
   * 获取col节点的父节点
   */
  function getColPid(p, lis) {
    if (!p) {
      //当上一层为条件框元素
      lis.pids.push(lis.groupPid);
    } else {
      //当上一层为整行元素
      loopGetPidCol(p, lis);
    }
  }
  /**
   *
   * @param {*} parentRow
   * @param {*} lis
   * 单独处理一下col节点
   */
  export function loopGetPidCol(parentRow, lis) {

    if (parentRow.branchNodes) {
      parentRow.branchNodes.forEach(i => {
        loopGetPid(i, lis);
      });
    } else {
      lis.pids.push(parentRow.id);
    }
  }
  /**
   *  轮询节点获取pid
   * @param {*} node
   * @param {*} lis
   */
  export function loopGetPid(node, lis) {

    if (node.nextNode) {
      loopGetPid(node.nextNode, lis);
    } else if (node.branchNodes) {
      node.branchNodes.forEach(i => {
        loopGetPid(i, lis);
      });
    } else {
      lis.pids.push(node.id);
    }
  }
  /**
   * 转化为el-tree树形结构数据
   */
  export function transTree(arr) {
    let list = arr;
    if (!list || !list.length) return [];
    let map = {};
    for (let item of list) {
      map[item.id] = item;
    }
    let nodes = [];
    for (let lis of list) {
      if (!lis.isRow) {
        continue;
      }
      let p = map[lis.groupId];
      if (!p) {
        nodes.push(lis);
        continue;
      }
      p.isParent = true;
      p.nextNode || (p.nextNode = {});
      p.nextNode = lis;
      if (
        p.nextNode.branchNodes &&
        // TODO "流转至" 应单独写配置文件
        p.nextNode.branchNodes[0].type === "6"
      ) {
        p.isFlowTo = true;
      }
    }
    return nodes;
  }
  /**
   * Hash 哈希值
   */
  export function HashCode(hashLength) {
    // 默认长度 24
    return (
      "a" +
      Array.from(Array(Number(hashLength) || 15), () =>
        Math.floor(Math.random() * 36).toString(36)
      ).join("")
    );
  }
  /**
   * 树结构转化为扁平化结构
   */
  export function deepTraversal(tree) {
    let list = [];
    tree.forEach(item => {
      const loop = data => {
        list.push(data);
        let nextNode = []
        data.nextNode ? nextNode.push(data.nextNode): [];
        nextNode &&
        nextNode.length &&
        nextNode.forEach(child => {
            loop(child);
          });
      };
      loop(item);
    });
    return list;
  }

  /** 方法思路：
  *  1.找到当前加签的节点
  *  2.判断是向前，向后加签
  *  3.如果是向前加签的话，创建两个节点数据
  *  3.1 第一个节点： 跟第一个节点也一样，不一样的有：节点名称，节点id，节点pid，回退的节点等
  *  3.2 第二个节点： 跟第一个节点一样
  *  3.3 第一个节点，和第二个节点链接在一起
  *  4.将这些个节点组装起来，两边在list以及processNode里面
    */
  /**
  * 向前向后加签
  * @param {加签的类型 1：向前加签 2：向后加签} type
  * @param {当前节点key } taskDefKey
  * @param {被选中的加签的人的姓名} selectUserName
  * @param {流程图的数据json} json
  */
  export function renderJson(type, taskDefKey, selectUserName, json){

     // 当前加签的节点，以及加签后面的一个节点
     let currentIndex = 0
     let currentNode = {}
     let nextNode = {}
     json.list.forEach((item ,index) => {
         if(item.id == taskDefKey){
             currentIndex = index
             currentNode = item
         }
         if(item.groupId == taskDefKey){
             nextNode = item
         }
     });
     // 向前加签
     if(type == 1){
         let firstNode =  Object.assign({},currentNode) // 加签的节点
         let secondNode =  Object.assign({},currentNode) // 回到新原节点
         // 加签的节点
         firstNode.id = HashCode();
         firstNode.assignee = selectUserName.toString();
         firstNode.nodeName = selectUserName.toString();
         firstNode.title = currentNode.title + '-向前加签';
         firstNode.groupId = currentNode.id;
         firstNode.rejectKey = currentNode.id;
         // 回到原节点
         secondNode.id = HashCode();
         secondNode.assignee = currentNode.assignee;
         secondNode.nodeName = currentNode.nodeName;
         secondNode.title = currentNode.title
         secondNode.groupId = firstNode.id
         secondNode.rejectKey = firstNode.id
         // 判断是否有孩子节点，如果有孩子节点的话（将第二个节点与后面的节点进行关联）
         if(nextNode.groupId){
             nextNode.groupId = secondNode.id;
             nextNode.rejectKey = secondNode.id;
         }
         json.list.splice(currentIndex + 1, 0, firstNode, secondNode);
         let newList = JSON.parse(JSON.stringify(json.list));
         json.processNode = transToTreeDat(json.list)[0]
         json.list = newList
         return {json, currentNode, firstNode, secondNode }
     }else { // 向后加签
         let addNode =  Object.assign({},currentNode) // 加签的节点
         // 加签的节点
         addNode.id = HashCode();
         addNode.assignee = selectUserName.toString();
         addNode.nodeName = selectUserName.toString();
         addNode.title = currentNode.title + '-向后加签';
         addNode.groupId = currentNode.id;
         addNode.rejectKey = currentNode.id;

         if(nextNode.groupId){ // （将加签的节点与后面的节点进行关联）
             nextNode.groupId = addNode.id;
             nextNode.rejectKey = addNode.id;
         }
         json.list.splice(currentIndex + 1, 0, addNode);
         let addNewList = JSON.parse(JSON.stringify(json.list));
         json.processNode = transToTreeDat(json.list)[0]
         json.list = addNewList
         return {json, currentNode, addNode}
     }
 }
