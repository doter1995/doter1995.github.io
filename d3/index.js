let init = () => {
  initD3();
};
let initD3 = () => {
  fetch("./d3.json")
    .then(data => data.json())
    .then(data => initMiddle(data.d3));
  let initMiddle = data => {
    let tableNode = d3
      .select("#root")
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
