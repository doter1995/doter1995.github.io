var widget;
//用于生成渐变数据，后期可删除
var parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S");
var formatDate = d3.timeFormat("%Y-%m-%d %H:%M:%S");
window.onload = function () {
    var yAxis = []
    var lines = []
    var color = ['rgba(10,19,51,0.8)', 'rgba(34,42,71,0.8)', 'rgba(57,65,91,0.8)', 'rgba(83,89,112,0.8)']
    for (i = 0; i < 400; i++) {
        yAxis.push([(i * 0.05).toFixed(2), ((i + 1) * 0.05).toFixed(2), color[i % 4], {
            yAxis: [1],
            visible: true
        }])
       lines.push([i*0.1+0.02, '2017-06-03 21:12:32', '2017-06-15 21:12:38', { leftAttr: "attr1" }])
       lines.push([i*0.1+0.03, '2017-08-15 21:12:32', '2017-08-31 21:14:38', { rightAttr: "attr2" }])
    }
    console.log(yAxis)
    var config = {
        domNode: '#root',
        title: '<div class="svg_title" >&nbsp;</div>',
        width: window.innerWidth - 20,
        height: window.innerHeight - 20,
        xAxis: ['2017-06-01 21:12:32', '2017-10-20 21:12:38'],
        yAxis:yAxis,
        yAxis2:yAxis,
        // yAxis: [
        //     [0, 2, 'rgba(10,19,51,0.8)', {
        //         yAxis: [1],
        //         visible: true
        //     }],
        //     [2, 4, 'rgba(34,42,71,0.8)', {
        //         yAxis: [1],
        //         visible: true
        //     }],
        //     [6, 8, 'rgba(57,65,91,0.8)', {
        //         yAxis: [1],
        //         visible: true
        //     }],
        //     [10, 12, 'rgba(83,89,112,0.8)', {
        //         yAxis: [1],
        //         visible: true
        //     }]],
        // lines: [
        //     [3.2, '2017-06-01 21:12:32', '2017-06-15 21:12:38', { leftAttr: "attr1" }],
        //     [6.2, '2017-06-15 21:12:32', '2017-07-01 21:14:38', { leftAttr: "attr2" }],
        //     [2.2, '2017-07-01 21:12:32', '2017-08-15 21:12:38', { rightAttr: "attr1" }],
        //     [4.2, '2017-08-15 21:12:32', '2017-08-31 21:14:38', { rightAttr: "attr2" }],
        //     [7.2, '2017-08-15 21:12:32', '2017-08-30 21:12:38', { leftAttr: "attr3" }],
        //     [0.2, '2017-08-27 21:12:32', '2017-09-06 21:14:38', { leftAttr: "attr4", rightAttr: "attr3" }]
        // ],
        yAxisSelected: 1,
        lines:lines,
        colorMap: [[0, "#146600"], [0.25, "#0f0"], [0.50, "#f00"], [0.75, "#00f"], [1, "#34FF00"]],
        attrOpts: [{
            type: 'leftAttr',
            name: 'attr1',
            color: '#32fdfd'
        },
        {
            type: 'leftAttr',
            name: 'attr2',
            color: '#61009f'
        },
        {
            type: 'leftAttr',
            name: 'attr3',
            color: '#eacf02'
        }, {
            type: 'leftAttr',
            name: 'attr4',
            color: '#34FF00'
        }, {
            type: 'rightAttr',
            name: 'attr1',
            color: '#39a3f6'
        }, {
            type: 'rightAttr',
            name: 'attr2',
            color: '#f00'
        }, {
            type: 'rightAttr',
            name: 'attr3',
            color: '#f17c67'
        }],
        onLineSelected: function (target, event, payload) {
            // console.log(target, event, payload)
        },
        onRightAttrClick: function (target, event, payload) {
            // console.log(target, event, payload)
        },
        onSelectColorMap: function (x1, x2) {
            var data = [
                [3.2, '2017-06-01 21:12:32', '2017-06-15 21:12:38', { leftAttr: "attr1" }],
                [6.2, '2017-06-15 21:12:32', '2017-07-01 21:14:38', { leftAttr: "attr2" }],
                [2.2, '2017-07-01 21:12:32', '2017-08-15 21:12:38', { rightAttr: "attr1" }],
                [4.2, '2017-08-15 21:12:32', '2017-08-31 21:14:38', { rightAttr: "attr2" }],
                [7.2, '2017-08-15 21:12:32', '2017-08-30 21:12:38', { leftAttr: "attr3" }],
                [0.2, '2017-08-27 21:12:32', '2017-09-06 21:14:38', { leftAttr: "attr4", rightAttr: "attr3" }]
            ]
            var arry = []
            var date1 = parseDate(x1)
            var date2 = parseDate(x2)
            var time0 = new Date()
            data.map(function (item, i) {
                if (parseDate(item[1]) < date1 && parseDate(item[2]) > date1) {
                    arry.push([item[0], formatDate(date1), 0])
                    arry.push([item[0], formatDate(date2), Math.random() / 2 + 0.5])
                } else if (parseDate(item[1]) < date2 && parseDate(item[2]) > date2) {
                    arry.push([item[0], formatDate(date1), 0])
                    arry.push([item[0], formatDate(date2), Math.random() / 2 + 0.5])
                }
            })
            var time1 = new Date()
            // console.log(time1-time0)
            return arry
        },
        OnHoverSelect: function (data) {
            // console.log('OnHoverSelect', data)
        },
        colorMapSelectOffset: 300000,
        hoverSelectOffset: 300000,
        markerInfo: function (x, y, d) {
            return '<div>当前鼠标值：X：' + x + 'Y：' + y + '</div>' +
                '<div>当前值：Y:' + d.data[0] + '</div>' +
                '<div>开始时间：' + d.data[1] + '</div>' +
                '<div>结束时间：' + d.data[2] + '</div>' +
                '<div>附带属性：' + JSON.stringify(d.data[3]) + '</div>'
        },
        rightAttrInfo: function (x, y, d) {
            return '<div>当前鼠标值：X：' + x + 'Y：' + y + '</div>' +
                '<div>当前值：Y:' + d.data[0] + '</div>' +
                '<div>开始时间：' + d.data[1] + '</div>' +
                '<div>结束时间：' + d.data[2] + '</div>' +
                '<div>附带属性：' + JSON.stringify(d.data[3]) + '</div>'
        },
        yUnit: '米',

    }
    widget = new MQVisWidget(config)
    widget.render()
    var config1 = config
    config1.node = '#root1'

}
window.onresize = function () {
    var width = window.innerWidth - 20
    var height = window.innerHeight - 20
    widget.updateOptions({ width: width, height: height })
}
