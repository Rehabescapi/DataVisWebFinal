//topojson = require('https://d3js.org/topojson.v1.min.js')
//d3 = require("https://d3js.org/d3.v5.min.js", 'd3-svg-legend')

var CloroplethVis = function (){
  var newCloropleth = {
    drawCloropleth : function (svg){
      var width = svg.attr("width")
      var height = svg.attr("height");

     
  
  var geojson
  d3.json("chicago_zipcodes.json").then(function (data){
    console.log(data);
    data = data
   geojson = topojson.feature(data, data.objects["Boundaries - ZIP Codes"])
  
  
 
  
   colorScheme = d3.schemeBlues[5];
   colorScale = d3.scaleThreshold()
   .domain([0,2,5,10,20])
   .range(colorScheme)

  var popData = mockPopulationData(geojson);
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
    var labels = ['0','1-2', '3-5', '6-10', '11-20'];

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
      return colorScale(popData[d.properties.zip]);
    })
      .attr("d", d3.geoPath(projection))  
  })




      
    }

  }
  return newCloropleth;
}


var DrawCartogram = function (svg, data){

}