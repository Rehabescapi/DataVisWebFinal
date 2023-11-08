//topojson = require('https://d3js.org/topojson.v1.min.js')
//d3 = require("https://d3js.org/d3.v5.min.js", 'd3-svg-legend')
var ChoroplethVis = function () {
  var newChoropleth = {
    drawChloropleth: function (svg, type = 0) {
      
      svg.selectAll("g").remove();

      strokeLevel= 2;
      var mapDir = "SchoolBoundariesGeoJSONFixed.json"
      switch (type){
        case 0:
          mapDir = "SchoolBoundariesGeoJSONFixed.json"
          type = "nothing"
        break;

        case 1:
          mapDir = "SchoolBoundariesGeoJSONFixed.json"
          type="population"
          break;
          
        case 2:
          mapDir="2024fixed.json"
          type="nothing"
          break;
         
        default:
          mapDir = "SchoolBoundariesGeoJSON.json"

      }

      
     
        

      var g = svg.append("g").attr("id","map");

      var width = svg.attr("width");
      var height = svg.attr("height");

      var projection = d3
        .geoMercator()
        .scale(width*80)
        .center([-87.6298, 41.8781])
        .translate([width / 2, height / 2]);

      let geoGenerator = d3.geoPath().projection(projection);
      
      Promise.all([
          d3.json(mapDir)
            ]).then(function(loadData){
              
              let topo = loadData[0]
   
   

        /**
         * TODO update Scheme to reflet things
         */
        colorScheme = d3.schemeBlues[5];
        colorScale = d3
          .scaleThreshold()
          .domain([10, 11, 12, 13, 14, 25])
          .range(colorScheme);


        /**
         * Replace Mock Population Data with 
         * actual data frame.
         */  
        var popData = mockPopulationData(topo, type);



        /**
         * Drawing The Legend based on the color scale
         */
        drawChoroplethLegend(colorScale, svg);



        /**
         * Updates paths after a zoom interaction. 
         */
      function update(){
        g.selectAll("path")
        .data(topo.features)
        .join("path") 
        .attr("d", geoGenerator)
        .attr("name", function (d) {
          return d.properties.SCHOOL_NM;
        })
        .attr("sID", function(d){
          return d.properties.SCHOOL_ID
        })
        .attr("fill", function (d) {
          return colorScale(popData[d.properties.SCHOOL_ID]);
        })
        .attr("d", geoGenerator)
        .attr("stroke", "black")
          .attr("stroke-width", strokeLevel)
          .on("click", function(d) {
            
           
            //Formerly known as d.properties.SCHOOL_ID
            newChoropleth.dispatch.call("selected", {}, d.target.attributes[2].value); 
           
          
          })


      }
      

      var zoom = d3
      .zoom().scaleExtent([1, 8])
      .on("zoom", handleZoom);

      function initZoom(){
        console.log(svg.selectAll('g'))
        svg.call(zoom);
      }
      update();
      initZoom();
      function handleZoom(event){
        
        const{transform} = event;
        g.attr('transform', transform);
       
        //JML -- was chasing a way to have the legend be on top of the Main map. 
        //drawChoroplethLegend(colorScale, svg)
        
      }
          
      });

      
    },
    dispatch: d3.dispatch("selected")
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
var drawChoroplethLegend = function (colorScale, svg) {
  var Legend = d3.select("#main_Legend");
  d3.select("#main_Legend").selectAll("g").remove();
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


function rewind(geo){
  const fixedGeoJSON = {...geo}
  fixedGeoJSON.features = fixedGeoJSON.features.map(f =>
    turf.rewind(f, { reverse: true })
  );
  return fixedGeoJSON;

}