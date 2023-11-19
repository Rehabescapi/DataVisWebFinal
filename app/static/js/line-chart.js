
const LineChart = (graphCategory = "Parent") => {
    return {
        draw: selectedDistrict => {
            // Set the dimensions and margins of the graph
            const margin = {
                top: 10,
                right: 100,
                bottom: 30,
                left: 60
            };

            const graphWidth = 1000 - margin.left - margin.right;
            const graphHeight = 550 - margin.top - margin.bottom;

            // Clear contents if any
            const chartArea = document.querySelector("#line-chart");
            if (chartArea !== null || chartArea !== undefined) {
                chartArea.replaceChildren();
            }

            // Append the svg object to the body of the page
            const theSvg = d3.select("#line-chart")
                .append("svg")
                .attr("width", graphWidth + margin.left + margin.right)
                .attr("height", graphHeight + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            d3.csv(`/school-districts/${selectedDistrict[0]}/new/csv`).then(unfilteredData => {
                // group the data (in case there are repeated entries)

                data = unfilteredData.filter( (element) => element.type ==graphCategory)

                const sumStats = d3.group(data, d => d.name);

                const x = d3.scaleLinear()
                    .domain(d3.extent(data, d => +d.year))
                    .range([15, graphWidth]);
                theSvg.append("g")
                    .attr("transform", `translate(0, ${height})`)
                    .call(d3.axisBottom(x).tickFormat(d3.format(".0f")).ticks(2));

                
                // Add Y axis
                const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => +d.votes)*1.1])
                    .range([graphHeight, 0]);
                theSvg.append("g")
                    .call(d3.axisLeft(y));

                // color palette
                const color = d3.scaleOrdinal()
                    .range(['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999'])

                // Draw the line
                theSvg.selectAll(".line").append('g')
                    .data(sumStats)
                    .join("path")
                    .attr("fill", "none")
                    .attr("stroke", d => color(d[0]))
                    .attr("stroke-width", 1.5)
                    .attr("d", d => d3.line()
                        .x(d => x(d.year))
                        .y(d => y(+d.votes))
                        (d[1]))

                
                impactfuldata = findImpactfull(data)

                //Draw the points
                theSvg.selectAll("Dots")
                .data(impactfuldata).join('g')
                .style("fill", d =>color(d.name))
                .attr("class", d => d.name)
                .append("circle")
                .attr("cx" , d=>x(d.year))
                .attr("cy", d=>y(d.votes))
                .attr("r", 5)
                .attr("stroke", "white")


                  const solomap = {}
                impactfuldata.forEach(item =>{
                    const name = item.name;
                    const year = parseInt(item.year)

                    if(!solomap[name] || year > solomap[name].year)
                        solomap[name] = item

                })


            
                console.log(Object.values(solomap))
                //adding the names
                theSvg
                .selectAll("#line-chart")
                .data(Object.values(solomap))
                .join('g')
                .attr('class', d => d.name)
                .append('text')
                .attr('transform', d=>  `translate(${x(d.year)},${y(d.votes)})`) // Put the text at the position of the last point
                .attr('x', 12) // shift the text a bit more right
                .text(function(d) {
                    console.log("I Exist")
                    return d.name
                } )
                .style('fill', d => color(d.name))
                .style('font-size', 15)
                console.log("woo")

              




               
            })
            findImpactfull = function(data){
                const years = [2016, 2018, 2020]

                const maxBy = (arr, fn) => Math.max(...arr.map(typeof fn === 'function' ? fn : val => val[fn]));
                /**Todo 
                 * Get the Max of each Year "Winner"
                 * and Any with 
                 */
                impactData = []
                temp = []
                for( year of years )
                {
                    temp= data.filter( (d) => d.year ==year)
                    max = maxBy(temp, o => o.votes)
                    impactData.push( ...temp.filter((d) => d.votes == max))
                }
                const sumStats = d3.group(data, d => d.name);

                for(stat of sumStats)
                {
                    if(stat[1].length > 1)
                    {
                        impactData.push(...stat[1])

                    }
                }
                 

                return impactData
            }
        },
        dispatch: d3.dispatch("selected")
    };
}

