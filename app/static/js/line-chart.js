
const LineChart = () => {
    return {
        draw: selectedDistrict => {
            // Set the dimensions and margins of the graph
            const margin = {
                top: 10,
                right: 30,
                bottom: 30,
                left: 60
            };

            const graphWidth = 460 - margin.left - margin.right;
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

            d3.csv(`/school-districts/${selectedDistrict[0]}/new/csv`).then(data => {
                // group the data (in case there are repeated entries)
                const sumStats = d3.group(data, d => d.name);

                const x = d3.scaleLinear()
                    .domain(d3.extent(data, d => +d.year))
                    .range([0, width]);
                theSvg.append("g")
                    .attr("transform", `translate(0, ${height})`)
                    .call(d3.axisBottom(x).tickFormat(d3.format(".0f")).ticks(3));

                // Add Y axis
                const y = d3.scaleLinear()
                    .domain([0, d3.max(data, d => +d.votes)])
                    .range([height, 0]);
                theSvg.append("g")
                    .call(d3.axisLeft(y));

                // color palette
                const color = d3.scaleOrdinal()
                    .range(['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999'])

                // Draw the line
                theSvg.selectAll(".line")
                    .data(sumStats)
                    .join("path")
                    .attr("fill", "none")
                    .attr("stroke", d => color(d[0]))
                    .attr("stroke-width", 1.5)
                    .attr("d", d => d3.line()
                        .x(d => x(d.year))
                        .y(d => y(+d.votes))
                        (d[1]))
            })
        },
        dispatch: d3.dispatch("selected")
    };
}

