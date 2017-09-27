function Widget(config) {
    var title = config.title ? config.title : '请加入标题'
    var domNode = config.domNode ? config.domNode : 'body'
    var onYAxisClick = config.onYAxisClick ? config.onYAxisClick : function () { console.log('请提供事件处理函数') }
    var xUnit = config.xUnit ? config.xUnit : 'M'
    var data = config.data ? config.data : []
    var xAxis = config.xAxis ? config.xAxis : []
    var yAxis = config.yAxis ? config.yAxis : []
    var width = config.width ? config.width : window.innerWidth
    var height = config.height ? config.height : window.innerHeight
    var marginLeft = 20
    var marginRight = 10
    var marginTop = 10
    var marginBottom = 20
    var W = width - marginLeft - marginRight
    var H = height - marginTop - marginBottom - 20
    //比例尺
    var Y
    var xMain
    //坐标轴
    var _xAxis
    var _yAxis
    var _rects
    var _svgtitle
    var _xAxisG
    var _svg
    var rootG

    function render() {
        d3.select(domNode).selectAll('svg').remove()
        var Node = d3.select(domNode)
        _svgtitle = Node
            .append('div')
            .style('text-align', 'center')
            .style('font-weight', '600')
            .style('font-size', '1rem')
            .attr('width', width)
            .html(config.title)

        _svg = Node.append('svg')
            .attr('width', width)
            .attr('height', height - 20)
        rootG = _svg.append('g')
            .attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')')
        Y = d3.scaleLinear().domain([yAxis[0], yAxis[1]]).range([H, 0])
        xMain = formatX(xAxis)
        console.log(xMain)
        _yAxis = rootG.append('g')
            .attr('class', 'yAxis')
        _yAxis.call(d3.axisLeft(Y))
        _xAxis = rootG.append('g')
            .attr('class', 'xAxis')
            .attr('transform', 'translate(0,' + H + ')')
        _xAxisG = _xAxis.selectAll('g')
            .data(xMain.data)
            .enter()
            .append('g')

        _xAxisG.append('line')
            .attr('x1', function (d, i) {
                return xMain.X(d.range[0])
            })
            .attr('x2', function (d, i) {
                return xMain.X(d.range[1])
            })
            .attr('y1', 1)
            .attr('y2', 1)
            .attr('stroke-width', 4)
            .attr('stroke', function (d, i) {
                return d.data[2]
            })
        _xAxisG.append('text')
            .attr('class', 'text1')
            .attr('font-size', "10")
            .attr('font-family', "sans-serif")
            .attr('text-anchor', 'middle')
            .attr('x', function (d, i) {
                return xMain.X(d.range[0]) + 20
            })
            .attr('y', 15)
            .text(function (d, i) { return d.data[0] + xUnit })
        _xAxisG.append('text')
            .attr('class', 'text2')
            .attr('font-size', "10")
            .attr('font-family', "sans-serif")
            .attr('text-anchor', 'middle')
            .attr('x', function (d, i) {
                return xMain.X(d.range[1]) - 20
            })
            .attr('y', 15)
            .text(function (d, i) { return d.data[1] + xUnit })
        _rects = rootG.append('g')
            .attr('class', 'rects')
            .selectAll('g')
            .data(data)
            .enter()
            .append('g')
            .attr('class', 'rect')
        _rects
            .append('rect')
            .attr('x', function (d, i) {
                return xMain.X(GetXvalue(xMain, d[0]))
            })
            .attr('y', function (d, i) {
                return Y(d[3])
            })
            .attr('width', function (d, i) {
                return xMain.X(GetXvalue(xMain, d[1])) - xMain.X(GetXvalue(xMain, d[0]))
            })
            .attr('height', function (d, i) {
                return Y(d[2]) - Y(d[3])
            })
            .attr('fill', '#eb7d3c')
            .append('title')
            .text(function (d, i) {
                return d[5]
            })
        _rects.append('text')
            .attr('class', 'text')
            .attr('fill', "#fff")
            .attr('x', function (d, i) {
                var x = xMain.X(GetXvalue(xMain, d[1])) + xMain.X(GetXvalue(xMain, d[0]))
                return x / 2
            })
            .attr('y', function (d, i) {
                return (Y(d[2]) + Y(d[3])) / 2 + 7
            })
            .text(function (d, i) {
                return d[4]
            })

    }
    render()
    function rerender() {
        W = width - marginLeft - marginRight
        H = height - marginTop - marginBottom - 20
        _svgtitle.attr('width', width)
        _svg.attr('width', width)
            .attr('height', height - 20)
        Y = Y.range([H, 0])
        xMain = formatX(xAxis)
        _yAxis.call(d3.axisLeft(Y))
        _xAxis = d3.select('g.xAxis').attr('transform', 'translate(0,' + H + ')')
        _xAxis.selectAll('g').remove()
        _xAxisG = _xAxis.selectAll('g')
            .data(xMain.data)
            .enter()
            .append('g')

        _xAxisG.append('line')
            .attr('x1', function (d, i) {
                return xMain.X(d.range[0])
            })
            .attr('x2', function (d, i) {
                return xMain.X(d.range[1])
            })
            .attr('y1', 1)
            .attr('y2', 1)
            .attr('stroke-width', 4)
            .attr('stroke', function (d, i) {
                return d.data[2]
            })
        _xAxisG.append('text')
            .attr('class', 'text1')
            .attr('font-size', "10")
            .attr('font-family', "sans-serif")
            .attr('text-anchor', 'middle')
            .attr('x', function (d, i) {
                return xMain.X(d.range[0]) + 20
            })
            .attr('y', 15)
            .text(function (d, i) { return d.data[0] + xUnit })
        _xAxisG.append('text')
            .attr('class', 'text2')
            .attr('font-size', "10")
            .attr('font-family', "sans-serif")
            .attr('text-anchor', 'middle')
            .attr('x', function (d, i) {
                return xMain.X(d.range[1]) - 20
            })
            .attr('y', 15)
            .text(function (d, i) { return d.data[1] + xUnit })
        d3.selectAll('g.rect').remove()
        _rects = d3.select('g.rects').selectAll('g')
            .data(data)
            .enter()
            .append('g')
            .attr('class', 'rect')
        _rects
            .append('rect')
            .attr('x', function (d, i) {
                return xMain.X(GetXvalue(xMain, d[0]))
            })
            .attr('y', function (d, i) {
                return Y(d[3])
            })
            .attr('width', function (d, i) {
                return xMain.X(GetXvalue(xMain, d[1])) - xMain.X(GetXvalue(xMain, d[0]))
            })
            .attr('height', function (d, i) {
                return Y(d[2]) - Y(d[3])
            })
            .attr('fill', '#eb7d3c')
            .append('title')
            .text(function (d, i) {
                return d[5]
            })
        _rects.append('text')
            .attr('class', 'text')
            .attr('fill', "#fff")
            .attr('x', function (d, i) {
                var x = xMain.X(GetXvalue(xMain, d[1])) + xMain.X(GetXvalue(xMain, d[0]))
                return x / 2
            })
            .attr('y', function (d, i) {
                return (Y(d[2]) + Y(d[3])) / 2 + 7
            })
            .text(function (d, i) {
                return d[4]
            })


    }

    this.updateOptions = function (config) {

        if (config.title != undefined) {
            svgtitle.html(config.title)
        }

        if (config.xUnit != undefined) {
            xUnit = config.xUnit
            xAxisG.selectAll('text.text1')
                .text(function (d, i) { return d.data[0] + xUnit })
            xAxisG.selectAll('text.text2')
                .text(function (d, i) { return d.data[1] + xUnit })
        }
        //更新宽高
        if (config.width != undefined || config.height != undefined) {
            width = config.width
            height = config.height
            rerender()
        }
        //更新坐标轴
        if (config.yAxis != undefined) {
            yAxis = config.yAxis
            Y = Y.domain([yAxis[0], yAxis[1]])
            rerender()
        }
        if (config.xAxis != undefined) {
            xAxis = config.xAxis
            xMain = formatX(xAxis)
            rerender()
        }
        if (config.data != undefined) {
            data = config.data
            var A = d3.selectAll('g.rects')
                .data(data)
            _rects = A.enter()
                .append('g')
                .attr('class', 'rect')
                .merge(A)
            rerender()
        }

        if (config.onYAxisClick) {
            onYAxisClick = config.onYAxisClick
            rerender()
        }
    }


    function formatX(xAxis, H) {
        var xMain = {
            xlength: 0,
            data: [],
            X: null,
        }
        //解析,数据重构
        xAxis.map(function (d, i) {
            var lest = xMain.xlength
            xMain.xlength += (d[1] - d[0])
            xMain.data.push({
                data: d,
                range: [lest, xMain.xlength]
            })
        })
        xMain.X = d3.scaleLinear().domain([0, xMain.xlength]).range([0, W])
        console.log(xMain)
        return xMain
    }
    //将真实数据转化为Y的domain值
    // 后期优化时，可将改方式在原始数据整理时处理
    function GetXvalue(xMain, V) {
        var data = -1
        console.log(xMain)
        xMain.data.map(function (d, i) {
            if (d.data[0] < V && d.data[1] >= V) {
                //属于该对象
                data = V - d.data[0] + d.range[0]
                return data;
            }
        })
        return data;
    }
}