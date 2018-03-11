function Chart(config) {
  var DataSet = config.dataSet ? config.dataSet : []; //配置数据
  var Node = config.node ? config.node : document.body; //节点node
  var Width = config.width ? config.width : window.innerWidth - 20; //宽
  var Height = config.height ? config.height : window.innerHeight - 20; //高
  var margin = config.margin ? config.margin : [25, 25, 25, 25];//上下左右边距,左=Y轴的宽度
  var color = config.color ? config.color : ["#1775b6", '#adc7ea', '#ff7f00', '#ffbc72', '#24a122', '#96e186'];//柱颜色
  var themeColor = config.themeColor ? config.themeColor : '#333';//主题色
  var bgColor = config.bgColor ? config.bgColor : '#eee';//背景色
  var yUint = config.yUint ? config.yUint : '元';//单位
  var yTipText = config.yTipText ? config.yTipText : '单位'; //y轴标注
  var t = config.t ? config.t : 1000; //动画时长
  var Rx = config.Rx ? config.Rx : 5; //圆角大小
  var W = Width - margin[2] - margin[3] - 40;//图型宽度
  var H = Height - margin[0] - margin[1] - 30;
  var barMargin = config.barMargin ? config.barMargin : 20;
  var yTicksNum = config.yTicksNum ? config.yTicksNum : 6;


  var digit = 1;   //进阶位数
  var fixNum = 0;

  var x, y;//比例尺
  var max = 0, totalMax = 0;
  d3.select(Node).selectAll("*").remove(); //清空画布后重置画布
  var svg = d3.select(Node).append('svg').attr('width', Width).attr('height', Height);
  svg.append('rect').attr('x', 0).attr('y', 0).attr('width', Width).attr('height', Height).attr('fill', bgColor);
  //数据的合并和处理
  DataSet.map(function (d) {
    if (typeof d.value !== 'number') {
      d.value = Number(d.value);
    }
    max += d.value
    totalMax += Number(d.totalValue)
  });
  if (max > 100000000) {
    digit = 100000000;
    fixNum = 1;
    yUint = "亿" + yUint;
  } else if (max > 10000) {
    digit = 10000;
    fixNum = 1;
    yUint = "万" + yUint;
  }

  svg.append('text').attr("class", "yText").attr('x', '' + Number(margin[2] + 0)).attr('y', '' + Number(margin[0] - 10)).text(yTipText + '/' + yUint).attr('fill', themeColor);

  max = Number(Number(max / digit).toFixed(fixNum));

  var yDomain = [0, max];
  var step = max;
  DataSet.map(function (d) {
    d.value = Number(Number(d.value / digit).toFixed(fixNum));
    d['range'] = [step - d.value, step];
    step -= d.value
  });
  DataSet.unshift({
    title: '合计',
    range: [0, max],
    totalValue: totalMax,
    value: max
  });
  var xDomain = [];
  DataSet.map(function (d) {
    xDomain.push(d.title)
  });

  //初始化坐标轴
  y = d3.scaleLinear().domain(yDomain).range([H, 0]);
  x = d3.scaleLinear().domain([0, DataSet.length]).range([0, W]);

  var yaxis = d3.axisLeft(y).ticks(yTicksNum);
  var yAxis = svg.append('g').attr('class', 'yAxis')
    .attr('transform', 'translate(' + Number(margin[2] + 30) + ',' + margin[0] + ')');
  yAxis.call(yaxis);
  //添加网格
  var grid = svg.append("g")
    .attr("class", "grid")
    .attr('transform', 'translate(' + Number(margin[2] + 30) + ',' + margin[0] + ')')
    .call(yaxis.tickSize(-W)
      .tickFormat(""));

  var xaxis = d3.axisBottom(x).ticks(DataSet.length);
  var xAxis = svg.append('g').attr('class', 'xAxis')
    .attr('transform', 'translate(' + Number(margin[2] + 30) + ',' + Number(H + margin[0]) + ')');
  xAxis.call(xaxis);
  xAxis.selectAll('text').remove();
  xAxis.selectAll('text').data(xDomain).enter().append('text')
    .attr('class', 'xAxis_text')
    .attr('x', function (d) {
      return x(xDomain.indexOf(d) + 0.5)
    })
    .attr('y', function (d) {
      return 20
    })
    .text(function (d) {
      return d
    });

  //绘制条
  console.log(DataSet)
  var bars = svg.append('g').attr('class', 'bar')
    .attr('transform', 'translate(' + Number(margin[2] + 30) + ',' + margin[0] + ')')
    .selectAll('g')
    .data(DataSet)
    .enter()
    .append('g');

  bars.append('rect').attr('x', function (d) {
    return x(xDomain.indexOf(d.title)) + barMargin
  })
    .attr('y', function (d) {
      return y(d.range[0])
    })
    .attr('rx', Rx)
    .attr('ry', Rx)
    .attr('width', function (d) {
      return x(1) - 2 * barMargin
    })
    .attr('fill', function (d, i) {
      return color[i % color.length];     //防止颜色越界显示异常
    })
    .attr('height', 0)
    .transition()
    .duration(t)
    .attr('y', function (d) {
      return y(d.range[1])
    })
    .attr('height', function (d) {
      console.log(d);
      return y(d.range[0]) - y(d.range[1])
    });
  bars.append('text')
    .attr('class', 'bar_text')
    .attr('x', function (d) {
      return x(xDomain.indexOf(d.title)) + x(1) / 2
    })
    .attr('y', function (d) {
      return y((d.range[0] + d.range[1]) / 2)
    })
    .attr('text-anchor', 'middle')    //水平居中
    .attr('font-size', '0.1rem')
    .attr('dominant-baseline', 'middle')    //垂直居中
    .text(function (d) {
      return d.value
    })
  bars.on('mousemove', function (d) {
    var mouse = d3.mouse(svg.node())
    MarkTip0.selectAll('text').remove()
    MarkTip0.style('display', 'inline')
    if (mouse[1] > H / 2) {
      MarkTip0.select('g.rotate').attr('transform-origin', '0,0').attr('transform', 'rotate(0)')
      if(mouse[0]<W/2){
        MarkTip0.select('g.translate').attr('transform', 'translate(20,78)')
        MarkTip0.attr('x', mouse[0] - 25)
        .attr('y', mouse[1] - 89)
      }else{
        MarkTip0.select('g.translate').attr('transform', 'translate(130,78)')
        MarkTip0.attr('x', mouse[0]-135)
        .attr('y', mouse[1] - 89)
      }
      MarkTip0.append('text')
        .attr('class', "tip_line")
        .attr('x', 5)
        .attr('y', 35)
        .text('总投放量：' + d.value)
      MarkTip0.append('text')
        .attr('class', "tip_line")
        .attr('x', 5)
        .attr('y', 60)
        .text('累计核销：' + d.totalValue)
    } else {
      MarkTip0.select('g.rotate').attr('transform-origin', '0,0').attr('transform', 'rotate(180)')
      if(mouse[0]<W/2){
        MarkTip0.select('g.translate').attr('transform', 'translate(20,12)')
        MarkTip0.attr('x', mouse[0]-15)
        .attr('y', mouse[1])
      }else{
        MarkTip0.select('g.translate').attr('transform', 'translate(130,12)')
        MarkTip0.attr('x', mouse[0]-125)
        .attr('y', mouse[1])
      }
        MarkTip0.append('text')
        .attr('class', "tip_line")
        .attr('x', 7)
        .attr('y', 40)
        .text('总投放量：' + d.value)
      MarkTip0.append('text')
        .attr('class', "tip_line")
        .attr('x', 7)
        .attr('y', 70)
        .text('累计核销：' + d.totalValue)
    }
  })
    .on('mouseout', function () {
      MarkTip0.style('display', 'none')
    })
  var MarkTip0 = svg.append("svg")
    .attr("class", 'Mark0')
    .style('display', 'none')
  
  MarkTip0
    .append('g').attr('transform','translate(20,68)').attr('class', 'translate') //控制对话框的大小
    .append('g').attr('transform', 'rotate(0)').attr('class', 'rotate')
    .append('path')
    .attr('transform', 'scale(0.01)')
    .attr('fill', '#eee')
    .attr('opacity', '0.8')
    .attr("d", "M512 844.8L759.466667 512l247.466666-332.8H17.066667L264.533333 512z")
  MarkTip0.append('g').attr('transform','translate(0,10)')
    .append('rect')
    .attr('rx',5).attr('ry',5)
    .attr('width',150)
    .attr('height',70)
    .attr('fill', '#eee')
    .attr('opacity', '0.8')
}
