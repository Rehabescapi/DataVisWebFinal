// The svg
let width = 600;
let height = 1000;
const svg = d3.select("svg").attr("width", width).attr("height", height);

/**
 * Moved projection to ChoroplethMain. 
*/

/***
 * TODO selet PoI from Main map to expand on subGraphs. 
 * */
function getSchoolIDData(node, ID) {

}

//*Data Visualization Boards
CP = ChoroplethVis();

CP.drawChloropleth(svg);

CP.dispatch.on("selected",
    function (selectedPath) {
        console.log(selectedPath);
        d3.csv(`/SchoolID/?ID=${selectedPath}`).then(function (data) {
            console.log(data);
        })

        /***
         * TODO ADD ZOOM IN on Selected Area
         * 
         */
    })

/**
 * TODO: return to global scope
 */
function setYear(mode) {
    CP.drawChloropleth(svg, mode);
}