var lineChart;
window.onload = function () {
    //数据源
    var dataSet = [
        {
            "date": "2017-12-18 14:00:00",
            "exceedFlag": "N",
            "goalFlag": "N",
            "value": "487374911",
            "ratio": "0.7589"
        }
    ];

    //以下为定时测试
    var parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S");
    var formatDate = d3.timeFormat("%Y-%m-%d %H:%M:%S");
    var sum = 29441;
    var time = parseDate('2017-12-20 0:00:00');

    function addDataTest() {
        sum += Number(Math.random().toFixed(3) * 5000);
        time = Number(time.valueOf() + 300000);
        return {
            date: formatDate(time),
            value: sum,
            v:1+Number(Math.random().toFixed(2))
        }
    }
    var aaa = 0;
    // 五分钟加载一次数据演示
    // setInterval(function () {
    //     if (aaa < 100) {
    //         lineChart.addData(addDataTest())
    //         aaa++
    //     }
    // }, 400)


    // //计算所有点
    //  for(var i=0;i<315;i++){
    //     dataSet.push(addDataTest())
    // }
    lineChart = new LineChart({
        dataSet: [ {
            "date": "2017-12-18 14:00:00",
            "exceedFlag": "N",
            "goalFlag": "N",
            "value": "31231",
            "ratio": "0.7589"
        },
        {
            "date": "2017-12-18 14:05:00",
            "exceedFlag": "N",
            "goalFlag": "N",
            "value": "312311",
            "ratio": "0.7589"
        }],
        width:714,
        height:237,
        markImage:['./point.png','./star.png'],
        dTipIcon:['./zonge.png','./leiji.png'],
        tipTitle:['2016年总销售额','2017年预计总销售额'],
        bgColor:'#211885',
        yUint:'元',
        margin:[25, 10, 5, 20],
        themeColor:"rgba(255,255,255,0.51)",
        node: document.getElementById('root'),
        lineStyle: ['#E50CE9', 1],
        circleStyle: ['#23B9F7', 4],
        textSize:16
    })
   
    d3.json('./data/linesData.json',function(d){
        console.log(d.lineList)
       lineChart.addData(d.lineList)
    })
};
