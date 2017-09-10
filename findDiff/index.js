window.onload = function () {
    var width = d3.select('#root').style('background-color', '#eee').node().clientWidth
    var height = window.innerHeight - d3.select('header').node().clientHeight - d3.select('footer').node().clientHeight - 10
    console.log(d3.select('#root').node())
    //当高大于宽时，以为基准(未处理高margin)
    var W = width
    var H = W * 2 / 3
    var marginTop = 0;
    if (width / 3 > height / 4) { //当宽大于高时，以高为基准
        H = height / 2
        W = H * 3 / 2
    }
    console.log(H, height / 2)
    if (H < height / 2) {
        marginTop = (height / 2 - H) / 2
    }
    var gameOver = false;

    var data = {
        dataImg: ['./timg0.jpg', './timg1.jpg'],
        tip: [
            {
                x: width / 2 + 0.3 * W,
                y: H * 0.07,
                w: 0.15 * W,
                h: 0.15 * H,
                show: false
            },
            {
                x: width / 2 - 0.06 * W,
                y: H * 0.02,
                w: 0.1 * W,
                h: 0.1 * H,
                show: false
            },
            {
                x: width / 2 - 0.18 * W,
                y: H * 0.8,
                w: 0.1 * W,
                h: 0.2 * H,
                show: false
            },
        ]
    }
    var sum = data.tip.length
    d3.select('span#sum').text(sum)
    var svg = d3.selectAll('svg').data(data.dataImg).attr('width', width).attr('height', height / 2)


    svg.append('image')
        .attr('xlink:href', function (d, i) {
            return d
        })
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', width)
        .attr('height', height / 2)
    console.log(marginTop)
    var tip = svg.append('g')
        .attr('transform', 'translate(0,' + marginTop + ')')
        .selectAll('rect').data(data.tip).enter()

    tip.append('rect')
        .attr('x', function (d, i) {
            return d.x
        })
        .attr('y', function (d, i) {
            return d.y
        })
        .attr('stroke', '#f00')
        .attr('fill', function (d, i) { return d.show ? 'none' : '#ccc' })
        .attr('opacity', function (d, i) { return d.show ? 1 : 0 })
        .attr('width', function (d, i) {
            return d.w
        })
        .attr('height', function (d, i) {
            return d.h
        })
        .on('click', function (d, i) {
            console.log('xiu')
            data.tip[i].show = true;
            reTip();
        })
    var showTip=true;
    function reTip() {
        tip.selectAll('rect').data(data.tip)
            .transition()
            .duration(100)
            .attr('fill', function (d, i) { return d.show ? 'none' : '#ccc' })
            .attr('opacity', function (d, i) { return d.show ? 1 : 0 })
            .on('end',function(){if(gameOver&&showTip){
                alert('少侠好眼力！下一关卡正在设计')
                showTip = false;
            }})

        var isum = 0;
        data.tip.forEach(function (d, i) {
            if (d.show) {
                isum++
            }
        })

        if (isum == sum) {//查找完成
            gameOver = true
        }
        d3.select('span#sum').text(sum - isum)
    }
    var timer = 100;
    setInterval(function () {
        if (!gameOver) {
            timer--
            d3.select('span#time').text(timer + 'S')
            d3.select('span#time')
            .attr('color', timer < 20 ? '#e00' : '#000')
        }
    }, 1000)

}

