// The svg
let width = 1000;
let height = 600;
const svg = d3.select("svg").attr("width", width).attr("height", height);

// Map and projection
let projection = d3.geoAlbersUsa()
    .translate([width / 2, height / 2]).scale([2000]);
const path = d3.geoPath().projection(projection);

//console.log(projection(40.71453,-74.00712))

let color = d3.scaleQuantize()
    .range(["rgb(237,248,233)", "rgb(186,228,179)", "rgb(116,196,118)", "rgb(49,163,84)", "rgb(0,109,44)"]);
//Colors derived from ColorBrewer, by Cynthia Brewer, and included in
//https://github.com/d3/d3-scale-chromatic
let formatAsThousands = d3.format(",");

let zooming = function (d) {
    let offset = [d3.event.transform.x, d3.event.transform.y];
    let newScale = d3.event.transform.k * 2000;
    projection.translate(offset).scale(newScale);

    svg.selectAll("path").attr("d", path);
    svg.selectAll("circle").attr("cx", function (d) {
        return projection([d.lon, d.lat])[0];
    }).attr("cy", function (d) {
        return projection([d.lon, d.lat])[1];
    });
}
let zoom = d3.zoom().on("zoom", zooming);
let center = projection([-97.0, 39.0]);

let map = svg.append("g")
    .attr("id", "map").call(zoom)
    .call(zoom.transform, d3.zoomIdentity.translate(width / 2, height / 2)
        .scale(0.25)
        .translate(-center[0], -center[1]));

map.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", width)
    .attr("height", height)
    .attr("opacity", 0);

d3.csv("./us-ag-productivity.csv", function (data) {
    //Set input domain for color scale
    color.domain([
        d3.min(data, function (d) { return d.value; }),
        d3.max(data, function (d) { return d.value; })
    ]);

    // Load external data and boot
    //Note to Jason -- Just start running things on http-server
    d3.json("./chicago_zipcodes.json", function (json) {
        for (let i = 0; i < data.arcs.length; i++) {
            let dataState = data.arcs[i].state;
            let dataValue = parseFloat(data[i].value);
            for (const feature of json.features) {
                let jsonState = feature.properties.name;
                if (dataState == jsonState) {
                    //Copy the data value into the JSON
                    feature.properties.value = dataValue;
                    //Stop looking through the JSON
                    break;
                }
            }
        }

        //Bind data and create one path per GeoJSON feature
        map.selectAll("path")
            .data(json.features)
            .enter()
            .append("path")
            .attr("d", path)
            .style("fill", function (d) {
                //Get data value
                let value = d.properties.value;
                if (value) {
                    //If value exists…
                    return color(value);
                } else {
                    //If value is undefined…
                    return "#ccc";
                }
            });

        d3.csv('./us-cities.csv', function (data) {
            console.log(data);
            svg.selectAll("circle")
                .data(data)
                .enter()
                .append("circle")
                .attr("cx", function (d) {
                    return projection([d.lon, d.lat])[0];
                })
                .attr("cy", function (d) {
                    return projection([d.lon, d.lat])[1];
                })
                .attr("r", function (d) {
                    return Math.sqrt(parseInt(d.population) * 0.00004);
                })
                .style("fill", "yellow")
                .style("stroke", "gray")
                .style("stroke-width", 0.25)
                .style("opacity", 0.75)
                .append("title")			//Simple tooltip
                .text(function (d) {
                    return d.place + ": Pop. " + formatAsThousands(d.population);
                });
        });
    });
});