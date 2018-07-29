let init = () => {
  initTopBar();
  d3.select("#iframe")
    .attr("height", window.innerHeight - 65)
    .attr("width", window.innerWidth);
};
// init top bar
let initTopBar = () => {
  fetch("./top.json")
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
let initD3 = () => {
  fetch("./d3.json")
    .then(data => data.json())
    .then(data => initMiddle(data.d3));
  let initMiddle = data => {
    let tableNode = d3
      .select("#middle")
      .selectAll("div")
      .data(data)
      .enter()
      .append("div")
      .attr("class", "table");

    tableNode
      .append("div")
      .attr("class", "title")
      .text(item => item.title);
    let tableCard = tableNode.append("div").attr("class", "cards");
    let cards = tableCard
      .selectAll("a")
      .data(item => item.links)
      .enter()
      .append("a")
      .attr("href", d => d.link)
      .attr("class", "card")
      .append("div");
    cards
      .append("div")
      .attr("class", "card_title")
      .text(item => item.title);
    cards.append("div").text("a");
    cards.append("div");
  };
};
init();
