const LineChart = () => {
  return {
    draw: (selectedDistrict) => {
      // Set the dimensions and margins of the graph
      const margin = {
        top: 10,
        right: 100,
        bottom: 30,
        left: 60,
      };

      const width = 1000;
      const height = 500;

      const graphWidth = width - margin.left - margin.right;
      const graphHeight = height - margin.top - margin.bottom;

      // Clear contents if any
      const chartArea = document.querySelector("#line-chart");
      if (chartArea !== null || chartArea !== undefined) {
        chartArea.replaceChildren();
      }

      // Append the svg object to the body of the page
      const theSvg = d3
        .select("#line-chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      d3.csv(`/school-districts/${selectedDistrict[0]}/new/csv`).then(
        (unfilteredData) => {
          const filteredData = unfilteredData.filter(
            (candidate) => candidate.type === "Parent"
          );
          // group the data (in case there are repeated entries)
          const sumStats = d3.group(filteredData, (d) => d.name);

          const x = d3
            .scaleLinear()
            .domain(d3.extent(filteredData, (d) => +d.year))
            .range([15, graphWidth - 70]);
          theSvg
            .append("g")
            .attr("transform", `translate(0, ${graphHeight})`)
            .call(d3.axisBottom(x).tickFormat(d3.format(".0f")).ticks(2));

          // Add Y axis
          const y = d3
            .scaleLinear()
            .domain([0, d3.max(filteredData, (d) => +d.votes) * 1.1])
            .range([graphHeight, 15]);
          theSvg.append("g").call(d3.axisLeft(y));

          // color palette
          const color = d3
            .scaleOrdinal()
            .range([
              "#e41a1c",
              "#377eb8",
              "#4daf4a",
              "#984ea3",
              "#ff7f00",
              "#ffff33",
              "#a65628",
              "#f781bf",
              "#999999",
            ]);

          // Draw the line
          theSvg
            .selectAll(".line")
            .append("g")
            .data(sumStats)
            .join("path")
            .attr("fill", "none")
            .attr("stroke", (d) => color(d[0]))
            .attr("stroke-width", 1.5)
            .attr("d", (d) =>
              d3
                .line()
                .x((d) => x(d.year))
                .y((d) => y(+d.votes))(d[1])
            );

          let impactfuldata = findImpactful(filteredData);

          // Draw the points
          theSvg
            .selectAll("Dots")
            .data(impactfuldata)
            .join("g")
            .style("fill", (d) => color(d.name))
            .attr("class", (d) => d.name)
            .append("circle")
            .attr("cx", (d) => x(d.year))
            .attr("cy", (d) => y(d.votes))
            .attr("r", 5)
            .attr("stroke", "white");

          const solomap = {};
          impactfuldata.forEach((item) => {
            const name = item.name;
            const year = parseInt(item.year);
            if (!solomap[name] || year > solomap[name].year) {
              solomap[name] = item;
            }
          });

          // Adding the names
          theSvg
            .selectAll("#line-chart")
            .data(Object.values(solomap))
            .join("g")
            .attr("class", (d) => d.name)
            .append("text")
            .attr("transform", (d) => `translate(${x(d.year)},${y(d.votes)})`) // Put the text at the position of the last point
            .attr("x", 12) // shift the text a bit more right
            .text(function (d) {
              return d.name;
            })
            .style("fill", (d) => color(d.name))
            .style("font-size", 15);
        }
      );
    },
    dispatch: d3.dispatch("selected"),
  };
};
