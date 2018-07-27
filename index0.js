window.onload = function() {
  fetch("./top.json")
    .then(data => data.json())
    .then(data => {
      initTopRight(data.right);
      initTopLeft(data.left);
    });
  let initTopRight = data => {
    let TopRight = d3.select("#top_right");
    TopRight.selectAll("li")
      .data(data)
      .enter()
      .append("li")
      .on("click", item => {
        window.open(item.link);
      })
      .text(item => item.title);
  };
  let initTopLeft = data => {
    d3.select("#top_left")
      .selectAll("li")
      .data(data)
      .enter()
      .append("li")
      .on("click", item => {
        window.open(item.link);
      })
      .text(item => item.title);
  };
};
