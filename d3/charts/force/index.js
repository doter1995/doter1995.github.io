// import d3 from 'd3'
window.onload = function () {
    var width = window.innerWidth * .9
    var height = window.innerHeight * .9
    var inner = 10
    var outer = 100
    var svg = d3.select("#root").append('svg')
        .attr('width', width)
        .attr('height', height)
    var color = d3.scaleOrdinal(d3.schemeCategory20)
    //准备数据
    var dataSet = {
        nodes_data: [{ 'name': '0' },
        { 'name': '1' },
        { 'name': '2' },
        { 'name': '3' },
        { 'name': '4' },
        { 'name': '5' },
        { 'name': '6' }],

        edges_data: [{ 'source': 0, 'target': 1 },
        { 'source': 0, 'target': 2 },
        { 'source': 0, 'target': 3 },
        { 'source': 1, 'target': 4 },
        { 'source': 2, 'target': 5 },
        { 'source': 2, 'target': 6 }]
    };
    // 构建布局 构建布局
    //dataSet.edges_data这个数据会被处理为links
    var simulation = d3.forceSimulation(dataSet.nodes_data)
        .force("charge", d3.forceManyBody().strength(-500))	 //节点间的作用力
        .force("link", d3.forceLink(dataSet.edges_data).distance(20).strength(1))	  //连线作用力
        .force("center", d3.forceCenter(width / 2, height / 2))	  //重力，布局有一个参考位置，不会跑偏
        .on('tick', tick)


    var dragged = d3.drag()
        .container(document.getElementsByTagName("svg")[0])
        .on('start', function (d) {
            if (!d3.event.active) simulation.alphaTarget(0.6).restart();
            d.fx = d.x;
            d.fy = d.y;
        }) //mousedown
        .on('drag', function (d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }) //mousemove
        .on('end', function (d) {
            if (!d3.event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }) //mousedown
    //pies存储的是计算后的数据
    
    //绘制links
    var link = svg.selectAll("g.link")
        .data(dataSet.edges_data)
        .enter()
        .append('g')
        .attr("class", 'link')
        .append('line')
        .attr('stroke', '#000')
        .attr('stroke-width', 1)
        .attr('x1', function (d) { return d.source.x })
        .attr('y1', function (d) { return d.source.y })
        .attr('x2', function (d) { return d.target.x })
        .attr('y2', function (d) { return d.target.y })

    var node = svg.selectAll("g.nodes")
        .data(dataSet.nodes_data)
        .enter()
        .append("g")
        .attr("class", "nodes")
        .append("circle")
        .attr("cx", function (d) { return d.x })
        .attr("cy", function (d) { return d.y })
        .attr("r", 10)
        .attr('fill', function (d, i) { return color(i) })
        .call(dragged)

    function tick() {
        link.attr('x1', function (d) { return d.source.x })
            .attr('y1', function (d) { return d.source.y })
            .attr('x2', function (d) { return d.target.x })
            .attr('y2', function (d) { return d.target.y })
        node.attr("cx", function (d) { return d.x })
            .attr("cy", function (d) { return d.y })

    }

}
