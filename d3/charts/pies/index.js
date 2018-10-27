// import d3 from 'd3'
window.onload = function () {
    var isRun = true
    var width = window.innerWidth * .9
    var height = window.innerHeight * .9
    var inner = 10
    var outer = 100
    
    var root = d3.select("#root").append('svg')
        .attr('width', width)
        .attr('height', height)
    //左饼图区
    var svg = root.append('g')
        .attr('class', 'svg1')
        .attr('transform', 'translate(' + width / 3 + ',' + height / 2 + ')')
    //右饼图区    
    var svg1 = root.append('g')
        .attr('class', 'svg2')
        .attr('transform', 'translate(' + width / 3 * 2 + ',' + height / 2 + ')')
    var color = d3.scaleOrdinal(d3.schemeCategory20)
    // 准备数据
    var data = [1, 3, 3, 5, 8, 13, 21];
    var data1 = [1, 3, 3, 5, 8, 13, 21];
    // 构建布局
    var pies = d3.pie();

    var arc = d3.arc()
        .innerRadius(inner)
        .outerRadius(outer)

    //加入拖动
    var draged = d3.drag()
        .on('drag', function (d, i) {
            d.dx += d3.event.dx;
            d.dy += d3.event.dy;
            d3.select(this).attr("transform", "translate(" + d.dx + "," + d.dy + ")");
        })
        .on('end', function (d, i) {
            var dis2 = d.dx * d.dx + d.dy * d.dy
            if (dis2 > outer * outer) {
                //移动到对方饼图中
                if (d.type == 0) {
                    var moveData = data.splice(i, 1);
                    data1.push(moveData)
                } else {
                    var moveData = data1.splice(i, 1);
                    data.push(moveData)
                }


            } else {
                d.type=d.type
                d.dy = 0
                d.dx = 0
            }
            redraw();
        })
    //绘制
    var arcGroup = svg.selectAll('g.arcG').data(pies(data))
        .enter()
        .append('g')
        .attr('class', 'arcG')
        .each(function (d) {
            d.type = 0
            d.dx = 0
            d.dy = 0
        })
        .call(draged)
    var arcGroup1 = svg1.selectAll('g.arcG').data(pies(data1))
        .enter()
        .append('g')
        .attr('class', 'arcG')
        .each(function (d) {
            d.type = 1
            d.dx = 0
            d.dy = 0
        })
        .call(draged)
    arcGroup.append('path')
        .attr("fill", function (d, i) { return color(i) })
        .attr("d", arc)
    arcGroup1.append('path')
        .attr("fill", function (d, i) { return color(i) })
        .attr("d", arc)

    function redraw() {
        var update = svg.selectAll('g.arcG')
            .data(pies(data))

        update.each(function (d) {
            d.type = 0
            d.dx = 0
            d.dy = 0
        })
        .attr("transform", function(d){return "translate(" + d.dx + "," + d.dy + ")"})
            .select('path')
            .attr('d', arc)
        var enter = update.enter()
            .append('g')
            .attr('class', 'arcG')
            .each(function (d) {
                d.type = 0
                d.dx = 0
                d.dy = 0
            }) .attr("transform", function(d){return "translate(" + d.dx + "," + d.dy + ")"})
            .call(draged)

        enter.append('path')
            .attr("fill", function (d, i) { return color(i) })
            .attr('d', arc)

        update.exit().remove();

        var update1 = svg1.selectAll('g.arcG')
            .data(pies(data1))

        update1.each(function (d) {
            d.type = 1
            d.dx = 0
            d.dy = 0
        }).attr("transform", function(d){return "translate(" + d.dx + "," + d.dy + ")"})
            .select('path')
            .attr('d', arc)
        var enter1 = update1.enter()
            .append('g')
            .attr('class', 'arcG')
            .each(function (d) {
                d.type = 1
                d.dx = 0
                d.dy = 0
            }).attr("transform", function(d){return "translate(" + d.dx + "," + d.dy + ")"})
            .call(draged)

        enter1.append('path')
            .attr("fill", function (d, i) { return color(i) })
            .attr('d', arc)

        update1.exit().remove();
    }
}
