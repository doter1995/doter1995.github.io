// import d3 from 'd3'
window.onload = function () {
    var width = window.innerWidth * .9
    var height = window.innerHeight * .9
    var margin = 20
    var inner = 10
    var outer = 100
    var svg = d3.select("#root").append('svg')
        .attr('width', width)
        .attr('height', height)
        .append("g")
        .attr('transfrom', 'translate(' + margin + ',' + margin + ')')
    var color = d3.scaleOrdinal(d3.schemeCategory20)
    var Times = [new Date(2013, 7, 1), new Date(2013, 7, 15) - 1]
    var x = d3.scaleTime()
        .domain(Times)
        .range([0, width])
    //构建上部
    svg.append('g')
        .attr('transfrom', 'translate(0,' + 0 + ')')
        .call(d3.axisBottom(x)
            .ticks(d3.timeHour, 12)
            .tickSize(-height)
            .tickFormat(function () { return null; }))
        .selectAll(".tick")
        .classed("tick--minor", function (d) { return d.getHours(); });
    //构建下部
    svg.append("g")
        .attr("transform", "translate(0," + (height - 2 * margin) + ")")
        .call(d3.axisBottom(x)
            .ticks(d3.timeDay)
            .tickPadding(0))
        .attr("text-anchor", null)
        .selectAll("text")
        .attr("x", 6);
    //刷子
    svg.append("g")
        .attr("class", "brush")
        .call(d3.brushX()
            .extent([[0, 0], [width, height - 2 * margin]])//规定可选区域
            .on("end", brushended));

    function brushended() {
        if (!d3.event.sourceEvent) return; // Only transition after input.
        if (!d3.event.selection) return; // Ignore empty selections.
        //selection为获取到的当前的鼠标选中的x0 x1的值
        //然后通过x.invert将x0 x1反转为x对应点
        var d0 = d3.event.selection.map(x.invert),
            //
            d1 = d0.map(d3.timeDay.round);
        // round function (date) {
        //     var d0 = interval(date),
        //         d1 = interval.ceil(date);
        //     return date - d0 < d1 - date ? d0 : d1;
        // }
        // If empty when rounded, use floor & ceil instead.
        if (d1[0] >= d1[1]) {
            d1[0] = d3.timeDay.floor(d0[0]);
            d1[1] = d3.timeDay.offset(d1[0]);
        }
        //移动矩形选取
        d3.select(this).transition().call(d3.event.target.move, d1.map(x));
    }
}