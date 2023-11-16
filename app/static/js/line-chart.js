
const LineChart = () => {
    return {
        draw: selectedDistrict => {
            // set the dimensions and margins of the graph
            const margin = {
                top: 10,
                right: 30,
                bottom: 30,
                left: 60
            };

            const graphWidth = 460 - margin.left - margin.right;
            const graphHeight = 400 - margin.top - margin.bottom;

            // Clear contents if any
            const chartArea = document.querySelector("#line-chart");
            if (chartArea !== null || chartArea !== undefined) {
                chartArea.replaceChildren();
            }

            // append the svg object to the body of the page
            const theSvg = d3.select("#line-chart")
                .append("svg")
                .attr("width", graphWidth + margin.left + margin.right)
                .attr("height", graphHeight + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            // JSON from local API
            const district_id = selectedDistrict[0];
            let jsonData;
            let theCSV;

            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    // Typical action to be performed when the document is ready:
                    const response = xhttp.responseText;
                    // console.log("ok" + response);
                    jsonData = response;
                    // TODO: Fix malformed JSON before conversion
                    // theCSV = jsonToCsv(jsonData);
                    console.log(theCSV);
                    console.log(response);
                }
            };
            xhttp.open("GET", `/school-districts/${district_id}`, true);
            xhttp.send();

            // Read and graph the data
            const sourceData = "https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv";

            // TODO: Replace 'sourceData' with data from local API
            d3.csv(sourceData, d => { return { date: d3.timeParse("%Y-%m-%d")(d.date), value: d.value } })
                .then(data => {
                    // Add X axis --> it is a date format
                    const x = d3.scaleTime()
                        .domain(d3.extent(data, d => d.date))
                        .range([0, graphWidth]);
                    theSvg.append("g")
                        .attr("transform", `translate(0, ${graphHeight})`)
                        .call(d3.axisBottom(x));

                    // Max value observed:
                    const max = d3.max(data, d => +d.value)

                    // Add Y axis
                    const y = d3.scaleLinear()
                        .domain([0, max])
                        .range([graphHeight, 0]);
                    theSvg.append("g")
                        .call(d3.axisLeft(y));

                    // Set the gradient
                    theSvg.append("linearGradient")
                        .attr("id", "line-gradient")
                        .attr("gradientUnits", "userSpaceOnUse")
                        .attr("x1", 0)
                        .attr("y1", y(0))
                        .attr("x2", 0)
                        .attr("y2", y(max))
                        .selectAll("stop")
                        .data([{ offset: "0%", color: "blue" }, { offset: "100%", color: "red" }])
                        .enter().append("stop")
                        .attr("offset", d => d.offset)
                        .attr("stop-color", d => d.color);

                    // Add the line
                    theSvg.append("path")
                        .attr("class", "line-path")
                        .datum(data)
                        .attr("fill", "none")
                        .attr("stroke", "url(#line-gradient)")
                        .attr("stroke-width", 2)
                        .attr("d", d3.line().x(d => x(d.date)).y(d => y(d.value)))
                })
        },
        dispatch: d3.dispatch("selected")
    };
}
