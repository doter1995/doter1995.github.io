var widget;
//用于生成渐变数据，后期可删除
var parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S");
var formatDate = d3.timeFormat("%Y-%m-%d %H:%M:%S");
var random = function (){return Math.random()/2+Number(0.4)}
window.onload = function () {
    var yAxis2 = [];
    for (var i = 1; i <= 350; i += 2) {
        yAxis2.push([i - 1, i, 'rgba(10,155,51,0.3)', {
            yAxis: [1],
            visible: true
        }])
        yAxis2.push([i, i + 1, 'rgba(34,42,71,0.8)', {
            yAxis: [1],
            visible: true
        }])
    }
    var config = {
        domNode: '#root',
        title: '<div class="svg_title" >&nbsp;</div>',
        width: window.innerWidth - 20,
        height: window.innerHeight - 20,
        xAxis: time ,
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
        yAxis2: yAxis2,
        yAxisSelected: 1,
        lines: data1,
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
        // onSelectColorMap: getResultData,
        onSelectColorMap:function(){},
        OnHoverSelect: function (data) {
        },
        OnHoverSet:[],
        colorMapSelectOffset: 3000,
        hoverSelectOffset: 3000,
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
    function getResultData(x1, x2,yRange,dataSet,pointLength,UID,x0) {
        setTimeout(function (){
            if(widget){
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
                           step>100?step=10:""
                           for(var i=0;i<step;i++){
                               arry.push([item[0],formatDate(Number(date1.valueOf()+i*pointLength*1000)), random()])
                           }
                        } else {//item[1] date1 item[2] date2
                            var step = ((parseDate(item[2])-date1)/pointLength/1000)
                            step>100?step=10:""
                            for(var i=0;i<step;i++){
                                arry.push([item[0],formatDate(Number(date1.valueOf()+i*pointLength*1000)), random()])
                            }
                        }
                    }else if (parseDate(item[1]) < date2 && parseDate(item[2]) > date2) {// date1 item[1]  date2  item[2]
                         var step = ((date2-parseDate(item[1]))/pointLength/1000)
                        step>100?step=10:""
                        for(var i=0;i<step;i++){
                            arry.push([item[0],formatDate(Number(parseDate(item[1]).valueOf()+i*pointLength*1000)), random()])
                        }
                    }
                })
                // 此处调用函数，设置伪彩点的颜色。
                widget.showHoverData(arry,UID)
            }
        },1000)
        return []
    }
}
window.onresize = function () {
    var width = window.innerWidth - 20
    var height = window.innerHeight - 20
    widget.updateOptions({ width: width, height: height })
}
//关于异步加载说明：
//

/*

1. 鼠标移动时，回调onSelectColorMap配置的函数A。

2. 函数A会附带当前选区位置，以及当前UID。(防止多次调用乱序)

3. 使用时在函数A中ajax请求服务器,请求成功后,得到数据data

4. 调用本通试图的.showHoverData(data,UID)//用于在图表中展示伪彩数据。

*/