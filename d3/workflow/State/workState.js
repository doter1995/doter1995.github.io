
const initState = {
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
}

const moveStart = (state, id, mx, my) => {  // 开启node移动
  var lisenter = state.lisenter
  var outnode = state.outNode
  if (id > -1) {
    const x = state.nodes[id].flow.x
    const y = state.nodes[id].flow.y
    outnode.mx = mx - x
    outnode.my = my - y
  }
  lisenter.moveStart = true
  lisenter.moveId = id
  return {
    ...state,
    lisenter: lisenter,
    outNode: outnode
  }
}
const moveNode = (state, x, y) => {
  const lisenter = state.lisenter
  const id = lisenter.moveId
  const mx = state.outNode.mx
  const my = state.outNode.my
  if (id > -1) {
    var nodes = state.nodes
    // 在数据中移动xy以及附属点的xy
    nodes[id] = flowMove(x - mx, y - my, nodes[id])
    return {
      ...state,
      nodes: [...nodes]
    }
  }
  return {
    ...state
  }
}

const addDefaultNode = (state, x, y) => { // 添加默认节点
  const node = CreatFlowNode(x, y, 200, 100)
  if (node) {
    var nodes = state.nodes
    console.log('这是添加的一个node', node)
    return {
      ...state,
      nodes: [
        ...nodes,
        node
      ]
    }
  }
  return {
    ...state
  }
}
const addNode = (state, node) => { // 添加节点
  if (node) {
    var nodes = state.nodes
    return {
      ...state,
      nodes: [
        ...nodes,
        node
      ]
    }
  }
  return {
    ...state
  }
}
const delNode = (state, nid) => {
  var nodes = state.nodes
  const result = state.result // 执行工作流时 屏蔽数据修改
  if (result.runState === 1) {
    return {
      ...state
    }
  }
  nodes.map((item, i) => {
    item.input.map((ite, im) => {
      if (ite.type === 'ElementType_FromResult' && ite.node.to >= nid) {
        if (ite.node.to === nid) {
          nodes[i].input[im].node.to = -1
        } else {
          nodes[i].input[im].node.to = nodes[i].input[im].node.to - 1
        }
      }
    })
  })
  nodes.splice(nid, 1)
  return {
    ...state,
    node: nodes
  }
}
const moveEnd = (state) => { // node移动结束
  var lisenter = state.lisenter
  lisenter.moveStart = false
  lisenter.moveId = -1
  return {
    ...state,
    lisenter: lisenter
  }
}
const moveInStart = (state, id, Inid, type = 0) => { // 开启input（type=0），output移动
  var lisenter = state.lisenter
  if (type === 0) {
    lisenter.moveInStart = true
    lisenter.moveId = id
    lisenter.moveInId = Inid
  } else { // 输出点移动
    console.log('尝试设定out移动')
    lisenter.moveOutStart = true
    lisenter.moveId = id
  }
  return {
    ...state,
    lisenter: lisenter
  }
}
const moveIn = (state, x, y) => { // 移动input
  var lisenter = state.lisenter
  var outNode = state.outNode
  console.log('正在移动', lisenter.moveInStart, lisenter.moveId)
  if (lisenter.moveInStart && lisenter.moveId > -1) {
    // 正常的状态
    console.log('正在移动', lisenter.moveOutStart)
    outNode.x = x
    outNode.y = y
  } else if (lisenter.moveOutStart) {
    outNode.x = x
    outNode.y = y
  }
  return {
    ...state,
    outNode: outNode
  }
}
const moveInEnd = (state) => { // 结束input移动
  var lisenter = state.lisenter
  var outNode = state.outNode
  var nodes = state.nodes
  var iflow
  const result = state.result // 执行工作流时 屏蔽数据修改
  console.log('移动位置', lisenter.moveId, lisenter.moveInId)
  if (lisenter.moveInStart && lisenter.moveInId > -1) {
    // 检测是否处于移动状态
    if (lisenter.moveInToLoction > -1 && lisenter.moveId === lisenter.moveToId) { // input移动位置
      iflow = getLocation(nodes[lisenter.moveId].flow.x,
        nodes[lisenter.moveId].flow.y,
        nodes[lisenter.moveId].flow.w,
        nodes[lisenter.moveId].flow.h,
        outNode.x, outNode.y,
        lisenter.moveInToLoction,
        nodes[lisenter.moveId].input[lisenter.moveInId].node.r)

      nodes[lisenter.moveId].input[lisenter.moveInId].node.x = iflow.x
      nodes[lisenter.moveId].input[lisenter.moveInId].node.y = iflow.y
    } else if (lisenter.moveToId > -1 && result.runState !== 1) { // input移动到输出
      if (nodes[lisenter.moveId].input[lisenter.moveInId].type === 'ElementType_FromResult') { // 确认是否属于接受返回的input节点
        if (lisenter.moveToId === lisenter.moveId) { // 当同一个node的in移向out则，消除链接
          nodes[lisenter.moveId].input[lisenter.moveInId].node.to = -1
        } else { // 确认链接
          nodes[lisenter.moveId].input[lisenter.moveInId].node.to = lisenter.moveToId
          nodes[lisenter.moveId].input[lisenter.moveInId].value.resultId = nodes[lisenter.moveToId].outputAttr.resultId
        }
      }
    }
  } else if (lisenter.moveInToLoction > -1 && lisenter.moveOutStart && lisenter.moveId > -1 && lisenter.moveId === lisenter.moveToId) { // 输出移动位置
    iflow = getLocation(nodes[lisenter.moveId].flow.x,
      nodes[lisenter.moveId].flow.y,
      nodes[lisenter.moveId].flow.w,
      nodes[lisenter.moveId].flow.h,
      outNode.x, outNode.y,
      lisenter.moveInToLoction,
      nodes[lisenter.moveId].outputAttr.node.r)
    nodes[lisenter.moveId].outputAttr.node.x = iflow.x
    nodes[lisenter.moveId].outputAttr.node.y = iflow.y
  }
  return {
    ...state,
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
  }
}
const moveInToOUT = (state, toNid, type, loc = -1) => { // 移入四边检测
  if (type !== 0) { // 处理输入/输出 移动位置
    return MoveInToL(state, toNid, loc)
  } else { // 处理输入移动到输出
    var lisenter = state.lisenter
    lisenter.moveToId = toNid
    lisenter.moveInToLoction = loc
    return {
      ...state,
      lisenter: lisenter
    }
  }
}
const MoveInToL = (state, toNid, loc) => {
  var lisenter = state.lisenter
  lisenter.moveToId = toNid
  lisenter.moveInToLoction = loc
  return {
    ...state,
    lisenter: lisenter
  }
}
const showModal = (state, isShow, nodeId = 0) => { // 开关 对话框
  var dialog = state.dialog
  var node = state.nodes[nodeId]
  var result = state.result // 执行工作流时 屏蔽数据修改
  if (result.runState === 1) {
    return {
      ...state
    }
  }
  dialog.isShow = isShow
  dialog.node = JSON.parse(JSON.stringify(node))
  console.log('new Moalnode', dialog.node)
  dialog.nodeId = nodeId
  return {
    ...state,
    dialog: dialog
  }
}
const startChangeNode = (state, isChange, id) => { //
  var lisenter = state.lisenter
  lisenter.changeNodeSize = isChange
  lisenter.changeNodeId = id
  console.log('START_CHANGE_NODE', lisenter)
  return {
    ...state,
    lisenter: lisenter
  }
}
const changeNodeSize = (state, x, y) => {  // 修改node的图形大小
  var nodes = state.nodes
  var lisenter = state.lisenter
  var id = lisenter.changeNodeId
  if (id > -1 && lisenter.changeNodeSize) {
    var node = nodes[id]
    var nW = x - node.flow.x
    var nH = y - node.flow.y
    if (nW > 100 && nH > 50) { // 最小不能小于100
      console.log('run IN test WH', nW, nH)
      var Onode = node.outputAttr.node
      if (Onode.x > (node.flow.x + node.flow.w)) { // 位置L=1
        nodes[id].outputAttr.node.x = nW + Onode.r + node.flow.x
      } else if (Onode.y > (node.flow.y + node.flow.h)) { // 位置L=2
        nodes[id].outputAttr.node.y = nH + Onode.r + node.flow.y
      }
      nodes[id].flow.w = nW
      nodes[id].flow.h = nH
    }
  }
  return {
    ...state,
    nodes: nodes
  }
}
const changeModalData = (state) => {  // 修改对话框数据
  var nodes = state.nodes
  var node = state.dialog.node
  var newReId = node.outputAttr.resultId
  var oldReId = state.nodes[state.dialog.nodeId].outputAttr.resultId

  if (newReId !== oldReId) {
    console.log('修改的resultId')
    nodes.map((item, i) => {
      item
        .input
        .map((ite, it) => {
          if (ite.node.to === state.dialog.nodeId && ite.type === 'ElementType_FromResult') {
            ite.value.resultId = newReId
          }
        })
    })
  }
  state.nodes[state.dialog.nodeId] = JSON.parse(JSON.stringify(node))
  return {
    ...state
  }
}
const changeFormData = (state, type, datatype, v, iid = -1) => { // id用于确定type为input的id
  var dialog = state.dialog
  var node = dialog.node
  if (type === 'input') {
    switch (datatype) {
      case 'type':
        {
          node.input[iid].type = v
          if (v === 'ElementType_Double') {
            var s = 0
            node.input[iid].value = s
            console.log('getchange node', node)
          } else if (v === 'ElementType_FromResult') {
            node.input[iid].value = {
              'id': 'id3',
              'resultId': '200001_200102_Add'
            }
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
            }
          } else {
            node.input[iid].value = {
              metadata: {
                spatialArea: 'Shanbei',
                tableName: 'AutoStationData', // 多选
                startDate: '20100101',
                endDate: '20121231',
                columns: 'DYP', // 暂时一个 未来多选
                stationType: 'HydrologyStation'// 多选 水利  气象
              },
              interval: 'Interval_1year',
              summaryType: 'Summary_Max'  // 多选
            }
          }
        }
        break
      case 'value':
        node.input[iid].value = parseInt(v)
        break
      case 'parameters':
        node.input[iid].value.metadata.parameters = v
        break
      case 'spatialArea':
        node.input[iid].value.metadata.spatialArea = v
        break
      case 'tableName':
        node.input[iid].value.metadata.tableName = v
        break
      case 'spatialResolution':
        node.input[iid].value.metadata.spatialResolution = v
        break
      case 'temporalResolution':
        node.input[iid].value.metadata.temporalResolution = v
        break
      case 'product':
        node.input[iid].value.metadata.product = v
        break
      case 'startDate':
        node.input[iid].value.metadata.startDate = v
        break
      case 'endDate':
        node.input[iid].value.metadata.endDate = v
        break
      case 'columns':
        node.input[iid].value.metadata.columns = v
        break
      case 'stationType':
        node.input[iid].value.metadata.stationType = v
        break
      case 'interval':
        node.input[iid].value.interval = v
        break
      case 'summaryType':
        node.input[iid].value.summaryType = v
        break
      default:
        break
    }
  } else if (type === 'output') {
    switch (datatype) {
      case 'cached':
        node.outputAttr.cached = v
        break
      case 'saveToFile':
        node.outputAttr.saveToFile = v
        break
      case 'saveToAccu':
        node.outputAttr.saveToAccu = v
        break
      case 'resultId':
        node.outputAttr.resultId = v
        break
    }
  } else if (type === 'node') {
    if (datatype === 'op_type') {
      node.op_type = v
      if (v === 'Op_CURD') {
        node.modelParam = {
          threshold: 0.0,
          isMin: true
        }
      } else if (v === 'Op_TOPN') {
        node.modelParam = {
          topN: 2,
          isMax: true
        }
      } else if (v === 'Op_Anomaly') {
        node.modelParam = {
          summaryParam: {
            summaryType: 'SummaryType_Avg'
          }
        }
      }
    } else if (datatype === 'name') {
      node.name = v
    } else if (datatype === 'threshold') {
      node.modelParam.threshold = Number(v)
    } else if (datatype === 'isMin') {
      node.modelParam.isMin = v
    } else if (datatype === 'topN') {
      node.modelParam.topN = Number(v)
    } else if (datatype === 'isMax') {
      node.modelParam.isMax = v
    } else if (datatype === 'summaryType') {
      node.modelParam.summaryParam.summaryType = v
    }
  }
  dialog.node = JSON.parse(JSON.stringify(node))
  return {
    ...state,
    dialog: dialog
  }
}
const opModalIOput = (state, optype, nid) => { // 修改node的输出
  var dialog = state.dialog
  var node = dialog.node
  var inputs = node.input.length
  if (optype === 'ADD') {
    var vinput = JSON.parse(JSON.stringify(node.input[inputs - 1]))
    var x = vinput.node.x - node.flow.x
    var y = vinput.node.y - node.flow.y
    if (x > 0 && y < 0) {
      vinput.node.x = vinput.node.x + vinput.node.r * 2
    } else if (x < vinput.node.w && y > 0) {
      vinput.node.y = vinput.node.y + vinput.node.r * 2
    } else if (x > 0 && y > node.flow.h) {
      vinput.node.x = vinput.node.x + vinput.node.r * 2
    } else if (x < 0 && y > 0) {
      vinput.node.y = vinput.node.y + vinput.node.r * 2
    }

    // Todo:计算新的node位置 最后一个节点位置向后添加一
    node
      .input
      .push(vinput)
  } else if (optype === 'DEL') {
    if (node.input.length > 1) {
      node
        .input
        .splice(nid, 1)
    }
  }
  return {
    ...state,
    dialog: dialog
  }
}
const startRun = (state, nodes) => { // 提交数据到服务器，准备执行。
  nodes.map((item, i) => {
    item.id = i
  })
  console.log('post data', JSON.stringify({ nodes: nodes }))
  var request = new Request(URLwork + 'flow', {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify({ nodes: nodes })
  })
  fetch(request).then(function (res) {
    return res.json()
  }).then((json) => {
    var re = state.result
    re.runState = 1
    re.progress = 0
    re.id = json.id
    re.name = json.name
    return {
      ...state,
      result: re
    }
  }).catch(function (e) {
    return {
      ...state
    }
  })
}

const getResult = (state, id) => {
  var URL = URLwork + 'result?id=' + id
  Fetch(fetch(URL).then(response => response.json()).then(data => {
    if (data.code === 200) {
      var result = state.result
      result.result = data
      result.runState = 3
      return {
        ...state,
        result: result
      }
    } else {
      return {
        ...state,
        result: null
      }
    }
  }).catch(e => console.log('Oops, error', e)), URLTimeOut)
    .then(function (res) { }, function (e) {
      return {
        ...state,
        result: null
      }
    })
}
const getProgress = (state, id) => {
  var URL = URLwork + 'progress?id=' + id
  var result = state
  Fetch(fetch(URL).then(response => response.json()).then(data => {
      if (data.code === 200) {
        if (data.state === 'DoneState') {
          result.runState = 2 // 继续执行 获取结果
          result.progressState = 'success'
          result.progress = 1
        } else if (data.state === 'FailedState') {
          result.runState = 4 // todo:错误处理
          result.progressState = 'exception'
          result.progress = data.progress
        } else if (data.state === 'RunningState') { // 正确代码执行时在
          result.runState = 1
          result.progressState = 'active'
          result.progress = data.progress
        } else {
        // else if(data.state=='AwaitingState'){//服务器对进程占用时拒绝请求时 在开启此代码
        //   alert('进程占用，等会再试');
        //   result.runState = 0;
        // }
          result.progress = data.progress
        }
        return {
          ...state,
          result: result
        }
      } else {
        return {
          ...state
        }
      }
    }).catch(e => console.log('Oops, error', e)), URLTimeOut)
    .then(function (res) { }, function (e) {
      return {
        ...state
      }
    })
}
const getProgressDetails = (state, id) => {
  var URL = URLwork + 'progressdetails?id=' + id
  return (dispatch, getState) => {
    Fetch(fetch(URL).then(response => response.json()).then(data => {
      if (data.code === 200) {
        var result = state.result
        var nodes = state.nodes
        data.map((item, i) => {
          if (item.progress === 0) {
            nodes[i].flow.c = 0
          } else if (item.progress === 1) {
            if (item.state === 'DoneState') {
              nodes[i].flow.c = 1
            } else {
              nodes[i].flow.c = 3
            }
          } else {
            nodes[i].flow.c = 2
          }
        })
        result.detail = data
        return {
          ...state,
          nodes: nodes,
          result: result
        }
      } else {
        return {
          ...state
        }
      }
    }).catch(e => console.log('Oops, error', e)), URLTimeOut)
      .then(function (res) { }, function (e) {
        return {
          ...state
        }
      })
  }
}
const reSetNodes = (state, value) => {
  var nodes = state.nodes
  nodes = value.nodes
  return {
    ...state,
    nodes: nodes
  }
}
const changeBrowser = (state) => {
  var height = window.innerHeight - 130
  return {
    ...state,
    height: height
  }
}

export const actions = {
  addDefaultNode,
  addNode,
  delNode,
  moveNode,
  moveStart,
  moveEnd,
  moveInStart,
  moveIn,
  moveInEnd,
  moveInToOUT,
  showModal,
  startChangeNode,
  changeNodeSize,
  changeModalData,
  changeFormData,
  opModalIOput,
  startRun,
  getResult,
  getProgress,
  getProgressDetails,
  reSetNodes,
  changeBrowser
}
