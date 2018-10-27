let init = () => {
  initTopBar();
  d3.select("#iframe")
    .attr("height", window.innerHeight- 60)
    .attr("width", window.innerWidth);
};
// init top bar
let initTopBar = () => {
  fetch("/config/top.json")
    .then(data => data.json())
    .then(data => {
      initTopUl(data.right, d3.select("#top_right"));
      initTopUl(data.left, d3.select("#top_left"));
    });
  let initTopUl = (data, node) => {
    node
      .selectAll("li")
      .data(data)
      .enter()
      .append("li")
      .on("click", item => {
        if (item.newTable) {
          window.open(item.link);
        } else {
          window.location.href = item.link;
        }
      })
      .text(item => item.title);
  };
};
init();
