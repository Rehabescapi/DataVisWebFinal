//topojson = require('https://d3js.org/topojson.v1.min.js')
//d3 = require("https://d3js.org/d3.v5.min.js", 'd3-svg-legend')

var ChoroplethVis = function () {
  var newChoropleth = {
    drawChloropleth: function (svg) {

      strokeLevel= 2;

      var zoom = d3
        .zoom()
        .scaleExtent([1, 8])
        .on("zoom", function () {
          g.selectAll("path").attr("transform", d3.event.transform);
        });

      var g = svg.append("g").attr("id", "map");

      var width = svg.attr("width");
      var height = svg.attr("height");

      var projection = d3
        .geoMercator()
        .scale(width * 80)
        .center([-87.6298, 41.8781])
        .translate([width / 2, height / 2]);

      const path = d3.geoPath().projection(projection);

     
      
      //d3.json("chicago_zipcodes.json").then(function (data){
      d3.json("SchoolBoundariesGeoJSON.json").then(function (data) {
        console.log(data);

        colorScheme = d3.schemeBlues[5];
        colorScale = d3
          .scaleThreshold()
          .domain([10, 11, 12, 13, 14, 25])
          .range(colorScheme);


        /**
         * Replace Mock Population Data with 
         * actual data frame.
         */  
        var popData = mockPopulationData(data);

       
        /**
         * Drawing The Legend based on the color scale
         */
        drawLegend(colorScale);

        g.selectAll("path")
          .data(data.features)
          .enter()
          .append("path")
          
          .attr("name", function (d) {
            return d.properties.SCHOOL_NM;
          })
          .attr("fill", function (d) {
            return colorScale(popData[d.properties.SCHOOL_ID]);
          })
          .attr("d", path)
          .attr("class",'district-path')
          .attr("opacity", .2)
          .attr("stroke", "black")
          .attr("stroke-width", strokeLevel)

          
          
      });

      svg.call(zoom);
    },
  };

  return newChoropleth;
};


/**
 * TODO: Remove HardCoded Labels
 *  
 * Fix Label Header Location
 * Current Labels are hard 
 * @param {*} colorScale 
 */
var drawLegend = function (colorScale) {
  var Legend = d3.select("#main_Legend");
  var g = Legend.append("g");
  
  /**
   * G. Append Text needs to be put in a better location. 
   */
  g.append("text")
  .attr("transform" ,"translate(50, 22.18181800842285)")
    .attr("class", "caption")
    .attr("x", 0)
    .attr("y", -6)
    .text("Population");

  // Add labels for legend
  var labels = ["10", "11", "12", "13", "14", "15"];
  // Create the legend based on colorScale and our labels


  var legend = d3
    .legendColor()
    .labels(function (d) {
      return labels[d.i];
    })
    .shapePadding(4)
    .scale(colorScale);
  g.call(legend);
};


/**
 * Stub
 * Thought it would be interesting to use a Cartogram
 * 
 * As of Deadline 4 this is out of scope. 
 */
var DrawCartogram = function () {};
