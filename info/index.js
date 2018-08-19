window.onload = function() {
  init();
};

let init = () => {
  var root = d3
    .select("#root")
    .append("svg")
    .attr("width", window.innerWidth)
    .attr("height", window.innerHeight);
  Chart(root, "./information.json", {
    width: window.innerWidth,
    height: window.innerHeight
  });
};
let Chart = (root, src, config) => {
  // 获取数据
  fetch(src)
    .then(data => data.json())
    .then(dataSet => {
      initDraw(dataSet);
      updateColor(1);
    });
  //时间处理
  let parseDate = d3.timeParse("%Y/%m/%d");
  let formatDate = d3.timeFormat("%Y年%m月%d日");
  //颜色
  let color = d3.scaleOrdinal(d3.schemeCategory10);

  //基础node
  let x;
  let xAxis;
  let xAxisG;
  let sidePath;
  let Item_Idx = 0;
  let side_path = d3
    .line()
    .curve(d3.curveLinearClosed)
    .x(d => d[0])
    .y(d => d[1]);
  let initFilter = id => {
    root
      .append("defs")
      .append("filter")
      .attr("id", id)
      .append("feGaussianBlur")
      .attr("in", "SourceGraphic")
      .attr("stdDeviation", "5");
    return "#" + id;
  };
  // 初始化绘制
  let initDraw = dataSet => {
    let startDate = parseDate(dataSet[0].startDate);
    let newDate = new Date().valueOf();
    let heightCneter = config.height / 2;
    let widthLeft = config.width / 3;
    let widthRight = widthLeft * 2;
    x = d3
      .scaleLinear()
      .domain([startDate, newDate])
      .range([0, config.width]);
    //绘制横坐标轴
    xAxis = d3
      .axisBottom(x)
      .ticks(10)
      .tickFormat(d => formatDate(d));
    xAxisG = root
      .append("g")
      .attr("transform", "translate(0,30)")
      .attr("class", "xAxis")
      .call(xAxis);
    xAxisG.selectAll("line").attr("y2", 20);
    xAxisG.selectAll("text").attr("y", 30);

    //绘制线条
    sidePath = root.append("g");
    let leftpos = [
      [x(startDate), 70], //左上
      [widthLeft / 2, heightCneter - 40],
      [widthLeft, heightCneter],
      [widthRight, heightCneter],
      [(widthRight * 5) / 4, heightCneter - 40],
      [x(newDate), 70] //右上
    ]; //右中
    sidePath
      .data([leftpos])
      .append("path")
      .attr("opacity", 0.5)
      .attr("fill", color(0))
      .attr("filter", `url(${initFilter("pathFilter")})`)
      .attr("d", side_path);
    //绘制一个文本显示框
    let tip = d3
      .select("#tip")
      .datum(dataSet[Item_Idx])
      .style("width", widthLeft + "px")
      .style("height", config.height / 3 + "px")
      .style("left", widthLeft + "px")
      .style("top", config.height / 3 + "px")
      .style("display", "block");
    tip.select(".date").text(d => `${d.startDate}--${d.endDate}`);
    tip.select(".title").text(d => d.title);
    tip.select(".company").text(d => d.company);
    tip.select(".info").text(d => d.info);
    d3.select("body").on("click", () => updateDraw(Item_Idx++, dataSet));
    // d3.select("#tip").on("click", () => updateDraw(Item_Idx++, dataSet));
  };
  //更新绘制
  let updateDraw = (i, dataSet) => {
    if (i >= dataSet.length) {
      Item_Idx = 0;
      i = 0;
    }
    let item = dataSet[i];
    //更新内容
    let tip = d3.select("#tip").datum(dataSet[i]);
    tip.select(".title").text(d => d.title);
    tip.select(".company").text(d => d.company);
    tip.select(".info").text(d => d.info);
    //更新时间轴
    console.log(item);
    if (!item.endDate || item.endDate == "") {
      x.domain([parseDate(item.startDate), new Date().valueOf()]);
      tip.select(".date").text(d => `${d.startDate}--至今`);
    } else {
      x.domain([parseDate(item.startDate), parseDate(item.endDate)]);
      tip.select(".date").text(d => `${d.startDate}--${d.endDate}`);
    }
    xAxis.scale(x);
    xAxisG
      .transition()
      .duration(1000)
      .call(xAxis)
      .on("end", function() {
        d3.select(this)
          .selectAll("line")
          .attr("y2", 20);
        d3.select(this)
          .selectAll("text")
          .attr("y", 30);
      });
  };
  //更新背景色
  let updateColor = (i = 1) => {
    var t = d3
      .transition()
      .duration(10000)
      .ease(d3.easeLinear)
      .on("end", () => {
        updateColor((i + 1) % 10);
      });

    sidePath
      .select("path")
      .transition(t)
      .attr("fill", () => {
        return color(i);
      });
  };
};
