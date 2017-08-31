// import * as d3 from 'd3'
window.onload = function () {
    var cx = 300, cy = 300;
    var width = 600;
    var svg = d3.select("#root")
        .append('svg')
        .attr("width", '100%')
        .attr('height', 600)
        .attr('fill', '#c5c5c5');

    var projection = d3.geoOrthographic()
        .center([0, 0])
        .translate([cx, cy])
        .scale(width / Math.PI)
        .rotate([0, 0, 0])
    var Graticule = d3.geoGraticule()
    var path = d3.geoPath().projection(projection)
    svg.append('g')
        .attr('class', 'grid')
        .append('path')
        .datum(Graticule)
        .attr('class', 'graticule')
        .attr('d', path)
        .attr('stroke-width', '1px')
        .attr('stroke', '#EEE')


    d3.json("./world(1).json", function (datas) {
        var DataSet = datas
        console.log(datas)
        console.log(DataSet)
        let features = DataSet.features
       
        // 渲染地图
        svg.append('g')
            .attr('class', 'map')
            .selectAll('.country')
            .data(features)
            .enter()
            .append('path')
            .attr('class', 'country')
            .attr('d', path)
    });

}