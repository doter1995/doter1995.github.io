function MQVisWidget(config) {
  //提示矩形的透明效果
  var opacityMin = 0.2 //最小透明度
  var opacityMax = 0.6 //最大透明度
  var opacityColor1 = '#353535' //两侧色
  var opacityColor2 = '#212121' //中间色
  var tipXDate = null // 部分事件对外提供的X值
  //数据线色
  var color0 = '#185cc6'
  //数据线高亮色
  var color1 = '#34FF00'
  // 横纵提示线
  var tipColory = '#222'
  var tipColorx = '#999'

  //标题
  var title = config.title
  //挂载点
  var node = config.domNode ? d3.select(config.domNode) : d3.select('body')
  //x比例尺
  var xAxis = config.xAxis ? config.xAxis : []
  //y轴配置类型
  var yType = config.yType ? config.yType : 0
  //y轴配置
  var yAxis1 = config.yAxis ? config.yAxis : [[0, 1, '#ffff00'], [1, 3, '#ffff00']]
  var yAxis2 = config.yAxis2 ? config.yAxis2 : [[0, 1, '#ffff00'], [1, 3, '#ffff00']]
  var yAxisSelected = config.yAxisSelected ? config.yAxisSelected : 0
  //当前显示的y轴配置
  var yAxis = yAxisSelected == 0 ? yAxis1 : yAxis2
  var lines = config.lines ? config.lines : []
  //色条接口  
  var colorMap = config.colorMap ? config.colorMap : []
  //
  var width = config.width ? config.width - 15 : 10
  var height = config.height ? config.height - 45 : 10
  var onLineSelected = config.onLineSelected ? config.onLineSelected : function () { alert('请加入点击事件') }
  var yUnit = config.yUnit ? config.yUnit : 'M'
  var pointLength = config.pointLength ? config.pointLength : 10000
  var colorMapSelectOffset = config.colorMapSelectOffset ? config.colorMapSelectOffset : 200
  var onSelectColorMap = config.onSelectColorMap ? config.onSelectColorMap : function () { alert('onSelectColorMap是必需事件') }
  var hoverSelectOffset = config.hoverSelectOffset ? config.hoverSelectOffset : 1
  var OnHoverSelect = config.OnHoverSelect ? config.OnHoverSelect : function (d) { console.log('Y轴hover选中的数据') }
  var onRightAttrClick = config.onRightAttrClick ? config.onRightAttrClick : function (d) { console.log('有属性点击事件') }
  var attrOpts = config.attrOpts ? config.attrOpts : []
  var yAxisVisible = config.yAxisVisible ? config.yAxisVisible : []
  var markerInfo = config.markerInfo ? config.markerInfo : function () { return '没有数据' }
  var rightAttrInfo = config.rightAttrInfo ? config.rightAttrInfo : function () { return '没有数据' }
  var onMouseMove = config.onMouseMove ? config.onMouseMove : function (xdate, ydata) { /*console.log('未定义鼠标移动回调方法', xdate, ydata)*/ }
  var attrLegends = config.attrLegends ? config.attrLegends : {}
  var OnHoverSet = config.OnHoverSet ? config.OnHoverSet : []
  var markerX = config.markerX ? config.markerX : 0
  var markerY = config.markerY ? config.markerY : 0
  var resultId = "";
  var resultDate ='';
  /**
   * 私有属性
   */
  //400轴,当刻度重叠时隐藏部分，y刻度的最小间距
  var Ylength = 15

  //基础属性
  var _title;
  var _marginLeft = 35
  var _marginRight = 15
  var _marginTop = 25
  var _marginBottom = 25
  var _svg
  //坐标轴显示
  var _xAxis
  var _yAxis
  var _zAxis
  //背景
  var _bg
  //显示线
  var _Lines
  //加入了zoom存储kxy,不用于显示。
  var _zoomX
  var _zoomY

  var _zoomRoot
  var yrect //y轴提示字
  var Tip
  var tipX
  var tipY
  var tipR
  var liTip
  var tipXY
  //构建属性，初始化的x y 比例尺
  var _X;
  var _Y;
  var _Z
  var _Ymain
  //最新比例尺
  var _xz
  var _yz

  var trueF = null;
  var zoom
  //按键状态
  var changeX = false
  var changeY = false
  //缩放状态
  var Xk = 1, Yk = 1, K0 = 1, Mx = 0, My = 0, Mx0 = 0, My0 = 0
  var zoomKx
  var zoomKy
  // 日期格式化
  var parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S");
  var formatDate = d3.timeFormat("%Y-%m-%d %H:%M:%S");

  //左属性的个数，右属性的个数
  var attrS = attrOpts
  var _tipLeftRight
  var tipAttr
  var tipDiv

  var translateExtent = [[0,0],[800,400]]
  var scaleExtent = [1,200]
  var Extent=[[0, 0],[800,400]]
  var transformX = new Transform(1,0,0)
  var transformY = new Transform(1,0,0)
  //按键监听
  window.onkeydown = function (e) {
    //16 
    if (e.keyCode == 16) {
      changeX = true
    }
    //18
    if (e.keyCode == 18) {
      changeY = true
    }
  }
  window.onkeyup = function (e) {
    //16  sh   65 A
    if (e.keyCode == 16) {
      changeX = false
    }
    //18 alt   83 S
    if (e.keyCode == 18) {
      changeY = false
    }
  }
  //图表宽高
  var W = width - _marginLeft - _marginRight
  var H = height - _marginBottom - _marginTop
  //X坐标轴构建函数
  var XA = d3.axisBottom()
    .tickFormat(function (d) { return formatDate(d) })
  this.linesTag= _Lines
  //初始化渲染
  this.render = function () {


    //颜色插值器
    var interColor = d3.interpolateRgb(colorMap[0][1], colorMap[colorMap.length - 1][1])
    //标题
    _title = node
      .append('div')
      .attr('class', 'widget_node')
      .style('width', width + 'px')
      .style('text-align', 'center')
      .style('font-weight', '600')
      .style('font-size', '1rem')
      .html(title)
    //提示框,左右属性的提示框
    tipDiv = node
      .append('div')
      .attr('class', 'div_tip')
      .attr('height', 400 + 'px')
      .attr('width', 200 + 'px')
      .style('background-color', '#333')
      .style('display', 'none')
      .style('position', 'fixed')
      .style('top', '20px')
      .style('left', '40px')
    //左上角鼠标移入的属性提示
    tipAttr = node
    .append('div')
    .attr('class', 'div_tip')
    .attr('height', 400 + 'px')
    .attr('width', 200 + 'px')
    .style('background-color', '#333')
    .style('display', 'none')
    .style('position', 'fixed')
    .style('top', '20px')
    .style('left', '40px')
    //X Y 的当前值提示
    tipXY = node
      .append('div')
      .attr('class', 'div_XY')
      .attr('height', 200 + 'px')
      .attr('width', 200 + 'px')
      .style('background-color', '#333')
      .style('display', 'none')
      .style('position', 'fixed')
      .style('top', '20px')
      .style('left', '40px')
    _svg = node.append('svg')
      .attr('class', 'root')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(' + _marginLeft + ',' + _marginTop + ')')

    _zoomX = _svg.append('g').attr('class', '_zoomX')
    _zoomY = _svg.append('g').attr('class', '_zoomY')

    _tipLeftRight = _svg.append('g')
      .attr('class', 'tipLeftRight')
      .attr('transform', 'translate(-10,' + -10 + ')')
    _zAxis = _svg
      .append('g')
      .attr('class', 'zAxis')
      .attr('transform', 'translate(30,' + -25 + ')')
    _xAxis = _svg
      .append('g')
      .attr('class', 'xAxis')
      .attr('transform', 'translate(0,' + H + ')')
    //todo:宽高需要优化
    _yAxis = _svg
      .append('g')
      .attr('class', 'yAxis')
    _X = d3.scaleTime()
      .domain([parseDate(xAxis[0]), parseDate(xAxis[1])])
      .range([0, W])
    _Z = d3.scaleLinear()
      .domain([0, 100])
      .range([W / 4, W / 4 * 3])
    _zAxis.call(d3.axisBottom().scale(_Z))
    _zAxis.select('path').attr('stroke', "url(#" + addColor(_zAxis.node(), 0, 1) + ")").attr('stroke-width', 10);
    _zAxis.selectAll('g.tick').select('line').attr('stroke', 'none');
    //对X轴分段处理
    var ticks = Number((W / 140).toFixed(0))
    if (ticks > 4 && ticks < 6) {
      ticks -= 2
    } else if (ticks >= 6) {
      ticks -= 4
    }
    _xAxis.selectAll('*').remove()
    _xAxis.call(XA.scale(_X).ticks(Number(ticks)))
    //生成Y轴的配置
    _Ymain = formatY(yAxis, H);
    // Y比例尺
    Y = _Ymain.Y
    //为全局变量赋值
    _yz = Y
    _xz = _X
    //添加背景色
    _bg = _svg
      .append('svg')
      .attr('width', W)
      .attr('height', H)
      .attr('class', 'bg')
    _bg.selectAll('rect')
      .data(_Ymain.data)
      .enter()
      .append('rect')
      .attr('x', 0)
      .attr('y', function (d, i) {
        return Y(d.range[1])
      })
      .attr('width', W)
      .attr('height', function (d, i) {
        return Y(d.range[0]) - Y(d.range[1])
      })
      .attr('fill', function (d, i) {
        return d.data[2]
      })
    //添加y轴
    var yrect = _yAxis.selectAll('g')
      .data(_Ymain.data)
      .enter()
      .append('g')
      .attr('class', 'ys')
    //y轴的刻度值
    _yAxis.append('text').attr('class', 'yUnit')
      .attr('x', -_marginLeft)
      .attr('y', -5)
      .attr('font-size', "10")
      .text('单位:' + yUnit)
    if (yAxisSelected == 1) {
      yrect
        .append('text').text(function (d, i) { return d.data[1] })
        .attr('font-size', "10")
        .attr('font-family', "sans-serif")
        .attr('text-anchor', 'middle')
        .attr('class', 'text2')
        .attr('x', -15)
        .attr('y', function (d, i) {
          var len = Y(d.range[1]) - Y(d.range[0])
          if (len < Ylength) {
            salte = Number((Ylength / len).toFixed(0)) + 1
          }
          if (len < Ylength && i % salte != 0) return -77
          var ydata = -66
            var v = (d.range[0] + d.range[1]) / 2
            ydata = (Y(v) + 5)
          return ydata
        })
    } else {
      yrect
        .append('text').text(function (d, i) { return d.data[0] })
        .attr('font-size', "10")
        .attr('font-family', "sans-serif")
        .attr('text-anchor', 'middle')
        .attr('class', 'text1')
        .attr('x', -15)
        .attr('y', function (d, i) {
          var ydata = Y(d.range[0])

          return ydata > -1 && ydata <= H + 2 ? ydata : -66
        })
      yrect
        .append('text').text(function (d, i) { return d.data[1] })
        .attr('font-size', "10")
        .attr('font-family', "sans-serif")
        .attr('text-anchor', 'middle')
        .attr('class', 'text2')
        .attr('x', -15)
        .attr('y', function (d, i) {
          //添加额外的扩展刻度
          var baseY = Y(d.range[0])
          var baseY1 = Y(d.range[1])
          baseY=baseY>0?baseY:-10
          baseY=baseY<H?baseY:H+20
          baseY1=baseY1>0?baseY1:-10
          baseY1=baseY1<H?baseY1:H+20
          if(baseY==baseY1)return -15
          var length  = baseY - baseY1
         
          if(length>100){
            var steps = length/50;
            for(var i =1;i<steps-1;i++){
              var yd = baseY-Number(i*50)+3
              yrect.append('text').text(Number(d.data[0]-d.range[0]+Y.invert(baseY-i*50)).toFixed(2))
              .attr('font-size', "10")
              .attr('font-family', "sans-serif")
              .attr('text-anchor', 'middle')
              .attr('class', 'text3')
              .attr('x', -15)
              .attr('y',baseY-Number(i*50)+3)
            }
          }
          var ydata = -66
          ydata = Y(d.range[1]) + 10
          return ydata
        })
    }
    // 绘制XY提示线
    Tip = _svg.append('g')
      .attr('class', 'tip')
      .append('svg').attr('width', W).attr('height', H)
    tipX = Tip.append('line')
      .attr('class', 'tipX')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 0)
      .attr('y2', H)
      .attr('stroke', tipColorx)
    tipY = Tip.append('line')
      .attr('class', 'tipY')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', W)
      .attr('y2', 0)
      .attr('stroke', tipColory)



    //指定缩放
    var xdomain = _X.domain()
    var length = xdomain[1] - xdomain[0]
      Extent=[[0, 0], [W, H]]
      scaleExtent=[1,(length / (1000 * ((width / 130).toFixed(0)) + 10))]
      translateExtent=[[0, 0], [W, H]]
     

    //添加线条svg(svg可解决线条过长问题)
    _Lines = _svg
      .append('svg')
      .attr('class', 'lines')
      .attr('width', W)
      .attr('height', H)
      .append('g')
      .attr('class', 'lines')
      
    //添加预选区
    tipR = _svg.append('svg')
      .attr('class', 'tipR')
      .attr('width', W)
      .attr('height', H)
      .append('g')
    //添加线条
    _zoomRoot = _svg.append('g')
      .attr('class', 'zoom')
      .append('rect')
      .attr('fill', 'none')
      .attr("pointer-events", "all")
      .attr('width', W)
      .attr('height', H)
    _zoomRoot.on("wheel", zoomed);
    //矩形渐变效果
    var linearGradientTR = tipR.append("defs")
      .append("linearGradient")
      .attr("id", 'tipR-rect')
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "0%")
    linearGradientTR.append("stop")
      .attr("offset", "0%")
      .style("stop-color", opacityColor1)
      .style("stop-opacity", opacityMin);
    linearGradientTR.append("stop")
      .attr("offset", "50%")
      .style("stop-color", opacityColor2)
      .style("stop-opacity", opacityMax);
    linearGradientTR.append("stop")
      .attr("offset", "100%")
      .style("stop-color", opacityColor1)
      .style("stop-opacity", opacityMin);
    tipR.append('rect')
      .attr('fill', 'url(#tipR-rect)')
      .attr('class', 'boder')
  
    //左右两属性图例
    _lineLeftAttr = _svg.append('g')
      .attr('class', 'leftAttr')
    _lineRightAttr = _svg.append('g')
      .attr('class', 'rightAttr')

    tipR.append('svg')
      .attr('width', W)
      .attr('height', H)
      .attr('class', 'data')
    //添加线条

    _Lines.selectAll('line')
      .data(formatLine(_Ymain, lines))
      .enter()
      .append('line')
      .filter(function (d, i) {
        //进行重点关注的显隐2.8功能
        if (yAxisVisible.length == 0) {
          return true
        }
        var show = false
        yAxisVisible.forEach(function (item, ii) {
          if (item.visible) {
            var isshow = false
            if (item.yAxis != undefined) {
              if (item.yAxis[0] < d.data[0] && item.yAxis[1] > d.data[0]) {//yAxis校验
                isshow = true
              } else {
                isshow = false
                return false
              }
            }
            if (item.xAxis != undefined && item.xAxisSelect != undefined) {
              var date0 = d.date[0]
              var date1 = d.date[1]
              if (item.xAxisSelect == 'start') {
                date0 = d.date[1]
                date1 = d.date[1]
              } else if (item.xAxisSelect == 'end') {
                date0 = d.date[2]
                date1 = d.date[2]
              }
              if (parseDate(item.xAxis[0]) < date0 && parseDate(item.xAxis[1]) > date1) {//yAxis校验
                isshow = true

              } else {
                isshow = false
                return false
              }
            }
            if (item.attrs != undefined) {
              if (item.attrs.leftAttr != undefined && d.data[3] && d.data[3].leftAttr) {
                isshow = item.attrs.leftAttr == d.data[3].leftAttr
                if (!isshow) return false
              }
              if (item.attrs.rightAttr != undefined && d.data[3] && d.data[3].rightAttr) {
                isshow = item.attrs.rightAttr == d.data[3].rightAttr
                if (!isshow) return false
              }
            }
            if (isshow) {
              show = true
              return isshow
            }

          }
        })
        return show
      })
      .attr('class', 'line')
      .filter(function (d, i) {
        return d.rangeY != -1
      })
      .attr('x1', function (d, i) {
        return _X(d.date[0])
      })
      .attr('y1', function (d, i) {
        return _Ymain.Y(d.rangeY)
      })
      .attr('x2', function (d, i) {
        if (d.data[2] == d.data[1]) {
          return _X(d.date[1].valueOf()+pointLength*1000)
        }
        return _X(d.date[1])
      })
      .attr('y2', function (d) {
        return _Ymain.Y(d.rangeY)
      })
      .attr('stroke', function (d, i) {
        var attrColor = d.data[3]['color'] != undefined ? d.data[3]['color'] : color0
        return attrColor
      })
      .attr('stroke-width', function (d) {
        var linewidth = d.data[3] && d.data[3].thick && d.data[3].thick > 1 ? d.data[3].thick : 1
        return linewidth
      })
    var attrS = attrOpts
    attrS.forEach(function (d, i) {
      d['S'] = 0
    })
    _tipLeftRight.selectAll('g').remove()
    var textlength = 0
    _tipLeftRight.append('g').attr('class', 'tipLeftRight').selectAll('text')
      .data(attrS).enter()
      .append('text')
      .attr('x', function (d, i) {
        var st = "" + d.S
        textlength += 1
        textlength += st.length
        return textlength * 14
      })
      .attr('font-size', "16")
      .attr('font-family', "sans-serif")
      .attr('text-anchor', 'middle')
      .attr('stroke', function (d, i) {
        return d.color
      })
      .attr('stroke-width', 1.4)
      .text(function (d, i) {
        if (d.type == 'leftAttr') {
          return '>:' + d.S
        } else if (d.type == 'rightAttr') {
          return '<:' + d.S
        }
      })
      .on('mouseover',function(d){
        var top = d3.event.clientY
        var html = ""
        attrLegends.map(function(item,i){
          if(item.type==d.type&&item.attr==d.name){
            //正常匹配
            var type = item.type=='leftAttr'?'左':'右'
            html='<div>名称：'+item.name+'<br/>'+'类型：'+type+"<br/>"+'描述：'+item.description+"</div>"
          }
        })
        if (top > window.innerHeight / 2)
          top = top - 100
        html!=""?tipAttr.style('display', 'block')
          .style('left', (d3.event.clientX + 10) + 'px')
          .style('top', top + 'px')
          .html(html):""
        
      })
      .on('mouseout', function () {
        tipAttr.style('display', 'none')
      })

    //设置zoom的事件的监听点
    Extent=[[0, 0], [W, H]]
    scaleExtent=[1,(length / (1000 * ((width / 130).toFixed(0)) + 10))]
    translateExtent=[[0, 0], [W, H]]
    _zoomRoot.on("wheel", zoomed);
    _zoomRoot.on("mousedown", zoomed);
    _zoomRoot.on('click', LinetEvent)
    _zoomRoot.on('dblclick', LinetEvent)
    _zoomRoot.on('mousemove.1', LinetEvent)
    
    

    //以tipR为主监听点
    // tipR.call(zoom).on("dblclick.zoom", null);
    //设置鼠标移动事件监听处理
    setZoomlisent(_X, _Ymain.Y);
    this.linesTag=_Lines
  }
  function zoomed() {
 
    // 构建新X比例尺
    var xz = _xz
    // 构建新Y比例尺
    var yz = _yz
    var imove = false
    if(d3.event.type=='wheel'){
      var wheel = d3.event.deltaY
      var old__X = transformX.copy()
      var p = d3.mouse(this)
      mouse=[p,old__X.invert(p)]
      
      //获取到wheel事件。
      //变换K
      var WheelDelta = ZoomTool.getWheelDelta(d3.event)
      if(!changeY){
        transformX.k = ZoomTool.wheelToK(transformX.k,WheelDelta,scaleExtent)
        
        //变换x y
        // constrain(translate(scale(t, k), g.mouse[0], g.mouse[1]), g.extent, translateExtent);
        transformX = ZoomTool.translate(transformX,mouse[0],mouse[1])
        transformX = ZoomTool.constrain(transformX,Extent,translateExtent)
        xz = transformX.rescaleX(_X)
      }
      if(!changeX){
        transformY.k = ZoomTool.wheelToK(transformY.k,WheelDelta,scaleExtent)
        
        //变换x y
        // constrain(translate(scale(t, k), g.mouse[0], g.mouse[1]), g.extent, translateExtent);
        transformY = ZoomTool.translate(transformY,mouse[0],mouse[1])
        transformY = ZoomTool.constrain(transformY,Extent,translateExtent)
        yz=transformY.rescaleY(_Ymain.Y)
      }
      
    }else if(d3.event.type=='mousedown'){
      var old__X = transformX.copy()
      var old__Y = transformY.copy()
      var event = d3.event
      var moved=false
      var p = d3.mouse(this)
      var  x0 = event.clientX
      var y0 = event.clientY
      mouseX=[p,old__X.invert(p)]
      mouseY=[p,old__Y.invert(p)]
      d3.select(this).on('mousemove.zoom',mousemove)
      .on("mouseup.zoom", mouseupped, true)
      function mousemove(){
        var xingtest = (new Date()).valueOf()
        
          if (!moved) {
              var dx = event.clientX - x0, dy = event.clientY - y0;
              moved = dx * dx + dy * dy > 0;
          }
          mouseX[0] = d3.mouse(this)
          mouseY[0] = d3.mouse(this)
          if(!changeY){
            transformX=ZoomTool.translate(transformX,mouseX[0],mouseX[1])
            transformX = ZoomTool.constrain(transformX,Extent,translateExtent)
            var p = d3.mouse(this)
            mouseX=[p,transformX.invert(p)]
            xz = transformX.rescaleX(_X)
          }
          if(!changeX){
            transformY=ZoomTool.translate(transformY,mouseY[0],mouseY[1])
            transformY = ZoomTool.constrain(transformY,Extent,translateExtent)
            var p = d3.mouse(this)
            mouseY=[p,transformY.invert(p)]
            yz=transformY.rescaleY(_Ymain.Y)
          }
          zoomform(xz,yz,d3.mouse(this))
      }
      function mouseupped(){
          d3.select(this).on('mousemove.zoom',null);
      }
    }else{
      return
    }
    zoomform(xz,yz,d3.mouse(this))
  }
function zoomform(xz,yz,mouse){
  var xingtest = (new Date()).valueOf()
  
    _xz = xz
    _yz = yz
    //重置鼠标move事件
    setZoomlisent(xz, yz)
    //调用move，用于刷新TipR的位置
    // move(this, xz, yz)
    //处理鼠标左键按下移动时tipR移动问题
    var Ydata = split(_yz.invert(mouse[1])).toFixed(10)
    var yd = GetValueY(_Ymain, Ydata)
    var xd = xz.invert(mouse[0])
    markerX=xd?xd:markerX
    markerY = Ydata ? Ydata:markerY

    move(xd, yd, xz, yz)
    tipR.select('rect.boder')
      .attr('x', function (d) { return xz(d[1]) })
      .attr('y', 0)
      .attr('width', function (d) {
        return xz(d[0]) - xz(d[1])
      })
      .attr('height', H)
    liTip.select('rect')
      .attr('x', function (d, i) {
        var xxx = xz(parseDate(d.data[0][0]))
        xxx = xxx < 0 ? 0 : xxx
        return xxx
      })
      .attr('width', function (d, i) {
        var xxx = xz(parseDate(d.data[0][0]))
        xxx = xxx < 0 ? 0 : xxx
        var xxx1 = xz(parseDate(d.data[1][0]))
        var wid = xxx < xxx1 ? xxx1 - xxx : 0
        return wid
      })
      .attr('y', function (d, i) {
        var yyy = yz(d.range) - 2
        return yyy < H ? yyy : -99
      })
      .attr('height', function (d, i) {
        return 4
      })
      console.log("xingtest1",(new Date()).valueOf()-xingtest)     
    //更新线条以及线条属性图例
    _Lines.selectAll('line.line')
    _lineLeftAttr.selectAll('text').attr('x', -10)
      .attr('y', function (d) {
        var y = _yz(d.rangeY) + 5
        y = y > 4 ? y : -99
        return y < H + 4 ? y : -999
      })
    _lineRightAttr.selectAll('text').attr('x', W)
      .attr('y', function (d) {
        var y = _yz(d.rangeY) + 5
        y = y > 4 ? y : -99
        return y < H + 4 ? y : -999
      })
      console.log("xingtest2",(new Date()).valueOf()-xingtest)     
    _Lines.selectAll('line.line')
      .filter(function (d) { var y = _yz(d.rangeY); return y > -40 || y < H + 40 })

      .attr('x1', function (d, i) {
        return _xz(d.date[0])
      })
      .attr('y1', function (d, i) {
        var YData = _yz(d.rangeY)
        return YData
      })
      .attr('x2', function (d, i) {
        if (d.data[2] == d.data[1]) {
          return _xz(d.date[1].valueOf()+pointLength*1000)
        }
        return _xz(d.date[1])
      })
      .attr('y2', function (d) {
        return _yz(d.rangeY)
      })
      console.log("xingtest3",(new Date()).valueOf()-xingtest)     
    //更新x轴
    var ticks = Number((W / 140).toFixed(0))
    if (ticks > 4 && ticks < 6) {
      ticks -= 2
    } else if (ticks >= 6) {
      ticks -= 4
    }
    _xAxis.selectAll('*').remove()
    _xAxis.call(XA.scale(xz).ticks(Number(ticks)))
    //更新 Y轴
    var yrect = _yAxis.selectAll('g.ys')
    yrect.selectAll('text.text3').remove()
      yrect.select('text.text1')
      .attr('font-size', "10")
      .attr('font-family', "sans-serif")
      .attr('text-anchor', 'middle')
      .text(function (d, i) { return d.data[0] })
      .attr('x', -15)
      .attr('y', function (d, i) {
        var ydata = _yz(d.range[0])

        return ydata > -1 && ydata <= H + 2 ? ydata : -66
      })
    _yAxis.selectAll('g.ys').select('text.text2')
      .attr('font-size', "10")
      .attr('font-family', "sans-serif")
      .attr('text-anchor', 'middle')
      .text(function (d, i) { return d.data[1] })
      .attr('x', function(d,i){
        //添加额外的扩展刻度
        var baseY = _yz(d.range[0])
        var length  = baseY - _yz(d.range[1])
        if(length>100){
          var steps = length/50;
          for(var i =1;i<steps-1;i++){
            var yvalue = baseY-Number(i*50)+3
            if(yvalue>0&&yvalue<H){
              yrect.append('text').text(Number(d.data[0]-d.range[0]+_yz.invert(baseY-i*50)).toFixed(2))
              .attr('font-size', "10")
              .attr('font-family', "sans-serif")
              .attr('text-anchor', 'middle')
              .attr('class', 'text3')
              .attr('x', -15)
              .attr('y',baseY-Number(i*50)+3)
            }
          }
        }
        return -15
      })
      .attr('y', function (d, i) {
        var sel = false
        //400轴过滤
        if (yAxisSelected == 0) {
          sel = true
        }
        var salte = 1
        var len = _yz(d.range[0]) - _yz(d.range[1])
        if (len <= Ylength) {
          salte = Number((Ylength / len).toFixed(0))
        }
        if (!sel && (len < Ylength && i % salte != 0)) return -77

        var ydata = -66
        if (yAxisSelected == 0) {
          ydata = _yz(d.range[1]) + 10
        } else {
          var v = (d.range[0] + d.range[1]) / 2
          ydata = (_yz(v))
        }
        return ydata > 0 && ydata < H ? ydata : -66
      })
      console.log("xingtest4",(new Date()).valueOf()-xingtest)     
    //更新背景色
    _bg.selectAll('rect')
      .attr('y', function (d, i) {
        var y = yz(d.range[1])
        if (y < -window.innerHeight) {
          y = -window.innerHeight
        }
        return y
      })
      .attr('height', function (d, i) {
        var y = yz(d.range[1])
        if (y < -window.innerHeight) {
          y = -window.innerHeight
        }
        var y1 = yz(d.range[0]) - y
        y1 < 0 ? y1 = 0 : ""
        return y1
      })
      .attr('fill', function (d, i) {
        return d.data[2]
      })
      console.log("xingtest5",(new Date()).valueOf()-xingtest)     
    liTip.selectAll('rect')
      .attr('x', function (d, i) {
        var xxx = xz(parseDate(d.data[0][0]))
        return xxx < 0 ? -99 : xxx
      })
      .attr('width', function (d, i) {
        return xz(parseDate(d.data[1][0])) - xz(parseDate(d.data[0][0]))
      })
      .attr('y', function (d, i) {
        var yyy = yz(d.range) - 2
        return yyy < H ? yyy : -99
      })
      .attr('height', function (d, i) {
        return 4
      })
      console.log("xingtest6",(new Date()).valueOf()-xingtest)      
  }

  function move(xdate, ydate, x, y, preventEvent) {
    var xintest = new Date()    
    //获取鼠标位置
    var ydata = GetYvalue(_Ymain, ydate)
    var mouse = [x(xdate), y(ydata)]
    tipX.attr('x1', x(xdate)).attr('x2', x(xdate)).attr('y2', H)
    tipY.attr('y1', y(ydata)).attr('y2', y(ydata)).attr('x2', W)
    //通过鼠标位置计算当前X Y的对应值
    // var xdate = x.invert(mouse[0])
    // var ydata = y.invert(mouse[1])
    tipXDate = formatDate(xdate)


    //处理XY属性值的提示框显示位置
    var Boundrect = _zoomRoot.node().getBoundingClientRect()
    var top = mouse[1]
    if (top > H / 2) { top = top - 50 }
    else { top += 10 }
    var left = mouse[0]
    if (left > W / 2) {
      left -= 140
    }
    tipXY.style('display', 'block')
      .style('left', left + Boundrect.left + 'px')
      .style('top', top + Boundrect.top + 'px')
      .html('x:' + formatDate(xdate) + '<br/>' + 'y:' + split(ydate).toFixed(2) || null)
    //确定当前左结束右开始的判断位置
    var date = xdate.valueOf()
    var date2 = date - hoverSelectOffset * 500
    var date3 = date + hoverSelectOffset * 500

    var OnHoverSelectData = []
    var selectDataSet = []
    //清除已显示的属性
    _lineLeftAttr.selectAll('*').remove();
    _lineRightAttr.selectAll('*').remove();
    //高亮处理
    //重置当前提示状态
    _lineLeftAttr.selectAll('text').attr('stroke-width', 1)
    _lineRightAttr.selectAll('text').attr('stroke-width', 1)
    var isLight = { left: false, right: false }
    //重置统计结果
    //统计线条数量
    var attrS = attrOpts
    attrS.forEach(function (d, i) {
      d['S'] = 0
    })
    var linesShow = _Lines.selectAll('line.line')
      .attr('stroke-width', 2)
      .attr('stroke', function (d, i) {
        var attrColor = d.data[3]['color'] != undefined ? d.data[3]['color'] : color0
        return attrColor
      })
      .filter(function (d) {
        //第一遍过滤
        //在处理时rangY=-1属于未匹配到y轴,所以不参与显示,和高亮
        if (d.rangeY == -1||d.rangeY<_yz.domain()[0]||d.rangeY>_yz.domain()[1]) return false
        //对
        var isshow = false
        var d1 = d.date[0]
        var d2 = d.date[1]
        d.data[1]==d.data[2]?d2=d2.valueOf()+Number(pointLength*1000):''
        var yValueS = y(d.rangeY)
        var xhoverSelect = 3
        //显示属性

        if (d1 <= date3 && d2 > date2) {
          //添加左右属性图例
          var attr = d.data[3]
          //处理左属性
          if (attr.leftAttr != undefined) {
            var color
            attrOpts.forEach(function (dd, i) {
              if (dd.type == 'leftAttr' && attr.leftAttr == dd.name) {
                color = dd.color
                dd.S += 1
              }
            })
            //绘制
            _lineLeftAttr.append('text')
              .datum(d)
              .attr('x', -10)
              .attr('y', function () {
                var y1 = yValueS + 5
                y1 = y1 > 0 ? y1 : -99
                return y1 < H ? y1 : -999
              })
              .text('>')
              .attr('stroke', color)
              .on('mouseover', function () {
                var top = d3.event.clientY
                if (top > window.innerHeight / 2)
                  top = top - 100
                tipDiv.style('display', 'block')
                  .style('left', (d3.event.clientX + 10) + 'px')
                  .style('top', top + 'px')
                  .html(typeof (markerInfo) == 'function' ? markerInfo(d3.event.x, d3.event.y, d) : markerInfo)
              })
              .on('mouseout', function () {
                tipDiv.style('display', 'none')
              })
          }
          //处理右属性
          if (attr.rightAttr != undefined) {
            var color
            attrOpts.forEach(function (dd, i) {
              if (dd.type == 'rightAttr' && attr.rightAttr == dd.name) {
                color = dd.color
                dd.S += 1
              }
            })
            //绘制
            _lineRightAttr.append('text')
              .datum(d)
              .attr('x', W)
              .attr('y', function () {
                var y1 = yValueS + 5
                y1 = y1 > 0 ? y1 : -99
                return y1 < H ? y1 : -999
              })
              .text('<')
              .attr('stroke', color)
              .on('click', function (dd) {
                onRightAttrClick(d3.select(this), d3.event, d.data)
              })
              .on('mouseover', function () {
                var top = d3.event.clientY
                if (top > window.innerHeight / 2)
                  top = top - 100
                tipDiv.style('display', 'block')
                  .style('left', (d3.event.clientX - 230) + 'px')
                  .style('top', top + 'px')
                  .html(typeof (rightAttrInfo) == 'function' ? rightAttrInfo(d3.event.x, d3.event.y, d) : rightAttrInfo)
              })
              .on('mouseout', function () {
                tipDiv.style('display', 'none')
              })
          }
        }
        //线条起点在范围内则显示
        if (d1 >= date2 && d1 <= date3) {
          isshow = true
          d['isLight']={right :true}
        }
        //线条终点在范围内则显示
        if (d2 <= date3 && d2 >= date2) {
          isshow = true
          d['isLight']={left :true}
        }

        //模拟线条的mouseOver高亮
        if (d1 < xdate && d2 > xdate) {

          if (yValueS - xhoverSelect < mouse[1] && yValueS + xhoverSelect > mouse[1]) {
            isshow = true

          }
        }
        //高亮处理
        // d3.select(this).attr('stroke-width', function (d) {
        //   var linewidth = d.data[3] && d.data[3].thick && d.data[3].thick > 1 ? d.data[3].thick : 1
        //   return Number(linewidth) + 1
        // })
        return isshow
      })
      console.log("test2",(new Date()).valueOf()-xintest)   
    //更新当前的属性统计
    _tipLeftRight.selectAll('g').remove()
    var textlength = 0
    _tipLeftRight.append('g').attr('class', 'tipLeftRight').selectAll('text').data(attrS).enter()
      .append('text')
      .attr('x', function (d, i) {
        var st = "" + d.S
        textlength += 1
        textlength += st.length
        return textlength * 14
      })
      .attr('font-size', "16")
      .attr('font-family', "sans-serif")
      .attr('text-anchor', 'middle')
      .attr('stroke', function (d, i) {
        return d.color
      })
      .attr('stroke-width', 1.4)
      .text(function (d, i) {
        if (d.type == 'leftAttr') {
          return '>:' + d.S
        } else if (d.type == 'rightAttr') {
          return '<:' + d.S
        }
      }).on('mouseover',function(d){
        var top = d3.event.clientY
        var html = ""
        attrLegends.map(function(item,i){
          if(item.type==d.type&&item.attr==d.name){
            //正常匹配
            var type = item.type=='leftAttr'?'左':'右'
            html='<div>名称：'+item.name+'<br/>'+'类型：'+type+"<br/>"+'描述：'+item.description+"</div>"
          }
        })
        if (top > window.innerHeight / 2)
          top = top - 100
        html!=""?tipAttr.style('display', 'block')
          .style('left', (d3.event.clientX + 10) + 'px')
          .style('top', top + 'px')
          .html(html):""
        
      })
      .on('mouseout', function () {
        tipAttr.style('display', 'none')
      })
    console.log("test3",(new Date()).valueOf()-xintest) 
    //第二遍过滤  
    linesShow
      .filter(function (d) {
        var d1 = d.date[0]
        var d2 = d.date[1]
        d.data[1]==d.data[2]?d2=d2.valueOf()+Number(pointLength*1000):''
        if (d1 < xdate && d2 > xdate) {
          var yValueS = y(d.rangeY)
          var xhoverSelect = 3
          if (yValueS - xhoverSelect < mouse[1] && yValueS + xhoverSelect > mouse[1]) {
            //高亮处理
            OnHoverSelectData.push(d.data)
            selectDataSet.push(d)
            // d3.select(this).attr('stroke-width', 4)
            return true
          }
        }
        if (d.isLight.left) {
          var show = false
          linesShow.filter(function(d){
              return d.isLight.right
            }).each(function (dd) {
            if (dd.date[0] > d.date[1] || d.date[0] > dd.date[1]) {
              show = true
              return true
            }
          })
          if (show) {
            //高亮处理
            OnHoverSelectData.push(d.data)
            selectDataSet.push(d)
            // d3.select(this).attr('stroke-width', 4)
            return true
          }
        }
      })
      .each(function (d) {
        var attr = d.data[3]
        //处理左属性
        if (attr.leftAttr != undefined) {
          _lineLeftAttr.selectAll('text')
            .filter(function (dd) {
              return d.rangeY == dd.rangeY
            })
            .attr('stroke-width', 3)
        }
        if (attr.rightAttr != undefined) {
          _lineRightAttr.selectAll('text')
            .filter(function (dd) {
              return d.rangeY == dd.rangeY
            })
            .attr('stroke-width', 3)
        }
      })
      .attr('stroke-width', function (d) {
        var linewidth = d.data[3] && d.data[3].thick && d.data[3].thick > 1 ? d.data[3].thick : 1
        return Number(linewidth) + 1
      })
      .attr('stroke', color1)
      console.log("test41",(new Date()).valueOf()-xintest)
    _Lines.selectAll('line.line').filter(function (d) {
      //调用外部数据判断是否有线条需要高亮
      var re = false
      var data = d.data
      OnHoverSet.map(function (dd) {
        if (data[0] == dd[0] && data[1] == dd[1] && data[2] == dd[2]) {
          re = true;
          return true;
        }
      })
      return re
    }).attr('stroke-width', function (d) {
      var linewidth = d.data[3] && d.data[3].thick && d.data[3].thick > 1 ? d.data[3].thick : 1
      return Number(linewidth) + 1
    })
      .attr('stroke', color1)
    //如果不需要OnHoverSelect方法空数据被调用的话
    if (OnHoverSelectData.length != 0) { }
    OnHoverSelect(OnHoverSelectData)

    //确定当前tipR的rect宽
    var date0 = date - colorMapSelectOffset * 500
    var date1 = date + colorMapSelectOffset * 500
    tipR.select('svg.data').selectAll('*').remove()
    //获取当前的显示的数据集
    resultId = guid();
    resultDate = date;
    console.log("test4",(new Date()).valueOf()-xintest)   
    //=》此处的lines需要单独处理,需要当前可视区域的y范围
 
    var data = onSelectColorMap(formatDate(date0), formatDate(date1),y.range,lines,pointLength,resultId)
    if(data==null){
      data=[]
    }
    if (preventEvent == true) {
    } else {
      markerX=formatDate(xdate)?formatDate(xdate):markerX
      markerY = ydata ? ydata:markerY
      onMouseMove(formatDate(xdate), ydata)
    }
    console.log("test5",(new Date()).valueOf()-xintest,data.length)   
    if(data.length<1){
      showHoverData(data,"")
    }else{
      showHoverData(data,resultId)
    }
    console.log("test6",(new Date()).valueOf()-xintest)    
  }
  function showHoverData (data,uId,dat){
    var date = resultDate
    if(resultId!=uId){
      data=[]
    };
    //默认情况下不使用该参数,除非定制时
    if(dat){
      date = dat
    }
    // console.log("data111",data,resultId,uId)
    var date0 = date - colorMapSelectOffset * 500
    var date1 = date + colorMapSelectOffset * 500
    tipR.select('rect.boder')
    .datum([date1, date0])
    .attr('x', _xz(date0))
    .attr('y', 0)
    .attr('width', function (d) {
      return _xz(d[0]) - _xz(d[1])
    })
    .attr('height', H)
    tipR.select('svg.data').selectAll('g.l').remove();
  //伪彩图添加
  liTip = tipR.select('svg.data').selectAll('g.l')
    .data(data)
    .enter()
    .append('g')
    .attr('class', 'l')
  liTip.each(function (dd, i) {
   //解析伪彩色的颜色
   var data = dd[2]
   colorMap.sort(function (a, b) {
     return Number(a[0]) - Number(b[0])
   })
   colorMap.forEach(function (d, i) {
     if (i == 0) { }
     else if (data <= d[0] && data >= colorMap[i - 1][0]) {//处理start
       var colorRang = [colorMap[i - 1][1], d[1]]

       var interCOlor = d3.interpolateRgbBasis(colorRang)
       var v = d[0] - colorMap[i - 1][0]
       var inter = ((data - colorMap[i - 1][0]) / v).toFixed(3)
       dd['color']=interCOlor(inter)
     }
   })
  }).append('line')
    .attr('x1', function (d, i) {
      var xxx = _xz(parseDate(d[1]))
      xxx = xxx < -100 ? -100 : xxx
      return xxx
    })
    .attr('x2', function (d, i) {
      var xx= parseDate(d[1])
      return _xz(xx.valueOf()+Number(pointLength*1000))
    })
    .attr('y1', function (d, i) {
      var yyy = _yz( GetYvalue(_Ymain,d[0]).toFixed(2))
      return yyy
    })
    .attr('y2', function (d, i) {
      return d3.select(this).attr('y1') + 1
    })
    .attr('stroke-width', function (d, i) {
      return 6
    })
    .attr('stroke', function (d, i) {
      return d.color
    })
 
  }

  function setZoomlisent(x, y) {
    function lisenMove() {
      var mouse = d3.mouse(this);
      var Ydata = split(y.invert(mouse[1])).toFixed(10)
      var yd = GetValueY(_Ymain, Ydata)
      var xd = x.invert(mouse[0])
      markerX=xd?xd:markerX
      markerY = Ydata ? Ydata:markerY
      move(xd, yd, x, y)
      LinetEvent(this)
    }

    _zoomRoot.on('mousemove.1',lisenMove)
    _Lines.on('mousemove', lisenMove)
    tipR.on('mousemove', lisenMove)
  }

  //直接重绘
  this.showHoverData = showHoverData;
  this.reRender = function (config) {
    // 重置状态属性
    Xk = 1
    Yk = 1
    K0 = 1
    Mx = 0
    My = 0
    Mx0 = 0
    My0 = 0

    changeX = false
    changeY = false

    _title.style('width', width + 'px').html(title)
    //标题已处理,忽略标题
    //颜色插值器
    var interColor = d3.interpolateRgb(colorMap[0][1], colorMap[colorMap.length - 1][1])
    W = width - _marginLeft - _marginRight
    H = height - _marginBottom - _marginTop

    _svg = node.select('svg.root')
      .attr('width', width)
      .attr('height', height)
      .select('g')

    _svg
      .select('g.xAxis')
      .transition()
      .attr('transform', 'translate(0,' + H + ')')
    //恢复X
    _X = _X ? _X.range([0, W]) : d3.scaleTime()
      .domain([parseDate(xAxis[0]), parseDate(xAxis[1])])
      .range([0, W])

    _Z = d3.scaleLinear()
      .domain([0, 100])
      .range([W / 4, W / 4 * 3])
    _zAxis.call(d3.axisBottom().scale(_Z))
    //此处可以判断是否发生颜色变化，或者直接删除原有渐变色
    _zAxis.select('path').attr('stroke', "url(#" + addColor(_zAxis.node(), 0, 1) + ")").attr('stroke-width', 10);
    _zAxis.selectAll('g.tick').select('line').attr('stroke', 'none');
    _xz = _X
    var xdomain = _X.domain()
    var length = xdomain[1] - xdomain[0]
    Extent=[[0, 0], [W, H]]
    scaleExtent=[1,(length / (1000 * ((width / 130).toFixed(0)) + 10))]
    translateExtent=[[0, 0], [W, H]]
   

    var ticks = Number((W / 140).toFixed(0))
    if (ticks > 4 && ticks < 6) {
      ticks -= 2
    } else if (ticks >= 6) {
      ticks -= 4
    }
    _xAxis.selectAll('*').remove()
    _xAxis.call(XA.scale(_X).ticks(Number(ticks)))
    //重新计算Y
    _Ymain = formatY(yAxis, H);
    var Y = _Ymain.Y
    _Y = Y
    _yz = Y
    //添加背景色
    _bg = _svg
      .select('svg.bg')
      .attr('width', W)
      .attr('height', H)

    //添加背景色
    _bg.selectAll('rect').remove()
    var bg = _bg.selectAll('rect')
      .data(_Ymain.data)
    bg.enter()
      .append('rect')
      .attr('x', 0)
      .attr('y', function (d, i) {
        return _Ymain.Y(d.range[1])
      })
      .attr('width', W)
      .attr('height', function (d, i) {
        return _Ymain.Y(d.range[0]) - _Ymain.Y(d.range[1])
      })
      .attr('fill', function (d, i) {
        return d.data[2]
      })
    var Y = _Ymain.Y

    //添加y轴
    _yAxis.selectAll('g').remove()
    yrect = _yAxis.selectAll('g')
      .data(_Ymain.data)
      .enter()
      .append('g')
      .attr('class', 'ys')

     if (yAxisSelected == 1) {
      yrect
        .append('text').text(function (d, i) { return d.data[1] })
        .attr('font-size', "10")
        .attr('font-family', "sans-serif")
        .attr('text-anchor', 'middle')
        .attr('class', 'text2')
        .attr('x', -15)
        .attr('y', function (d, i) {
          var len = Y(d.range[1]) - Y(d.range[0])
          if (len < Ylength) {
            salte = Number((Ylength / len).toFixed(0)) + 1
          }
          if (len < Ylength && i % salte != 0) return -77
          var ydata = -66
            var v = (d.range[0] + d.range[1]) / 2
            ydata = (Y(v) + 5)
          return ydata
        })
    } else {
      yrect
        .append('text').text(function (d, i) { return d.data[0] })
        .attr('font-size', "10")
        .attr('font-family', "sans-serif")
        .attr('text-anchor', 'middle')
        .attr('class', 'text1')
        .attr('x', -15)
        .attr('y', function (d, i) {
          var ydata = Y(d.range[0])

          return ydata > -1 && ydata <= H + 2 ? ydata : -66
        })
      yrect
        .append('text').text(function (d, i) { return d.data[1] })
        .attr('font-size', "10")
        .attr('font-family', "sans-serif")
        .attr('text-anchor', 'middle')
        .attr('class', 'text2')
        .attr('x', -15)
        .attr('y', function (d, i) {
          //添加额外的扩展刻度
          var baseY = Y(d.range[0])
          var length  = baseY - Y(d.range[1])
          if(length>100){
            var steps = length/50;
            for(var i =1;i<steps-1;i++){
              yrect.append('text').text(Y.invert(baseY-i*50).toFixed(2))
              .attr('font-size', "10")
              .attr('font-family', "sans-serif")
              .attr('text-anchor', 'middle')
              .attr('class', 'text3')
              .attr('x', -15)
              .attr('y',baseY-Number(i*50)+3)
            }
          }
          var ydata = -66
          ydata = Y(d.range[1]) + 10
          return ydata
        })
    }



    //添加线条
    _zoomRoot
      .attr('width', W)
      .attr('height', H)
    //添加线条
    _Lines = _svg
      .select('svg.lines')
      .attr('width', W)
      .attr('height', H)
      .select('g')
    updateLine()
    _zoomRoot.on("wheel", zoomed);
    _zoomRoot.on("mousedown", zoomed);
    _zoomRoot.on('click', LinetEvent)
    _zoomRoot.on('dblclick', LinetEvent)
    _zoomRoot.on('mousemove.1', LinetEvent)
    // tipR.call(zoom).on("dblclick.zoom", null);
    setZoomlisent(_X, _Ymain.Y);
  }
  //更新线条
  function updateLine() {
    _lineLeftAttr.selectAll('*').remove()
    _lineRightAttr.selectAll('*').remove()
    _Lines.selectAll('line').remove()

    _Lines.selectAll('line')
      .data(formatLine(_Ymain, lines))
      .enter()
      .append('line')
      .filter(function (d, i) {
        //进行重点关注的显隐
        if (yAxisVisible.length == 0) {
          return true
        }
        var show = false
        yAxisVisible.forEach(function (item, ii) {
          if (item.visible) {
            var isshow = false
            if (item.yAxis != undefined) {
              if (item.yAxis[0] < d.data[0] && item.yAxis[1] > d.data[0]) {//yAxis校验
                isshow = true
              } else {
                isshow = false
                return false
              }
            }
            if (item.xAxis != undefined && item.xAxisSelect != undefined) {
              var date0 = d.data[1]
              var date1 = d.data[2]
              if (item.xAxisSelect == 'start') {
                date0 = d.data[1]
                date1 = d.data[1]
              } else if (item.xAxisSelect == 'end') {
                date0 = d.data[2]
                date1 = d.data[2]
              }
              if (parseDate(item.xAxis[0]) < parseDate(date0) && parseDate(item.xAxis[1]) > parseDate(date1)) {//yAxis校验
                isshow = true

              } else {
                isshow = false
                return false
              }
            }
            if (item.attrs != undefined) {
              if (item.attrs.leftAttr != undefined && d.data[3] && d.data[3].leftAttr) {
                isshow = item.attrs.leftAttr == d.data[3].leftAttr
                if (!isshow) return false
              }
              if (item.attrs.rightAttr != undefined && d.data[3] && d.data[3].rightAttr) {
                isshow = item.attrs.rightAttr == d.data[3].rightAttr
                if (!isshow) return false
              }
            }
            if (isshow) {
              show = true
              return isshow
            }

          }
        })
        return show
      })
      .attr('class', 'line')
      .filter(function (d, i) {
        return d.rangeY != -1
      })
      .attr('x1', function (d, i) {
        return _xz(d.date[0])
      })
      .attr('y1', function (d, i) {
        return _yz(d.rangeY)
      })
      .attr('x2', function (d, i) {
        if (d.data[2] == d.data[1]) {
          return _xz(d.date[1].valueOf()+pointLength*1000)
        }
        return _xz(d.date[1])
      })
      .attr('y2', function (d) {
        return _yz(d.rangeY)
      })
      .attr('stroke-width', function (d) {
        var linewidth = d.data[3] && d.data[3].thick && d.data[3].thick > 1 ? d.data[3].thick : 1
        return linewidth
      })
      .attr('stroke', function (d, i) {
        var attrColor = d.data[3]['color'] != undefined ? d.data[3]['color'] : color0
        return attrColor
      })
      
  }
  this.updateOptions = function (config) {
    //优先更新OnHoverSet
    if (config.OnHoverSet != undefined) {
      OnHoverSet = config.OnHoverSet
      return
    }

    //是否全部更新
    var ToUp = false
    //是否只更新线段
    var upLine = false
    // 1.1 1.2
    if (config.xAxis != undefined) {
      xAxis = config.xAxis
      //此处不建议更新吧？
      //建议统一更新

      _X = null
      ToUp = true
    }
    //1.3

    if (config.yAxis != undefined) {
      yAxis1 = config.yAxis
      yAxis1.forEach(function (d, i) {
        d[3] == undefined ? d[3] = { visible: true } : d[3] = { visible: true }
      })
      if (yAxisSelected == 0) {
        _Ymain = null
        ToUp = true
      }
    }
    if (config.yAxis2 != undefined) {
      yAxis2 = config.yAxis2
      yAxis2.forEach(function (d, i) {
        d[3] == undefined ? d[3] = { visible: true } : d[3] = { visible: true }
      })
      if (yAxisSelected != 0) {
        _Ymain = null
        ToUp = true
      }
    }
    if (config.yAxisSelected != undefined) {
      yAxisSelected = config.yAxisSelected
      yAxis = yAxisSelected == 0 ? yAxis1 : yAxis2
      _Ymain = null
      ToUp = true
    }

    //第二阶段
    if (config.colorMapSelectOffset != undefined) {
      colorMapSelectOffset = config.colorMapSelectOffset
    }
    //2.2
    if (config.onSelectColorMap != undefined) {
      onSelectColorMap = config.onSelectColorMap
    }
    //控制Y的显示 2.8
    if (config.yAxisVisible != undefined) {
      yAxisVisible = config.yAxisVisible

      upLine = true
    }
    //控制Y的轴段的显隐 2.7
    if (config.yAreaVisible != undefined) {
      config.yAreaVisible.forEach(function (d, i) {
        yAxis[d.index][3].visible = d.visible
      })
      _Ymain = null
      _X = null

      ToUp = true
    }
    //2.5 左右图例
    if (config.attrOpts != undefined) {
      attrOpts = config.attrOpts
      upLine = true
      //
    }
    //线条的点击事件1.7
    if (config.onLineSelected != undefined) {
      onLineSelected = config.onLineSelected
      //线的点击事件
      upLine = true
    }
    //右属性点击事件3.1
    if (config.onRightAttrClick != undefined) {
      onRightAttrClick = config.onRightAttrClick
      //有标签的点击事件,更新线
      upLine = true
    }
    //纵轴游标起止点的点数 2.4
    if (config.hoverSelectOffset != undefined) {
      hoverSelectOffset = config.hoverSelectOffset
    }

    if (config.markerInfo != undefined) {
      markerInfo = config.markerInfo
      //
    }
    if (config.rightAttrInfo != undefined) {
      rightAttrInfo = config.rightAttrInfo
      //
    }
    //2.4
    if (config.OnHoverSelect != undefined) {
      OnHoverSelect = config.OnHoverSelect
    }
    if (ToUp) {
      this.reRender()
    }
    if (config.width != undefined && config.height != undefined) {
      width = config.width - 15
      height = config.height - 45
      //统一更新
      reSize()
    }
    if (config.yUnit != undefined) {
      yUnit = config.yUnit
      //
      _yAxis.select('text.yUnit').text('单位:' + yUnit)
    }
    //局部  
    // 2.1 
    if (config.colorMap != undefined) {
      colorMap = config.colorMap
      //todo:更新z轴，及伪彩图
      _zAxis.select('path').attr('stroke', "url(#" + addColor(_zAxis.node(), 0, 1) + ")").attr('stroke-width', 10);
    }
    // 1.4
    if (config.lines != undefined) {
      lines = config.lines
      //此处不建议更新吧？
      //建议统一更新
      upLine = true
    }
    // 1.4
    if (config.extLines != undefined) {
      lines = d3.merge([lines, config.extLines])
      //此处不建议更新吧？
      //建议统一更新
      upLine = true
    }
    //
    if (config.pointLength != undefined) {
      pointLength = config.pointLength
      upLine = true
    }
    //更新线条
    if (upLine) {
      updateLine()
    }
    if (config.title != undefined) {
      title = config.title
      _title.style('width', width + 'px').html(title)
    }
    //1.7
    if (config.onLineSelected != undefined) {
      onLineSelected = config.onLineSelected
      //线的点击事件
      _Lines.selectAll('line')
        .on('click', function (d, i) {
          onLineSelected(d3.select(this), d3.event, d.data)
        })
    }
    //2.2
    if (config.colorMapSelectOffset != undefined) {
      colorMapSelectOffset = config.colorMapSelectOffset
    }

    var isMove = false
    if (config.markerX != undefined) {
      markerX = config.markerX
      isMove = true
    }
    if (config.markerY != undefined) {
      markerY = config.markerY
      isMove = true
    }
    if (isMove) {
      move(parseDate(markerX), GetValueY(_Ymain, markerY), _xz, _yz, true)
    }
    if (config.onMouseMove != undefined) {
      onMouseMove = config.onMouseMove
    }
  }

  //先处理大小问题
  function reSize() {

    _title.style('width', width + 'px').html(title)
    W = width - _marginLeft - _marginRight
    H = height - _marginBottom - _marginTop
    _svg.select('svg.tipR').attr('width', W).attr('height', H)
    tipR.select('rect').attr('height', H)
    _svg = node.select('svg.root')
      .attr('width', width)
      .attr('height', height)
      .select('g')
    _svg
      .select('g.xAxis')
      .transition()
      .attr('transform', 'translate(0,' + H + ')')
    Tip.attr('width', W).attr('height', H)
    tipX.attr('y1', 0).attr('y2', H)
    tipY.attr('x1', 0).attr('x2', W)
    tipY
    _X.range([0, W])
    _xz = _xz ? _xz.range([0, W]) : d3.scaleTime()
      .domain([parseDate(xAxis[0]), parseDate(xAxis[1])])
      .range([0, W])
    _Z = d3.scaleLinear()
      .domain([0, 100])
      .range([W / 4, W / 4 * 3])
    _zAxis.call(d3.axisBottom().scale(_Z))
    //此处可以判断是否发生颜色变化，或者直接删除原有渐变色
    _zAxis.select('path').attr('stroke', "url(#" + addColor(_zAxis.node(), 0, 1) + ")").attr('stroke-width', 10);
    _zAxis.selectAll('g.tick').select('line').attr('stroke', 'none');

    var xdomain = _xz.domain()
    var length = xdomain[1] - xdomain[0]

    var ticks = Number((W / 140).toFixed(0))
    if (ticks > 4 && ticks < 6) {
      ticks -= 2
    } else if (ticks >= 6) {
      ticks -= 4
    }
    _xAxis.selectAll('*').remove()
    _xAxis.call(XA.scale(_xz).ticks(Number(ticks)))
    var Y = _yz.range([H, 0])
    _Ymain.Y = _Ymain.Y.range([H, 0])
    //添加背景色
    _bg = _svg
      .select('svg.bg')
      .attr('width', W)
      .attr('height', H)

    //添加背景色
    _bg.selectAll('rect').remove()
    var bg = _bg.selectAll('rect')
      .data(_Ymain.data)
    bg.enter()
      .append('rect')
      .attr('x', 0)
      .attr('y', function (d, i) {
        return Y(d.range[1])
      })
      .attr('width', W)
      .attr('height', function (d, i) {
        return Y(d.range[0]) - Y(d.range[1])
      })
      .attr('fill', function (d, i) {
        return d.data[2]
      })
    //添加y轴
    _yAxis.selectAll('g').remove()
    yrect = _yAxis.selectAll('g')
      .data(_Ymain.data)
      .enter()
      .append('g')
      .attr('class', 'ys')
  
      if (yAxisSelected == 1) {
        yrect
          .append('text').text(function (d, i) { return d.data[1] })
          .attr('font-size', "10")
          .attr('font-family', "sans-serif")
          .attr('text-anchor', 'middle')
          .attr('class', 'text2')
          .attr('x', -15)
          .attr('y', function (d, i) {
            var len = Y(d.range[1]) - Y(d.range[0])
            if (len < Ylength) {
              salte = Number((Ylength / len).toFixed(0)) + 1
            }
            if (len < Ylength && i % salte != 0) return -77
            var ydata = -66
              var v = (d.range[0] + d.range[1]) / 2
              ydata = (Y(v) + 5)
            return ydata
          })
      } else {
        yrect
          .append('text').text(function (d, i) { return d.data[0] })
          .attr('font-size', "10")
          .attr('font-family', "sans-serif")
          .attr('text-anchor', 'middle')
          .attr('class', 'text1')
          .attr('x', -15)
          .attr('y', function (d, i) {
            var ydata = Y(d.range[0])
  
            return ydata > -1 && ydata <= H + 2 ? ydata : -66
          })
        yrect
          .append('text').text(function (d, i) { return d.data[1] })
          .attr('font-size', "10")
          .attr('font-family', "sans-serif")
          .attr('text-anchor', 'middle')
          .attr('class', 'text2')
          .attr('x', -15)
          .attr('y', function (d, i) {
            //添加额外的扩展刻度
            var baseY = Y(d.range[0])
            var length  = baseY - Y(d.range[1])
            if(length>100){
              var steps = length/50;
              for(var i =1;i<steps-1;i++){
              yrect.append('text').text(Number(d.data[0]-d.range[0]+Y.invert(baseY-i*50)).toFixed(2))
                .attr('font-size', "10")
                .attr('font-family', "sans-serif")
                .attr('text-anchor', 'middle')
                .attr('class', 'text3')
                .attr('x', -15)
                .attr('y',baseY-Number(i*50)+3)
              }
            }
            var ydata = -66
            ydata = Y(d.range[1]) + 10
            return ydata
          })
      }
  

    //添加线条
    _zoomRoot
      .attr('width', W)
      .attr('height', H)

      _zoomRoot.on("wheel", zoomed);
      _zoomRoot.on("mousedown", zoomed);
      _zoomRoot.on('click', LinetEvent)
      _zoomRoot.on('dblclick', LinetEvent)
      _zoomRoot.on('mousemove.1', LinetEvent)
    //添加线条
    _svg
      .select('svg.lines')
      .attr('width', W)
      .attr('height', H)
    _lineLeftAttr.selectAll('*').remove()
    _lineRightAttr.selectAll('*').remove()
    _Lines.selectAll('line.line')
      .filter(function (d, i) {
        //进行重点关注的显隐
        if (yAxisVisible.length == 0) {
          return true
        }
        var show = false
        yAxisVisible.forEach(function (item, ii) {
          if (item.visible) {
            var isshow = false
            if (item.yAxis != undefined) {
              if (item.yAxis[0] < d.data[0] && item.yAxis[1] > d.data[0]) {//yAxis校验
                isshow = true
              } else {
                isshow = false
                return false
              }
            }
            if (item.xAxis != undefined && item.xAxisSelect != undefined) {
              var date0 = d.data[1]
              var date1 = d.data[2]
              if (item.xAxisSelect == 'start') {
                date0 = d.data[1]
                date1 = d.data[1]
              } else if (item.xAxisSelect == 'end') {
                date0 = d.data[2]
                date1 = d.data[2]
              }
              if (parseDate(item.xAxis[0]) < parseDate(date0) && parseDate(item.xAxis[1]) > parseDate(date1)) {//yAxis校验
                isshow = true

              } else {
                isshow = false
                return false
              }
            }
            if (item.attrs != undefined) {
              if (item.attrs.leftAttr != undefined && d.data[3] && d.data[3].leftAttr) {
                isshow = item.attrs.leftAttr == d.data[3].leftAttr
                if (!isshow) return false
              }
              if (item.attrs.rightAttr != undefined && d.data[3] && d.data[3].rightAttr) {
                isshow = item.attrs.rightAttr == d.data[3].rightAttr
                if (!isshow) return false
              }
            }
            if (isshow) {
              show = true
              return isshow
            }

          }
        })
        return show
      })
      .each(function (d, i) {
        var attr = d.data[3]
        //处理左属性
        if (attr.leftAttr != undefined) {
          var color
          attrOpts.forEach(function (d, i) {
            if (d.type == 'leftAttr' && attr.leftAttr == d.name) {
              color = d.color
            }
          })
          //绘制
          _lineLeftAttr.append('text')
            .datum(d)
            .attr('x', -10)
            .attr('y', function () {
              var y = _yz(d.rangeY) + 5
              y = y > 4 ? y : -99
              return y < H + 4 ? y : -999
            })
            .text('>')
            .attr('stroke', color)
            .on('mouseover', function () {
              var top = d3.event.clientY
              if (top > window.innerHeight / 2)
                top = top - 100
              tipDiv.style('display', 'block')
                .style('left', (d3.event.clientX + 10) + 'px')
                .style('top', top + 'px')
                .html(typeof (markerInfo) == 'function' ? markerInfo(d3.event.x, d3.event.y, d) : markerInfo)
            })
            .on('mouseout', function () {
              tipDiv.style('display', 'none')
            })
        }
        //处理右属性
        if (attr.rightAttr != undefined) {
          var color
          attrOpts.forEach(function (d, i) {
            if (d.type == 'rightAttr' && attr.rightAttr == d.name) {
              color = d.color
            }
          })
          //绘制
          _lineRightAttr.append('text')
            .datum(d)
            .attr('x', W)
            .attr('y', function () {
              var y = _yz(d.rangeY) + 5
              y = y > 4 ? y : -99
              return y < H + 4 ? y : -999
            })
            .text('<')
            .attr('stroke', color)
            .on('click', function (dd) {
              onRightAttrClick(d3.select(this), d3.event, d.data)
            })
            .on('mouseover', function () {
              var top = d3.event.clientY
              if (top > window.innerHeight / 2)
                top = top - 100
              tipDiv.style('display', 'block')
                .style('left', (d3.event.clientX - 220) + 'px')
                .style('top', top + 'px')
                .html(typeof (rightAttrInfo) == 'function' ? rightAttrInfo() : rightAttrInfo)
            })
            .on('mouseout', function () {
              tipDiv.style('display', 'none')
            })
        }
      })
      .filter(function (d, i) {
        return d.rangeY != -1
      })
      .attr('x1', function (d, i) {
        return _xz(d.date[0])
      })
      .attr('y1', function (d, i) {
        return Y(d.rangeY)
      })
      .attr('x2', function (d, i) {
        if (d.data[2] == d.data[1]) {
          return _xz(d.date[1]) + 10
        }
        return _xz(d.date[1])
      })
      .attr('y2', function (d) {
        return Y(d.rangeY)
      })
    _zoomRoot
      .attr('width', W)
      .attr('height', H)
    //更新当前的缩放因子限制
    Extent=[[0, 0], [W, H]]
    scaleExtent=[1,(length / (1000 * ((width / 130).toFixed(0)) + 10))]
    translateExtent=[[0, 0], [W, H]]
      _zoomRoot.on("wheel", zoomed);
      _zoomRoot.on("mousedown", zoomed);
      _zoomRoot.on('click', LinetEvent)
      _zoomRoot.on('dblclick', LinetEvent)
      _zoomRoot.on('mousemove.1', LinetEvent)
   
    // tipR.call(zoom)
  }




  /**
   * 工具方法
   */
  //线条事件处理
  function LinetEvent (a){
    var mouse
    if(a!=undefined){
      mouse = d3.mouse(a)
    }else{
      mouse = d3.mouse(this)
    }
    
    //遍历线条
    _Lines.selectAll('line').each(function(d){
      var line = d3.select(this);
      var y = line.attr('y1')
      if(mouse[1]>Number(y-2)&&Number(y+2)>mouse[1]){//y值匹配
       
        var x1 = line.attr('x1')
        var x2 = line.attr('x2')
        if(mouse[0]>=x1&&x2>mouse[0]){//x值匹配
          onLineSelected(line.node(), d3.event, { X: tipXDate, Y: d.data[0], data: d.data }); 
        }
      }
      
    })
    return true
  }

  //添加变色模板
  function addColor(select, start, end) {
    var colorDomain = []
    var colorRange = []

    colorMap.forEach(function (d) {
      colorDomain.push(d[0])
      colorRange.push(d[1])
    })

    var L = d3.scaleLinear().range([0, 100]).domain(colorDomain)
    var id = guid()
    var linearGradient = d3.select(select).append("defs")
      .append("linearGradient")
      .attr("id", id)
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "0%")
    if (start < end) {
      //用于计算比例
      var k = 1 / (end - start)
      colorMap.sort(function (a, b) {
        return Number(a[0]) - Number(b[0])
      })
      colorMap.forEach(function (d, i) {
        if (start < d[0] && colorMap[i - 1][0] < start) {//处理start
          var colorRang = [colorMap[i - 1][1], d[1]]

          var interCOlor = d3.interpolateRgbBasis(colorRang)
          var v = d[0] - colorMap[i - 1][0]
          var inter = ((start - colorMap[i - 1][0]) / v).toFixed(3)
          linearGradient.append("stop")
            .attr("offset", "0%")
            .style("stop-color", interCOlor(inter));
        }
        if (start <= d[0] && end >= d[0]) {//在值域之间
          var v
          if (d[0] == 0) {
            v = 0
          } else {
            v = k * Number(d[0] - start) * 100
          }
          linearGradient.append("stop")
            .attr("offset", v + "%")
            .style("stop-color", d[1]);
        } else if (end < d[0] && colorMap[i - 1][0] < end) {//处理end
          var colorRang = [colorMap[i - 1][1], d[1]]
          var interCOlor = d3.interpolateRgbBasis(colorRang)
          var v = d[0] - colorMap[i - 1][0]
          var inter = ((end - colorMap[i - 1][0]) / v).toFixed(3)
          linearGradient.append("stop")
            .attr("offset", "100%")
            .style("stop-color", interCOlor(inter));
        }

      })
    } else if (start == end) {
      var k = 1 / (end - start)
      colorMap.sort(function (a, b) {
        return Number(a[0]) - Number(b[0])
      })
      colorMap.forEach(function (d, i) {
        if (i == 0) { }
        else if (start <= d[0] && start >= colorMap[i - 1][0]) {//处理start
          var colorRang = [colorMap[i - 1][1], d[1]]

          var interCOlor = d3.interpolateRgbBasis(colorRang)
          var v = d[0] - colorMap[i - 1][0]
          var inter = ((start - colorMap[i - 1][0]) / v).toFixed(3)
          linearGradient.append("stop")
            .attr("offset", "0%")
            .style("stop-color", interCOlor(inter));
          linearGradient.append("stop")
            .attr("offset", "100%")
            .style("stop-color", interCOlor(inter));
        }
      })
    } else {
      var k = 1 / (start - end)
      colorMap.sort(function (a, b) {
        return Number(b[0]) - Number(a[0])
      })
      colorMap.forEach(function (d, i) {
        if (start > d[0] && colorMap[i - 1][0] > start) {//处理start
          var colorRang = [colorMap[i - 1][1], d[1]]
          var interCOlor = d3.interpolateRgbBasis(colorRang)
          var v = d[0] - colorMap[i - 1][0]
          var inter = ((start - colorMap[i - 1][0]) / v).toFixed(3)
          linearGradient.append("stop")
            .attr("offset", "0%")
            .style("stop-color", interCOlor(inter));
        }
        if (start >= d[0] && end < d[0]) {
          var v
          if (d[0] == 0) {
            v = 0
          } else {
            v = k * Number(start - d[0]) * 100
          }
          linearGradient.append("stop")
            .attr("offset", v + "%")
            .style("stop-color", d[1]);
        } else if (end >= d[0] && colorMap[i - 1][0] > end) {//处理end
          var colorRang = [colorMap[i - 1][1], d[1]]
          var interCOlor = d3.interpolateRgbBasis(colorRang)
          var v = d[0] - colorMap[i - 1][0]
          var inter = ((end - colorMap[i - 1][0]) / v).toFixed(3)
          linearGradient.append("stop")
            .attr("offset", "100%")
            .style("stop-color", interCOlor(inter));
        }
      })

    }
    return id;//返回给d.id 用于在rect中使用
  }

  //生成随机码
  function guid() {
    function S4() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
  }
  //转换Y轴

  function formatY(yAxis, H) {
    var yMain = {
      ylength: 0,
      data: [],
      Y: null,
      y: [],

    }
    //解析,数据重构
    yAxis.forEach(function (d, i) {
      var lest = yMain.ylength
      if (d[3].visible != false) {
        yMain.ylength += (d[1] - d[0])
        yMain.data.push({
          data: d,
          range: [lest, yMain.ylength]
        })
      }
    })
    yMain.Y = d3.scaleLinear().domain([0, yMain.ylength]).range([H, 0])
    return yMain
  }
  //将真实数据转化为Y的domain值
  function GetYvalue(yMain, V) {
    var data = -1

    yMain.data.forEach(function (d, i) {
      if (d.data[0] < V && d.data[1] >= V) {
        //属于该对象
        data = V - d.data[0] + d.range[0]
        return data;
      }
    })
    return data;
  }
  function split(V) {
    var vS = ("" + V).split('.')
    if (vS.length >= 2) {
      V = parseFloat(vS[0] + '.' + vS[1].substr(0, 10))
    }

    return V
  }
  //与上方法相反
  function GetValueY(yMain, V) {
    var data = -1
    yMain.data.forEach(function (d, i) {
      if (d.range[0] < V && d.range[1] >= V) {
        //属于该对象

        data = Number(V) - Number(d.range[0]) + Number(d.data[0])
        return data;
      }
    })
    return data;
  }
  //将线段在原始阶段处理
  function formatLine(yMain, line) {
    var lines = []
    line.forEach(function (d, i) {
      lines.push({
        data: d,
        date:[parseDate(d[1]).valueOf(),parseDate(d[2]).valueOf()],
        rangeY: GetYvalue(yMain, d[0])
      })
    })
    return lines
  }
  function clearK() {
    zoomKx = d3.zoomTransform(_zoomX)
    zoomKx = { k: 1, x: 0, y: 0 }
    zoomKy = d3.zoomTransform(_zoomY)
    zoomKy = { k: 1, x: 0, y: 0 }
    var zoomKxy = d3.zoomTransform(zoom)
    zoomKxy = { k: 1, x: 0, y: 0 }
    return true
  }
}