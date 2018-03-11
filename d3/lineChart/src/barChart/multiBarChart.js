function multiBarChart(config) {
    var DataSet = config.dataSet ? config.dataSet : []; //配置数据
    var Node = config.node ? config.node : document.body; //节点node
    var Width = config.width ? config.width : config.node.innerWidth - 20; //宽
    var Height = config.height ? config.height : config.node.innerHeight - 20; //高
    var margin = config.margin ? config.margin : [25, 25, 25, 50];//上下左右
    var color = config.color ? config.color : "#FBA944";//柱子颜色
    var themeColor = config.themeColor ? config.themeColor : '#333';//主题色
    var bgColor = config.bgColor ? config.bgColor : '#2A1C97';//背景色
    var linearColor = config.linearColor ? config.linearColor : ["#ee894f", "#EDC657"];//柱子漸變色
    var lineColor = config.lineColor?config.lineColor:"rgba(255,255,255,0.21)";
    var axisColor = config.axisColor?config.axisColor:"#5D38E3"; //轴的颜色
    var yUint = config.yUint ? config.yUint : '' //单位
    var yTipText = config.yTipText ? config.yTipText : '单位'; //y轴标注
    var xUint = config.xUint ? config.xUint : '' //单位
    var xTipText = config.xTipText ? config.xTipText : '单位'; //x轴标注
    var yTipTextSize = config.yTipTextSize?config.yTipTextSize:10;
    var Rx = config.Rx ? config.Rx : 30; //圆角大小
    var barWidth = config.barWidth ? config.barWidth : 20;
    var offsetXText =  config.offsetXText?config.offsetXText:5; //
    var offsetYText =  config.offsetYText?config.offsetYText:10; //
    var textSize = config.textSize ? config.textSize : 16
    var wOffset = 40;
    var hOffset = 30;
    var W = Width - margin[2] - margin[3] - wOffset;
    var H = Height - margin[0] - margin[1] - hOffset;
    var t = config.t ? config.t : 1000; //动画时长
    var tipScale = config.tipScale ? config.tipScale : 0.3; //动画时长
    var isTickShow = config.isTickShow?config.isTickShow: false; //
    var reactW = textSize * 8
    reactW += 0//预设20留白
    var rectH  = 3 * textSize + 20 //预设15留白
    d3.select(Node).selectAll("*").remove(); //清空画布后重置画布
    // d3.select(Node).style("position","relative");
    var svg = d3.select(Node).append('svg').attr('width', Width).attr('height', Height);

    this.render = function (isFirst) {
        svg.selectAll("*").remove();
        svg.append('rect').attr('x', 0).attr('y', 0).attr('width', Width).attr('height', Height).attr('fill', bgColor);

        var max = d3.max(DataSet, function (d) {
            return parseFloat(d.value);
        });
        if (max > 100000000) {
            yUint = "亿元";
        }else if (max > 10000) {
            yUint = "万元";
        }

        var xDomain = DataSet.map(function (d) {
            return d.text;
        });

        // 比例尺
        var x = d3.scaleLinear().domain([0, DataSet.length]).range([0, W]),
            y1 = d3.scaleLinear().domain([0, max]).range([H, 0]),
            y = d3.scaleLinear().domain([0, max]).range([0, H]);
        // y轴格式化
        var xAxisValueFormat = function (d) {
            var ratio = 10000;
            if(yUint.indexOf("万") > -1){
                ratio = 10000
            }else if (yUint.indexOf("亿") > -1)
            {
                ratio = 100000000;
            }
            return d / ratio;
        };
        var yAxis = svg.append('g').attr('class', 'axis yAxis')
            .attr('transform', 'translate(' + Number(margin[2] + wOffset) + ',' + margin[0] + ')')
            .call(d3.axisLeft(y1).tickFormat(xAxisValueFormat));

        yAxis.append('text').attr('x',-margin[2]).attr('y',-offsetYText).text(yTipText+'/' + yUint).attr('text-anchor', 'middle') .attr('fill',themeColor).attr("font-size",yTipTextSize);

        var xAxis = svg.append('g').attr('class', 'axis xAxis')
            .attr('transform', 'translate(' + Number(margin[2] + wOffset) + ',' + Number(H + margin[0]) + ')')
            .call(d3.axisBottom(x).ticks(DataSet.length));

        xAxis.selectAll('text').remove();
        xAxis.selectAll('text').data(xDomain).enter().append('text')
            .attr('x', function (d) {
                return x(xDomain.indexOf(d) + 0.5);
            })
            .attr('y', function (d) {
                return 20;
            })
            .text(function (d,i) {
                // if(W<500&&W>300&&i%2!=0){
                //     return ''
                // }else if(W<300&&W>100&&i%3!=0){
                //     return ''
                // }
                // else if(W<100&&i%6!=0){
                //     return ''
                // }
                return d;
            });

        xAxis.append('text').attr('x',x(xDomain.length)+offsetXText).attr('y',20).text(xTipText).attr('fill',themeColor);

        xAxis.selectAll('text').attr('fill', themeColor);
        yAxis.selectAll('text').attr('fill', themeColor);
        xAxis.selectAll('path').attr('stroke', themeColor);
        yAxis.selectAll('path').attr('stroke', themeColor);
        if(isTickShow){
            xAxis.selectAll('line').attr('stroke', themeColor);
        }else{
            xAxis.selectAll('line').attr('stroke', "none");
        }

        yAxis.selectAll('line').attr('stroke', themeColor);
        svg.selectAll(".domain").attr("stroke",axisColor);

        var bars = svg.append('g').attr('class', 'bar')
            .attr('transform', 'translate(' + Number(margin[2] + wOffset) + ',' + (margin[0]) + ')')
            .selectAll('g')
            .data(DataSet)
            .enter()
            .append('g');
        var defs = svg.append("defs");
        var linearGradient = defs.append("linearGradient")
            .attr("id", "linear")
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "100%")
            .attr("y2", "0%");
        linearGradient.append("stop")
            .attr("stop-color", linearColor[0])
            .attr("offset", "0");
        linearGradient.append("stop")
            .attr("stop-color", linearColor[1])
            .attr("offset", "1");

        var rectGroup = bars.append('rect').attr('x', function (d) {
            return (x(xDomain.indexOf(d.text) + 0.5) - barWidth / 2);
        })
            .attr('rx', Rx)
            .attr('ry', Rx)
            .attr("class", "singleBar")
            .attr('width', function (d) {
                return barWidth;
            })
            .attr("data-value", function (d) {
                return d.value;
            })
            .attr('fill', "url(#linear)")
            .attr('y', function (d) {
                return y(max);
            });
        if (isFirst) {
            rectGroup
                .attr('height', 0)
                .transition()
                .duration(t)
                .attr('y', function (d) {
                    return y(max - Number(d.value));
                })
                .attr('height', function (d) {
                    var data = Number(d.value);
                    return y(data < 0 ? 0 : data);
                });
        } else {
            rectGroup
                .attr('y', function (d) {
                    return y(max - d.value);
                })
                .attr('height', function (d) {
                    var data = Number(d.value);
                    return y(data < 0 ? 0 : data);
                });
        }


        // //鼠标监听层
        bars.selectAll("rect")
            .on('mousemove', function (d) {

                MarkTip0.style('display', 'block');
                MarkTip0.selectAll('text').remove();
                //这是每个柱子携带的信息
                // console.log(d3.select(this).attr("data-value"));
                var mouse = d3.mouse(this);
                // var mouseX = x.invert(mouse[0]);
                // var mouseY = y1.invert(mouse[1]);
                //需要获取前一个点的name
                var afterName = Number(d.text)+1
                var mouse = d3.mouse(svg.node());
                // 上半部分
                if (mouse[1] > H / 2) {
                    MarkTip0.select('g.rotate').attr('transform-origin', '0,0').attr('transform', 'rotate(0)')
                    if(mouse[0]<W/2){
                        MarkTip0.select('g.translate').attr('transform', 'translate(20,'+(rectH+8)+')')
                        MarkTip0.attr('x', mouse[0] - 25)
                            .attr('y', mouse[1] - (rectH+18))
                    }else{
                        MarkTip0.select('g.translate').attr('transform', 'translate('+(reactW-20)+','+(rectH+8)+')')
                        MarkTip0.attr('x', mouse[0]-(reactW-15))
                            .attr('y', mouse[1] - (rectH+18))
                    }
                    MarkTip0.append('text')
                        .style('font-size', textSize + 'px')
                        .attr('x', 5)
                        .attr('y', 5+1.8*textSize)
                        .text(d.text + '-' + afterName + "时 销售额")
                    MarkTip0.append('text')
                        .style('font-size', textSize *1.1 + 'px')
                        .style('font-weight', 600)
                        .attr('x', 5)
                        .attr('y', 15+3*textSize)
                        .text((Math.round(xAxisValueFormat(d.value)*100)/100).toFixed(2) + yUint)
                } else {
                    // 下半部分
                    MarkTip0.select('g.rotate').attr('transform-origin', '0,0').attr('transform', 'rotate(180)')
                    if(mouse[0]<W/2){
                        MarkTip0.select('g.translate').attr('transform', 'translate(20,12)')
                        MarkTip0.attr('x', mouse[0]-15)
                            .attr('y', mouse[1])
                    }else{
                        MarkTip0.select('g.translate').attr('transform', 'translate('+(reactW-20)+',12)')
                        MarkTip0.attr('x', mouse[0]-(reactW-25))
                            .attr('y', mouse[1])
                    }
                    MarkTip0.append('text')
                        .style('font-size', textSize  + 'px')
                        .attr('x', 5)
                        .attr('y', 5+1.8*textSize)
                        .text(d.text + '-' + afterName + "时 销售额")
                    MarkTip0.append('text')
                        .style('font-size', textSize * 1.1 + 'px')
                        .style('font-weight', 600)
                        .attr('x', 5)
                        .attr('y', 15+3*textSize)
                        .text((Math.round(xAxisValueFormat(d.value)*100)/100).toFixed(2) + yUint)
                }

                var index = 0;
            })
            .on('mouseout', function () {
                // MarkTip0.style('display','none');
            });

        var MarkTip0 = svg.append("svg")
            .attr("class", 'Mark0')
            .style('display', 'none');
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
            .attr('rx', 5).attr('ry', 5)
            .attr('width', reactW)
            .attr('height', rectH)
            .attr('fill', '#eee')
            .attr('opacity', '0.8')

        var lines = svg.select(".yAxis").selectAll("line").attr("stroke",lineColor);
        lines.each(function () {
            d3.select(this).attr("x2",W);
        })
    };
    this.update = function (data) {
        DataSet = data;
        this.render(false);
    };

    this.render(true);
}
