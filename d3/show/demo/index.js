// import d3 from 'd3'
window.onload = function () {

    var root = d3.select('#root')
        .attr('width', '100%')
        .style('background-color', '#eee')
    var height = window.innerHeight - 1
    var width = root.node().clientWidth
    var svg = root.append('svg')
        .attr('width', width)
        .attr('height', height)
    //生成随机码
    function guid() {
        function S4() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }
    //构建数据
    var dataSet = [
        {
            id: null,
            name: 'bb',
            h: 1.5,
            date0: '20161201 08:30:00',
            data0: 20,
            date1: '20161201 20:30:00',
            data1: 80
        },
        {
            id: null,
            name: 'aa',
            h: 1.2,
            date0: '20161201 08:30:00',
            data0: 20,
            date1: '20161201 12:30:00',
            data1: 90
        },
        {
            id: null,
            name: 'aa1',
            h: 1.3,
            date0: '20160601 08:30:00',
            data0: 20,
            date1: '20161201 16:30:00',
            data1: 100
        },
        {
            id: null,
            name: 'aa2',
            h: 2.8,
            date0: '20160801 08:30:00',
            data0: 20,
            date1: '20161202 08:30:00',
            data1: 60
        }
    ]

    var config = {
        background: [
            { start: 0, end: 1, color: '#400' }, { start: 1, end: 2, color: '#040' }, { start: 2, end: 3, color: '#004' }
        ]
    }
    // 日期格式化
    var parseDate = d3.timeParse("%Y%m%d %H:%M:%S"),
        formatDate = d3.timeFormat("%Y");
    //基础图表配置
    var marginTop = 50
    var marginLeft = 100
    var marginBottom = 50
    var marginRight = 100
    var W = width - marginLeft - marginRight
    var H = height - marginBottom - marginTop
    //建立Y比例尺
    var Y = d3.scaleLinear()
        .domain([0, 3]).range([H, marginTop])
    var X = d3.scaleTime()
        .domain([new Date(2015, 12, 1), new Date(2016, 12, 4)])
        .range([0, W])
    var Z = d3.scaleLinear()
        .domain([0, 100])
        .range([W / 4, W / 4 * 3])

    //构建一个线性样式
    var interColor =d3.interpolateRgb("#00ab5d", "#fda700")
    console.log() 
    var defs = svg.append("defs");

    var linearGradient = defs.append("linearGradient")
        .attr("id", "linearColor")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "0%");
    var stop1 = linearGradient.append("stop")
        .attr("offset", "0%")
        .style("stop-color", interColor(0));

    var stop2 = linearGradient.append("stop")
        .attr("offset", "100%")
        .style("stop-color", interColor(1));
    function addColor(select, startC, endC) {
        console.log(select)
        var id = guid()
        var linearGradient = d3.select(select).append("defs")
            .append("linearGradient")
            .attr("id", id)
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "100%")
            .attr("y2", "0%")
        linearGradient.append("stop")
            .attr("offset", "0%")
            .style("stop-color", startC)
        linearGradient.append("stop")
            .attr("offset", "100%")
            .style("stop-color", endC);
        console.log(id)
        return id;
    }
    // 构建背景色
    var backG = svg.append('g')
        .attr('class', 'backG')
        .attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')')
    backG.selectAll('rect')
        .data(config.background)
        .enter()
        .append('rect')
        .attr('x', 0)
        .attr('y', function (d, i) { return Y(d.end) })
        .attr('width', W)
        .attr('height', function (d, i) { return Y(d.start) - Y(d.end) })
        .attr('fill', function (d, i) { return d.color })
    //构建基础图形
    var YaxisG = svg.append('g')
        .attr('class', 'YaxisG')
        .attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')')
    YaxisG.call(d3.axisLeft().scale(Y))
    var XaxisG = svg.append('g')
        .attr('class', 'XaxisG')
        .attr('transform', 'translate(' + marginLeft + ',' + (marginTop + H) + ')')
    XaxisG.call(d3.axisBottom().scale(X))
    var ZaxisG = svg.append('g')
        .attr('class', 'ZaxisG')
        .attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')')
    ZaxisG.call(d3.axisBottom().scale(Z))
    ZaxisG.select('path').attr('stroke', "url(#" + linearGradient.attr("id") + ")").attr('stroke-width', 10);
    ZaxisG.selectAll('g.tick').select('line').attr('stroke', 'none');
    //构建图形
    var lines = svg.append('g')
        .attr('class', 'lines')
        .attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')')
    var line = lines.selectAll('g.line')
        .data(dataSet)
        .enter()
        .append('g')
        .attr('class', 'line')
    line.each(function(d,i){
        d.id=addColor(this, interColor(d.data0/100), interColor(d.data1/100))
    })
    line.append('rect')
        .attr("x", function (d, i) { return X(parseDate(d.date0)) })
        .attr("width", function (d, i) {console.log(X(parseDate(d.date1))-X(parseDate(d.date0))); return X(parseDate(d.date1))-X(parseDate(d.date0))})
        .attr("y", function (d, i) { return Y(d.h) })
        .attr("height", 2)
        .attr('fill', function (d, i) {
            return "url(#" + d.id + ")"
        })
    //指定缩放
   
}