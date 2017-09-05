window.onload = function () {
    var width = window.innerWidth * .9
    var height = window.innerHeight * .9
    var margin = 20
    var inner = 10
    var outer = 100
    var svg = d3.select("#root").append('svg')
        .attr('width', width)
        .attr('height', height)
    var color = d3.scaleOrdinal(d3.schemeCategory20)
    var dataSet = {
        "name": "中国",
        value: 80,
        "children": [
            {
                "name": "北京",
                'value': 20
            },
            {
                "name": "陕西",
                'value': 20,
                "children": [
                    {
                        "name": "宝鸡",
                        'value': 10,
                        "children": [
                            {
                                "name": "眉县",
                                'value': 6,
                            },
                            {
                                "name": "岐山",
                                'value': 4
                            }
                        ]
                    },
                    {
                        "name": "西安",
                        'value': 10
                    }
                ]
            },
            {
                "name": "上海",
                'value': 15
            },
            {
                "name": "浙江",
                'value': 25,
                "children": [
                    {
                        "name": "杭州",
                        'value': 10
                    },
                    {
                        "name": "宁波",
                        'value': 7
                    },
                    {
                        "name": "温州",
                        'value': 8
                    }

                ]
            },
        ]
    }
    //层次化数据
    var root = d3.hierarchy(dataSet)
    //构建pack函数
    var pack = d3.pack()
        .size([width - 2 * margin, height - 2 * margin])
    var nodes = pack(root);
    
    console.log(nodes.descendants())

    //准备绘制
    var threeNode = svg.append("g")
        .attr('class', 'treeG')
        .attr("transform", "translate(" + margin + "," + margin + ")");
    var linksGroup = threeNode.append("g")
        .attr('class', 'links')
    var nodesGroup = threeNode.append('g')
        .attr('class', 'nodes')
    nodesGroup.selectAll('circle')
    .data(nodes.descendants())
    .enter()
    .append('circle')
    .attr('fill',function(d,i){return color(i)})
    .attr('r',function(d,i){return d.r})
    .attr('cx',function(d,i){return d.x})
    .attr('cy',function(d,i){return d.y})
}