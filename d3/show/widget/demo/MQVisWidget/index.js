var widget;
window.onload = function () {
    var config = {
        domNode: '#root',
        title: '<div class="svg_title" >通视图标题</div>',
        width: window.innerWidth,
        height: window.innerHeight,
        xAxis: ['2017-06-01 21:12:32', '2017-08-01 21:12:38'],
        yAxis:[
            [0,2,'#f00',{
                yAxis:[1],
                visible:true
            }],
            [2,4,'#ff0',{
                yAxis:[1],
                visible:true
            }],
            [6,8,'#fff',{
                yAxis:[1],
                visible:true
            }],
            [10,12,'#eee',{
                yAxis:[1],
                visible:true
            }]],
        lines:[
            [3.2,'2017-06-01 21:12:32','2017-06-15 21:12:38',{}],
            [6.2,'2017-06-15 21:12:32','2017-07-01 21:14:38',{}],
            [2.2,'2017-07-01 21:12:32','2017-08-15 21:12:38',{}],
            [4.2,'2017-08-15 21:12:32','2017-08-31 21:14:38',{}],
            [7.2,'2017-08-15 21:12:32','2017-08-30 21:12:38',{}],
            [0.2,'2017-08-27 21:12:32','2017-09-06 21:14:38',{}]
        ],
        colorMap:[[0,"#220000"],[0.5,"#990000"],[1.0,"#ff0000"]],
        attrOpts:[{
            type:'leftAttr',
            name:'attr1',
            color:'#f00'
        },{
            type:'rightAttr',
            name:'attr2',
            color:'#0f0'
        }],
        onLineSelected:function(target, event, payload){
            console.log(target, event, payload)
        },
        onRightAttrClick:function(target, event, payload){
            console.log(target, event, payload)
        },
        hoverSelectOffset:12,
        makeInfo:'辅助信息',
        leftAttrInfo:'辅助信息',
        rightAttrInfo:'辅助信息',
        yUnit:'米',

    }
    widget = new MQVisWidget(config)
    widget.render()
    var config1 = config
    config1.node='#root1'
    
}
window.onresize = function(){
    var width = window.innerWidth
    var height = window.innerHeight
    widget.updateOptions({width:width,height:height})
}