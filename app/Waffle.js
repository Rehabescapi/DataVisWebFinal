var WaffleVis = function () {
    var newWaffle = {
      drawWaffle: function (svg,  selectedPath, type=0) {
        svg.selectAll("g").remove();
        tempW = svg.attr("width")
        tempH = svg.attr("height")
        var margin= {top:10, right:130, bottom : 30, left: 0},
        width = tempW- margin.left - margin.right,
        height = tempH - margin.left - margin.right,
        
        /**
         * TODO Math Scalable Waffle Squares
         */
        boxSize = 7, 
        boxGap = 2, 
        hoManyAccross = Math.floor(width/boxSize)


        /**
         * ("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
         */

        svg.attr("viewBox", "0 0" + (width + margin.left +margin.right) + " " + (height + margin.bottom + margin.top))

        
        var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top+ ")");

        var colors = d3.scaleSequential(d3.interpolateCubehelixDefault);


        /**
         * Box Chart needs to scale with objects
         * 
         */

        d3.json(`/SchoolID/?ID=${selectedPath}`).then(function(data, i){
            //sort data Alphabetically
            console.log("Woo")
            console.log(data)

            data = data[0]
            /**Stubbing for first year */
            var year = data.Year


            var categoryHeading = data.Name + " "+ data.year
            const candidates = [];

            var count = CountNumberOfCandidate("Parent", data)

            for (let i = 1; i <= count; i++) {
              const type = "Parent"
              const nameIndex = data[`${type} Candidate ${i} Name`];
              const votesIndex = data[`${type} Candidate ${i} Votes`];
             
          
            
          
              candidates.push({ 'Name': nameIndex, 'Votes': votesIndex, 'Type' : type });
          }

          console.log(candidates)

            //data.sort(function (a, b){ return d3.ascending(a[Name], b[Name])});


            var keys = d3.map(candidates, d=>d.Name).keys()

            colors.domain([0, keys.length]);



            //convert to Categorical scale
            var categoryScale = d3.scaleOrdinal(keys.map(function(d,i){return colors(i)}))
            categoryScale.domain(keys);//set the scale domain



            g.selectAll(".square")
            .data(candidates)
            .enter().append("rect")
            .attr("class", "square").attr("x", function(d) {return boxSize * (d.Votes%hoManyAccross)})
            .attr("y", function(d) { return Math.floor(d.Votes/hoManyAccross) * boxSize})
            .attr("width", boxSize-3)
            .attr("height", boxSize-3)
            .attr("fill", function(d) { return categoryScale(d.Name)})
            .exit();



            /**
             * Legend Works
             * 
             */
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