//topojson = require('https://d3js.org/topojson.v1.min.js')
//d3 = require("https://d3js.org/d3.v5.min.js", 'd3-svg-legend')
var ChoroplethVis = function () {

  this.ActiveYear;
  this.ActiveType;

  this.LegendLabel = "Vote Count"

  getLegendLabel = function(){
    return this.LegendLabel
  }
  getActiveYear= function(){
    return this.ActiveType
  }
  setActiveYear= function( year){
    this.ActiveType= year
  }
  var newChoropleth = {
    drawChloropleth: function (svg,activeYearParam =2020,  type = 0) {
      setActiveYear(activeYearParam);
      
      svg.selectAll("g").remove();

      strokeLevel= .5;

      var g = svg.append("g").attr("id","map");

      var width = svg.attr("width");
      var height = svg.attr("height");

      var projection = d3
        .geoMercator()
        .scale(width*80)
        .center([-87.6298, 41.8781])
        .translate([width / 2, height / 2]);

      let geoGenerator = d3.geoPath().projection(projection);
      
      /**
       * Loads the GeoJson Data 
       * And the Active Year data. 
       */
      Promise.all([
          d3.json(`/Map/?Year=${getActiveYear()}`,function(d){
            console.log(d)           
          })
            ]).then(function(loadData){
              [collectionData] = loadData;
              console.log(collectionData)
       
        /**
         * Replace Mock Population Data with 
         * actual data frame.
         */  
        
        
        //var popData = mockPopulationData(collectionData, type);

        domain_options = [1,9, 29, 62, 154,1900]
        colorScheme = d3.schemeBlues[6];
        colorScale = d3
          .scaleThreshold()
          .domain(domain_options)
          .range(colorScheme);



        /**
         * Drawing The Legend based on the color scale
         */
        drawChoroplethLegend(colorScale, svg);



        /**
         * Updates paths after a zoom interaction. 
         */
      function update(){
        g.selectAll("path")
        .data(collectionData.features)
        .join("path") 
        .attr("d", geoGenerator)
        .attr("name", function (d) {
          return d.properties.Name;
        })
        .attr("sID", function(d){
          return d.properties.ID
        })
        .attr('TotalPopulation',function(d){
          return d.properties.ParentSum

        })
        .attr('Year',function(d){
          return d.properties.Year
        })
        .attr("fill", function (d) {

          if(d.properties.ParentSum >0)
          return colorScale(d.properties.ParentSum);
        else 
        return 'White'
        })
        .attr("d", geoGenerator)
        .attr("stroke", "black")
          .attr("stroke-width", strokeLevel)
          .on("click", function(d) {
            console.log(d.target.attributes[3])
            //d.target.__data__.properties
          
            if(d.target.attributes[3].value > 0)
            {
            //school ID and year
            newChoropleth.dispatch.call("selected", {}, [d.target.attributes[2].value, d.target.attributes[4].value]); 
            }
          
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
    .text(getLegendLabel());

  // Add labels for legend
  var labels = domain_options
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


function rewind (geo){
  const fixedGeoJSON = {...geo}
  fixedGeoJSON.features = fixedGeoJSON.features.map(f =>
    turf.rewind(f, { reverse: true })
  );
  return fixedGeoJSON;

}