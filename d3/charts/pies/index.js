// import d3 from 'd3'
window.onload = function () {
    var width = window.innerWidth * .9
    var height = window.innerHeight * .9
    var inner = 10
    var outer = 100
    var svg = d3.select("#root").append('svg')
        .attr('width', width)
        .attr('height', height)
    var color = d3.scaleOrdinal(d3.schemeCategory20)
    //准备数据
    var data = [1, 3, 3, 5, 8, 13, 21];
    // 构建布局
    var pies = d3.pie()(data);
    console.log("pies", pies)
    //pies存储的是计算后的数据
    //绘制
    var arc = d3.arc()
        .innerRadius(inner)
        .outerRadius(outer)
    //加入拖动
    var draged = d3.drag()
        .on('drag', function (d) {
            d.dx += d3.event.dx;
            d.dy += d3.event.dy;
            d3.select(this).attr("transform", "translate(" + d.dx + "," + d.dy + ")");
        })
    var arcGroup = svg.selectAll('g')
        .data(pies)
        .enter()
        .append('g')
        .each(function (d) {
            d.dx = width / 2
            d.dy = height / 2
        })
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
        .call(draged)
    arcGroup.append('path')
        .attr("fill", function (d, i) { return color(i) })
        .attr("d", arc)



}
