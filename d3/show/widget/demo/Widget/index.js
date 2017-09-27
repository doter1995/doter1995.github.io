var widget
window.onload = function () {
    var config = {
        title: '这是一个标题',
        domNode: '#root',
        xUnit: 'M',
        data: [
            [45, 65, 10, 16, 100, '提示文字'],
            [20, 40, 18, 19, 110]
        ],
        xAxis: [
            [0, 10, '#ffff00'],
            [10, 20, '#22ff00'],
            [20, 80, '#779299']
        ],
        yAxis: [0, 20, 2],
        width:window.innerWidth-5,
        height:window.innerHeight-5
    }
    widget = new Widget(config)
    
}
window.onresize = function (){
    var config = {
        width:window.innerWidth-5,
        height:window.innerHeight-5
    }
    widget.updateOptions(config)
}