// import d3 from 'd3'
window.onload = function () {
  var root = document.getElementById('root')
  var width = window.innerWidth * 0.9
  var height = window.innerHeight * 0.9
  var magrin = 50
  var w = width - magrin * 2, h = height - magrin * 2
  var color = d3.scaleOrdinal(d3.schemeCategory20)
  var svg = d3.select(root)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('margin-left', '5%')
    .append('g')
    .attr('class', 'node')
    .attr('transform', 'translate(' + w / 2 + ',' + h / 2 + ')')
  var set = [40, 40, 20]
  var outer = 200, inner = 170
  var pie = d3.pie()
    .startAngle(-0.75 * Math.PI).endAngle(0.75 * Math.PI)
  var arc = d3.arc()
    .innerRadius(inner)
    .outerRadius(outer)
  var arc1 = d3.arc()
    .innerRadius(inner - 4)
    .outerRadius(inner)
  var arcG = svg.append('g')
  arcG.selectAll('path')
    .data(pie(set))
    .enter()
    .append('path')
    .attr('fill', function (d, i) { return color(i) })
    .attr('d', arc)
  var dataleng = []
  for (i = 0; i <= 100; i++) {
    dataleng.push(i)
  }
  d3.symbol(d3.symbolDiamond)
  var scaleArc = d3.scaleLinear().domain([0, 100]).range([-0.75 * Math.PI, 0.75 * Math.PI])
  var scaleKe = d3.scaleLinear().domain([0, 100]).range([-225, 45])
  var dataSet = 0,oldData=0
  //绘制刻度
  var keG = arcG.append('g')
    .attr('class', 'ke')
    .selectAll('line')
    .data(dataleng)
    .enter()

  keG.append('line')
    .attr('stroke', '#000')
    .attr('stroke-width', function (d, i) {
      if (i == 0 || i == 100) { return '1px' }
      else
        return i % 10 == 0 ? '3px' : '1px'
    })
    .attr('x1', function (d) { return x2(d, outer + 5) })
    .attr('y1', function (d) { return y2(d, outer + 5) })
    .attr('y2', function (d) { return y2(d, outer) })
    .attr('x2', function (d) { return x2(d, outer) })
  //刻度值
  keG.append('text')
    .filter(function (d, i) { return i % 10 == 0 ? true : false })
    .text(function (d) { return d })
    .attr('x', function (d) { return x2(d, outer + 17) })
    .attr('y', function (d) { return y2(d, outer + 17) })
    .attr('transform', 'translate(' + -10 + ',' + 4 + ')')
  //绘制指针
  var dataG = arcG.append('g')
    .attr('class', 'zhen')
    .append('polygon')
    .attr('stroke', '#e00')
    .attr('fill', '#a00')
    .attr('points', "-50,0 0,-30 165,0 0,30")
    .attr('transform', 'rotate(' + scaleKe(dataSet) + ')')
  var dataTip = arcG.append('g')
    .attr('class', 'text')

  dataTip.append('rect')
    .attr('fill', '#eee')
    .attr('stroke', '#ccc')
    .attr('x', -80)
    .attr('y', 120)
    .attr('width', 160)
    .attr('height', 80)
  var dataText=dataTip.append('text')
    .style('font-size', 60)
    .style('text-anchor',"middle")
    .attr('fill', '#a00')
    .attr('y', 180)
    .text(dataSet)
  setInterval(update,1000)
  function update(dataSet){
     dataSet = Math.random()*100
     dataText.transition()
     .text( Math.round(dataSet))
     dataG.transition()
     .duration(300)
     .attrTween('transform', function(){
      var i = d3.interpolateNumber(oldData,dataSet);
      return function(t){
        return 'rotate('+scaleKe(i(t))+')'
      }
    })
     .tween('',
       function(){
         var i = d3.interpolateNumber(oldData,dataSet);
         var text;
         return function(t){
          const d0 = i(t) 
           return 'rotate('+scaleKe(d0)+')'
         }
       })
       .on('end',function(){
        oldData=dataSet
       })
  }
  function y2(d, R) {
    return -Math.cos(scaleArc(d)) * R;
  }
  function x2(d, R) {
    return Math.sin(scaleArc(d)) * R;
  }
}