var axisTextColor = '#ccc';

function GitChain(config) {
  //配置属性
  var title = config.title ? config.title : '请加入标题'
  var domNode = config.domNode ? config.domNode : 'body'
  var width = config.width ? config.width : window.innerWidth
  var height = config.height ? config.height : window.innerHeight
  var data = config.data ? config.data : []
  var useDataset = config.useDataset?config.useDataset:function(d){console.log(d)}
  var markerWidth = 5 //箭头的大小
  var tipDot = '; '//切换中文，或者英文,
  //基础工具
  var parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S.%L");
  var formatDate = d3.timeFormat("%Y-%m-%d %H:%M:%S.%L");

  var marginLeft = 30
  var marginRight = 20
  var marginTop = 40
  var marginBottom = 20
  var W = width - marginLeft - marginRight
  var H = height - marginTop - marginBottom - 20
  var _svgtitle
  // var color = d3.scaleOrdinal(d3.schemeCategory20);
  //dom
  var rootNode
  //样式属性
  //是否居中对齐 否则左对齐
  var isCenter = config.isCenter ? true : false
  //左侧图的宽度，0为不设置
  var itemW = config.itemW ? config.itemW : 0
  //是否排序
  var isSortNode = config.isSortNode != undefined ? config.isSortNode : true
  var isSortTime = config.isSortTime != undefined ? config.isSortTime : true
  //水平一的宽
  var itemMargin = 50
  //垂直1的高
  var itemMargin1 = 45
  //节点圆半径
  var nodeR = 15
  //节点圆的外边框
  var nodeRwidth = 5
  //背景色透明度，高亮时透明度
  var opacity = config.style.opacity ? config.style.opacity : [0.3, 0.9];
  // var userColor = ['#39397a', '#627a35', '#8d6d2c', '#853c37', '#737f74']
  // var color = ['#2c80bf', '#e95400', '#2aa450', '#bcbf00', '#636363']
  var userColor = config.style.userColor ? config.style.userColor : ['#39397a', '#627a35', '#8d6d2c', '#853c37', '#737f74'];
  var color = config.style.color ? config.style.color : ['#2c80bf', '#e95400', '#2aa450', '#bcbf00', '#636363'];
  //文字颜色
  var textColor = config.style.textColor ? config.style.textColor : ['#333', "#eee"];
  //使用按钮的样式
  //按钮背景(标准，高亮)
  var use_back=['#380','#7b0']


  //绘制
  function render() {
    d3.select(domNode).selectAll('*').remove()
    d3.select(domNode).selectAll('svg').remove()
    var Node = d3.select(domNode)
    _svgtitle = Node
      .append('div')
      .style('position', 'relative')
      .style('color', axisTextColor)
      .style('top', '20px')
      .style('text-align', 'center')
      .style('font-weight', '600')
      .style('font-size', '0.7rem')
      .style('width', width-10 + 'px')
      .html(config.title)
    //预处理数据
    var dataSet = formatData(data)
    console.log(dataSet)
    //获取图表的长度
    var length = dataSet.data[dataSet.data.length - 1].index
    var Hlength = length * itemMargin1 //拿到长度
    console.log('length,Hlength', length, Hlength)
    rootNode = Node.append('svg')
      .attr('width', width-10)
      .attr('height', height - 20)
      .append('g')
      .attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')')
    var Y = function (d) {
      if (isSortTime) {
        return d
      } else {
        console.log('d', d, Hlength - d)
        return Hlength - d
      }
    }


    //绘制数据
    var titltData = { index: -1, length: 0, titles: [] }
    //处理图形的宽度
    itemW = itemW != 0 ? itemW : dataSet.classes.length * itemMargin
    //调整图层
    backGround = rootNode.append('g')
    linkLine = rootNode.append('g')
    linkNode = rootNode.append('g')
    linkTitleRect = rootNode.append('g')
    linkTitle = rootNode.append('g')
    if (isCenter) {
      var center = W / 2 - 20
      var left = center - itemW
      backGround.attr('transform', 'translate(' + left + ',0)')
      linkNode.attr('transform', 'translate(' + left + ',0)')
      linkLine.attr('transform', 'translate(' + left + ',0)')
      linkTitleRect.attr('transform', 'translate(' + left + ',0)')
      linkTitle.attr('transform', 'translate(' + left + ',0)')
    }

    dataSet.data.forEach(function (d, i) {

      //绘制连线
      var line = d3.line()
        .x(function (d) { return d[0] })
        .y(function (d) { return Y(d[1]) })
        .curve(d3.curveMonotoneX)
      var orientLine = GetLines(dataSet, d)
      orientLine.forEach(function(dd,ii){
        linkLine.append('path')
        .attr("class", "line")
        .datum(dd.line)
        .attr('d', line)
        .attr('stroke-width', 3)
        .attr('stroke', function (i) {
          return userColor[dataSet.user.indexOf(d.user)]
        })
        .attr('fill', 'none')
        .attr('marker-end',"url(#"+addMarker(dd.orient,userColor[dataSet.user.indexOf(d.user)])+")")
      })
      //绘制节点
      backGround.append('rect')
        .datum(d)
        .attr('x', function (d) {
          return itemMargin * (dataSet.classes.indexOf(d.to))
        })
        .attr('y', function (d) {
          return Y(itemMargin1 * d.index) - nodeR
        })
        .attr('width', function (d) { return itemW - itemMargin * (dataSet.classes.indexOf(d.to)) })
        .attr('height', 2 * nodeR)
        .attr('fill', userColor[dataSet.user.indexOf(d.user)])
        .attr('opacity', opacity[0])
        .on('mouseover', function (d) { select(d) })
        .on('mouseout', function (d) { select({ index: -1 }) })
      linkNode.append('circle')
        .datum(d)
        .attr('cx', function (d) {
          console.log(dataSet.classes.indexOf(d.to),d)
          return itemMargin * (dataSet.classes.indexOf(d.to))
        })
        .attr('cy', function (d) {
          console.log('cy',Y(itemMargin1 * d.index),d)
          return Y(itemMargin1 * d.index)
        })
        .attr('r', function (d) {
          return nodeR
        })
        .attr('fill', function (d, i) {
          return color[dataSet.classes.indexOf(d.to)]
        })
        .attr('stroke', function (d) {
          return userColor[dataSet.user.indexOf(d.user)]
        })
        .attr('stroke-width', 4)
        .on('mouseover', function (d) { select(d) })
        .on('mouseout', function (d) { select({ index: -1 }) })
      //打印内容
      if (titltData.index != d.index) {
        var frist=0
        titltData.index = d.index
        titltData.length = 0
        linkTitleRect.append('rect')
          .datum(d)
          .attr('x', function () { return itemW + 20 + titltData.length * 12 })
          .attr('y', function () {
            return Y(itemMargin1 * d.index) - nodeR
          })
          .attr('height', 2 * nodeR)
          .attr('width', W - itemW)
          .attr('fill', userColor[dataSet.user.indexOf(d.user)])
          .attr('opacity', opacity[0])
          .on('mouseover', function (d) { select(d) })
          .on('mouseout', function (d) { select({ index: -1 }) })
        //每一行,第一打印
        var userData = getTitle(dataSet, titltData)
        console.log(titltData.index, userData)
        var dataString = ""
        dataSet.user.forEach(function (d, ii) {
         if(userData.user.indexOf(d)!=-1){//匹配到用户
          dataString+=' '+ d//打印用户
          console.log(userData.user.indexOf(d))
          var textData = userData.data[userData.user.indexOf(d)]
          console.log(textData)
          if(textData.create.to.length>0){//有创建
            dataString+=getType('create')
            textData.create.to.forEach(function(d,i){
              dataString +=i>0?tipDot:''
              dataString +=getTag(d)
            })
            frist=1
          }
          if(textData.use.to.length>0){//有使用
            dataString+=frist==0?"":tipDot
            dataString+=getType('use')
            console.log('use', textData.use)
            textData.use.to.forEach(function(d,i){
              dataString +=i>0?tipDot:''
              dataString += getTag(d)
            })
            frist=1
          }
          if(textData.refer.length>0){
            
            dataString+=frist==0?"":tipDot
            dataString+=getType('refer')
            textData.refer.forEach(function(dd,i){
              dd.from.forEach(function(d,i){
                dataString +=i>0?',':''
                dataString +=getTag(d)
              })
              dataString +='到'+getTag(dd.to) +''
            })
            frist=1
          }

         }
        })
        //准备打印内容

        linkTitle.append('text')
          .attr('class','link')
          .datum(d)
          .attr('x', function () { return itemW + 30  })
          .attr('y', function (d) {
            return Y(itemMargin1 * d.index) + 5
          })
          .text(function (d) {
            dataString+='('+d.time.substring(0,19)+')'
            return dataString
          })
          .attr('fill', textColor[0])
          .on('mouseover', function (d) { select(d) })
          .on('mouseout', function (d) { select({ index: -1 }) })
          
          //打印使用按钮
          var Allow_use = false
          dataSet.data.forEach(function(ddd){
            if(titltData.index==ddd.index){
              ddd.allow_use==true?Allow_use=true:""
              return
            }
          })
          if(Allow_use){
            console.log('textLength',dataString.length)
            var useTip = linkTitle.append('g').datum(d)
            useTip.append('rect')
              .attr('class','tip_use_back')
              .attr('x',W-40)
              .attr('y', Y(itemMargin1 * d.index)-nodeR)
              .attr('width',50)
              .attr('height',30)
              .attr('fill',use_back[0])
              .on('mousemove')
            useTip.append('text')
              .attr('class','tip_Use')
              .attr('x',W-30)
              .attr('y', Y(itemMargin1 * d.index) + 5)
              .text('使用')
            useTip.attr('cursor','pointer').on('click',function(d){useDataset(d.to)})
              .on('mouseover',function(d){
                var self =d3.select(this)

                self.select('rect.tip_use_back') 
                .attr('fill',use_back[1])
              })
              .on('mouseout',function(d){
                var self =d3.select(this)
                self.select('rect.tip_use_back') 
                .attr('fill',use_back[0])
              })
          }
          
      }


      //记录节点
      dataSet.state[d.to].index = d.index

    })
    console.log(dataSet)
  }

  render()

  function select(data) {
    console.log('select', data)
    backGround.selectAll('rect')
      .attr('opacity', opacity[0])
      .filter(function (d) {
        return d.index == data.index
      })
      .attr('opacity', opacity[1])
    linkNode.selectAll('rect')
      .attr('opacity', opacity[0])
      .filter(function (d) {
        return d.index == data.index
      })
      .attr('opacity', opacity[1])
    linkTitleRect.selectAll('rect')
      .attr('opacity', opacity[0])
      .filter(function (d) {
        return d.index == data.index
      })
      .attr('opacity', opacity[1])
    linkTitle.selectAll('text.link')
      .attr('fill', textColor[0])
      .filter(function (d) {
        return d.index == data.index
      })
      .attr('fill', textColor[1])
  }

  this.updateOptions = function (config) {
    if (config.title != undefined) {
      _svgtitle.html(title)
    }
    //是否居中 默认居左
    config.isCenter != undefined ? isCenter = config.isCenter : ''
    //左侧图的宽度，0为不设置
    config.itemW != undefined ? itemW = config.itemW : ''
    //是否排序 节点名称
    config.isSortNode != undefined ? isSortNode = config.isSortNode : ''
    //是否时间顺序
    config.isSortTime != undefined ? isSortTime = config.isSortTime : ''
    config.useDataset!=undefined?useDataset=config.useDataset:''
    //更新宽高
    c
    config.width ? width = config.width : ""
    config.height ? height = config.height : ""
    W = width - marginLeft - marginRight
    H = height - marginTop - marginBottom - 20
    _svgtitle.style('width', width + 'px')
    //更新样式
    if (config.style != undefined) {
      var style = config.style
      style.textColor ? textColor = style.textColor : ""
      style.userColor ? userColor = style.userColor : ""
      style.color ? color = style.color : ""
      style.opacity ? opacity = style.opacity : ""
    }
    render()
  }
  function getType(type) {
    return type == 'create' ? '创建' :
      type == 'refer' ? '合并' :
        type == 'use' ? '使用' : ""
  }
  function getTag(d){
    return '『'+d+'』'
  }
  function formatData(data) {
    var dataSet = {
      classes: [],
      data: [],
      user: [],
      state: {}
    }
   
    //时间排序 小》大
    //chrome方法失效
    // data.sort(function (a, b) {
    //   return a.time > b.time
    // })
    
      data.sort(function (a, b) {
        return parseDate(a.time.substring(0,23)) -parseDate(b.time.substring(0,23)) 
      })
     //数组排序
     dataSet.data = data
    console.log("data",data)
    //刷选出来对应的分支类型
    var time = 'a'
    var index = -1
    dataSet.data.forEach(function (d, i) {
      d['id'] = guid()
      //d.type!='create' && d.type!='use'
      if (d.time != time) {
        index += 1
      }
      d['index'] = index
      if (d.type == 'refer' && dataSet.classes.indexOf(d.from) == -1) {
        dataSet.classes.push(d.from)
        dataSet.state[d.from] = { index: -1 }
      }
      if (dataSet.classes.indexOf(d.to) == -1) {
        dataSet.classes.push(d.to)
        dataSet.state[d.to] = { index: -1 }
      }
      if (dataSet.user.indexOf(d.user) == -1) {
        dataSet.user.push(d.user)
      }
      time = d.time
    })
    isSortNode ? dataSet.classes.sort(function (a, b) { return a > b }) : ""
    return dataSet
  }
  //获取连线
  function GetLines(dataSet, d) {
    var data = []
    var lineData = []
    var orient=0
    var end = dataSet.classes.indexOf(d.to) * itemMargin

    var endLength = dataSet.state[d.to].index * itemMargin1
    var endIndex = dataSet.state[d.to].index
    if (d.type == 'use') {
      lineData.push([end, endLength + nodeR])
      lineData.push([end, itemMargin1 * d.index - nodeR -markerWidth])
      orient=isSortTime?90:-90
      data.push({line:lineData,orient:orient})
    } else if (d.type == 'refer') {
      var start = dataSet.classes.indexOf(d.from) * itemMargin
      var startLength = dataSet.state[d.from].index * itemMargin1

      lineData.push([start, startLength])
      if (start <= end) {//左向右合并
        if (startLength > endLength) {//先右后上
          lineData.push([end - nodeR, startLength])
          lineData.push([end, startLength + nodeR])
          lineData.push([end, itemMargin1 * d.index-nodeR-markerWidth])
          orient=isSortTime?90:-90
        } else {//先上后右
          lineData.push([start, itemMargin1 * d.index - nodeR])
          lineData.push([start + nodeR, itemMargin1 * d.index])
          lineData.push([end-nodeR-markerWidth, itemMargin1 * d.index])
          orient=orient=isSortTime?0:0
        }
      } else {//右向左合并
        if (startLength >= endLength) {//先左后上
          lineData.push([end + nodeR, startLength])
          lineData.push([end, startLength + nodeR])
          lineData.push([end, itemMargin1 * d.index-nodeR-markerWidth])
          orient=isSortTime?90:-90
        } else {//先上后左
          lineData.push([start, itemMargin1 * d.index - nodeR])
          lineData.push([start - nodeR, itemMargin1 * d.index])
          lineData.push([end+nodeR+markerWidth, itemMargin1 * d.index])
          orient=orient=isSortTime?180:180
        }
      }
      data.push({line:lineData,orient:orient})
      if (endIndex != -1&&endIndex!=d.index) {
        lineData=[]
        lineData.push([end, itemMargin1 * endIndex+nodeR])
        lineData.push([end, itemMargin1 * d.index-nodeR -markerWidth])
        data.push({line:lineData,orient:orient=isSortTime?90:-90})
      }
    }

    return data
  }
  function getTitle(dataSet, titltData) {
    var userData = {user:[],data:[]};
    //合并算法
    dataSet.data.forEach(function (v, ind) {
      console.log(v, titltData.index, v.index)
      if (v.index == titltData.index) {
        if (userData.user.indexOf(v.user)==-1) {//创建用户
          userData.user.push(v.user)
          userData.data.push({use:{to:[]},create:{to:[]},refer:[]})
          getTypeData(userData.data[userData.user.indexOf(v.user)],v)
        } else {
          getTypeData(userData.data[userData.user.indexOf(v.user)],v)
        }
      }
    })
    console.log(userData)
    return userData

  }
  //获取通类型
  function getTypeData(data, v) {
    if (v.type == 'refer') {
      var isPush = false
      data.refer.forEach(function (dd, i) {
        if (dd.to == v.to) {
          dd.from.push(v.from)
          isPush =true
        }
      })
      if(!isPush){
        data.refer.push({to:v.to,from:[v.from]})
      }
    } else {//创建，使用处理
      data[v.type].to.push(v.to)
    }

  }
  //生成随机码
  function guid() {
    function S4() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
  }
  //添加箭头 orient是方向
  function addMarker(orient,color){
    var uid = guid()
    rootNode.append('defs').append('marker')
    .attr('id',uid)
    .attr("markerUnits","strokeWidth")
    .attr("markerWidth",markerWidth)
    .attr("markerHeight",markerWidth)
    .attr("viewBox","0 0 12 12")
    .attr("refX","6")
    .attr("refY","6")
    .attr("orient",orient)
    .append("path")
    .attr("d","M2,2 L10,6 L2,10 L6,6 L2,2")
    .attr("fill",color);
    return uid
  }

}
