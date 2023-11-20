// The svg

const svg = d3.select("svg");
/**
 * Moved projection to ChoroplethMain.
 */

/***
 * TODO selet PoI from Main map to expand on subGraphs.
 * */
function getSchoolIDData(node, ID) {}

//*Data Visualization Boards
const CP = ChoroplethVis();
const WF = WaffleVis();
const lChart = LineChart();

CP.drawChloropleth(svg);

CP.dispatch.on("selected", function (selectedPath) {
  console.log(selectedPath);

  let subGraphA = d3.select("#SubGraphA");
  let subGraphB = d3.select("#SubGraphB");

  /**
   * Can actually have the Subgraph make this call.
   */
  WF.drawWaffle(subGraphA, selectedPath);
  //Number of election types in side the data.

  lChart.draw(selectedPath);
});

WF.dispatch.on("selected", function (args) {
  let [selectedPath, type, year] = args;
  console.log(selectedPath);
  let subGraphA = d3.select("#SubGraphA");
  WF.drawWaffle(subGraphA, selectedPath, type, year);
});

/***
 * TODO ADD ZOOM IN on Selected Area
 *
 */

/**
 * TODO: return to global scope
 */
function setYear(mode) {
  CP.drawChloropleth(svg, mode);
}
