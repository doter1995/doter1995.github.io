//import * as d3 from 'd3'
window.onload=function (){
    var dataSet = [1,2,3,4,5,6];
    var dataSet1 = [1,2]
    var selection = d3.selectAll('.root')
    var update=selection.data(dataSet)
    console.log("selection",update)
    var update1=selection.data(dataSet1)
    console.log("selection",update1)
    console.log("selection.empty()",selection.empty())
    console.log("selection.node()",selection.node())
    console.log("selection.nodes()",selection.nodes())
    console.log("selection.size()",selection.size())
    console.log("selection.classed()",selection.classed("red",true))
}  