var widget;
//用于生成渐变数据，后期可删除
var parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S");
var formatDate = d3.timeFormat("%Y-%m-%d %H:%M:%S");
var random = function (){return Math.random()/2+Number(0.4)}
window.onload = function () {
    var config = {
        domNode: '#root',
        title: '<div class="svg_title" >&nbsp;</div>',
        width: window.innerWidth - 20,
        height: window.innerHeight - 20,
        xAxis: ['2017-05-28 21:12:32', '2017-10-20 21:12:38'],
        yAxis: [
            [0, 2, 'rgba(10,19,51,0.8)', {
                yAxis: [1],
                visible: true
            }],
            [2, 3, 'rgba(34,42,71,0.8)', {
                yAxis: [1],
                visible: true
            }],
            [4, 8.01, 'rgba(57,65,91,0.8)', {
                yAxis: [1],
                visible: true
            }]],
        yAxis2: [
            [0, 2.325, 'rgba(10,19,51,0.8)', {
                yAxis: [1],
                visible: true
            }],
            [2.325, 4.325, 'rgba(34,42,71,0.8)', {
                yAxis: [1],
                visible: false
            }],
            [6.325, 8.325, 'rgba(57,65,91,0.8)', {
                yAxis: [1],
                visible: true
            }],
            [10.325, 12.325, 'rgba(83,89,112,0.8)', {
                yAxis: [1],
                visible: true
            }]],
        yAxisSelected: 0,
        lines: [
            [3.2, '2017-06-01 21:12:32', '2017-06-01 21:12:32', { leftAttr: "attr1",color:"#f00",thick:2 }],
            [6.2, '2017-06-15 21:12:32', '2017-06-15 21:12:32', { leftAttr: "attr2",thick:3 }],
            [2.2, '2017-07-01 21:12:32', '2017-08-15 21:12:38', { rightAttr: "attr1" ,thick:2}],
            [4.2, '2017-08-17 21:12:32', '2017-08-31 21:14:38', { rightAttr: "attr2" ,thick:2}],
            [7.2, '2017-08-15 4:12:38', '2017-08-30 21:12:38', { leftAttr: "attr3",thick:5 }],
            [0.2, '2017-09-01 21:12:32', '2017-09-01 21:12:32', { leftAttr: "attr4",thick:4,color:"#f00", rightAttr: "attr3" }]
        ],
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
            console.log(target, event, payload)
        },
        onRightAttrClick: function (target, event, payload) {
            console.log(target, event, payload)
        },
        pointLength:100000,
        onSelectColorMap: function (x1, x2,yRange,dataSet,pointLength,UID) {
            var data = []
            dataSet ? data = dataSet:''
            var arry = []
            var date1 = parseDate(x1)
            var date2 = parseDate(x2)
            data.forEach(function (item, i) {
                if(item[1]==item[2]&&parseDate(item[1])>date1&&parseDate(item[1])<date2){
                    arry.push([item[0],item[2],random()])
                }else if (parseDate(item[1]) < date1 && parseDate(item[2]) > date1) {
                    if ( parseDate(item[2]) > date2) {//线条穿过 item[1] date1  date2 item[2]
                       var step = ((date2-date1)/pointLength/1000)
                       console.log("strep",step)
                       step>100?step=10:""
                       for(var i=0;i<step;i++){
                           arry.push([item[0],formatDate(Number(date1.valueOf()+i*pointLength*1000)), random()])
                       }
                    } else {//item[1] date1 item[2] date2
                        var step = ((parseDate(item[2])-date1)/pointLength/1000)
                        console.log("strep",step)
                        step>100?step=10:""
                        for(var i=0;i<step;i++){
                            arry.push([item[0],formatDate(Number(date1.valueOf()+i*pointLength*1000)), random()])
                        }
                    }
                }else if (parseDate(item[1]) < date2 && parseDate(item[2]) > date2) {// date1 item[1]  date2  item[2]
                     var step = ((date2-parseDate(item[1]))/pointLength/1000)
                    console.log("strep",step)
                    step>100?step=10:""
                    for(var i=0;i<step;i++){
                        arry.push([item[0],formatDate(Number(parseDate(item[1]).valueOf()+i*pointLength*1000)), random()])
                    }
                }
            })
            return arry
        },
        OnHoverSelect: function (data) {
        },
        OnHoverSet:[],
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
        attrLegends: [
            {
                "attr": "attr1",
                type: 'leftAttr',
                "name": "左属性一",
                "description": "左属性一的说明" 
            },
            {
                "attr": "attr2",
                type: 'rightAttr',
                "name": "右属性1",
                "description": "右属性1的说明" 
            }
        ]
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
