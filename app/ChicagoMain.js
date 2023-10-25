topojson = require('https://d3js.org/topojson.v1.min.js')
d3 = require("https://d3js.org/d3.v5.min.js", 'd3-svg-legend')
var DrawChloropleth = function(svg, data){


    {
        const svg = d3.select("#map").selectAll("svg").data(['foo']).enter().append("svg")
          .attr("width", width)
          .attr("height", height)
          .attr("class", "topo")
        
        // Add group for color legend
        var g = svg.append("g")
        .attr("class", "legendThreshold")
        .attr("transform", "translate(" + width * .65 + "," + height / 2 + ")");
        g.append("text")
          .attr("class", "caption")
          .attr("x", 0)
          .attr("y", -6)
          .text("Population");
      
        // Add labels for legend
        var labels = ['0', '1-5', '6-10', '11-20'];
      
        // Create the legend based on colorScale and our labels
        var legend = d3.legendColor()
        .labels(function (d) { return labels[d.i]; })
        .shapePadding(4)
        .scale(colorScale);
        svg.select(".legendThreshold")
          .call(legend);  
      
        // Add the data to the choropleth map
        svg.selectAll("path")
          .data(geojson.features)
          .enter()
          .append("path")
          .attr("fill", function(d, i){
          return colorScale(populationData[d.properties.zip]);
        })
          .attr("d", d3.geoPath(projection))  
      }

}


var DrawCartogram = function (svg, data){

}