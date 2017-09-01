'use strict';
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
var Work = {
  nodes: [
    {
      op_type: "Op_Add",
      flow: {
        x: 100, y: 50, w: 150, h: 100, c: 0
      },
      input: [
        {
          type: "ElementType_FromResult",
          node: { x: 90, y: 100, r: 10, to: -1 },
          value: {
            id: "id2",
            layerId: ""
          }
        },
        {
          type: "ElementType_Double",
          node: { x: 90, y: 60, r: 10, to: -1 },
          value: 12
        }
      ],
      outputAttr: {
        node: { x: 250, y: 100, r: 15 },
        cached: true,
        saveToFile: false,
        saveToAccu: false,
        resultId: ""
      }
    }
  ]
}
function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var initState = {
  lisenter: {
    moveId: -1, // 移动的node id
    moveToId: -1, // 移动指向的node id
    moveStart: false,
    changeNodeSize: false,
    changeNodeId: -1,
    moveInId: -1, // 移动node的input id
    moveInStart: false,
    moveOutStart: false,
    moveInToLoction: -1
  },
  nodes: Work.nodes,
  outNode: {
    x: -200, // 鼠标移动时基于svg的位置
    y: -200,
    mx: 0, // 鼠标相对于node位置的偏移量
    my: 0
  },
  dialog: {
    isShow: false,
    nodeId: 0,
    node: Work.nodes[0]
  },
  result: {
    id: -1,
    name: '',
    runState: 0, // 0未执行，1正在执行，2已经执行（有结果）,3已经取回结果,4 失败
    progress: 0,
    progressState: 'active', // [exception]错误
    detail: [],
    result: null
  },
  height: window.innerHeight - 70 - 30 - 30
};

var moveStart = function moveStart(state, id, mx, my) {
  // 开启node移动
  var lisenter = state.lisenter;
  var outnode = state.outNode;
  if (id > -1) {
    var x = state.nodes[id].flow.x;
    var y = state.nodes[id].flow.y;
    outnode.mx = mx - x;
    outnode.my = my - y;
  }
  lisenter.moveStart = true;
  lisenter.moveId = id;
  return _extends({}, state, {
    lisenter: lisenter,
    outNode: outnode
  });
};
var moveNode = function moveNode(state, x, y) {
  var lisenter = state.lisenter;
  var id = lisenter.moveId;
  var mx = state.outNode.mx;
  var my = state.outNode.my;
  if (id > -1) {
    var nodes = state.nodes;
    // 在数据中移动xy以及附属点的xy
    nodes[id] = flowMove(x - mx, y - my, nodes[id]);
    return _extends({}, state, {
      nodes: [].concat(_toConsumableArray(nodes))
    });
  }
  return _extends({}, state);
};

var addDefaultNode = function addDefaultNode(state, x, y) {
  // 添加默认节点
  var node = CreatFlowNode(x, y, 200, 100);
  if (node) {
    var nodes = state.nodes;
    console.log('这是添加的一个node', node);
    return _extends({}, state, {
      nodes: [].concat(_toConsumableArray(nodes), [node])
    });
  }
  return _extends({}, state);
};
var addNode = function addNode(state, node) {
  // 添加节点
  if (node) {
    var nodes = state.nodes;
    return _extends({}, state, {
      nodes: [].concat(_toConsumableArray(nodes), [node])
    });
  }
  return _extends({}, state);
};
var delNode = function delNode(state, nid) {
  var nodes = state.nodes;
  var result = state.result; // 执行工作流时 屏蔽数据修改
  if (result.runState === 1) {
    return _extends({}, state);
  }
  nodes.map(function (item, i) {
    item.input.map(function (ite, im) {
      if (ite.type === 'ElementType_FromResult' && ite.node.to >= nid) {
        if (ite.node.to === nid) {
          nodes[i].input[im].node.to = -1;
        } else {
          nodes[i].input[im].node.to = nodes[i].input[im].node.to - 1;
        }
      }
    });
  });
  nodes.splice(nid, 1);
  return _extends({}, state, {
    node: nodes
  });
};
var moveEnd = function moveEnd(state) {
  // node移动结束
  var lisenter = state.lisenter;
  lisenter.moveStart = false;
  lisenter.moveId = -1;
  return _extends({}, state, {
    lisenter: lisenter
  });
};
var moveInStart = function moveInStart(state, id, Inid) {
  var type = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  // 开启input（type=0），output移动
  var lisenter = state.lisenter;
  if (Inid != -1) {
    lisenter.moveInStart = true;
    lisenter.moveId = id;
    lisenter.moveInId = Inid;
  } else {
    // 输出点移动
    console.log('尝试设定out移动');
    lisenter.moveOutStart = true;
    lisenter.moveId = id;
  }
  return _extends({}, state, {
    lisenter: lisenter
  });
};
var moveIn = function moveIn(state, x, y) {
  // 移动input
  var lisenter = state.lisenter;
  var outNode = state.outNode;
  if (lisenter.moveInStart && lisenter.moveId > -1) {
    // 正常的状态
    outNode.x = x;
    outNode.y = y;
  } else if (lisenter.moveOutStart) {
    outNode.x = x;
    outNode.y = y;
  }
  return _extends({}, state, {
    outNode: outNode
  });
};
var moveInEnd = function moveInEnd(state) {
  // 结束input移动
  var lisenter = state.lisenter;
  var outNode = state.outNode;
  var nodes = state.nodes;
  var iflow;
  var result = state.result; // 执行工作流时 屏蔽数据修改
  console.log('移动weizhi', lisenter.moveId, lisenter.moveInId);
  console.log('移动weizhi loc', lisenter.moveInToLoction);
  if (lisenter.moveInStart && lisenter.moveInId > -1) {
    // 检测是否处于移动状态
    if (lisenter.moveInToLoction > -1 && lisenter.moveId === lisenter.moveToId) {
      // input移动位置
      iflow = getLocation(nodes[lisenter.moveId].flow.x, nodes[lisenter.moveId].flow.y, nodes[lisenter.moveId].flow.w, nodes[lisenter.moveId].flow.h, outNode.x, outNode.y, lisenter.moveInToLoction, nodes[lisenter.moveId].input[lisenter.moveInId].node.r);
      console.log('移动位置', iflow.x, iflow.y);
      nodes[lisenter.moveId].input[lisenter.moveInId].node.x = iflow.x;
      nodes[lisenter.moveId].input[lisenter.moveInId].node.y = iflow.y;
    } else if (lisenter.moveToId > -1 && result.runState !== 1) {
      // input移动到输出
      if (nodes[lisenter.moveId].input[lisenter.moveInId].type === 'ElementType_FromResult') {
        // 确认是否属于接受返回的input节点
        if (lisenter.moveToId === lisenter.moveId) {
          // 当同一个node的in移向out则，消除链接
          nodes[lisenter.moveId].input[lisenter.moveInId].node.to = -1;
        } else {
          // 确认链接
          console.log("nodes[lisenter.moveToId]",nodes,lisenter.moveToId)
          nodes[lisenter.moveId].input[lisenter.moveInId].node.to = lisenter.moveToId;
          nodes[lisenter.moveId].input[lisenter.moveInId].value.resultId = nodes[lisenter.moveToId].outputAttr.resultId;
        }
      }
    }
  } else if (lisenter.moveInToLoction > -1 && lisenter.moveOutStart && lisenter.moveId > -1 && lisenter.moveId == lisenter.moveToId) {
    // 输出移动位置
    console.log("移动shuchu位置")
    iflow = getLocation(nodes[lisenter.moveId].flow.x, nodes[lisenter.moveId].flow.y, nodes[lisenter.moveId].flow.w, nodes[lisenter.moveId].flow.h, outNode.x, outNode.y, lisenter.moveInToLoction, nodes[lisenter.moveId].outputAttr.node.r);
    nodes[lisenter.moveId].outputAttr.node.x = iflow.x;
    nodes[lisenter.moveId].outputAttr.node.y = iflow.y;
  }
  return _extends({}, state, {
    lisenter: {
      moveId: -1,
      moveStart: false,
      changeNodeSize: false,
      changeNodeId: -1,
      moveInId: -1,
      moveInStart: false,
      moveOutStart: false,
      moveInToLoction: -1,
      moveToId: -1
    },
    nodes: nodes,
    outNode: {
      x: -200,
      y: -200
    }
  });
};
var moveInToOUT = function moveInToOUT(state, toNid, type,loc) {
  var loc = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : -1;
  console.log("移入四边检测",type)
  // 移入四边检测
  if (type !== 0) {
    // 处理输入/输出 移动位置
    return MoveInToL(state, toNid, loc);
  } else {
    // 处理输入移动到输出
    var lisenter = state.lisenter;
    lisenter.moveToId = toNid;
    lisenter.moveInToLoction = loc;
    return _extends({}, state, {
      lisenter: lisenter
    });
  }
};
var MoveInToL = function MoveInToL(state, toNid, loc) {
  var lisenter = state.lisenter;
  lisenter.moveToId = toNid;
  lisenter.moveInToLoction = loc;
  return _extends({}, state, {
    lisenter: lisenter
  });
};
var showModal = function showModal(state, isShow) {
  var nodeId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  // 开关 对话框
  var dialog = state.dialog;
  var node = state.nodes[nodeId];
  var result = state.result; // 执行工作流时 屏蔽数据修改
  if (result.runState === 1) {
    return _extends({}, state);
  }
  dialog.isShow = isShow;
  dialog.node = JSON.parse(JSON.stringify(node));
  console.log('new Moalnode', dialog.node);
  dialog.nodeId = nodeId;
  return _extends({}, state, {
    dialog: dialog
  });
};
var startChangeNode = function startChangeNode(state, isChange, id) {
  //
  var lisenter = state.lisenter;
  lisenter.changeNodeSize = isChange;
  lisenter.changeNodeId = id;
  console.log('START_CHANGE_NODE', lisenter);
  return _extends({}, state, {
    lisenter: lisenter
  });
};
var changeNodeSize = function changeNodeSize(state, x, y) {
  // 修改node的图形大小
  var nodes = state.nodes;
  var lisenter = state.lisenter;
  var id = lisenter.changeNodeId;
  if (id > -1 && lisenter.changeNodeSize) {
    var node = nodes[id];
    var nW = x - node.flow.x;
    var nH = y - node.flow.y;
    if (nW > 100 && nH > 50) {
      // 最小不能小于100
      console.log('run IN test WH', nW, nH);
      var Onode = node.outputAttr.node;
      if (Onode.x > node.flow.x + node.flow.w) {
        // 位置L=1
        nodes[id].outputAttr.node.x = nW + Onode.r + node.flow.x;
      } else if (Onode.y > node.flow.y + node.flow.h) {
        // 位置L=2
        nodes[id].outputAttr.node.y = nH + Onode.r + node.flow.y;
      }
      nodes[id].flow.w = nW;
      nodes[id].flow.h = nH;
    }
  }
  return _extends({}, state, {
    nodes: nodes
  });
};
var changeModalData = function changeModalData(state,id,node) {
  state.nodes[id] = JSON.parse(JSON.stringify(node));
  return _extends({}, state);
};
var changeFormData = function changeFormData(state, type, datatype, v) {
  var iid = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : -1;
  // id用于确定type为input的id
  var dialog = state.dialog;
  var node = dialog.node;
  if (type === 'input') {
    switch (datatype) {
      case 'type':
        {
          node.input[iid].type = v;
          if (v === 'ElementType_Double') {
            var s = 0;
            node.input[iid].value = s;
            console.log('getchange node', node);
          } else if (v === 'ElementType_FromResult') {
            node.input[iid].value = {
              'id': 'id3',
              'resultId': '200001_200102_Add'
            };
          } else if (v === 'ElementType_Rster') {
            node.input[iid].value = {
              id: 'id4',
              metadata: {
                parameters: 'NDVI',
                spatialArea: 'LoessPlateau',
                spatialResolution: '1km',
                temporalResolution: '1mon',
                product: 'MODIS',
                startDate: '200001'
              }
            };
          } else {
            node.input[iid].value = {
              metadata: {
                spatialArea: 'Shanbei',
                tableName: 'AutoStationData', // 多选
                startDate: '20100101',
                endDate: '20121231',
                columns: 'DYP', // 暂时一个 未来多选
                stationType: 'HydrologyStation' // 多选 水利  气象
              },
              interval: 'Interval_1year',
              summaryType: 'Summary_Max' // 多选
            };
          }
        }
        break;
      case 'value':
        node.input[iid].value = parseInt(v);
        break;
      case 'parameters':
        node.input[iid].value.metadata.parameters = v;
        break;
      case 'spatialArea':
        node.input[iid].value.metadata.spatialArea = v;
        break;
      case 'tableName':
        node.input[iid].value.metadata.tableName = v;
        break;
      case 'spatialResolution':
        node.input[iid].value.metadata.spatialResolution = v;
        break;
      case 'temporalResolution':
        node.input[iid].value.metadata.temporalResolution = v;
        break;
      case 'product':
        node.input[iid].value.metadata.product = v;
        break;
      case 'startDate':
        node.input[iid].value.metadata.startDate = v;
        break;
      case 'endDate':
        node.input[iid].value.metadata.endDate = v;
        break;
      case 'columns':
        node.input[iid].value.metadata.columns = v;
        break;
      case 'stationType':
        node.input[iid].value.metadata.stationType = v;
        break;
      case 'interval':
        node.input[iid].value.interval = v;
        break;
      case 'summaryType':
        node.input[iid].value.summaryType = v;
        break;
      default:
        break;
    }
  } else if (type === 'output') {
    switch (datatype) {
      case 'cached':
        node.outputAttr.cached = v;
        break;
      case 'saveToFile':
        node.outputAttr.saveToFile = v;
        break;
      case 'saveToAccu':
        node.outputAttr.saveToAccu = v;
        break;
      case 'resultId':
        node.outputAttr.resultId = v;
        break;
    }
  } else if (type === 'node') {
    if (datatype === 'op_type') {
      node.op_type = v;
      if (v === 'Op_CURD') {
        node.modelParam = {
          threshold: 0.0,
          isMin: true
        };
      } else if (v === 'Op_TOPN') {
        node.modelParam = {
          topN: 2,
          isMax: true
        };
      } else if (v === 'Op_Anomaly') {
        node.modelParam = {
          summaryParam: {
            summaryType: 'SummaryType_Avg'
          }
        };
      }
    } else if (datatype === 'name') {
      node.name = v;
    } else if (datatype === 'threshold') {
      node.modelParam.threshold = Number(v);
    } else if (datatype === 'isMin') {
      node.modelParam.isMin = v;
    } else if (datatype === 'topN') {
      node.modelParam.topN = Number(v);
    } else if (datatype === 'isMax') {
      node.modelParam.isMax = v;
    } else if (datatype === 'summaryType') {
      node.modelParam.summaryParam.summaryType = v;
    }
  }
  dialog.node = JSON.parse(JSON.stringify(node));
  return _extends({}, state, {
    dialog: dialog
  });
};
var opModalIOput = function opModalIOput(state, optype, nid) {
  // 修改node的输出
  var dialog = state.dialog;
  var node = dialog.node;
  var inputs = node.input.length;
  if (optype === 'ADD') {
    var vinput = JSON.parse(JSON.stringify(node.input[inputs - 1]));
    var x = vinput.node.x - node.flow.x;
    var y = vinput.node.y - node.flow.y;
    if (x > 0 && y < 0) {
      vinput.node.x = vinput.node.x + vinput.node.r * 2;
    } else if (x < vinput.node.w && y > 0) {
      vinput.node.y = vinput.node.y + vinput.node.r * 2;
    } else if (x > 0 && y > node.flow.h) {
      vinput.node.x = vinput.node.x + vinput.node.r * 2;
    } else if (x < 0 && y > 0) {
      vinput.node.y = vinput.node.y + vinput.node.r * 2;
    }

    // Todo:计算新的node位置 最后一个节点位置向后添加一
    node.input.push(vinput);
  } else if (optype === 'DEL') {
    if (node.input.length > 1) {
      node.input.splice(nid, 1);
    }
  }
  return _extends({}, state, {
    dialog: dialog
  });
};
var startRun = function startRun(state, nodes) {
  // 提交数据到服务器，准备执行。
  nodes.map(function (item, i) {
    item.id = i;
  });
  console.log('post data', JSON.stringify({ nodes: nodes }));
  var request = new Request(URLwork + 'flow', {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify({ nodes: nodes })
  });
  fetch(request).then(function (res) {
    return res.json();
  }).then(function (json) {
    var re = state.result;
    re.runState = 1;
    re.progress = 0;
    re.id = json.id;
    re.name = json.name;
    return _extends({}, state, {
      result: re
    });
  }).catch(function (e) {
    return _extends({}, state);
  });
};

var getResult = function getResult(state, id) {
  var URL = URLwork + 'result?id=' + id;
  Fetch(fetch(URL).then(function (response) {
    return response.json();
  }).then(function (data) {
    if (data.code === 200) {
      var result = state.result;
      result.result = data;
      result.runState = 3;
      return _extends({}, state, {
        result: result
      });
    } else {
      return _extends({}, state, {
        result: null
      });
    }
  }).catch(function (e) {
    return console.log('Oops, error', e);
  }), URLTimeOut).then(function (res) {}, function (e) {
    return _extends({}, state, {
      result: null
    });
  });
};
var getProgress = function getProgress(state, id) {
  var URL = URLwork + 'progress?id=' + id;
  var result = state;
  Fetch(fetch(URL).then(function (response) {
    return response.json();
  }).then(function (data) {
    if (data.code === 200) {
      if (data.state === 'DoneState') {
        result.runState = 2; // 继续执行 获取结果
        result.progressState = 'success';
        result.progress = 1;
      } else if (data.state === 'FailedState') {
        result.runState = 4; // todo:错误处理
        result.progressState = 'exception';
        result.progress = data.progress;
      } else if (data.state === 'RunningState') {
        // 正确代码执行时在
        result.runState = 1;
        result.progressState = 'active';
        result.progress = data.progress;
      } else {
        // else if(data.state=='AwaitingState'){//服务器对进程占用时拒绝请求时 在开启此代码
        //   alert('进程占用，等会再试');
        //   result.runState = 0;
        // }
        result.progress = data.progress;
      }
      return _extends({}, state, {
        result: result
      });
    } else {
      return _extends({}, state);
    }
  }).catch(function (e) {
    return console.log('Oops, error', e);
  }), URLTimeOut).then(function (res) {}, function (e) {
    return _extends({}, state);
  });
};
var getProgressDetails = function getProgressDetails(state, id) {
  var URL = URLwork + 'progressdetails?id=' + id;
  return function (dispatch, getState) {
    Fetch(fetch(URL).then(function (response) {
      return response.json();
    }).then(function (data) {
      if (data.code === 200) {
        var result = state.result;
        var nodes = state.nodes;
        data.map(function (item, i) {
          if (item.progress === 0) {
            nodes[i].flow.c = 0;
          } else if (item.progress === 1) {
            if (item.state === 'DoneState') {
              nodes[i].flow.c = 1;
            } else {
              nodes[i].flow.c = 3;
            }
          } else {
            nodes[i].flow.c = 2;
          }
        });
        result.detail = data;
        return _extends({}, state, {
          nodes: nodes,
          result: result
        });
      } else {
        return _extends({}, state);
      }
    }).catch(function (e) {
      return console.log('Oops, error', e);
    }), URLTimeOut).then(function (res) {}, function (e) {
      return _extends({}, state);
    });
  };
};
var reSetNodes = function reSetNodes(state, value) {
  var nodes = state.nodes;
  nodes = value.nodes;
  return _extends({}, state, {
    nodes: nodes
  });
};
var changeBrowser = function changeBrowser(state) {
  var height = window.innerHeight - 130;
  return _extends({}, state, {
    height: height
  });
};

var WorkActions ={
  addDefaultNode: addDefaultNode,
  addNode: addNode,
  delNode: delNode,
  moveNode: moveNode,
  moveStart: moveStart,
  moveEnd: moveEnd,
  moveInStart: moveInStart,
  moveIn: moveIn,
  moveInEnd: moveInEnd,
  moveInToOUT: moveInToOUT,
  showModal: showModal,
  startChangeNode: startChangeNode,
  changeNodeSize: changeNodeSize,
  changeModalData: changeModalData,
  changeFormData: changeFormData,
  opModalIOput: opModalIOput,
  startRun: startRun,
  getResult: getResult,
  getProgress: getProgress,
  getProgressDetails: getProgressDetails,
  reSetNodes: reSetNodes,
  changeBrowser: changeBrowser
};
//以下是节点移动处理//////////////////////////////////////////////////////////////////////////////////////
const CreatFlowNode = (x = 600, y = 50, w = 100, h = 100, inL = 0, outL = 3, inr = 10, outr = 15) => {
  var inx = inL % 2 == 0
    ? x + w / 2
    : (inL % 3 == 1
      ? x - inr
      : x + w + inr)
  var iny = inL % 2 == 1
    ? y + h / 2
    : (inL % 4 == 0
      ? y - inr
      : y + h + inr)
  var outx = outL % 2 == 0
    ? x + w / 2
    : (outL % 3 == 1
      ? x
      : x + w)
  var outy = outL % 2 == 1
    ? y + h / 2
    : (outL % 4 == 0
      ? y
      : y + h)
  return ({
    op_type: 'Op_Add',
    flow: {
      x: x,
      y: y,
      w: w,
      h: h,
      c: 0
    },
    input: [
      {
        type: 'ElementType_FromResult',
        node: {
          x: inx,
          y: iny,
          r: inr,
          to: -1
        },
        value: {
          id: 'id2',
          layerId: ''
        }
      }
    ],
    outputAttr: {
      node: {
        x: outx,
        y: outy,
        r: outr
      },
      cached: true,
      saveToFile: false,
      saveToAccu: false,
      resultId: 'test'
    }
  })
};
//获取连接线/////////////////////////////////////
const GetLine = (x1, y1, x2, y2, r1, r2) => {
  var X = x2 - x1,Y = y2 - y1
  var Z = Math.sqrt(Math.pow(X, 2) + Math.pow(Y, 2))
  var a1 = X * r1 / Z
  var b1 = Y * r1 / Z
  var a2 = X * r2 / Z
  var b2 = Y * r2 / Z
   return {x1:x1+a1,y1:y1+b1,x2:x2-a2,y2:y2-b1}
};
//节点移动////////////////////////////////////////////
const flowMove = (x, y, node) => {
  var mx = x - node.flow.x
  var my = y - node.flow.y
  node.flow.x = x
  node.flow.y = y
  node.input.map((item, i) => {
      item.node.x = item.node.x + mx
      item.node.y = item.node.y + my
    })

  node.outputAttr.node.x += mx
  node.outputAttr.node.y += my
  return node
};
//获取点在上下左右////////////////////////////////////////////
const getLocation = (x, y, w, h, ox, oy, inL, inR = 10) => {
  console.log('new location', x, y, w, h, ox, oy, inL, inR)
  var inX = x
  var inY = y
  if (inL == 0) {
    inX = ox
    inY = inY - inR
  } else if (inL == 1) {
    inX = inX + w + inR
    inY = oy
  } else if (inL == 2) {
    inX = ox
    inY = inY + h + inR
  } else if (inL == 3) {
    inX = inX - inR
    inY = oy
  }
  return { x: inX, y: inY }
};