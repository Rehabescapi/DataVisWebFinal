var WaffleVis = function () {
    var newWaffle = {
      drawWaffle: function (svg,  selectedPath, type = 'Parent') {
        svg.selectAll("g").remove();
        svg.selectAll("text").remove();
        svg.selectAll("rect").remove();
        tempW = svg.attr("width")
        tempH = svg.attr("height")
        var margin= {top:25, right:100, bottom : 30, left: 0},
        width = tempW- margin.left - margin.right,
        height = tempH - margin.left - margin.right,
        
        /**
         * TODO Math Scalable Waffle Squares
         */
        boxSize = 7, 
        boxGap = 2, 
        hoManyAccross = Math.floor(width/boxSize)


        /**
         * Stubs
         */
        whole = true
        isRect = true
        options = {shape :"rect"}
        

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
            console.log(data)
            data = data[0]
            /**Stubbing for first year */
            var year = data.Year


            var categoryHeading = data.Name + " "+ data.year
            let candidates = [];

            var countParent = CountNumberOfCandidate("Parent", data)
            var countCommunity = CountNumberOfCandidate("Community", data);

            if(type.includes("Parent"))
            {
                count = countParent
            }
            else 
            {
               countCommunity
            }
            

            for (let i = 1; i <= count; i++) {
              
              const nameIndex = data[`${type} Candidate ${i} Name`];
              const votesIndex = data[`${type} Candidate ${i} Votes`];
              candidates.push({'Name': nameIndex,index :(i-1) , 'Votes': votesIndex, 'Type' : type , 'ratio': ( votesIndex/data[`${type}Sum`]) *100 });
            }

          console.log(candidates)

            //data.sort(function (a, b){ return d3.ascending(a[Name], b[Name])});
          waffles = function() {
              const array = [];
              
                const max = candidates.length; 
                let index = 0, curr = 1, 
                    accu = Math.round(candidates[0].ratio), waffle = [];
 
                for (let y = 9; y >= 0; y--)
                  for (let x = 0; x < 10; x ++) {
                    
                    if (curr > accu ) {
                      curr=1;
                      if(index < max-1) 
                        index++;
                      accu = Math.round(candidates[index].ratio)
                     
                    }
                    
                    
                    waffle.push({x, y, index, 'Name': candidates[index].Name});
                    curr++;
                    
                    
                    
                  } 
                array.push(waffle);
              
              return array;
            }
            waffleData = waffles()
            console.log(waffleData)
            var keys = d3.map(candidates, d=>d.Name).keys()

            colors.domain([0, keys.length]);



            console.log(keys)
            //convert to Categorical scale
            //var categoryScale = d3.scaleOrdinal(d3.schemeTableau10).domain(sequence(candidates.length))


            sequence = (length) => Array.apply(null, {length: length}).map((d, i) => i);

            color = d3.scaleOrdinal(d3.schemeTableau10)
            .domain(sequence(keys.length))

            /**
             * Start of 
             * https://observablehq.com/@analyzer2004/waffle-chart
             */
            drawTheDangWaffle = function(){
              const g = svg.selectAll(".waffle")  
            .data(waffleData)
            .join("g")
            .attr("class", "waffle");
            waffleSize = whole ? width < height ? width : height : 150;

            scale = d3.scaleBand()
            .domain(sequence(10))
            .range([0, waffleSize])
            .padding(0.1)
            

            const cellSize = scale.bandwidth();
            const half = cellSize / 2;
            const cells = g.append("g")
              .selectAll(options.shape)
              .data(d => d)
              .join(options.shape)
              .attr("type", d=> d.index)
              .attr("fill", d => d.index === -1 ? "#ddd" : color(d.index))
              .attr("candidate", d=> d.Name);
            
            if (isRect) {
              cells.attr("x", d => scale(d.x))
                .attr("y", d => scale(d.y))//Cut out whole here to see the scale
                .attr("rx", 3).attr("ry", 3)
                .attr("width", cellSize).attr("height", cellSize)      
            } 
            if (whole) {
              cells.append("title").text(d => {
                const cd = candidates[d.index];
                console.log(cd)
                return `${cd.Name}\n (${cd.ratio}%)`;
              });    
              
              cells.transition()
                .duration(d => d.y * 100)
                .ease(d3.easeBounce)
                .attr(isRect ? "y" : "cy", d => scale(d.y) + (isRect ? 0 : half));
                svg.transition().delay(550)
                .on("end", () => drawLegend(svg, cells));
            }
            /**
             * Legend Works
             * 
             */
            
             //legend
             drawLegend = function (svg, cells) {
             console.log(candidates)
             svg.append('svg').attr("id", "legend")
              const legend = svg.selectAll(".legend")
                .data(candidates.map(d => d.Name))
                .join("g")      
                .attr("opacity", 1)
                .attr('index', (d)=> d.index)
                .attr("transform", (d, i) => `translate(${waffleSize + 20},${i * 30})`)
                .on("mouseover", highlight)
                .on("mouseout", restore);
            
              legend.append("rect")
                .attr("rx", 3).attr("ry", 3)
                .attr("width", 30).attr("height", 20)
                .attr("fill", (d, i) => color(i));    
            
              legend.append("text")
                .attr("dx", 40)
                .attr("alignment-baseline", "hanging")
                .text((d, i) => `${d} (${candidates[i].ratio.toFixed(1)}%)`);

                console.log(legend.nodes())
              

              /**
               * Add SVG button change condition. 
               */
              svg.append("text")
              .attr("transform", (d, i) => `translate(${waffleSize + 20},${8 * 30})`)
              //.attr("alignment-baseline", "hanging")
              .text("Community").on("click", function(event){
                console.log("Woot")
                this.drawWaffle(svg,selectedPath,"Community")
                event.stopPropogation()
              })



            }
            


              function highlight(e, d, restore) {
                const i = legend.nodes().indexOf(e.currentTarget);
                console.log(e)
                console.log(i);
                cells.transition().duration(500)
                  .attr("fill", d => d.index === i ? color(d.index) : "#ccc");  
              }
              
              function restore() {
                cells.transition().duration(500).attr("fill", d => color(d.index))
              }
            }

            drawTheDangWaffle()
        })
        
      }
      
    }
    return newWaffle;
}

