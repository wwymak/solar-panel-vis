/**
 * Stuff for actually controlling the vis-- depending on how the code grows may have to split itup
 */

var solarVis = solarVis ||{}

//for data loading, exposing whatever's in exports
solarVis.dataHandler = function module(){
    var exports = {},
        dataDispatch = d3.dispatch() //todo data ready events

    /**
     *
     * @param filepath string 'path-to-data-file'
     * @param dataParseFunc function to process each column e.g. cast to number etc
     */
    exports.getData = function(filepath, dataParseFunc){

    }
}

//d3.csv("data/energy_generation.csv", function(err, data){
//
//})

// for the stacked area chart
solarVis.stackedChart = function module(){

}

//for the map
//ToDO !!!!!! (google map/ mapbox map with geojson overlay...)

