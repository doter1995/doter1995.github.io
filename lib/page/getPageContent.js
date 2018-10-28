
let getPageContent = (name) => {
  let url = `/config/${name}.json`
  fetch(url)
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
      .attr("class", "card")
      .attr("href",d=>d.link)
      .attr("target","view")
      .on("click",d=>{
        window.parent.location.hash ="/"+name+ d.link.substring(1);
      })
    cards
      .append("a")
      .attr("class", "card_title")
      .text(item => item.title);
    cards.append("p").text(item=>item.description);
  };
};