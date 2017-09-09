window.onload = function () {
    var map = document.getElementById('div_map')
    var arry = [];
    var repaly = false;
    //初始化数组
    for (var index = 1; index < 10; index++) {
        arry.push(index);
    }
    arry[8]=0
    var zeroP = 8
    //随机生成位置
    function random() {
        for (var index = 0; index < 9; index++) {
            var x = getX(index)
            var y = getY(index)
            var i=0;//随机后的位置
            var ir = Math.round(Math.random() * 4)//随机上下左右
            if(ir==0){//上移动
                if(index>2){
                    i=index-3
                }else{
                    i=index+3
                }
            }else if(ir==1){//下移动
                if(index<6){
                    i=index+3
                }else{
                    i=index-3
                }
            }else if(ir==2){//左移动
                if(y!=0){
                    i=index-1
                }else{
                    i=index+1
                } 
            }else {//右移动
                if(y!=2){
                    i=index+1
                }else{
                    i=index-1
                }  
            }
           
            var start = arry[index]
            arry[index] = arry[i]
            arry[i] = start
        }
    }
    random();
    console.log(arry)//


    function click() {
        console.log('aa', this, this.getAttribute('x'))
        var index = this.getAttribute('i')
        var value = this.getAttribute('x')

        console.log('index, zeroP', index, zeroP)
        console.log('', isMove(index, zeroP))
        //计算是否可移动
        if (isMove(index, zeroP)) {
            //数值重绘
            var start = arry[index]
            arry[index] = arry[zeroP]
            arry[zeroP] = start
            redraw()
        }

    }
    function redraw() {
        for (var index = 0; index < 9; index++) {
            const value = arry[index]
            var frist = getY(index);
            var y = getX(index);
            if (arry[index] == 0) {
                zeroP = index
            }
            console.log(value)
            console.log(y, map.children[frist].children[y])
            map.children[frist].children[y].addEventListener('click', click, false)
            map.children[frist].children[y].setAttribute('i', index)
            map.children[frist].children[y].setAttribute('x', value)
            map.children[frist].children[y].children[0].setAttribute('src', './login_bg_0' + value + '.jpg')
        }
    }
    redraw()

    function isMove(index, zeroP) {
        if (index == zeroP) return false;
        var ix = getX(index)
        var iy = getY(index)
        var zx = getX(zeroP)
        var zy = getY(zeroP)
        //是否在同一纵轴
        if (ix == zx) {
            if (Math.abs(iy - zy) == 1) return true
        } else if (iy == zy) { //是否在同一横轴
            if (Math.abs(ix - zx) == 1) return true
        }
        return false
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
    document.getElementById('bt_OK').addEventListener('click', onok, false)
    function onok() {
        var end = true;
        if (!repaly) {
            for (var index = 0; index < 9; index++) {
                if (index == 8) {
                    arry[index] != 0
                    end = false
                } else if (arry[index] != index + 1) {
                    end = false
                }
            }

            if (end) {
                alert('恭喜你')
                document.getElementById('bt_OK').firstChild.nodeValue = '再来一局'
                repaly = true;
            } else {
                alert('还没有完成,在检查下')
            }
        } else {//新开局
            random()
            redraw()
            repaly = false 
            document.getElementById('bt_OK').firstChild.nodeValue = '完成'
        }

    }
}