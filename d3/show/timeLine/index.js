// import * as d3 from 'd3'
window.onload = function () {
    var width = 400, height = 400;

    //data 数据 dataTYpe 数据类型 filter指向具体的那个数据（某个站点） isrun 是否播放
    function initTimeline() {
        var fileName = './timeline1.csv'
        var W = window.innerWidth / 24 * 22,
            H = 320;
        var width = W,
            height = H - 40;
        var div = document.getElementById('root_TimeLine')
        div.style.backgroundColor = '#496f66'
        console.log("object d3", d3);
        var svg = d3
            .select(div)
            .append('svg')
            .attr('width', W)
            .attr('height', H),
            margin = {
                top: 20,
                right: 20,
                bottom: 30,
                left: 60
            };
        var zoom = d3
            .zoom()
            .scaleExtent([
                1 / 9999,
                9999
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


        var parseDate = d3.timeParse("%Y-%m-%d"),
            formatDate = d3.timeFormat("%Y");

        var x = d3
            .scaleTime()
            .domain([
                new Date(2000, 0, 1),
                new Date(2016, 1, 0)
            ])
            .range([0, width]);

        var y = d3
            .scaleLinear()
            .range([height, 0]);

        var xAxis = d3.axisTop(x);

        var yAxis = d3.axisLeft(y);

        //定义纵轴网格线
        var yInner = d3
            .axisLeft(y)
            .tickSize(-width, 0, 0)
            .tickFormat("");

        //添加纵轴网格线
        var yInnerBar = svg
            .append("g")
            .attr("class", "inner_line")
            //.attr('stroke', "#e7e7e7")
            .attr("transform", "translate(+" + margin.left + "," + margin.top + ")")
            .call(yInner);

        //定义纵轴网格线
        var xInner = d3
            .axisTop()
            .scale(x)
            .tickSize(-height, 0, 0)
            .tickFormat("");

        //添加纵轴网格线
        var xInnerBar = svg
            .append("g")
            .attr("class", "inner_line")
            .attr("transform", "translate(+" + margin.left + "," + margin.top + ")")
            .call(xInner);


        var line = d3
            .line()
            .x(d => {
                return x(d.date)
            })
            .y(d => {
                return y(d.value)
            });


        var g = svg
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var linePath = g
            .append("path")
            .attr("fill", 'none')
            .attr("stroke-width", 1)
            .attr("stroke", '#395f56');
        g.append('rect').attr('fill', '#496f66').attr('x', -margin.left)     // y轴方块背景色
            .attr('y', 0).attr('width', margin.left).attr('height', height);
        g.append('rect').attr('fill', '#496f66').attr('x', -margin.left)     // x轴方块背景色
            .attr('y', -margin.right).attr('width', width).attr('height', margin.right);
        var yGroup = g.append("g").attr('fill', '#FFF').attr('stroke', '#ddd');


        var xGroup = g
            .append("g")
            .attr('fill', '#333')
            .attr('stroke', '#ddd');
        //.attr("transform", "translate(0," + height + ")"); 使用轴在下方


        var focus = g
            .append('g')
            .style('display', 'show');
        var dataSet = null;
        focus
            .append('line')
            .attr('id', 'focusLineX')
            .attr('fill', 'none')
            .attr('stroke', 'orange')
            .attr('stroke-width', '1px');
        focus
            .append('line')
            .attr('id', 'focusLineY')
            .attr('fill', 'none')
            .attr('stroke', 'orange')
            .attr('stroke-width', '1px');
        focus
            .append('circle')
            .attr('id', 'focusCircle')
            .attr('r', 4)
            .attr('fill', 'orange');
        focus
            .append('rect')
            .attr('x', '-999')
            .attr('id', 'focusTip')
            .attr('fill', 'orange')
            .attr('width', 50)  // 提示块的大小
            .attr('height', 30);
        focus
            .append('text')
            .attr('background-color', '#fff')
            .attr('id', 'focusText')
            .attr('stroke', '#333')


        //添加系列的小圆点
        var circlePath = svg.append('g');

        var zoomRect = svg
            .append("rect")
            .attr("width", width)
            .attr("height", height + margin.top)
            .attr("fill", "none")
            .attr("pointer-events", "all")
            .call(zoom)
            .attr("transform", "translate(" + margin.left + ",0)");

        //var fileName = (view.middle.left.selectedIndex % 2 == 0) ? "./timeline1.csv" : "./timeline2.csv";
        d3.csv(fileName, function (d) {
            d.date = parseDate(d.date);
            d.value = +d.value;
            return d;
        }, function (error, data) {
            if (error)
                throw error;
            dataSet = data;
            //取得最大值最小值
            var xExtent = d3.extent(data, function (d) {
                return d.date;
            });

            zoom.translateExtent([
                [
                    x(xExtent[0]), -Infinity
                ],
                [
                    x(xExtent[1]),
                    Infinity
                ]
            ])
            y.domain([
                0,
                d3.max(data, function (d) {
                    return d.value;
                })
            ]);

            yGroup
                .call(yAxis)
                .attr("class", "axisLine")
                .select(".domain")
                .remove();

            linePath.datum(data);
            //circlePath.datum(data);
            setZoomlisent(x);
            console.log("object", xAxis.tickSizeInner());
            zoomRect.call(zoom.transform, d3.zoomIdentity);
        });
        function zoomed() {
            var xz = d3
                .event
                .transform
                .rescaleX(x);
            xInnerBar.call(xInner.scale(xz));
            xGroup.call(xAxis.scale(xz)).attr("class", "axisLine");
            yGroup.call(yAxis).attr("class", "axisLine");

            setZoomlisent(xz);
            linePath.attr("d", line.x(function (d) {
                return xz(d.date);
            })).attr('stroke', '#Fef')
                .attr('stroke-width', '3px');  // 折线
        }

        function setZoomlisent(x) {
            svg
                .select('g')
                .exit()
                .remove();
            zoomRect.on('mousemove', function (d) {
                var mouse = d3.mouse(this);
                var mouseDate = x.invert(mouse[0]);
                var mouseData1 = y.invert(mouse[1]);
                var bisectDate = d3.bisector(function (d) {
                    return d.date;
                }).left;
                var i = bisectDate(dataSet, mouseDate); // returns the index to the current dataSet item

                var d0 = dataSet[i - 1];
                var d1 = dataSet[i];
                if (d0 == undefined || d1 == undefined) {
                    focus
                        .select('#focusTip')
                        .attr('x', -999);
                    focus
                        .select('#focusText')
                        .attr('x', -9999);
                    return;
                }
                // work out which date value is closest to the mouse
                var d = mouseDate - d0.date > d1.date - mouseDate
                    ? d1
                    : d0;
                var tipx = x(d.date);
                var tipy = y(d.value);
                focus
                    .select('#focusCircle')
                    .attr('cx', tipx)
                    .attr('cy', tipy);
                focus
                    .select('#focusLineX')
                    .attr('x1', tipx)
                    .attr('y1', 0)
                    .attr('x2', tipx)
                    .attr('y2', height);
                focus
                    .select('#focusLineY')
                    .attr('x1', 0)
                    .attr('y1', tipy)
                    .attr('x2', tipx)
                    .attr('y2', tipy);
                focus
                    .select('#focusTip')
                    .attr('x', tipx > width / 2
                        ? tipx - 120
                        : tipx + 20)
                    .attr('y', tipy > height / 2
                        ? tipy - 70
                        : tipy + 20)
                    .text('text' + d.date + ',' + d.value)
                    .attr('text', d.date + ',' + d.value);
                focus
                    .select('#focusText')
                    .attr('x', tipx > width / 2
                        ? tipx - 120
                        : tipx + 20)
                    .attr('y', tipy > height / 2
                        ? tipy - 50
                        : tipy + 40)
                    .text(d.value);
            });
        }
    }

    initTimeline();
}