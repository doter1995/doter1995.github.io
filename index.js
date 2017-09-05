// import d3 from 'd3';
window.onload = function () {
  console.log("使用d3版本", d3.version)
  var isRun = true;
  var MP3 = document.getElementById('mp3')
  function init() {
    var height = 200;
    
    var Root = d3.select("#d3_root")
      .insert('svg')
      .attr("width", '100%')
      .attr("height", height)
      .on('click', function () {
        if (isRun) {
          MP3.pause();
        } else {
          MP3.play();
        }
        isRun = !isRun;
      })
    var width = document.getElementById('d3_root').clientWidth;
    console.log(width);
    var lisLength = width / 10;
    //生成随机数组
    var list = random(lisLength)
    console.log(list)
    //创建x y 比例尺
    var x = d3.scaleLinear()
      .domain([0, lisLength])
      .range([0, width])
    var y = d3.scaleLinear()
      .domain([0, 1])
      .range([0, height])
    var color = d3.scaleOrdinal(d3.schemeCategory20b);
    //渲染柱状图
    var rectG = Root
      .append("g");
    rectG.selectAll('rect')
      .data(list)
      .enter()
      .append('rect')
      .attr('x', function (d, i) { console.log(d); return x(i) })
      .attr('y', function (d, i) { return 200 - y(d) })
      .attr('width', function (d, i) { return 10 })
      .attr('height', function (d, i) { return y(d) })
      .attr('fill', function (d, i) { return color(i % 20) })

    //更新柱状图
    setInterval(myInterval, 180);//1000为1秒钟
    function myInterval() {
      if (!isRun) {
        return;
      }
      //更新随机数据
      var list = random(lisLength)
      var rects = rectG.selectAll('rect')
        .data(list)
      //开始过渡
      rects.transition()
        .duration(130)
        // .delay(function(d, i) { return i * 10; })
        .attr('y', function (d, i) { return 200 - y(d) })
        .attr('height', function (d, i) { return y(d) })
    }

  }
  function random(lisLength) {
    var list = [];

    for (i = 0; i < lisLength; i++) {
      list.push(Math.random())
    }
    return list;
  }
  init();
  var hiddenProperty = 'hidden' in document ? 'hidden' :
    'webkitHidden' in document ? 'webkitHidden' :
      'mozHidden' in document ? 'mozHidden' :
        null;
  var visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');
  var onVisibilityChange = function () {
    if (!document[hiddenProperty]) {
      isRun=true
      console.log("isRUn",isRun)
    
      MP3.play();
    } else {
      isRun=false
      console.log("isRUn",isRun)
      MP3.pause();
    }
  }
  document.addEventListener(visibilityChangeEvent, onVisibilityChange);
}
