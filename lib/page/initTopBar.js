let init = () => {
  initTopBar();
};
// init top bar
let initTopBar = () => {
  let header = d3.select("header").append("nav").attr("class", "nav")
  d3.select("header").append("h1").attr("class", "hidden")
  header.append("ul").attr("id", "top_left")
  header.append("ul").attr("id", "top_right")
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
          console.log("A")
          window.location.href = location.origin + item.link;
        }
      })
      .html(item => item.title);
  };
};
init();