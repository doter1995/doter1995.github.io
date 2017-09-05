// import d3 from 'd3'
window.onload = function () {
    var W = window.innerWidth * .9
    var H = window.innerHeight * .9
    var margin = 20
    var inner = 10
    var outer = 100
    var width = W - margin * 2, height = H - margin * 2;
    var svg = d3.select("#root").append('svg')
        .attr('width', W)
        .attr('height', H)
    var color = d3.scaleOrdinal(d3.schemeCategory20)
    //生成随机数
    var rand = d3.randomNormal(170, 10);
    var dataSet = []
    for (var index = 0; index < 100; index++) {
        dataSet.push(rand());
    }
    console.log('dataSet', dataSet)
    //计算极值
    console.log(d3.extent(dataSet))
    //构建直方图生成器
    var histogram = d3.histogram()
        .domain([150, 190])
    var data = histogram(dataSet)
    console.log(data)
    //准备x坐标轴
    var x = d3.scaleLinear()
        .domain(d3.extent(dataSet))
        .range([0, width])
    var axisBottom = d3.axisBottom(x)
    //准备y坐标轴
    var y = d3.scaleLinear()
        .domain([0, 20])
        .range([0, height])
    var group = svg.append('g')
        .attr('transfrom', "translate(" + margin + "," + margin + ")");
    var rects = group.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('fill', function (d, i) { return color(i) })
        .attr('x', function (d) { return x(d.x0) })
        .attr('y', function (d) { return height - y(d.length) })
        .attr('width', function (d) { return x(d.x1) - x(d.x0) })
        .attr('height', function (d) { return y(d.length) })
    group.selectAll('text')
        .data(data)
        .enter()
        .append('text')
        .attr('x', function (d) { return x(d.x0) + 10 })
        .attr('y', function (d) { return height - y(d.length) + 20 })
        .text(function (d) { return d.length })
    group.append("g")
        .attr("class", 'axis')
        .attr('transform', 'translate(' + margin + ',' + (height) + ')')
        .call(axisBottom)
}