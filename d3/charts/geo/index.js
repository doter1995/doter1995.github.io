// import d3 from 'd3'
window.onload = function () {
    var width = window.innerWidth * .9
    var height = window.innerHeight * .9
    var margin = 20
    var inner = 10
    var outer = 100
    var svg = d3.select("#root").append('svg')
        .attr('width', width - margin * 2)
        .attr('height', height - margin * 2)
        .append("g")
        .attr('transfrom', 'translate(' + margin + ',' + margin + ')')

    var color = d3.scaleOrdinal(d3.schemeCategory20)
    var Times = [new Date(2013, 7, 1), new Date(2013, 7, 15) - 1]
    var x = 0, y = 0 //设置旋转角度
    var dataSet = null
    var projection = d3.geoOrthographic()
        .rotate([x, y, 0])
    var path = d3.geoPath(projection)
    var Graticule = d3.geoGraticule()//创建经纬线
    console.log(Graticule)
    svg.append('g')
        .attr('class', 'graticule')
        .append('path')
        .datum(Graticule)
        .attr('fill', 'none')
        .attr('stroke', '#000')
        .attr('stroke-opacity',.5)
        .attr('d', path)
    d3.json("./world.json", function (error, world) {
        if (error) throw error;

        dataSet = topojson.mesh(world)
        console.log(dataSet)
        svg.insert("path", ".graticule")
            .datum(dataSet)
            .attr("class", 'pathLine')
            .attr("d", path)
            

    });
    var draged = d3.drag()
        .on('drag', function (d) {
            x += d3.event.dx / 10;
            y -= d3.event.dy / 10;
            var path = d3.geoPath(projection.rotate([x, y, 0]))
            svg.select("path.pathLine")
                .transition()
                .duration(0)
                .attr('d', path)
            svg.select('g.graticule>path')
                .attr('class', 'graticule')
                .transition()
                .duration(0)
                .attr('d', path)
        })
    d3.select("svg").call(draged)
}