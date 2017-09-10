// import d3 from 'd3'
window.onload = function () {
    var width = d3.select('#root').style('background-color', '#eee').node().clientWidth
    var height = window.innerHeight * 0.9
    console.log(d3.select('#root').node())
    var svg = d3.select('svg').attr('width', width).attr('height', width)
    var margin = 5;
    var itemW = (width - 10) / 3
    var arry = [];
    var active = 0;
    var repaly = false;
    //初始化数组
    for (var index = 1; index < 10; index++) {
        arry.push({ value: index, dx: 0, dy: 0, index: index - 1 });
    }
    //数组中 下标index值+1=value


    random()
    //拖动事件
    var draged = d3.drag()
        .on('drag', function (d, i) {
            active = d.index
            d.dx += d3.event.dx;
            d.dy += d3.event.dy;
            var node = d3.select(this)
                .attr("transform", getTransform)
            node.select('image').style('z-index', 9);
        }).on('end', function (d, i) {
            active = d.index
            console.log(d)
            d.dx += d3.event.dx;
            d.dy += d3.event.dy;
            console.log(d.dx)
            //计算移动那个位置
            var moveRight, moveDown
            if (d.dx > 0) {//右移动
                moveRight = (d.dx / itemW).toFixed(0)
            } else {//左移
                var data = Math.abs(d.dx)
                moveRight = -(data / itemW).toFixed(0)
            }
            if (d.dy > 0) {//下移动
                moveDown = (d.dy / itemW).toFixed(0)
            } else {//上移
                var data = Math.abs(d.dy)
                moveDown = -(data / itemW).toFixed(0)
            }
            console.log('moveRight,moveDown', moveRight, moveDown)
            if (moveRight == -0) moveRight = 0
            if (moveDown == -0) moveDown = 0
            console.log('moveRight,moveDown', moveRight, moveDown)
            var targ = (parseInt(active) + parseInt(moveRight) + parseInt(moveDown) * 3);//获取到移动的目标点
            console.log('targ,d.index', targ, active)
            if (targ > -1 && targ < 9 && targ != active) {//移动
                var targ1, active1
                arry.forEach(function (d, i) {
                    d.dx = 0;
                    d.dy = 0;
                    if (d.index == targ) {
                        targ1 = i
                    } else if (d.index == active) {
                        active1 = i
                    }
                })
                var start = arry[active1].index;
                arry[active1].index = arry[targ1].index
                arry[targ1].index = start
            } else {
                arry.forEach(function (d) {
                    d.dx = 0;
                    d.dy = 0;
                })
            }
            console.log(arry)
            update();
        })
    var nodes = svg
        .selectAll('g')
        .data(arry)
        .enter()
        .append('g')
        .attr("transform", getTransform)
        .call(draged)
    nodes.append('image')
        .attr('xlink:href', function (d, i) {
            return './login_bg_0' + d.value + '.jpg'
        })
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', itemW)
        .attr('height', itemW)
    function update() {

        nodes.data(arry)
        nodes.transition().duration(100).attr("transform", getTransform)
        nodes.selectAll('image').attr('xlink:href', function (d, i) {
            return './login_bg_0' + d.value + '.jpg'
        })

    }

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
    function getTransform(d) {
        var index = getX(d.index);
        var left = index * itemW + index * margin
        index = getY(d.index);
        var right = index * itemW + index * margin
        return "translate(" + parseInt(left + d.dx) + "," + parseInt(right + d.dy) + ")"
    }

    document.getElementById('bt_OK').addEventListener('click', onok, false)
    function onok() {
        var end = true;
        if (!repaly) {
            arry.forEach(function (d, i) {
                if ((d.value - d.index) != 1) {
                    end = false
                    console.log(d)
                }
            })
            if (end) {
                alert('恭喜你')
                document.getElementById('bt_OK').firstChild.nodeValue = '再来一局'
                repaly = true;
            } else {
                alert('还没有完成,在检查下')
            }
        } else {//新开局
            random()
            update()
            repaly = false
            document.getElementById('bt_OK').firstChild.nodeValue = '完成'
        }
    }

    function random() {
        console.log(arry)
        //随机
        arry.forEach(function (d, i) {

            var redom = (Math.random() * 8).toFixed(0)
            var data = d.index
            d.index = arry[redom].index
            arry[redom].index = data
        })
        console.log(arry)
    }



}