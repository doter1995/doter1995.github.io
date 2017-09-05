// import * as d3 from 'd3'
window.onload = function () {
    var width = 400, height = 400;

    function initChord() {
        var outerRadius = Math.min(width - 10, height - 10) * 0.5 - 10;
        var innerRadius = outerRadius - 18;
        var ribbon = d3.ribbon()
            .radius(innerRadius);
        var title = ["NDVI", "Pre", "SR", "Tem"];

        var dataSet = [
            [11975, 5871, 8916, 2868],
            [1951, 10048, 2060, 6171],
            [8010, 16145, 8090, 8045],
            [1013, 990, 940, 6907]
        ];
        var params = d3.scaleOrdinal()
            .domain(d3.range(4))
            .range(title);
        var svg = d3.select('#root_chord')
            .append("svg")
            .attr("width", width)
            .attr("height", height)
        var group = svg.append("g")
            .attr("id", "circle")
            .style("pointer-events", "all")
            .style(".axis.path.fill", "none")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        var color = d3.scaleOrdinal()
            .domain(d3.range(4))
            .range(["#105069", "#FFDD89", "#957244", "#F26223"]);
        var arc = d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);
        var chord = d3.chord()
            .padAngle(.04)
            .sortSubgroups(d3.descending)
            .sortChords(d3.ascending);
        var resource = chord(dataSet)
        console.log(resource)
        group.datum(resource)
        var g = group
            .append('g')
            .attr('class', 'group')
            .selectAll('g')
            .data(function (d) { console.log(d); return d.groups })
            .enter()
            .append('g')
        function fade(opacity) {
            return function (g, i) {
                group.selectAll("g.chord>path")//选择连线的path
                    .filter(function (d) {
                        return d.source.index != i && d.target.index != i;
                    })
                    .transition()
                    .style("opacity", opacity);
            };
        }
        g.append("path")
            .style("fill", function (d) { return color(d.index); })
            .style("stroke", function (d) { return color(d.index) })
            .attr("d", arc)
            .on("mouseover", fade(0.0))
            .on("mouseout", fade(1));
        var innergroup = group.append("g")
            .attr("class", "chord")
            .selectAll("chord")
            .data(function (chords) { console.log(chords); return chords })
            .enter()
            .append("path")
            .attr("d", ribbon)
            .style("fill", function (d) { return color(d.target.index); })
            .style("stroke", function (d) { return d3.rgb(color(d.target.index)).darker(); })
            .on("mouseover", function (d, i) {
                d3.select(this)
                    .style("fill", "yellow");
            })
            .on("mouseout", function (d, i) {
                d3.select(this)
                    .transition()
                    .duration(500)
                    .style("fill", color(d.target.index));
            });
        innergroup.append("title").text(function (d) {
            return params(d.source.index)
                + " → " + params(d.target.index)
                + ": " + d.source.value
                + "\n" + params(d.target.index)
                + " → " + params(d.source.index)
                + ": " + d.target.value;
        })
        g.append("text")
            .each(function (d, i) {
                d.angle = (d.startAngle + d.endAngle) / 2;
                d.name = title[i];
            })
            .attr("dy", ".35em")
            .attr("transform", function (d) {
                return "rotate(" + (d.angle * 180 / Math.PI) + ")" +
                    "translate(0," + -1.0 * (outerRadius + 10) + ")" +
                    ((d.angle > Math.PI * 3 / 4 && d.angle < Math.PI * 5 / 4) ? "rotate(180)" : "");
            })
            .text(function (d) {
                return d.name;
            });
    }
    initChord();
}