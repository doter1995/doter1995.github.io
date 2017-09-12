// import d3 from 'd3'
window.onload = function () {

    var root = d3.select('#root')
        .attr('width', '100%')
        .style('background-color', '#eee')
    var height = window.innerHeight - 1
    var width = root.node().clientWidth
    function initChart() {
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
                id: null, // 用来定义渐变标签id，uuid生成，
                name: 'bb',
                h: 1.7,
                date0: '20160901 08:30:00',
                data0: 20,
                date1: '20161201 20:30:00',
                data1: 80
            },
            {
                id: null,
                name: 'aa',
                h: 0.9,
                date0: '20160901 08:30:00',
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
                date0: '20160701 08:30:00',
                data0: 20,
                date1: '20161202 08:30:00',
                data1: 60
            }
        ]

        var config = {
            background: {
                type: 0,
                data: [
                    [{ index: 0, value: 2, color: '#333' }, { index: 1, value: 2, color: '#444' }],
                    [{ value: 2, color: ['#333', '#eee'] }]
                ]
            }
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
            .domain([0, 3]).range([H, 0])
        var X = d3.scaleTime()
            .domain([new Date(2015, 12, 1), new Date(2016, 12, 4)])
            .range([0, W])
        var Z = d3.scaleLinear()
            .domain([0, 100])
            .range([W / 4, W / 4 * 3])

        //构建一个线性插值器
        var interColor = d3.interpolateRgb("#00ab5d", "#fda700")
        console.log()
        //构建一个线性样式
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
        //构建渐变色方法 
        function addColor(select, startC, endC) {
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
            return id;//返回给d.id 用于在rect中使用
        }
        // 构建背景色(便于背景色调整)

        var backG = svg.append('g')
            .attr('class', 'backG')
            .attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')')
            .append('svg').attr('width', W).attr('height', H)
        // 添加一个配置颜色功能
        svg.append('g')
            .attr('transform', 'translate(' + (marginLeft-35) + ',' + (marginTop-35) + ')')
            .append('text')
            .attr('x',0)
            .attr('y',0)
            .attr('dy','.9em')
            .attr('fill','#f00')
            .text('配置Y轴')
            .on('click',function(){alert('aaa')})
        if (config.background.type == 0) {
            backG.selectAll('rect')
                .data(config.background.data[0])
                .enter()
                .append('rect')
                .attr('x', 0)
                .attr('y', function (d, i) { return d.index == 0 ? 0 : Y(d.value) })
                .attr('width', W)
                .attr('height', function (d, i) { return d.index == 0 ? Y(d.value) : height })
                .attr('fill', function (d, i) { return d.color })
        }

        //构建基础图形(三个轴)
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
            .attr('transform', 'translate(' + marginLeft + ',' + marginTop / 2 + ')')
        ZaxisG.call(d3.axisBottom().scale(Z))
        ZaxisG.select('path').attr('stroke', "url(#" + linearGradient.attr("id") + ")").attr('stroke-width', 10);
        ZaxisG.selectAll('g.tick').select('line').attr('stroke', 'none');
        //构建图形
        //将原始数据排序
        dataSet.sort(function (a, b) {
            return a.h - b.h
        })
        console.log(dataSet)
        var lines = svg.append('g')
            .attr('class', 'lines')
            .attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')')
            .append('svg').attr('width', W).attr('height', H)
        var line = lines.selectAll('g.line')
            .data(dataSet)
            .enter()
            .append('g')
            .attr('class', 'line')
        //构建标签，设置id
        line.each(function (d, i) {
            d.id = addColor(this, interColor(d.data0 / 100), interColor(d.data1 / 100))
        })
        //绘制线
        line.append('rect')
            .attr("x", function (d, i) { return X(parseDate(d.date0)) })
            .attr("width", function (d, i) { console.log(X(parseDate(d.date1)) - X(parseDate(d.date0))); return X(parseDate(d.date1)) - X(parseDate(d.date0)) })
            .attr("y", function (d, i) { return Y(d.h) })
            .attr("height", 2)
            .attr('fill', function (d, i) {
                return "url(#" + d.id + ")"
            })
        // 绘制XY提示线
        var Tip = svg.append('g')
            .attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')')
            .append('svg').attr('width', W).attr('height', H)
        var tipX = Tip.append('line')
            .attr('x1', 20)
            .attr('y1', 0)
            .attr('x2', 20)
            .attr('y2', H)
            .attr('stroke', '#eee')
        var tipY = Tip.append('line')
            .attr('x1', 0)
            .attr('y1', 20)
            .attr('x2', W)
            .attr('y2', 20)
            .attr('stroke', '#eee')
        //绘制zoom
        var zoomRoot = svg.append('g')
            .attr('class', 'zoom')
            .append('rect')
            .attr('fill', 'none')
            .attr("pointer-events", "all")
            .attr('x', marginLeft)
            .attr('y', marginTop)
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
            .on("zoom", zoomed);

        zoomRoot.call(zoom)
        function zoomed() {
            // 构建新X比例尺
            var xz = d3
                .event
                .transform
                .rescaleX(X);
            // 构建新Y比例尺
            var yz = d3
                .event
                .transform
                .rescaleY(Y);
            console.log(xz, yz)
            setZoomlisent(xz, yz)
            //更新 x和Y轴
            XaxisG.call(d3.axisBottom().scale(xz)).attr("class", "axisLine")
            YaxisG.call(d3.axisLeft().scale(yz)).attr("class", "axisLine")
            line.select('rect')
                .transition()
                .duration(100)
                .attr("x", function (d, i) { return xz(parseDate(d.date0)) })
                .attr("width", function (d, i) { return xz(parseDate(d.date1)) - xz(parseDate(d.date0)) })
                .attr("y", function (d, i) { return yz(d.h) })
            if (config.background.type == 0) {
                backG.selectAll('rect')
                    .transition()
                    .duration(100)
                    .attr('x', 0)
                    .attr('y', function (d, i) { return d.index == 0 ? 0 : yz(d.value) })
                    .attr('width', W)
                    .attr('height', function (d, i) { return d.index == 0 ? yz(d.value) : height - yz(d.value) })
                    .attr('fill', function (d, i) { return d.color })
            }

        }
        function setZoomlisent(x, y) {

            zoomRoot.on('mousemove', function (d) {
                var mouse = d3.mouse(this);
                mouse[0] = mouse[0] - marginLeft
                mouse[1] = mouse[1] - marginTop
                //获得当前的鼠标所在比例尺的数据
                var mouseDate = x.invert(mouse[0]);
                var mouseData1 = y.invert(mouse[1]);


                // y轴h处理
                var bisectDate = d3.bisector(function (d) {
                    return d.h;
                }).left;
                console.log(mouseData1)

                var i = bisectDate(dataSet, mouseData1);
                console.log('h的预选值', i)
                if (i > 0 && i < dataSet.length) {
                    if (dataSet[i - 1].h + dataSet[i].h > mouseData1 * 2) {
                        i = i - 1
                    }
                } else {
                    i = i > 0 ? dataSet.length - 1 : 0
                }
                console.log('h的预选值', i)
                // x轴时间处理
                if (parseDate(dataSet[i].date0) > mouseDate || parseDate(dataSet[i].date1) < mouseDate) {
                    i = null;//不符合条件置空
                }
                console.log('最终的I', i)
                console.log('id', dataSet[0])
                console.log('length', line.selectAll('rect'))
                line.selectAll('rect')
                    .transition()
                    .duration(100)
                    .attr("height", 2)

                if (i != null && dataSet[i].id) {
                    var activeId = dataSet[i].id
                    line.filter(function (d, index) {
                        if (d.id == activeId) {
                            return true;
                        } else return false;
                    }).selectAll('rect')
                        .transition()
                        .duration(100)
                        .attr("height", 10)
                        .attr("y", function (d, i) {
                            d3.select('#div_tip')
                                .html(
                                "名称：" + d.name + '</br>' +
                                "身高：" + d.h + "m</br>" +
                                "监测时间：" + d.date0 + "</br>" +
                                "能量大小：" + d.data0 + "</br>" +
                                "监测时间：" + d.date1 + "</br>" +
                                "能量大小：" + d.data1
                                )
                                .style('left', mouse[0] + marginLeft - 20 + 'px')
                                .style('top', y(d.h) + marginRight - 30 + 'px')
                            return y(d.h)
                        })
                    console.log(mouse)

                } else {
                    d3.select('#div_tip')
                        .style('left', '-200px')
                        .style('top', '-800px')
                }
                tipX.transition().duration(10).attr('x1', mouse[0]).attr('x2', mouse[0])
                tipY.transition().duration(10).attr('y1', mouse[1]).attr('y2', mouse[1])
            })
        }
        setZoomlisent(X, Y)
    }
    initChart();
}