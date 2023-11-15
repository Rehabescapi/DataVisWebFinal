var WaffleVis = function () {
  this.selectedPath;
  this.DataTypes = [];
  this.YearOptions = [];
  this.ActiveType = "";
  this.ActiveYear = "";
  this.totalVotes = 0;
  this.Header = ""

  getHeader = function(){
    return this.Header
  }
  setHeader = function(header){
    this.Header = header
  }

  getDataTypes = function () {
    return this.DataTypes;
  };
  setDataTypes = function (types) {
    this.DataTypes = [...types];
  };

  getYearTypes = function () {
    return this.YearOptions;
  };

  getTotalVotes = function(){
    return this.totalVotes
  }
  setTotalVotes = function(votes){
    this.totalVotes = parseInt(votes)
  }
  setYearOptions = function (options) {
    console.log(options)
    this.YearOptions = [...new Set(options)];
  };

  setActiveType = function (type) {
    this.ActiveType = type;
  };
  getActiveType = function () {
    return this.ActiveType;
  };

  setActiveYear = function (year) {
    this.ActiveYear = year;
  };
  getActiveYear = function () {
    return this.ActiveYear;
  };

  var newWaffle = {
    drawWaffle: function (svg, selectedPath, type = "Parent", year = 2020) {
      this.selectedPath = selectedPath;
      if(selectedPath[1] > 0)
        year = selectedPath[1];
      setActiveType(type);
      setActiveYear(year);

      tempW = svg.attr("width");
      tempH = svg.attr("height");
      var margin = { top: 35, right: 100, bottom: 30, left: 0 },
        width = tempW - margin.left - margin.right,
        height = tempH - margin.left - margin.right,
        /**
         * TODO Math Scalable Waffle Squares
         */
        boxSize = 7,
        boxGap = 2,
        hoManyAccross = Math.floor(width / boxSize);

      /**
       * Stubs
       */
      whole = true;
      isRect = true;
      options = { shape: "rect" };

      svg.attr(
        "viewBox",
        "0 0" +
          (width + margin.left + margin.right) +
          " " +
          (height + margin.bottom + margin.top)
      );
      
      var colors = d3.scaleSequential(d3.interpolateCubehelixDefault);

      /**
       * Box Chart needs to scale with objects
       *
       */

      d3.json(`/SchoolID/?ID=${selectedPath[0]}&Year=${selectedPath[1]}`).then(function (dataSet, i) {
        //sort data Alphabetically
        console.log(dataSet);
        data = {};
        yearOptions = [];
        for (let row of dataSet) {
          console.log(row.Year)

          if(row.ParentSum >0|| row.CommunitySum > 0)
            {yearOptions.push(row.Year);
            }
          if(row.Year == getActiveYear())
          {
            data = row
          }
        }
        
        setYearOptions(yearOptions);

        try {
        } catch (error) {
          throw new Error("Year not in tuple Found");
        }
        
        
        console.log(data)
        /**Stubbing for first year */

        setHeader( categoryHeading = data.Name + " " + data.Year +" ");

        //data.sort(function (a, b){ return d3.ascending(a[Name], b[Name])});

        let candidates = getBasicData(data, type);
        setTotalVotes( (candidates[0].Votes/ ((candidates[0].ratio)* .01)));
        let waffleData = getWaffleData(candidates);
        var keys = d3.map(candidates, (d) => d.Name).keys();
        console.log(keys);

        colors.domain([0, keys.length]);

        //convert to Categorical scale
        //var categoryScale = d3.scaleOrdinal(d3.schemeTableau10).domain(sequence(candidates.length))

        sequence = (length) =>
          Array.apply(null, { length: length }).map((d, i) => i);

        color = d3
          .scaleOrdinal(d3.schemeTableau10)
          .domain(sequence(keys.length));

        /**
         * Start of
         * https://observablehq.com/@analyzer2004/waffle-chart
         */
        drawTheDangWaffle = function () {
          svg.selectAll("g").remove();
          svg.selectAll("text").remove();
          svg.selectAll("rect").remove();
          const g = svg
            .selectAll(".waffle")
            .data(waffleData)
            .join("g")
            .attr("class", "waffle").
            attr("transform", "translate(0, 30)");
          waffleSize = whole ? (width < height ? width : height) : 150;

          scale = d3
            .scaleBand()
            .domain(sequence(10))
            .range([0, waffleSize])
            .padding(0.1);

          const cellSize = scale.bandwidth();
          const half = cellSize / 2;
          const cells = g
            .append("g")
            .selectAll(options.shape)
            .data((d) => d)
            .join(options.shape)
            .attr("type", (d) => d.index)
            .attr("fill", (d) => (d.index === -1 ? "#ddd" : color(d.index)))
            .attr("candidate", (d) => d.Name);

          if (isRect) {
            cells
              .attr("x", (d) => scale(d.x))
              .attr("y", (d) => scale(d.y)) //Cut out whole here to see the scale
              .attr("rx", 3)
              .attr("ry", 3)
              .attr("width", cellSize)
              .attr("height", cellSize);
          }
          if (whole) {
            cells.append("title").text((d) => {
              const cd = candidates[d.index];
              return `${cd.Name}\n (${cd.ratio}%)`;
            });

            cells
              .transition()
              .duration((d) => d.y * 100)
              .ease(d3.easeBounce)
              .attr(
                isRect ? "y" : "cy",
                (d) => scale(d.y) + (isRect ? 0 : half)
              );
            svg
              .transition()
              .delay(550)
              .on("end", () => drawLegend(svg, cells));
          }
          /**
           * Legend Works
           *
           */

          //legend
          drawLegend = function (svg, cells) {
            svg.append("svg").attr("id", "legend");
            const legend = svg
              .selectAll(".legend")
              .data(candidates.map((d) => d.Name))
              .join("g")
              .attr("opacity", 1)
              .attr("index", (d) => d.index)
              .attr(
                "transform",
                (d, i) => `translate(${waffleSize + 20},${i * 30 + margin.top})`
              )
              .on("mouseover", highlight)
              .on("mouseout", restore);

            legend
              .append("rect")
              .attr("rx", 3)
              .attr("ry", 3)
              .attr("width", 30)
              .attr("height", 20)
              .attr("fill", (d, i) => color(i));

            legend
              .append("text")
              .attr("dx", 40)
              .attr("dominant-baseline", "hanging")
              .text((d, i) => `${d}: ${candidates[i].Votes} (${candidates[i].ratio.toFixed(1)}%)`);

            /**
             * Add SVG button change condition.
             */

            /**
             * DrawingOptions if Available in the Grid
             */

            currentDataTypes = getDataTypes();
            yearOptions = getYearTypes();
            totalVotes = getTotalVotes();

            svg.append("text").attr("transform", `translate(0,20)`)
            .text(categoryHeading + ", Total Votes :" +totalVotes)
            iterator = 1
            for(let year of yearOptions )
            {
              if(year != getActiveYear())
              {
                svg
                .append("text")
                .attr(
                  "transform",
                  (d, i) =>
                    `translate(${iterator * 50},${9 * 30 + margin.top})`
                )
                //.attr("alignment-baseline", "hanging")
                .text(year)
                .on("click", function (event) {
                  newWaffle.dispatch.call("selected", {}, [
                    selectedPath,
                    getActiveType(),
                    year,
                  ]);
                });
                iterator++
            }
              }
            

              currentType = getActiveType()
            if (currentType == "Parent") {
              svg
                .append("text")
                .attr(
                  "transform",
                  (d, i) =>
                    `translate(${waffleSize + 20},${8 * 30 + margin.top})`
                )
                //.attr("alignment-baseline", "hanging")
                .text("Community")
                .on("click", function (event) {
                  newWaffle.dispatch.call("selected", {}, [
                    selectedPath,
                    "Community",
                    getActiveYear(),
                  ]);
                });
            } else {
              svg
                .append("text")
                .attr(
                  "transform",
                  (d, i) =>
                    `translate(${waffleSize + 20},${9 * 30 + margin.top})`
                )
                //.attr("alignment-baseline", "hanging")
                .text("Parent")
                .on("click", function (event) {
                  newWaffle.dispatch.call("selected", {}, [
                    selectedPath,
                    "Parent",
                    getActiveYear(),
                  ]);
                });
            }

            function highlight(e, d, restore) {
              const i = legend.nodes().indexOf(e.currentTarget);
              cells
                .transition()
                .duration(500)
                .attr("fill", (d) => (d.index === i ? color(d.index) : "#ccc"));
            }

            function restore() {
              cells
                .transition()
                .duration(500)
                .attr("fill", (d) => color(d.index));
            }
          };
        };

        drawTheDangWaffle();
      });
    },
    dispatch: d3.dispatch("selected"),
  };
  return newWaffle;
};

getWaffleData = function (candidates) {
  try
  {
    if(candidates.length ==0)
      throw new error
  const array = [];

  const max = candidates.length;
  let index = 0,
    curr = 1,
    accu = Math.round(candidates[0].ratio),
    waffle = [];

    for (let y = 9; y >= 0; y--)
      for (let x = 0; x < 10; x++) {
        if (curr > accu) {
          curr = 1;
          if (index < max - 1) index++;
          accu = Math.round(candidates[index].ratio);
        }

        waffle.push({ x, y, index, Name: candidates[index].Name });
        curr++;
      }
    array.push(waffle);

    return array;
  }catch (error){

  }
};
function getBasicData(data, type) {
  let candidates = [];
  console.log(type);

  var countParent = CountNumberOfCandidate("Parent", data);
  var countCommunity = CountNumberOfCandidate("Community", data);

  setDataTypes([countParent, countCommunity]);

  if (type.includes("Parent")) {
    count = countParent;
  } else {
    count = countCommunity;
  }
  
  for (let i = 1; i <= count; i++) {
    if(data[`${type} Candidate ${i} Name`] === 0)
    {

    }else{
    const nameIndex = data[`${type} Candidate ${i} Name`];
    const votesIndex = data[`${type} Candidate ${i} Votes`];
    candidates.push({
      Name: nameIndex,
      index: i - 1,
      Votes: votesIndex,
      Type: type,
      ratio: (votesIndex / data[`${type}Sum`]) * 100,
    });
  }
  }
  return candidates;
}
