
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
