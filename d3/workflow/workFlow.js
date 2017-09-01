// import * As d3 from './d3'

console.log("使用的D3版本是：", d3.version)
console.log("要求使用的D3版本是：v3")

var actions = WorkActions
var _nodeEvent = {
  workFlow: initState,
  init: function (RootNode) {
    d3.select(RootNode).on('mousemove', this.move)
    d3.select(document).on('mouseup', this.End)
  },
  move: function () {
    var x, y
    var isNodeMV = _nodeEvent.workFlow.lisenter.moveStart
    if (RootNode === undefined) { return }
    if (isNodeMV) { // 是否移动node
      x = d3.mouse(RootNode)[0]
      y = d3.mouse(RootNode)[1]
      SetState({ workFlow: actions.moveNode(_nodeEvent.workFlow, x, y) })
    }
    var isInMV = _nodeEvent.workFlow.lisenter.moveInStart
    console.log("移动输入点", isInMV)
    if (isInMV) { // 是否移动输出点
      x = d3.mouse(RootNode)[0]
      y = d3.mouse(RootNode)[1]
      SetState({ workFlow: actions.moveIn(_nodeEvent.workFlow, x, y) })
    }
    var isOUTMV = _nodeEvent.workFlow.lisenter.moveOutStart // 是否移动out
    if (isOUTMV) {
      x = d3.mouse(RootNode)[0]
      y = d3.mouse(RootNode)[1]
      SetState({ workFlow: actions.moveIn(_nodeEvent.workFlow, x, y) })
    }
    var isChangeNS = _nodeEvent.workFlow.lisenter.changeNodeSize
    if (isChangeNS) {
      x = d3.mouse(RootNode)[0]
      y = d3.mouse(RootNode)[1]
      SetState({ workFlow: actions.changeNodeSize(_nodeEvent.workFlow, x, y) })
    }
  },
  End: function () {
    console.log("鼠标放开")
    var isNodeMV = _nodeEvent.workFlow.lisenter.moveStart // 是否移动node
    if (isNodeMV) {
      // 停止移动node
      SetState({ workFlow: actions.moveEnd(_nodeEvent.workFlow) })
    }
    var isInMV = _nodeEvent.workFlow.lisenter.moveInStart // 是否移动input
    var isOUTMV = _nodeEvent.workFlow.lisenter.moveOutStart // 是否移动out
    console.log('是否移动', isInMV, isOUTMV)
    if (isOUTMV || isInMV) {
      SetState({ workFlow: actions.moveInEnd(_nodeEvent.workFlow) })
    }
    var isChangeNS = _nodeEvent.workFlow.lisenter.changeNodeSize
    if (isChangeNS) {
      SetState({ workFlow: actions.startChangeNode(_nodeEvent.workFlow, false, -1) })
    }
  },
  addDefaultNode: function (x, y) {
    SetState({
      workFlow: actions.addDefaultNode(_nodeEvent.workFlow, x, y)
    })
  },
  addNode: function (node) {
    SetState({
      workFlow: actions.addNode(_nodeEvent.workFlow, node)
    })
  },
  moveStart: function (id, x, y) {
    var x = d3.mouse(RootNode)[0]
    var y = d3.mouse(RootNode)[1]
    SetState({ workFlow: actions.moveStart(_nodeEvent.workFlow, id, x, y) })
  },
  outPutData: function () { console.log('方法用于生成JSON文件，本地导出，暂未实现') },
  delNode: function (nid) { SetState({ workFlow: actions.delNode(_nodeEvent.workFlow, nid) }) },//删除节点
  changeNodeData: function (id, node) { this.setState({ workFlow: actions.changeNodeData(_nodeEvent.workFlow, id, node) }) },//修改对话框数据，不建议使用
  moveInToOUT: function (toNid, type) {
    var loc = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : -1;
    console.log('移动moveInToOUT loc', loc)
    SetState({
      workFlow: actions.moveInToOUT(_nodeEvent.workFlow, toNid, type, loc)
    })
  },
  moveInStart: function (id, Inid) {
    var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : -1;
    SetState({
      workFlow: actions.moveInStart(_nodeEvent.workFlow, id, Inid, type)
    })
  },
  startChangeNode: function (isChange, id) {
    SetState({ workFlow: actions.startChangeNode(_nodeEvent.workFlow, isChange, id) })
  }
}
var _myNode = {
  addNode: function (gNode, id) {

    // var flow = node.flow
    // var outNode = node.outputAttr.node
    // var inNodes = node.input
    var svgNode = gNode.append('svg').on('mouseup', _nodeEvent.End)
    //建立一个矩形边框
    var rectOut = svgNode.append('rect')
      .attr("x", function (d) { return d.flow.x })
      .attr("y", function (d) { return d.flow.y })
      .attr("width", function (d) { return d.flow.w })
      .attr("height", function (d) { return d.flow.h })
      .attr("rx", 5)
      .attr("ry", 5)
      .attr("class", function (d) { return 'workflow_rect_out' + d.flow.c })
      .on('mousedown', function () { _nodeEvent.moveStart(id) })

    //建立一个矩形上边框
    var rectTop = svgNode.append('rect')
      .attr("x", function (d) { return d.flow.x + 15 })
      .attr("y", function (d) { return d.flow.y - 10 })
      .attr("width", function (d) { return d.flow.w - 30 })
      .attr("height", function (d) { return 25 })
      .attr('fill', '#fff')
      .attr('fill-opacity', 0)
      .on('mousedown', function () { _nodeEvent.moveStart(id) })
      .on('mouseenter', function () { console.log('mouseenter'); _nodeEvent.moveInToOUT(id, 1, 0) })
      .on('mouseleave', function () { _nodeEvent.moveInToOUT(-1, 1) })
    //建立一个矩形右边框
    var rectD = svgNode.append('rect')
      .attr("x", function (d) { return d.flow.x + d.flow.w - 15 })
      .attr("y", function (d) { return d.flow.y + 15 })
      .attr("width", function (d) { return 25 })
      .attr("height", function (d) { return d.flow.h - 30 })
      .attr('fill', '#fff')
      .attr('fill-opacity', 0)
      .on('mousedown', function () { _nodeEvent.moveStart(id) })
      .on('mouseenter', function () { _nodeEvent.moveInToOUT(id, 1, 1) })
      .on('mouseleave', function () { _nodeEvent.moveInToOUT(-1, 1) })
    //建立一个矩形下边框
    var rectL = svgNode.append('rect')
      .attr("x", function (d) { return d.flow.x + 15 })
      .attr("y", function (d) { return d.flow.y + d.flow.h - 15 })
      .attr("width", function (d) { return d.flow.w - 30 })
      .attr("height", function (d) { return 25 })
      .attr('fill', '#fff')
      .attr('fill-opacity', 0)
      .on('click', function () { alert('这是xia吗') })
      .on('mousedown', function () { _nodeEvent.moveStart(id) })
      .on('mouseenter', function () { _nodeEvent.moveInToOUT(id, 1, 2) })
      .on('mouseleave', function () { _nodeEvent.moveInToOUT(-1, 1) })
    //建立一个矩形左边框
    var rectR = svgNode.append('rect')
      .attr("x", function (d) { return d.flow.x - 10 })
      .attr("y", function (d) { return d.flow.y + 15 })
      .attr("width", function (d) { return 25 })
      .attr("height", function (d) { return d.flow.h - 30 })
      .attr('fill', '#fff')
      .attr('fill-opacity', 0)
      .on('mousedown', function () { _nodeEvent.moveStart(id) })
      .on('mouseenter', function () { _nodeEvent.moveInToOUT(id, 1, 3) })
      .on('mouseleave', function () { _nodeEvent.moveInToOUT(-1, 1) })
    //建立关闭按钮
    svgNode.append('image')
      .attr('x', function (d) { return d.flow.x + d.flow.w - 15 })
      .attr('y', function (d) { return d.flow.y })
      .attr('width', 15)
      .attr('height', 15)
      .attr('xlink:href', './close.png')
      .on('click', function () { _nodeEvent.delNode(id) })

    //建立右下角可拖拽大小的
    var rectRN = svgNode.append('rect')
      .attr("x", function (d) { return d.flow.x + d.flow.w - 15 })
      .attr("y", function (d) { return d.flow.y + d.flow.h - 15 })
      .attr("width", function (d) { return 15 })
      .attr("height", function (d) { return 15 })
      .attr('class', 'rectRn_resize')
      .on('mousedown', function () { _nodeEvent.startChangeNode(true, id) })
    //建立内边框
    var InnerGroup = svgNode.append('g');
    var rectIN = InnerGroup.append('rect')
      .attr("x", function (d) { return d.flow.x + 15 })
      .attr("y", function (d) { return d.flow.y + 15 })
      .attr("width", function (d) { return d.flow.w - 30 })
      .attr("height", function (d) { return d.flow.h - 30 })
      .attr('class', 'workflow_rect_inner')
      .attr('rx', 5)
      .attr('ry', 5)
    var name = InnerGroup.append('text')
      .attr('x', function (d) { return d.flow.x + 25 })
      .attr('y', function (d) { return d.flow.y + 35 })
      .attr('class', 'text-node')
      .text(function (d) {
        return '别名:' + d.name
      })
    var OP = InnerGroup.append('text')
      .attr('x', function (d) { return d.flow.x + 25 })
      .attr('y', function (d) { return d.flow.y + 55 })
      .attr('class', 'text-node')
      .text(function (d) {
        return '操作符:' + d.op_type
      })
    var resultId = InnerGroup.append('text')
      .attr('x', function (d) { return d.flow.x + 25 })
      .attr('y', function (d) { return d.flow.y + 75 })
      .attr('class', 'text-node')
      .text(function (d) {
        return '返回值Id:' + d.outputAttr.resultId
      })
    InnerGroup.on('click', function (e) { WorkFlow.onNodeCilck(id, e) })//添加节点点击事件
    //输出点
    var outC = svgNode.append('circle')
      .attr('class', 'workflow_out')
      .attr('cx', function (d) { return d.outputAttr.node.x })
      .attr('cy', function (d) { return d.outputAttr.node.y })
      .attr('r', function (d) { return d.outputAttr.node.r })
      .on('mousedown', function (d, i) { _nodeEvent.moveInStart(id, -1, 1) })
      .on('mouseenter', function () { _nodeEvent.moveInToOUT(id, 3) })
      .on('mouseleave', function () { _nodeEvent.moveInToOUT(-1, 3) })
      .append('title')
      .text(function (d) { return "cached:" + d.outputAttr.cached })
    //输入点
    var inCGroup = svgNode.append('g')
    var inC = inCGroup.selectAll('circle')
      .data(function (d) { return d.input })
      .enter()
      .append('circle')
      .attr('class', 'workflow_input')
      .attr('cx', function (d, i) { return d.node.x })
      .attr('cy', function (d, i) { return d.node.y })
      .attr('r', function (d, i) { return d.node.r })
      .on('mousedown', function (d, i) { _nodeEvent.moveInStart(id, i) })
      .append('title')
      .attr('fill', '#000')
      .text(function (d, i) { return d.type })

    var inCt = inCGroup.selectAll('text')
      .data(function (d) { return d.input })
      .enter()
      .append('text')
      .attr('class', 'workflow_input_1')
      .attr('x', function (d, i) { return d.node.x - 5 })
      .attr('y', function (d, i) { return d.node.y + 5 })
      .on('mousedown', function (d, i) { _nodeEvent.moveInStart(id, i) })
      .text(function (d) {
        if (d.type == 'ElementType_FromResult') {
          return 'R'
        } else if (d.type == 'ElementType_Double') {
          return 'V'
        } else {
          return 'L'
        }
      })
    //建立删除按钮 <image xlinkHref={CloseImg} x={svgNode,flow.x + flow.w - 15} y={flow.y} width='15' height='15' onClick={() => { this.props.delNode(nodeId) }} />
  }
}

var _workFTool = {
  //nodes校验
  checkNode: function (json) {
    var res = json
    var nodes = res.nodes
    if (nodes == undefined) {
      alert('文件内容错误0,nodes is undefined')
      return false
    }
    if (nodes.length < 1) {
      alert('文件内容错误1,nodes length is 0')
      return false
    }
    try {
      nodes.map((item, i) => {
        if (item.flow.x <= 0 && item.flow.y <= 0 && item.flow.h <= 0 && item.flow.w <= 0) {
          alert('文件内容错误2,节点位置有误')
          return false
        }
        if (item.outputAttr.node.x <= 0 && item.outputAttr.node.y <= 0 && item.outputAttr.node.r <= 0) {
          alert('文件内容错误3,输出位置有误')
          return false
        }

      })
    } catch (e) {
      return false
    }
    return true
  },
  showNodes: function (RootNode) {
    var i = 0, nodeSet = _nodeEvent.workFlow.nodes
    //绘制提示点位置
    //<circle cx={outNode.x} cy={outNode.y} r={10} className='workflow_circle_tip' />
    var outNode = _nodeEvent.workFlow.outNode
    console.log("outnode", outNode, _nodeEvent.workFlow)
    console.log("outnode,x,y", outNode.x, outNode.y)
    d3.select(RootNode).selectAll('g.tip').remove()
    var nodeTip = d3.select(RootNode).append('g').attr('class', 'tip')
      .append('circle')
      .attr('cx', outNode.x)
      .attr('cy', outNode.y)
      .attr('r', 10)
      .attr('class', 'workflow_circle_tip')

    //建立连线
    d3.select(RootNode).selectAll('g.line').remove()
    var nodeLine = d3.select(RootNode).append('g').attr('class', 'line')
    var dataSet = _nodeEvent.workFlow.nodes;
    dataSet.map((item, i) => {
      console.log("item", item)
      if (item.input.length > 0) {
        re = item.input.map((im, i) => { // 获取连线
          if (im.type == 'ElementType_FromResult' && im.node.to > -1) {
            console.log("有连接点", im.node.to)
            if (dataSet[im.node.to] != undefined && dataSet[im.node.to].outputAttr != undefined) {
              var outnode = dataSet[im.node.to].outputAttr.node
              console.log("将要绘制", outnode.r, im.node.r)
              var line = GetLine(outnode.x, outnode.y, im.node.x, im.node.y, outnode.r, im.node.r + 6)
              console.log('line', line)
              line.width = 3
              //绘制线段
              var lineSvg = nodeLine.append('svg')
              lineSvg.append('defs')
                .append('marker')
                .attr('id', 'arrow')
                .attr('markerUnits', 'strokeWidth')
                .attr('markerWidth', 6)
                .attr('markerHeight', 6)
                .attr('viewBox', '0 0 12 12')
                .attr('refX', 6)
                .attr('refY', 6)
                .attr('orient', 'auto')
                .append('path')
                .attr('d', 'M2,2 L10,6 L2,10 L6,6 L2,2')
                .attr('fill', '#999')
              lineSvg.append('line')
                .attr('x1', line.x1)
                .attr('y1', line.y1)
                .attr('x2', line.x2)
                .attr('y2', line.y2)
                .attr('stroke-width', line.width)
                .attr('stroke', '#999')
                .attr('marker-end', 'url(#arrow)')
            }
          }
        })
      }
    })
    //绘制node节点。
    d3.select(RootNode).selectAll('g.node').remove()
    nodeSet.map((item, i) => {
      var node = d3.select(RootNode)
        .append('g')
        .attr('class', 'node')
        .datum(item)
      _myNode.addNode(node, i)
    })
    // var nodes = d3.select(RootNode).selectAll('g.node')
    //   .data(_nodeEvent.workFlow.nodes)
    //   .enter()
    //   .append('g')
    //   .attr('class', 'node')
  }
}
var WorkFlow = {
  onNodeCilck: null,
  addJson: function (json) {
    if (_workFTool.checkNode(json)) {
      console.log("JSONJSON", json)
      SetState({ workFlow: actions.reSetNodes(_nodeEvent.workFlow, json) })
    } else {
      alert('数据有误')
    }
  },
  nodeS: [],//当前所有状态值。
  //添加节点
  addDefaultNode: function (x, y) {
    console.log("添加默认节点")
    _nodeEvent.addDefaultNode(x, y)
  },
  changeNodeData: function (id, node) {
    _nodeEvent.changeNodeData(id, node)
  },
  addNode: function (node) {
    console.log("添加节点，未对数据进行校验，请确保数据正确")
    _nodeEvent.addNode(node)
  },
  //删除节点
  delNode: function (id) {
    console.log("删除节点，不建议使用，已有删除按钮实现该功能")
    _nodeEvent.delNode(id)
  },
  outPutData: function (filename) {
    var file = filename ? filename + '.json' : 'test.json'
    var baml = {
      nodes: _nodeEvent.workFlow.nodes
    }
    var file = new File([JSON.stringify(baml)], 'test.json', { type: 'text/plain;charset=utf-8' })
    saveAs(file)
  },
  //
  //初始化
  init: function (RootNode, State) {
    State ? _nodeEvent.workFlow = State : ''
    _nodeEvent.init(RootNode)
    _workFTool.showNodes(RootNode)
  }
}

var RootNode = document.getElementById('ROOT')
function SetState(workFlow) {
  var RootNode = document.getElementById('ROOT')
  WorkFlow.init(RootNode, workFlow.workFlow)
}




