var widget;
window.onload = function () {
    var config = {
        domNode: '#root',
        title: '<div class="svg_title" >通视图标题</div>',
        width: window.innerWidth,
        height: window.innerHeight,
        xAxis: ['2017-06-01 21:12:32', '2017-08-01 21:12:38'],
        yAxis:[[0,1,'#f00'],[1,3,'#ff0'],[6,8,'#fff'],[10,12,'#eee']],
        lines:[
            [3.2,'2017-06-01 21:12:32','2017-06-15 21:12:38',{}],
            [6.2,'2017-06-15 21:12:32','2017-07-01 21:14:38',{}],
            [2.2,'2017-07-01 21:12:32','2017-08-15 21:12:38',{}],
            [4.2,'2017-08-15 21:12:32','2017-08-31 21:14:38',{}],
            [7.2,'2017-08-15 21:12:32','2017-08-30 21:12:38',{}],
            [0.2,'2017-08-27 21:12:32','2017-09-06 21:14:38',{}]
        ],
        colorMap:[[0,"#220000"],[0.5,"#990000"],[1.0,"#ff0000"]],
        onLineSelected:function(target, event, payload){
            console.log(target, event, payload)
        }
    }
    widget = new Widget(config)
    widget.render()
    var config1 = config
    config1.node='#root1'
    
}
window.onresize = function(){
    var width = window.innerWidth
    var height = window.innerHeight
    widget.updateOptions({width:width,height:height})
}