function MQVisWidget(config) {

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
    var width = config.width ? config.width - 15 : 10
    var height = config.height ? config.height - 45 : 10
    var onLineSelected = config.onLineSelected ? config.onLineSelected : function () { alert('请加入点击事件') }
    var yUnit = config.yUnit ? config.yUnit : 'M'
    /**
     * 私有属性
     */
    //基础属性
    var _title;
    var _marginLeft = 25
    var _marginRight = 25
    var _marginTop = 25
    var _marginBottom = 25
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
    var trueF = null;
    var zoom
    //按键状态
    var changeX = false
    var changeY = false
    //缩放状态
    var Xk = 1, Yk = 1, K0 = 1, Mx = 0, My = 0
    console.log('tiske', (width / 100).toFixed(0))
    // 日期格式化
    var parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S");
    var formatDate = d3.timeFormat("%Y-%m-%d %H:%M:%S");
    window.onkeydown = function (e) {
        if (e.keyCode == 16) {
            changeX = true
        }
        if (e.keyCode == 17) {
            changeY = true
        }
        e.stopPropagation()
        e.preventDefault();
    }
    window.onkeyup = function (e) {
        if (e.keyCode == 16) {
            changeX = false
        }
        if (e.keyCode == 17) {
            changeY = false
        }
        e.stopPropagation()
        e.preventDefault();
    }
    var W = width - _marginLeft - _marginRight
    var H = height - _marginBottom - _marginTop
    console.log((W / 100).toFixed(0))
    var XA = d3.axisBottom()
        .tickFormat(function (d) { return formatDate(d) })
    //初始化渲染
    this.render = function () {


        //颜色插值器
        var interColor = d3.interpolateRgb(colorMap[0][1], colorMap[colorMap.length - 1][1])
        console.log(node)
        _title = node
            .append('div')
            .attr('class', 'widget_node')
            .style('width', width + 'px')
            .html(title)
        _svg = node.append('svg')
            .attr('class', 'root')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', 'translate(' + _marginLeft + ',' + _marginTop + ')')
        _zAxis = _svg
            .append('g')
            .attr('class', 'zAxis')
            .attr('transform', 'translate(0,' + -25 + ')')
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
        _Z = d3.scaleLinear()
            .domain([0, 100])
            .range([W / 4, W / 4 * 3])
        _zAxis.call(d3.axisBottom().scale(_Z))
        _zAxis.select('path').attr('stroke', "url(#" + addColor(_zAxis.node(), interColor, 0, 100) + ")").attr('stroke-width', 10);
        _zAxis.selectAll('g.tick').select('line').attr('stroke', 'none');
        var ticks = Number((width / 140).toFixed(0) - 3)
        _xAxis.call(XA.scale(_X).ticks(ticks))
        _Ymain = formatY(yAxis, H);
        Y = _Ymain.Y
        _yz = Y
        _xz = _X
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
                return Y(d.range[1])
            })
            .attr('width', W)
            .attr('height', function (d, i) {
                return Y(d.range[0]) - Y(d.range[1])
            })
            .attr('fill', function (d, i) {
                return d.data[2]
            })
        //添加y轴
        var yrect = _yAxis.selectAll('g')
            .data(_Ymain.data)
            .enter()
            .append('g')
            .attr('class', 'ys')
        yrect.filter(function (d, i) {
            console.log("dada", Math.abs(Y(d.range[1]) - Y(d.range[0])))
            //如果上下两个值域显示重叠，则直接隐藏下部分
            if (Math.abs(Y(d.range[1]) - Y(d.range[0])) < 15) {
                return false
            }
            if (_Ymain.data.length > 2) {
                return i < 1
            }
            return true
        })
            .append('text')
            .attr('font-size', "10")
            .attr('font-family', "sans-serif")
            .attr('text-anchor', 'middle')
            .text(function (d, i) { return d.data[0] + yUnit })
            .attr('class', 'text1')
            .attr('transform', function (d, i) { return 'translate(-15,' + (Y(d.range[0])) + ')' })
        yrect.append('text').text(function (d, i) { return d.data[1] + yUnit })
            .attr('font-size', "10")
            .attr('font-family', "sans-serif")
            .attr('text-anchor', 'middle')
            .attr('class', 'text2')
            .attr('transform', function (d, i) { return 'translate(-15,' + (Y(d.range[1]) + 5) + ')' })

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
        var xdomain = _X.domain()
        var length = xdomain[1] - xdomain[0]
        console.log('xdom', length / (1000))
        zoom = d3
            .zoom()
            .scaleExtent([
                1,
                (length / (1000 * ((width / 130).toFixed(0))))
            ])
            .translateExtent([
                [0, 0
                ],
                [
                    width,
                    height
                ]
            ])
            .on("zoom", zoomed);

        //添加线条
        _Lines = _svg
            .append('svg')
            .attr('class', 'lines')
            .attr('width', W)
            .attr('height', H)
            .append('g')
            .attr('class', 'lines')
        _Lines.selectAll('line')
            .data(formatLine(_Ymain, lines))
            .enter()
            .append('line')
            .attr('class', 'line')
            .filter(function (d, i) {
                return d.rangeY != -1
            })
            .attr('x1', function (d, i) {
                return _X(parseDate(d.data[1]))
            })
            .attr('y1', function (d, i) {
                return _Ymain.Y(d.rangeY)
            })
            .attr('x2', function (d, i) {
                return _X(parseDate(d.data[2]))
            })
            .attr('y2', function (d) {
                return _Ymain.Y(d.rangeY)
            })
            .attr('stroke', '#e3e')
            .attr('stroke-width', 2)
            .on('mouseover', function (d, i) { d3.select(this).attr('stroke-width', 4) })
            .on('mouseout', function (d, i) { d3.select(this).attr('stroke-width', 2) })
            .on('click', function (d, i) { onLineSelected(d3.select(this), d3.event, d.data) })
        //设置room
        _zoomRoot.call(zoom).on("dblclick.zoom", null);
        _Lines.call(zoom).on("dblclick.zoom", null);
        _bg.call(zoom).on("dblclick.zoom", null);
    }
    function zoomed() {
        var D3Zoom = d3.event.transform

        console.log(changeX, changeY)
        // 构建新X比例尺
        var xz = _xz
        // 构建新Y比例尺
        var yz = _yz
        if (changeX || (!changeX && !changeY)) {
            console.log('xk===', Xk, K0)
            //不移动Y
            Xk = Number((D3Zoom.k * Xk / K0))
            console.log('xk===', Xk)
            var zoomKx = d3.event.transform
            zoomKx.k=Xk
            if(zoomKx.k<1){
                zoomKx.k=1
            }
            console.log('zoomKx', zoomKx)
            xz = zoomKx.rescaleX(_X)
        }
        if (changeY || (!changeX && !changeY)) {
            //不移动X
            Yk = (D3Zoom.k * Yk / K0)
            var zoomKy = d3.event.transform
            zoomKy.Yk = Yk
            if(zoomKy.k<1){
                zoomKy.k=1
            }
            console.log('zoomKy', zoomKy)
            yz = zoomKy.rescaleY(_Ymain.Y)
        }
        Mx = D3Zoom.x
        My = D3Zoom.y
        K0 = D3Zoom.k
        var ys = yz.domain()
        var xs = xz.domain()
        console.log("ys", ys[0])
        console.log("ys", d3.event)
        //控制y轴
        // if (ys[0] < 0) {
        //     yz.domain([0, (ys[1] + Math.abs(ys[0]))])
        // }
        console.log('x')
        _xz = xz
        _yz = yz

        _Lines.selectAll('line.line')
            .attr('x1', function (d, i) {
                console.log(d)
                return xz(parseDate(d.data[1]))
            })
            .attr('y1', function (d, i) {
                return yz(d.rangeY)
            })
            .attr('x2', function (d, i) {
                return xz(parseDate(d.data[2]))
            })
            .attr('y2', function (d) {
                return yz(d.rangeY)
            })
        var ticks = Number((width / 140).toFixed(0) - 3)
        console.log("ticks", ticks)
        _xAxis.call(XA.scale(xz).ticks(ticks))
        //控制x轴
        //更新 x和Y轴
        _yAxis
            .selectAll('g.ys')
            .filter(function (d, i) {
                console.log("dada", d)
                //如果上下两个值域显示重叠，则直接隐藏下部分
                if (Math.abs(Y(d.range[1]) - Y(d.range[0])) < 15) {
                    return false
                }
                if (_Ymain.data.length > 2) {
                    return i < 1
                }
                return true
            }).select('text.text1')
            .attr('font-size', "10")
            .attr('font-family', "sans-serif")
            .attr('text-anchor', 'middle')
            .text(function (d, i) { return d.data[0] + yUnit })
            .transition()
            .attr('transform', function (d, i) { return 'translate(-15,' + (yz(d.range[0])) + ')' })
        _yAxis.selectAll('g.ys').select('text.text2')
            .attr('font-size', "10")
            .attr('font-family', "sans-serif")
            .attr('text-anchor', 'middle')
            .text(function (d, i) { return d.data[1] + yUnit })
            .attr('transform', function (d, i) { return 'translate(-15,' + (yz(d.range[1]) + 5) + ')' })
        // d3.select('g.yAxis').call(d3.axisLeft().scale(yz))
        //更新背景色
        _bg.selectAll('rect')
            .attr('y', function (d, i) {
                var y = yz(d.range[1]) > -window.innerHeight ? yz(d.range[1]) : -window.innerHeight
                return y
            })
            .attr('height', function (d, i) {
                var y = yz(d.range[1]) > -window.innerHeight ? yz(d.range[1]) : -window.innerHeight

                return yz(d.range[0]) - y
            })
            .attr('fill', function (d, i) {
                return d.data[2]
            })
    }
    function setZoomlisent(x, y) {
        zoomRoot.on('mousemove', function (d) {
            var mouse = d3.mouse(this);
            mouse[0] = mouse[0] - marginLeft
            mouse[1] = mouse[1] - marginTop
            tipX.duration(10).attr('x1', mouse[0]).attr('x2', mouse[0])
            tipY.duration(10).attr('y1', mouse[1]).attr('y2', mouse[1])
        })
    }


    this.reRender = function (config) {
        _title.style('width', width + 'px').html(title)
        //标题已处理,忽略标题
        //颜色插值器
        var interColor = d3.interpolateRgb(colorMap[0][1], colorMap[colorMap.length - 1][1])
        W = width - _marginLeft - _marginRight
        H = height - _marginBottom - _marginTop
        _svg = node.select('svg.root')
            .attr('width', width)
            .attr('height', height)
            .select('g')

        _svg
            .select('g.xAxis')
            .transition()
            .attr('transform', 'translate(0,' + H + ')')

        _X = d3.scaleTime()
            .domain([parseDate(xAxis[0]), parseDate(xAxis[1])])
            .range([0, W])
        _Z = d3.scaleLinear()
            .domain([0, 100])
            .range([W / 4, W / 4 * 3])
        _zAxis.call(d3.axisBottom().scale(_Z))
        //此处可以判断是否发生颜色变化，或者直接删除原有渐变色
        _zAxis.select('path').attr('stroke', "url(#" + addColor(_zAxis.node(), interColor, 0, 100) + ")").attr('stroke-width', 10);
        _zAxis.selectAll('g.tick').select('line').attr('stroke', 'none');

        var xdomain = _X.domain()
        var length = xdomain[1] - xdomain[0]
        console.log('xdom', length / (1000))
        zoom = zoom
            .scaleExtent([
                1 / 2,
                (length / (1000 * ((width / 130).toFixed(0))))
            ])

        var ticks = Number((width / 140).toFixed(0) - 3)
        _xAxis.call(XA.scale(_X).ticks(ticks))
        _Ymain = formatY(yAxis, H);
        console.log(yAxis, _Ymain)
        console.log(W)
        var Y = _Ymain.Y
        console.log(_Ymain.Y(3))
        //添加背景色
        _bg = _svg
            .select('svg.bg')
            .attr('width', W)
            .attr('height', H)
        _bg.selectAll('rect').remove()
        var bg = _bg.selectAll('rect')
            .data(_Ymain.data)
        bg.enter()
            .append('rect')
            .attr('x', 0)
            .attr('y', function (d, i) {
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
        _yAxis.selectAll('g').remove()
        var yrect = _yAxis.selectAll('g')
            .data(_Ymain.data)
            .enter()
            .append('g')
            .attr('class', 'ys')
        yrect.filter(function (d, i) {
            console.log("dada", Math.abs(Y(d.range[1]) - Y(d.range[0])))
            //如果上下两个值域显示重叠，则直接隐藏下部分
            if (Math.abs(Y(d.range[1]) - Y(d.range[0])) < 15) {
                return false
            }
            if (_Ymain.data.length > 2) {
                return i < 1
            }
            return true
        })
            .append('text').text(function (d, i) { return d.data[0] + yUnit })
            .attr('font-size', "10")
            .attr('font-family', "sans-serif")
            .attr('text-anchor', 'middle')
            .attr('class', 'text1')
            .attr('transform', function (d, i) {

                return 'translate(-15,' + (Y(d.range[0])) + ')'
            })
        yrect.append('text').text(function (d, i) { return d.data[1] + yUnit })
            .attr('font-size', "10")
            .attr('font-family', "sans-serif")
            .attr('text-anchor', 'middle')
            .attr('class', 'text2')
            .attr('transform', function (d, i) { return 'translate(-15,' + (Y(d.range[1]) + 5) + ')' })

        //添加线条
        _zoomRoot
            .attr('width', W)
            .attr('height', H)
        //添加线条
        _Lines = _svg
            .select('svg.lines')
            .attr('width', W)
            .attr('height', H)
            .select('g')
        _Lines.selectAll('line').remove()
        _Lines.selectAll('line')
            .data(formatLine(_Ymain, lines))
            .enter()
            .append('line')
            .attr('class', 'line')
            .filter(function (d, i) {
                return d.rangeY != -1
            })
            .attr('x1', function (d, i) {
                return _X(parseDate(d.data[1]))
            })
            .attr('y1', function (d, i) {
                return _Ymain.Y(d.rangeY)
            })
            .attr('x2', function (d, i) {
                return _X(parseDate(d.data[2]))
            })
            .attr('y2', function (d) {
                return _Ymain.Y(d.rangeY)
            })
            .attr('stroke-width', 4)
            .attr('stroke', '#e3e')
            .on('click', function (d, i) { onLineSelected(d3.select(this), d3.event, d.data) })

        _zoomRoot.on("zoom", function () { zoomed() });
        _zoomRoot.call(zoom)
        _Lines.call(zoom)
        _bg.call(zoom)
    }


    this.updateOptions = function (config) {
        if (config.width != undefined && config.height != undefined) {
            width = config.width - 15
            height = config.height - 45
        }
        if (config.title != undefined) {
            console.log('aa', self)
            title = config.title
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
        if (config.yAxisVisible != undefined) {
            config.map(function (d, i) {
                yAxis[d.index].visible = d.visible
            })
        }
        if (config.attrOpts != undefined) {
            attrOpts = config.attrOpts
            //
        }
        if (config.onLineSelected != undefined) {
            onLineSelected = config.onLineSelected
            //线的点击事件
        }
        if (config.onRightAttrClick != undefined) {
            onRightAttrClick = config.onRightAttrClick
            //有标签的点击事件
        }
        if (config.hoverSelectOffset != undefined) {
            hoverSelectOffset = config.hoverSelectOffset
            //
        }
        if (config.makeInfo != undefined) {
            makeInfo = config.makeInfo
            //
        }
        if (config.leftAttrInfo != undefined) {
            leftAttrInfo = config.leftAttrInfo
            //
        }
        if (config.rightAttrInfo != undefined) {
            rightAttrInfo = config.rightAttrInfo
            //
        }
        if (config.yUnit != undefined) {
            yUnit = config.yUnit
            //
        }
        this.reRender(config)
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
            if (d[3].visible != false) {
                yMain.ylength += (d[1] - d[0])
                yMain.data.push({
                    data: d,
                    range: [lest, yMain.ylength]
                })
            }
        })
        yMain.Y = d3.scaleLinear().domain([0, yMain.ylength]).range([H, 0])
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
                return data;
            }
        })
        return data;
    }
    //将线段在原始阶段处理
    function formatLine(yMain, line) {
        var lines = []
        line.map(function (d, i) {
            lines.push({
                data: d,
                rangeY: GetYvalue(yMain, d[0])
            })
        })
        return lines
    }


    var self = this

}