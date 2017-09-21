function Widget(config) {
   
    //标题
    var title = config.title
    //挂载点
    var node = config.domNode ? d3.select(config.domNode) : d3.select('body')
    //x比例尺
    var xAxis = config.xAxis ? config.xAxis : []
    //y比例尺类型
    var yType = config.yType ? config.yType : 0
    //y比例尺
    var yAxis = config.yAxis ? config.yAxis : [[0, 1, '#ffff00'], [1, 3, '#ffff00']]

    var lines = config.lines ? config.lines : []
    //色条接口  
    var colorMap = config.colorMap ? config.colorMap : []
    var width = config.width ? config.width : 10
    var height = config.height ? config.height - 40 : 10
    var onLineSelected = config.onLineSelected ? config.onLineSelected : function () { alert('请加入点击事件') }
    /**
     * 私有属性
     */
    //基础属性
    var _title;
    var _marginLeft = 25
    var _marginRight = 10
    var _marginTop = 10
    var _marginBottom = 15
    var _svg
    //图表属性
    var _xAxis
    var _yAxis
    var _zAxis
    var _bg
    var _Lines
    var _zoomRoot
    //构建属性
    var _X;
    var _Y;
    var _Z
    var _Ymain
    var _xz
    var _yz
    var _zz
    console.log('tiske', (width / 100).toFixed(0))
    // 日期格式化
    var parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S");
    var formatDate = d3.timeFormat("%Y-%m-%d %H:%M:%S");
    var ticks = (width / 100).toFixed(0)
    var XA = d3.axisBottom()
        .tickFormat(function (d) { return formatDate(d) })
    //初始化渲染
    this.render = function () {

        var W = width - _marginLeft - _marginRight
        var H = height - _marginBottom - _marginTop
        //颜色插值器
        var interColor = d3.interpolateRgb(colorMap[0][1], colorMap[colorMap.length - 1][1])

        _title = node
            .append('div')
            .attr('class', 'widget_node')
            .html(title)
        _svg = node.append('svg')
            .attr('class', 'root')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', 'translate(' + _marginLeft + ',' + _marginTop / 2 + ')')
        _zAxis = _svg
            .append('g')
            .attr('class', 'zAxis')

        _xAxis = _svg
            .append('g')
            .attr('class', 'xAxis')
            .attr('transform', 'translate(0,' + H + ')')
        //todo:宽高需要优化
        _yAxis = _svg
            .append('g')
            .attr('class', 'yAxis')
        _X = d3.scaleTime()
            .domain([parseDate(xAxis[0]), parseDate(xAxis[1])])
            .range([0, W])
        var X = _X
        _Z = d3.scaleLinear()
            .domain([0, 100])
            .range([W / 4, W / 4 * 3])
        var Z = _Z
        _zAxis.call(d3.axisBottom().scale(_Z))
        _zAxis.select('path').attr('stroke', "url(#" + addColor(_zAxis.node(), interColor, 0, 100) + ")").attr('stroke-width', 10);
        _zAxis.selectAll('g.tick').select('line').attr('stroke', 'none');
        _xAxis.call(XA.scale(_X))
        var _Ymain = formatY(yAxis, H);
        console.log('_Ymain', _Ymain)
        _Ymain = _Ymain
        var Y = _Ymain.Y
        //添加背景色
        _bg = _svg
            .append('svg')
            .attr('width', W)
            .attr('height', H)
            .attr('class', 'bg')
        _bg.selectAll('rect')
            .data(_Ymain.data)
            .enter()
            .append('rect')
            .attr('x', 0)
            .attr('y', function (d, i) {
                console.log(_Ymain)
                return _Ymain.Y(d.range[1])
            })
            .attr('width', W)
            .attr('height', function (d, i) {
                return _Ymain.Y(d.range[0]) - _Ymain.Y(d.range[1])
            })
            .attr('fill', function (d, i) {
                return d.data[2]
            })
        //添加y轴
        _yAxis.selectAll('g')
            .data(_Ymain.data)
            .enter()
            .append('g')
            .attr('class', 'ys')
            .each(function (d, i) {
                d3.select(this).append('text').text(d.data[0] + '米')
                    .attr('class', 'text1')
                    .attr('transform', 'translate(-25,' + (Y(d.range[0]) - 10) + ')')
                d3.select(this).append('text').text(d.data[1] + '米')
                    .attr('class', 'text2')
                    .attr('transform', 'translate(-25,' + (Y(d.range[1]) + 15) + ')')
            })

        //添加线条
        _zoomRoot = _svg.append('g')
        _zoomRoot.attr('class', 'zoom')
            .append('rect')
            .attr('fill', 'none')
            .attr("pointer-events", "all")
            .attr('x', _marginLeft)
            .attr('y', _marginTop)
            .attr('width', W)
            .attr('height', H)
        //指定缩放
        var zoom = d3
            .zoom()
            .scaleExtent([
                1 / 9,
                9
            ])
            .translateExtent([
                [-width, -Infinity
                ],
                [
                    2 * width,
                    Infinity
                ]
            ])
            .on("zoom", function () { zoomed(X, _Ymain) });
        //设置room
        _zoomRoot.call(zoom)
        //添加线条
        _Lines = _svg
            .append('svg')
            .attr('width', W)
            .attr('height', H)
            .append('g')
            .attr('class', 'lines')
        _Lines.selectAll('rect')
            .data(lines)
            .enter()
            .append('rect')
            .attr('class', 'line')
            .attr('x', function (d, i) {
                return X(parseDate(d[2]))
            })
            .attr('y', function (d, i) {
                // 
                console.log(GetYvalue(_Ymain, d[0]))
                return _Ymain.Y(GetYvalue(_Ymain, d[0]))
            })
            .attr('width', function (d, i) {
                return X(parseDate(d[2])) - X(parseDate(d[1]))
            })
            .attr('height', 4)
            .attr('fill', '#e3e')
            .on('click', function (d, i) { self.onLineSelected(d3.select(this), d3.event, d) })
    }
    function zoomed(X, _Ymain) {
        console.log()
        // 构建新X比例尺
        var xz = d3
            .event
            .transform
            .rescaleX(X);
        // 构建新Y比例尺
        var yz = d3
            .event
            .transform
            .rescaleY(_Ymain.Y);
        console.log(d3
            .event
            .transform)
        var ys = yz.domain() 
        //控制y轴
        if(ys[0]<0){
            yz.domain([0,(ys[1]+Math.abs(ys[0]))])
        }
        //控制x轴
        console.log(yz.domain())
        //更新 x和Y轴
        d3.selectAll('g.ys')
            .each(function (d, i) {
                d3.select(this).select('text.text1').transition().text(d.data[0] + '米')
                    .attr('transform', 'translate(-25,' + (yz(d.range[0]) - 10) + ')')
                d3.select(this).select('text.text2').transition().text(d.data[1] + '米')
                    .attr('transform', 'translate(-25,' + (yz(d.range[1]) + 15) + ')')
            })
        d3.select('g.lines').selectAll('rect')
            .transition()
            .attr('x', function (d, i) {
                return xz(parseDate(d[1]))
            })
            .attr('y', function (d, i) {
                // 
                return yz(GetYvalue(_Ymain, d[0]))
            })
            .attr('width', function (d, i) {
                return xz(parseDate(d[2])) - xz(parseDate(d[1]))
            })
        d3.select('g.xAxis').call(XA.scale(xz))
        // d3.select('g.yAxis').call(d3.axisLeft().scale(yz))
        //更新背景色
        d3.select('.bg').selectAll('rect')
            .transition()
            .attr('y', function (d, i) {
                console.log(_Ymain)
                return yz(d.range[1])
            })
            .attr('height', function (d, i) {
                return yz(d.range[0]) - yz(d.range[1])
            })
            .attr('fill', function (d, i) {
                return d.data[2]
            })
    }



    var reRender = function (config) {
        var self = this
        //标题已处理,忽略标题
        //更新新X
        var W = width - _marginLeft - _marginRight
        var H = height - _marginBottom - _marginTop
        var X = d3.scaleTime()
            .domain([parseDate(xAxis[0]), parseDate(xAxis[1])])
            .range([0, W])
        _X = X
        var _Ymain = formatY(yAxis, H);
        _Ymain = _Ymain
        var Y = _Ymain.Y

        //更新x轴

        d3.select('g.xAxis').call(XA.scale(X))
        d3.select('g.yAxis').call(d3.axisLeft().scale(Y))
        //更新背景色
        //更新背景色

        var bg = d3.select('.bg').selectAll('rect')
            .data(_Ymain.data)
        console.log(_Ymain.data, bg)
        bg.exit().remove();
        bg.enter()
            .append('rect')
            .merge(bg)
            .attr('y', function (d, i) {
                console.log(_Ymain)
                return Y(d.range[1])
            })
            .attr('height', function (d, i) {
                return Y(d.range[0]) - Y(d.range[1])
            })
            .attr('fill', function (d, i) {
                return d.data[2]
            })
        //更新line

        var lines = d3.select('g.lines').selectAll('rect')
            .data(lines)
        lines.exit().remove()
        var onLineSelected = onLineSelected
        lines.enter().append('rect')
            .merge(lines)
            .on('click', function (d, i) { onLineSelected(d3.select(this), d3.event, d) })
            .transition()
            .attr('x', function (d, i) {
                return X(parseDate(d[1]))
            })
            .attr('y', function (d, i) {
                // 
                console.log('ddd', d[0], GetYvalue(_Ymain, d[0]), _Ymain.Y(GetYvalue(_Ymain, d[0])))
                return _Ymain.Y(GetYvalue(_Ymain, d[0]))
            })
            .attr('width', function (d, i) {
                return X(parseDate(d[2])) - X(parseDate(d[1]))
            })
            .attr('height', 4)
            .attr('fill', '#e3e')

        _zoomRoot.on("zoom", function () { zoomed(X, _Ymain) });
    }


    var updateOptions = function (config) {
        if (config.width != undefined && config.height != undefined)
            d3.select('svg.root').attr('viewBox', '0 0 ' + config.width + ' ' + config.height)
        if (config.title != undefined) {
            console.log('aa', self)
            title = config.title
            setTitle(config.title)
        }
        if (config.xAxis != undefined) {
            xAxis = config.xAxis
            //此处不建议更新吧？
            //建议统一更新
            // self.reRender(config)
        }
        if (config.yAxis != undefined) {
            yAxis = config.yAxis
            //此处不建议更新吧？
            //建议统一更新
            // self.reRender(config)
        }
        if (config.lines != undefined) {
            lines = config.lines
            //此处不建议更新吧？
            //建议统一更新
            // self.reRender(config)
        }
        if (config.extLines != undefined) {
            lines = d3.merge([lines, config.extLines])
            //此处不建议更新吧？
            //建议统一更新
            // self.reRender(config)
        }

        if (config.colorMap != undefined) {
            colorMap = config.colorMap
            //todo:更新z轴，及伪彩图
        }
        console.log(lines)
        self.reRender(config)
    }
    function setTitle(title) {
        d3.select('.widget_node').html(title)
    }




















    /**
     * 工具方法
     */

    //添加变色模板
    function addColor(select, interColor, start, end) {
        var id = guid()
        console.log(interColor, start, end)
        var linearGradient = d3.select(select).append("defs")
            .append("linearGradient")
            .attr("id", id)
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "100%")
            .attr("y2", "0%")
        linearGradient.append("stop")
            .attr("offset", "0%")
            .style("stop-color", interColor(start))
        linearGradient.append("stop")
            .attr("offset", "100%")
            .style("stop-color", interColor(end));
        return id;//返回给d.id 用于在rect中使用
    }

    //生成随机码
    function guid() {
        function S4() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }
    //转换Y轴

    function formatY(yAxis, H) {
        var yMain = {
            ylength: 0,
            data: [],
            Y: null,
            y: [],

        }
        //解析,数据重构
        yAxis.map(function (d, i) {
            var lest = yMain.ylength
            yMain.ylength += (d[1] - d[0])
            yMain.data.push({
                data: d,
                range: [lest, yMain.ylength]
            })
        })
        yMain.Y = d3.scaleLinear().domain([0, yMain.ylength]).range([H, 0])
        yMain.data.map(function (d, i) {
            var lest;
            yMain.y.push(
                d3.scaleLinear().domain(d.data).range([yMain.Y(d.range[0]), yMain.Y(d.range[1])])
            )
        })
        console.log(yMain)
        return yMain
    }
    //将真实数据转化为Y的domain值
    // 后期优化时，可将改方式在原始数据整理时处理
    function GetYvalue(yMain, V) {
        var data = -1
        yMain.data.map(function (d, i) {
            if (d.data[0] < V && d.data[1] > V) {
                //属于该对象
                console.log(V - d.data[0] + d.range[0])
                data = V - d.data[0] + d.range[0]
                return;
            }
        })
        return data;
    }
    var self = this

}