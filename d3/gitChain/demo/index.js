
var data = [{"from": "", "to": "\u6570\u636e\u96c61", "user": "\u5218\u79d1\u957f", "type": "create", "time": "2017-11-11 23:05:04.747256", "user_id": "1001", "allow_use": false}, {"from": "\u6570\u636e\u96c61", "to": "\u6570\u636e\u96c62", "user": "\u5f20\u6559\u6388", "type": "refer", "time": "2017-11-11 23:06:07.856568", "user_id": "1002", "allow_use": true}, {"from": "", "to": "\u6570\u636e\u96c62", "user": "\u5f20\u6559\u6388", "type": "create", "time": "2017-11-11 23:06:07.856568", "user_id": "1002", "allow_use": true}, {"from": "\u6570\u636e\u96c62", "to": "\u6d4b\u8bd5\u6570\u636e6", "user": "\u5218\u79d1\u957f", "type": "refer", "time": "2017-11-11 23:07:04.899737", "user_id": "1001", "allow_use": false}, {"from": "\u6570\u636e\u96c61", "to": "\u6d4b\u8bd5\u6570\u636e6", "user": "\u5218\u79d1\u957f", "type": "refer", "time": "2017-11-11 23:07:04.899737", "user_id": "1001", "allow_use": false}, {"from": "", "to": "\u6d4b\u8bd5\u6570\u636e6", "user": "\u5218\u79d1\u957f", "type": "create", "time": "2017-11-11 23:07:04.899737", "user_id": "1001", "allow_use": false}, {"from": "", "to": "\u6d4b\u8bd5\u6570\u636e6", "user": "\u5f20\u6559\u6388", "type": "use", "time": "2017-11-11 23:07:37.366270", "user_id": "1002", "allow_use": true}, {"from": "", "to": "\u6d4b\u8bd5\u6570\u636e6", "user": "\u5f20\u6559\u6388", "type": "use", "time": "2017-11-11 23:08:03.818300", "user_id": "1002", "allow_use": true}, {"from": "\u6d4b\u8bd5\u6570\u636e6", "to": "\u6570\u636e\u96c64", "user": "\u5f20\u6559\u6388", "type": "refer", "time": "2017-11-11 23:08:36.872469", "user_id": "1002", "allow_use": true}, {"from": "\u6570\u636e\u96c61", "to": "\u6570\u636e\u96c64", "user": "\u5f20\u6559\u6388", "type": "refer", "time": "2017-11-11 23:08:36.872469", "user_id": "1002", "allow_use": true}, {"from": "", "to": "\u6570\u636e\u96c64", "user": "\u5f20\u6559\u6388", "type": "create", "time": "2017-11-11 23:08:36.872469", "user_id": "1002", "allow_use": true}, {"from": "\u6570\u636e\u96c64", "to": "\u6570\u636e\u96c65", "user": "\u5f20\u6559\u6388", "type": "refer", "time": "2017-11-11 23:09:50.354394", "user_id": "1002", "allow_use": true}, {"from": "\u6570\u636e\u96c62", "to": "\u6570\u636e\u96c65", "user": "\u5f20\u6559\u6388", "type": "refer", "time": "2017-11-11 23:09:50.354394", "user_id": "1002", "allow_use": true}, {"from": "", "to": "\u6570\u636e\u96c65", "user": "\u5f20\u6559\u6388", "type": "create", "time": "2017-11-11 23:09:50.354394", "user_id": "1002", "allow_use": true}, {"from": "", "to": "\u6570\u636e\u96c65", "user": "\u5218\u79d1\u957f", "type": "use", "time": "2017-11-12 01:37:59.396947", "user_id": "1001", "allow_use": false}];


var widget;
window.onload = function () {
    widget= new GitChain({
        domNode:'#root',
        data: data,//数据
        title: '这是一个展示demo(封装过的组件)',//标题
        isCenter:false,//是否居中 默认居左
        itemW:0,//左侧图的宽度，0为不设置
        isSortTime:true,//是否时间朝下
        width:window.innerWidth,
        height:window.innerHeight*9/10,
        useDataset:function(d){alert("you click the "+d)},
        style: {
            textColor:['#777',"#eee"],//文字颜色及高亮色
            //代表用户的颜色
            userColor: ['#39397a', '#627a35', '#8d6d2c', '#853c37', '#737f74'],
            //分类色：A：B：C
            color : ['#2c80bf', '#e95400', '#2aa450', '#bcbf00', '#636363'],
            opacity:[0.3,0.9],//背景色透明度，高亮时透明度
        },
    })
}
window.onresize = function(){
    widget.updateOptions({width:window.innerWidth,height:window.innerHeight})
}
