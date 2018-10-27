// import moduleName from 'd3'
window.onload = function () {
    var W = window.innerWidth * .9
    var H = window.innerHeight * .9
    var margin = 20
    var width = W - 2 * margin
    var height = H - 2 * margin
    
    var inner = 10
    var outer = 100
    var svg = d3.select("#root").append('svg')
        .attr('width', W)
        .attr('height', H)
    var color = d3.scaleOrdinal(d3.schemeCategory20)
    var dataSet = [
        {
            year: 2015,
            apple: 3840,
            bananas: 1920,
            cherries: 960,
            dates: 400
        },
        {
            year: 2016,
            apple: 1840,
            bananas: 2020,
            cherries: 560,
            dates: 1000
        },
        {
            year: 2017,
            apple: 2600,
            bananas: 920,
            cherries: 3960,
            dates: 700
        }, {
            year: 2018,
            apple: 2840,
            bananas: 3920,
            cherries: 1160,
            dates: 1400
        }
    ]
    var stack = d3.stack().keys(["apple", "bananas", "cherries", "dates"])
    var data = stack(dataSet)
    var doMain = dataSet.map(function (d) { return d.year })
    //x y 比例尺
    var scaleX = d3.scaleBand()
        .domain(doMain)
        .rangeRound([0, width])
        .paddingInner(0.05)
        .align(0.1)
    var scaleZ = d3.scaleOrdinal()
    .domain(["apple", "bananas", "cherries", "dates"])
    .range([color(1),color(2),color(3),color(4)])
    var maxYRange = d3.max(dataSet, function (d) { return (d.apple + d.bananas+d.cherries+d.dates) });
    var scaleY = d3.scaleLinear()
        .domain([0,maxYRange])
        .range([height, 0])

    var group = svg.append('g')
        .attr('transform', 'translate(' + margin + ',' + margin + ')')
    var g = group.selectAll('g')
        .data(data)
        .enter()
        .append('g')
        .attr("fill", function(d) { return scaleZ(d.key); })
        .selectAll('rect')
        .data(function (d) { return d })
        .enter()
        .append('rect')
        .attr('stroke','#000')
        .attr("x", function (d, i) { return scaleX(d.data.year) })
        .attr('y', function (d, i) { return scaleY(d[1])})
        .attr('height', function (d, i) { return scaleY(d[0]) - scaleY(d[1]);})
        .attr('width', scaleX.bandwidth())


}