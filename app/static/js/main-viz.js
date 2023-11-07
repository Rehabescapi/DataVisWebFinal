// The svg
let width = 300;
let height = 500;
const svg = d3.select("svg").attr("width", width).attr("height", height);

/**
 * Moved projection to ChoroplethMain.
 */

/***
 * TODO selet PoI from Main map to expand on subGraphs.
 * */
function getSchoolIDData(node, ID) {}

//*Data Visualization Boards
CP = ChoroplethVis();
WF = WaffleVis();

CP.drawChloropleth(svg);

CP.dispatch.on("selected", function (selectedPath) {
  console.log(selectedPath);
  d3.json(`/SchoolID/?ID=${selectedPath}`).then(function (data) {
    console.log(data);
    firstyear = data[0];
    console.log(firstyear)
    let subGraphA = d3.select('#SubGraphA')

    /**
     * Can actually have the Subgraph make this call. 
     */
    WF.drawWaffle(subGraphA, selectedPath)
    //Number of election types in side the data.
    
  });

  /***
   * TODO ADD ZOOM IN on Selected Area
   *
   */
});

/**
 * TODO: return to global scope
 */
function setYear(mode) {
  CP.drawChloropleth(svg, mode);
}
