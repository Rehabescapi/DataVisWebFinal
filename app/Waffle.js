var WaffleVis = function () {
    var newWaffle = {
      drawWaffle: function (svg, type = 0) {
        svg.selectAll("g").remove();
        tempW = svg.attr("width")
        tempH = svg.attr("height")
        var margin= {top:10, right:130, bottom : 30, left: 0},
        width = tempW- margin.left - margin.right,
        height = tempH - margin.left - margin.right,
        boxSize = 7, 
        boxGap = 2, 
        hoManyAccross = Math.floor(width/boxSize)


        /**
         * ("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
         */

        svg
        .attr("viewBox", "0 0" + (width + margin.left +margin.right) + " " + (height + margin.bottom + margin.top))

        var categoryHeading = "VEHTYPE_AT_FAULT"
        var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top+ ")");

        var colors = d3.scaleSequential(d3.interpolateCubehelixDefault);


        /**
         * Box Chart needs to scale with objects
         * 
         */

        d3.csv('./serverData/traffic-collision-data.csv').then(function(data, i){
            //sort data Alphabetically
            data.sort(function (a, b){ return d3.ascending(a[categoryHeading], b[categoryHeading])});


            var keys = d3.map(data, function(d) {return d[categoryHeading]}).keys()

            colors.domain([0, keys.length]);



            //convert to Categorical scale
            var categoryScale = d3.scaleOrdinal(keys.map(function(d,i){return colors(i)}))
            categoryScale.domain(keys);//set the scale domain



            g.selectAll(".square")
            .data(data)
            .enter().append("rect")
            .attr("class", "square").attr("x", function(d,i) {return boxSize * (i%hoManyAccross)})
            .attr("y", function(d,i) { return Math.floor(i/hoManyAccross) * boxSize})
            .attr("width", boxSize-3)
            .attr("height", boxSize-3)
            .attr("fill", function(d) { return categoryScale(d[categoryHeading])})
            .exit();


             //legend
     var legend = svg.selectAll(".legend")
     .data(keys)
     .enter();
 
 
 legend.append("rect")
     .attr("x", margin.left + width + boxGap )
     .attr("y", function(d,i){ return (i * boxSize) + margin.top; })
     .attr("width", boxSize - 3)
     .attr("height", boxSize - 3)
     .attr("fill", function(d){ return categoryScale(d); })
 
 legend.append("text")
     .attr("x", margin.left + width + boxSize + (boxGap*2))
     .attr("y", function(d,i){ return (i * boxSize) + margin.top; })
     .append("tspan")
     .attr("dx", 0)
     .attr("dy", boxSize/2)
     .style("alignment-baseline", "middle")
     .style("font-size", 10)
     .style("font-family", "Helvetica, Arial, sans-serif")
     .text(function(d){ return d;})
        })


      }
    }
    return newWaffle;
}