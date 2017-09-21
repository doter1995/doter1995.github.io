var widget;
window.onload = function () {
    var config = {
        node: '#root',
        title: '<div class="svg_title" >通视图标题</div>',
        width: window.innerWidth-40,
        height: window.innerHeight-40,
        xAxis: ['2017-06-01 21:12:32', '2017-08-01 21:12:38'],
        yAxis:[[0,1,'#f00'],[1,3,'#ff0'],[6,8,'#fff'],[10,12,'#eee']],
        lines:[
            [3.2,'2017-06-01 21:12:32','2017-08-01 21:12:38',{}],
            [6.2,'2017-06-01 21:12:32','2017-07-01 21:14:38',{}],
            [2.2,'2017-06-01 21:12:32','2017-08-01 21:12:38',{}],
            [4.2,'2017-06-01 21:12:32','2017-07-01 21:14:38',{}],
            [7.2,'2017-06-01 21:12:32','2017-08-01 21:12:38',{}],
            [0.2,'2017-06-01 21:12:32','2017-07-01 21:14:38',{}]
        ],
        colorMap:[[0,"#220000"],[0.5,"#990000"],[1.0,"#ff0000"]],
        onLineSelected:function(target, event, payload){
            console.log(target, event, payload)
        }
        
    }
    widget = new Widget(config)
    widget.render()

}