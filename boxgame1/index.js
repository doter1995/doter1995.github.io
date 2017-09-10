// import d3 from 'd3'
window.onload = function () {
    var width = d3.select('#root').style('background-color', '#eee').node().clientWidth
    var height = window.innerHeight * 0.9
    console.log(d3.select('#root').node())
    var svg = d3.select('svg').attr('width', width).attr('height', width)
    var margin = 5;
    var itemW = (width - 10) / 3
    var arry = [];
    var repaly = false;
    //初始化数组
    for (var index = 1; index < 10; index++) {
        arry.push({value:index,dx:0,dy:0});
    }
    //数组中 下标index值+1=value

    //拖动事件
    var draged = d3.drag()
        .on('drag', function (d, i) {
            d.dx += d3.event.dx;
            d.dy += d3.event.dy;
            d3.select(this).attr("transform", "translate(" + d.dx + "," + d.dy + ")");
        }).on('end',function (d, i) {
            console.log(d)
            d.dx += d3.event.dx;
            d.dy += d3.event.dy;
            console.log(d.dx)
            //计算移动那个位置
            
            if(d.dx>itemW/2){//右移
                console.log('准备右移动')
            }else if(-d.dx>itemW/2){//左移
                console.log('准备左移动')
            }else if(-d.dy>itemW/2){//上移
                console.log('准备上移动')
            }else if(d.dy>itemW/2){//下移
                console.log('准备下移动')
            }
            d3.select(this).attr("transform", "translate(" + d.dx + "," + d.dy + ")");
        })
    var nodes = svg
        .selectAll('g')
        .data(arry)
        .enter()
        .append('g')
        .call(draged)
    nodes.append('image')
        .attr('xlink:href', function (d, i) {
            return './login_bg_0' + d.value + '.jpg'
        })
        .attr('x', function (d, i) {
            var index = getX(i);
            return index * itemW + index * margin
        })
        .attr('y', function (d, i) {
            var index = getY(i);
            return index * itemW + index * margin
        })
        .attr('width', itemW)
        .attr('height', itemW)
        

    function getY(index) {
        var frist = 0;
        if (index > 2) {
            frist = (index / 3 - 0.5).toFixed(0)
        }
        return frist
    }
    function getX(index) {
        return index % 3
    }
}