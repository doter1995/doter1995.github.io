// import d3 from 'd3'
window.onload = function () {
    var width = window.innerWidth * .9
    var height = window.innerHeight * .9
    var margin = 20;
    var inner = 10
    var outer = 100
    var svg = d3.select("#root").append('svg')
        .attr('width', width)
        .attr('height', height)
    var color = d3.scaleOrdinal(d3.schemeCategory20)
    var dataSet = {
        "name": "中国",
        "children": [
            {
                "name": "北京"
            },
            {
                "name": "陕西",
                "children": [
                    {
                        "name": "宝鸡",
                        "children": [
                            {
                                "name": "眉县"
                            },
                            {
                                "name": "岐山"
                            }
                        ]
                    },
                    {
                        "name": "西安"
                    }
                ]
            },
            {
                "name": "上海"
            },
            {
                "name": "浙江",
                "children": [
                    {
                        "name": "杭州"
                    },
                    {
                        "name": "宁波"
                    },
                    {
                        "name": "温州"
                    }

                ]
            },
        ]
    }

    // 使用hierarchy层次化
    console.log("dataSet", dataSet)
    var root = d3.hierarchy(dataSet)
    console.log("root=d3.hierarchy(dataSet)", root)
    //构建树布局方法d3.cluster()
    var tree = d3.tree()
        .size([width - 2 * margin, height - 2 * margin])
    //生成节点及links
    var nodes = tree(root);
    var links = nodes.links()
    console.log("nodes=node.links()", links)
    //准备绘制
    var threeNode = svg.append("g")
        .attr('class', 'treeG')
        .attr("transform", "translate(" + margin + "," + margin + ")");
    var linksGroup = threeNode.append("g")
        .attr('class', 'links')
    var nodesGroup = threeNode.append('g')
        .attr('class', 'nodes')
    //绘制
    nodesGroup.selectAll('circle')
        .data(nodes.descendants())
        .enter()
        .append('circle')
        .attr("fill", '#fed')
        .attr("cx", function (d) { return d.x })
        .attr("cy", function (d) { return d.y })
        .attr("r", function (d) { return 10 })
    linksGroup.selectAll("line")
        .data(links)
        .enter()
        .append('line')
        .attr('stroke','#f00')
        .attr('x1',function(d){return d.source.x})
        .attr('y1',function(d){return d.source.y})
        .attr('x2',function(d){return d.target.x})
        .attr('y2',function(d){return d.target.y})

}