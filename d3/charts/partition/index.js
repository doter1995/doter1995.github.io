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
    //构建partition函数
    var partition = d3.partition()
        .size([width - 2 * margin, height - 2 * margin])
    var nodes = partition(root);
    
    console.log(nodes.descendants())

    //准备绘制
    var threeNode = svg.append("g")
        .attr('class', 'treeG')
        .attr("transform", "translate(" + margin + "," + margin + ")");
    var linksGroup = threeNode.append("g")
        .attr('class', 'links')
    var nodesGroup = threeNode.append('g')
        .attr('class', 'nodes')
    nodesGroup.selectAll('rect')
    .data(nodes.descendants())
    .enter()
    .append('rect')
    .attr('fill',function(d,i){return color(i)})
    .attr('x',function(d,i){return d.x0})
    .attr('y',function(d,i){return d.y0})
    .attr('width',function(d,i){return d.x1-d.x0})
    .attr('height',function(d,i){return d.y1-d.y0})


}