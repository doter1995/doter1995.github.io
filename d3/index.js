window.onload = function() {
  console.log("Aa");

  init();
};

let init = () => {
  console.log(window.innerHeight);
  var root = d3
    .select("#root")
    .append("svg")
    .attr("width", window.innerWidth)
    .attr("height", window.innerHeight);
  initChart(root, "./information.json");
};
let initChart = (root, src) => {
  fetch(src)
    .then(data => data.json())
    .then(dataSet => {});
  let draw = dataSet => {
    root.select();
  };
};
