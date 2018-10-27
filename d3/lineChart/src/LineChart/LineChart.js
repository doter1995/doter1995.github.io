function LineChart(config) {
    var DataSet = config.dataSet ? config.dataSet : []; //配置数据

    var Node = config.node ? config.node : document.body; //节点node
    var Width = config.width ? config.width : window.innerWidth - 20; //宽
    var Height = config.height ? config.height : window.innerHeight - 20; //高
    var margin = config.margin ? config.margin : [25, 25, 25, 25];//上下左右
    var themeColor = config.themeColor ? config.themeColor : '#333';//主题色
    var bgColor = config.bgColor ? config.bgColor : '#eee';//背景色
    var lineStyle = config.lineColor ? config.lineColor : ['#E50CE9', 2];
    var tipTitle = config.tipTitle ? config.tipTitle : ["", ""]
    var circleStyle = config.circleStyle ? config.circleStyle : ['#23B9F7', 5];
    var Uint = config.yUint ? config.yUint : '元'; //单位
    var markImage = config.markImage ? config.markImage : [];//
    var dTipIcon = config.dTipIcon ? config.dTipIcon : [];
    var uintColor = config.uintColor ? config.uintColor : '#A9AAAE';
    var axisColor = config.axisColor ? config.axisColor : "#5D38E3"; //轴的颜色
    var yTipTextSize = config.yTipTextSize ? config.yTipTextSize : 10;
    var textSize = config.textSize ? config.textSize : 16;
    var offsetYText =  config.offsetYText?config.offsetYText:10; //
    var isTickShow = config.isTickShow ? config.isTickShow : false; //
    var t = config.t ? config.t : 100; //动画时长
    var R = config.Rx ? config.R : 5; //圆点半径
    var stepLength = config.stepLength ? config.stepLength : 40;
    var yUint = '' + Uint
    var W = Width - margin[2] - margin[3] - 40;
    var H = Height - margin[0] - margin[1] - 30;

    var reactW = textSize * (tipTitle[0].length > tipTitle[1].length ? tipTitle[0].length : tipTitle[1].length)
    reactW += 10 //预设10留白
    var rectH  = 5 * textSize + 10 //预设15留白 
    // console.log('reactW', reactW)
    //记录tipData
    var tipData = -1;
    var digit = 1;   //进阶位数
    var fixNum = 0;

    var svg = d3.select(Node).append('svg').attr('width', Width).attr('height', Height);
    svg.append('rect').attr('x', 0).attr('y', 0).attr('width', Width).attr('height', Height).attr('fill', bgColor);
    var svgG = svg.append('g').attr('class', 'g')
        .attr('transform', 'translate(' + Number(margin[2] + 40) + ',' + margin[0] + ')');
    var parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S");
    var formatDate = d3.timeFormat("%Y-%m-%d %H:%M:%S");

    //计算比例尺
    var xRange = xRange = d3.extent(DataSet, function (d) { return parseDate(d.date) });
    var x = d3.scaleLinear().domain(xRange).range([0, W]);
    var xx = d3.scaleLinear().domain([0, DataSet.length - 1]).range([0, W]);
    var valueMax = d3.max(DataSet, function (d) { return parseInt(d.value) })
    if (valueMax > 100000000) {
        digit = 100000000;
        fixNum = 1;
        yUint = "亿" + Uint;
    } else if (valueMax > 10000) {
        digit = 10000;
        fixNum = 1;
        yUint = "万" + Uint;
    }
    var yRange = [0, valueMax];
    var y = d3.scaleLinear().domain(yRange).range([H, 0]);
    var markData = []  //标记点2016
    var markData1 = [] //标记点2017
    //绘制
    var yAxis = svgG.append('g').attr('class', 'yAxis');
    var xAxis = svgG.append('g').attr('class', 'xAxis').attr('transform', 'translate(0,' + Number(H) + ')');
    yAxis.call(d3.axisLeft(y).ticks(10).tickFormat(function (d) {
        // console.log(d)
        return (d / digit).toFixed(1)
    }));
    var xTickValue = [0];
    for (var i = 1; i < DataSet.length; i++) {
        if (i % 12 == 0) {
            xTickValue.push(i)
        } else {
            if (DataSet.length < stepLength) {
                xTickValue.push(i)
            }
        }
    }
    if (xTickValue.length > 30) {
        var data = []
        var step = Math.round(xTickValue.length/15)
        xTickValue.map(function (d, i) {
            if (i % step == 0) {
                data.push(xTickValue[i])
            }
        })
        data.push(xTickValue[xTickValue.length - 1])
        xTickValue = data
    }
    xAxis.call(d3.axisBottom(xx).ticks('6')
        .tickFormat(tickFormat).tickValues(xTickValue));
    //绘制连线
    var line = d3.line().x(function (d) {
        return x(parseDate(d.date))
    })
        .y(function (d) {
            //处理market点
            return y(d.value)
        });
    // //修改轴颜色
    xAxis.selectAll('text').attr('fill', themeColor);
    yAxis.selectAll('text').attr('fill', themeColor);
    xAxis.selectAll('path').attr('stroke', axisColor);
    yAxis.selectAll('path').attr('stroke', axisColor);
    xAxis.selectAll('line').attr('stroke', axisColor);
    yAxis.selectAll('line').attr('stroke', axisColor);
    //添加单位
    var unit = yAxis.append('text').attr('font-size', yTipTextSize).attr('x',-margin[2]).attr('y',-offsetYText).attr('text-anchor', 'middle').text('销售额/' + yUint).attr('fill', themeColor);
    //绘制线条
    var linesG = svgG.append('g').attr('class', 'lines');
    linesG.append('path')
        .datum(DataSet)
        .attr('d', line)
        .attr('fill', 'none')
        .attr('stroke', lineStyle[0])
        .attr('stroke-width', lineStyle[1]);


    //绘制鼠标监听层
    var tipG = svgG.append('g').attr('class', 'tipG');
    var tipRect = svgG.append('rect')
        .attr('class', 'tiprect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', W)
        .attr('height', H)
        .attr('fill', '#333')
        .attr('opacity', 0)
        .on('mousemove', move)
        .on('mouseover', function () {
            MarkTip0.style('display', 'inline')
            tipG.style('display', 'inline')
        })
        .on('mouseout', function () {
            MarkTip0.style('display', 'none')
            tipG.style('display', 'none')
        })

    DataSet.map(function (d) {
        if (d.exceedFlag == 'Y') {
            markData.push(d)
        }
        if (d.goalFlag == "Y") {
            markData1.push(d)
        }
    })
    // console.log(markData, markData1)
    //绘制mark点
    var markG = svgG.append('g').attr('class', 'markG');

    markG.selectAll('image')
        .data(getMarkData())
        .enter()
        .append('image')
        .attr('width', function (d, i) { return i == 0 ? 16 : 66 })
        .attr('height', function (d, i) { return i == 0 ? 16 : 66 })
        .attr('xlink:href', function (d, i) { return markImage[i] })
        .attr('x', function (d, i) {
            var step = i == 0 ? 8 : 33;
            if (d) {
                return x(parseDate(d.date)) - step
            } else {
                return -99
            }

        })
        .attr('y', function (d, i) {
            var step = i == 0 ? 8 : 33;
            if (d) {
                return y(d.value) - step
            } else {
                return -99
            }

        })
        .on('mousemove.1', move)

    function tickFormat(d) {
        if (d % 12 == 0) {
            return d / 12 + "h"
        } else {
            if (DataSet.length < stepLength) {
                return Math.floor(d / 12) + ':' + d % 12 * 5
            }
        }
    }
    function move() {
        var mouse = d3.mouse(this);
        var mouseDate = x.invert(mouse[0]);
        var mouseData1 = y.invert(mouse[1]);
        var bisectDate = d3.bisector(function (d) {
            return parseDate(d.date);
        }).left;
        var i = bisectDate(DataSet, mouseDate);
        var d0 = DataSet[i - 1];
        var d1 = DataSet[i];
        if (d0 == undefined || d1 == undefined) {
            return;
        }
        var d = mouseDate - parseDate(d0.date) > parseDate(d1.date) - mouseDate
            ? d1
            : d0;
        var d = mouseDate - parseDate(d0.date) > parseDate(d1.date) - mouseDate
            ? d1
            : d0;
        tipData = i;
        var tipx = x(parseDate(d.date));
        var tipy = y(d.value);
        tipG.select('line.xline')
            .attr('x1', tipx)
            .attr('y1', tipy)
            .attr('x2', tipx)
            .attr('y2', H);
        tipG.select('line.yline')
            .attr('x1', 0)
            .attr('y1', tipy)
            .attr('x2', tipx)
            .attr('y2', tipy);
        tipG.select('circle')
            .datum(d)
            .attr('opacity', 1)
            .attr('cx', tipx)
            .attr('cy', tipy)

        //比例尺坐标转为svg中的坐标

        var mouse1 = [tipx + margin[2] + 40, tipy + margin[0]];
        var v;
        var value = (d.value / digit).toFixed(2) + yUint
        v = d.ratio * 100;
        MarkTip0.selectAll('text').remove();
        MarkTip0.selectAll('image').remove();
        MarkTip0.style('display', 'inline');
        if (mouse1[1] > (H+30) / 2) {
            MarkTip0.select('g.rotate').attr('transform-origin', '0,0').attr('transform', 'rotate(0)')

            if (mouse1[0] < W / 2) {
                MarkTip0.select('g.translate').attr('transform', 'translate(20,'+(rectH+7)+')')
                MarkTip0.attr('x', mouse1[0] - 25)
                    .attr('y', mouse1[1] - (rectH+18))
            } else {
                MarkTip0.select('g.translate').attr('transform', 'translate(' + (reactW - 15) + ','+(rectH+8)+')')
                MarkTip0.attr('x', mouse1[0] - reactW+10)
                    .attr('y', mouse1[1] - (rectH+19))
            }
            MarkTip0.append('image').attr('link:href', dTipIcon[0]).attr('width', textSize * 0.9)
                .attr('x', 10).attr('y', 5+2.65*textSize);
            MarkTip0.append('image').attr('link:href', dTipIcon[1]).attr('width', textSize * 0.9)
                .attr('x', 10).attr('y',5+4.05*textSize);
            MarkTip0.append('text')
                .style('font-size', textSize * 0.8 + 'px')
                .attr('x', 10).attr('y', 5+2.0*textSize)
                .text(d.date);
            MarkTip0.append('text')
                .style('font-size', textSize * 0.9 + 'px')
                .style('font-weight', 600)
                .attr('x', 10+textSize).attr('y', 5+3.4*textSize)
                .text('累计销售额' + value);
            MarkTip0.append('text')
                .style('font-size', textSize * 0.9 + 'px')
                .style('font-weight', 600)
                .attr('x', 10+textSize).attr('y', 5+4.8*textSize)
                .text('累计销售同比' + v.toFixed(2) + '%')
        } else {
            MarkTip0.select('g.rotate').attr('transform-origin', '0,0').attr('transform', 'rotate(180)')
            if (mouse1[0] < W / 2) {
                MarkTip0.select('g.translate').attr('transform', 'translate(20,12)')
                MarkTip0.attr('x', mouse1[0] - 15)
                    .attr('y', mouse1[1])
            } else {
                MarkTip0.select('g.translate').attr('transform', 'translate(' + (reactW - 10) + ',12)')
                MarkTip0.attr('x', mouse1[0] - reactW + 15)
                    .attr('y', mouse1[1])
            }
            MarkTip0.append('image').attr('link:href', dTipIcon[0]).attr('width', textSize * 0.9)
                .attr('x', 10).attr('y', 5+2.65*textSize);
            MarkTip0.append('image').attr('link:href', dTipIcon[1]).attr('width', textSize * 0.9)
                .attr('x', 10).attr('y', 5+4.05*textSize);
            MarkTip0.append('text')
                .style('font-size', textSize * 0.8 + 'px')
                .attr('x', 10).attr('y', 5+2.0*textSize)
                .text(d.date);
            MarkTip0.append('text')
                .style('font-size', textSize * 0.9 + 'px')
                .style('font-weight', 600)
                .attr('x', 10+textSize).attr('y', 5+3.4*textSize)
                .text('累计销售额' + value);
            var aaa = MarkTip0.select('text.text3')
            // console.log('aaa', aaa)
            MarkTip0.append('text')
                .style('font-size', textSize * 0.9 + 'px')
                .style('font-weight', 600)
                .attr('x', 10+textSize).attr('y', 5+4.8*textSize)
                .text('累计销售同比' + v.toFixed(2) + '%')
        }



    }
    this.addData = function (data) {
        DataSet = data;
        //更新比例尺
        xRange = xRange = d3.extent(DataSet, function (d) { return parseDate(d.date) });
        x = d3.scaleLinear().domain(xRange).range([0, W]);
        xx = d3.scaleLinear().domain([0, DataSet.length - 1]).range([0, W]);
        var valueMax = d3.max(DataSet, function (d) { return parseInt(d.value) })
        if (valueMax > 100000000) {
            digit = 100000000;
            fixNum = 1;
            yUint = "亿" + Uint;
        } else if (valueMax > 10000) {
            digit = 10000;
            fixNum = 1;
            yUint = "万" + Uint;
        }
        unit.text('销售额/' + yUint).attr('fill', uintColor);
        yRange = [0, valueMax];
        y = d3.scaleLinear().domain(yRange).range([H, 0]);
        //更新坐标
        updateXAxisColor
        yAxis.transition()
            .duration(t)
            .call(d3.axisLeft(y).ticks(10).tickFormat(function (d) {
                // console.log(d)
                return (d / digit).toFixed(1)
            }));
        var xTickValue = [0];
        for (var i = 1; i < DataSet.length; i++) {
            if (i % 12 == 0) {
                xTickValue.push(i)
            } else {
                if (DataSet.length < stepLength) {
                    xTickValue.push(i)
                }
            }
        }
        if (xTickValue.length > 30) {
            var step = Math.round(xTickValue.length/15)
            var data = []
            xTickValue.map(function (d, i) {
                if (i % step == 0) {
                    data.push(xTickValue[i])
                }
            })
            // data.push(xTickValue[xTickValue.length - 1])
            xTickValue = data
        }
        console.log(xTickValue)
        //修改轴颜色
        updateXAxisColor();
        xAxis.transition()
            .duration(t)
            .call(d3.axisBottom(xx)
                .tickFormat(tickFormat).tickValues(xTickValue));
        updateXAxisColor();
        //更新线条
        linesG.select('path')
            .datum(DataSet)
            .transition()
            .duration(t)
            .attr('d', line);
        //绘制mark点
        markG.selectAll('image').remove()
        markG.selectAll('image')
            .data(getMarkData())
            .enter()
            .append('image')
            .attr('width', function (d, i) { return i == 0 ? 16 : 66 })
            .attr('height', function (d, i) { return i == 0 ? 16 : 66 })
            .attr('xlink:href', function (d, i) { return markImage[i] })
            .attr('x', function (d, i) {
                var step = i == 0 ? 8 : 33;
                if (d) {
                    return x(parseDate(d.date)) - step
                } else {
                    return -99
                }

            })
            .attr('y', function (d, i) {
                var step = i == 0 ? 8 : 33;
                if (d) {
                    return y(d.value) - step
                } else {
                    return -99
                }

            })
            .on('mousemove.1', move)
            .on('mousemove.2', function (d, i) {
                if (!d) return
                var mouse = d3.mouse(svg.node());
                MarkTip0.selectAll('text').remove();
                MarkTip0.selectAll('image').remove();
                MarkTip0.style('display', 'inline');
                if (mouse[1] > (H+30) / 2) {
                    MarkTip0.select('g.rotate').attr('transform-origin', '0,0').attr('transform', 'rotate(0)')

                    if (mouse[0] < W / 2) {
                        MarkTip0.select('g.translate').attr('transform', 'translate(20,'+(rectH+8)+')')
                        MarkTip0.attr('x', mouse[0] - 25)
                            .attr('y', mouse[1] - (rectH+18))
                    } else {
                        MarkTip0.select('g.translate').attr('transform', 'translate(' + (reactW - 20) + ','+(rectH+8)+')')
                        MarkTip0.attr('x', mouse[0] - reactW + 20)
                            .attr('y', mouse[1] - (rectH+18))
                    }
                } else {
                    MarkTip0.select('g.rotate').attr('transform-origin', '0,0').attr('transform', 'rotate(180)')
                    if (mouse[0] < W / 2) {
                        MarkTip0.select('g.translate').attr('transform', 'translate(20,12)')
                        MarkTip0.attr('x', mouse[0] - 15)
                            .attr('y', mouse[1])
                    } else {
                        MarkTip0.select('g.translate').attr('transform', 'translate(' + (reactW - 20) + ',12)')
                        MarkTip0.attr('x', mouse[0] - reactW + 25)
                            .attr('y', mouse[1])
                    }
                }
                var value = (d.value / digit).toFixed(2) + yUint
                MarkTip0.append('text')
                    .style('font-size', textSize + 'px')
                    .attr('x', 10).attr('y', 5+2.0*textSize)
                    .text(tipTitle[i]);
                MarkTip0.append('text')
                    .style('font-size', textSize * 1.4 + 'px')
                    .style('font-weight', 600)
                    .attr('x', 10).attr('y', 5+4.2*textSize)
                    .text(value)
            })
            .on('mouseout', function (d, i) {
                MarkTip0.style('display', 'none')
            });

    };
    tipG.append('line')
        .attr('class', 'xline')
        .datum(DataSet[tipData])
        .attr('stroke', '#555')
        .attr('opacity', 0.8)
    tipG.append('line')
        .attr('class', 'yline')
        .datum(DataSet[tipData])
        .attr('opacity', 0.8)
        .attr('stroke', '#555')
    tipG.append('circle')
        .datum(DataSet[tipData])
        .attr('cx', -100)
        .attr('cy', -100)
        .attr('opacity', 1)
        .attr('fill', circleStyle[0])
        .attr('r', circleStyle[1])


    var MarkTip0 = svg.append("svg")
        .attr("class", 'Mark0')
        .style('display', 'none')
        .on('mouseover', function (d) {
            d3.select(this).style('display', 'inline')
        })

    MarkTip0
        .append('g').attr('transform', 'translate(20,68)').attr('class', 'translate') //控制对话框的大小
        .append('g').attr('transform', 'rotate(0)').attr('class', 'rotate')
        .append('path')
        .attr('transform', 'scale(0.01)')
        .attr('fill', '#eee')
        .attr('opacity', '0.8')
        .attr("d", "M512 844.8L759.466667 512l247.466666-332.8H17.066667L264.533333 512z")
    MarkTip0.append('g').attr('transform', 'translate(0,10)')
        .append('rect')
        .attr('class', 'rect')
        .attr('rx', 5).attr('ry', 5)
        .attr('width', reactW)
        .attr('height', rectH)
        .attr('fill', '#eee')
        .attr('opacity', '0.8')

    function getMarkData() {
        markData = []
        markData1 = []
        DataSet.map(function (d) {
            if (d.exceedFlag == 'Y') {
                markData.push(d)
            }
            if (d.goalFlag == "Y") {
                markData1.push(d)
            }
        })
        var data = []
        if (markData.length > 0) {
            data.push(markData[0])
        } else {
            data.push(null)
        }
        if (markData1.length > 0) {
            data.push(markData1[0])
        } else {
            data.push(null)
        }
        return data
    }
    function updateXAxisColor() {
        xAxis.selectAll('text').attr('fill', themeColor);
        yAxis.selectAll('text').attr('fill', themeColor);
        xAxis.selectAll('path').attr('stroke', axisColor);
        yAxis.selectAll('path').attr('stroke', axisColor);
        xAxis.selectAll('line').attr('stroke', axisColor);
        yAxis.selectAll('line').attr('stroke', axisColor);
        if (isTickShow) {
            xAxis.selectAll('line').attr('stroke', axisColor);
        } else {
            xAxis.selectAll('line').attr('stroke', "none");
        }

    }
}