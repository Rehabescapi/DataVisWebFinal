//topojson = require('https://d3js.org/topojson.v1.min.js')
//d3 = require("https://d3js.org/d3.v5.min.js", 'd3-svg-legend')

var ChoroplethVis = function (){
  var newChoropleth = {
    drawChloropleth : function (svg){
      var width = svg.attr("width")
      var height = svg.attr("height");


projection = d3.geoMercator()
.scale(width * 90)
.center([-87.6298, 41.8781])
.translate([width/2, height/2])


     
  
  
  //d3.json("chicago_zipcodes.json").then(function (data){
    d3.json("SchoolBoundariesGeoJSON.json").then(function (data){
    console.log(data);
    
    
  
  
   colorScheme = d3.schemeBlues[5];
   colorScale = d3.scaleThreshold()
   .domain([10,11,12,13,14,25])
   .range(colorScheme)

  var popData = mockPopulationData(data);
  console.log(popData)
  // Add group for color legend
    var Legend = d3.select("#main_Legend")
    var g = Legend.append("g")
    .attr("class", "legendThreshold")
    //.attr("transform", "translate(" + width * .65 + "," + height / 2 + ")");
    g.append("text")
      .attr("class", "caption")
      .attr("x", 0)
      .attr("y", -6)
      .text("Population");

    // Add labels for legend
    var labels = ['10','11','12', '13', '14', '15'];
    // Create the legend based on colorScale and our labels
    var legend = d3.legendColor()
    .labels(function (d) { return labels[d.i]; })
    .shapePadding(4)
    .scale(colorScale);
    g.call(legend);  

    // Add the data to the choropleth map
    svg.selectAll("path")
      .data(data.features)
      .enter()
      .append("path")
      .attr("name", function(d){
        return d.properties.SCHOOL_NM;
      }) 
      .attr("fill", function(d){
             return colorScale(popData[d.properties.SCHOOL_ID]);
    })
      .attr("d", d3.geoPath(projection)) 
      .attr("class", "border")
      
  })  
    }

  }
  return newChoropleth;
}


var DrawCartogram = function (){

}