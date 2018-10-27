let init = () => {
  initD3();
};
let initD3 = () => {
  fetch("./three.json")
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
      .selectAll("div")
      .data(item => item.links)
      .enter()
      .append("div")
      .attr("class", "card");

    cards
      .append("a")
      .attr("class", "card_title")
      .on("click", d => {
        if (window.parent) {
          console.log(parent);
          let link = d.link.substring(2, d.link.length);
          window.parent.location.href += link;
        } else {
          window.location.href = d.link;
        }
      })
      .text(item => item.title);
    cards.append("p").text("a");
  };
};
init();
