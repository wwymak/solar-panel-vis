/**
 * Created by wwymak on 12/12/2015.
 */

var nestedData,

    width = 600, height = 500

//scales
var xTimeScale = d3.time.scale().range([0, width]),
    yScale = d3.scale.linear().range([height, 0])

//layout funcs
var stackFunc = d3.layout.stack()
    .offset("zero")
    .values(function (d) { return d.values; })
    .x(function (d) { return xTimeScale(d.key); })
    .y(function (d) { return d.values; });

var areaFunc = d3.svg.area()
    .x(function(d) { return xTimeScale(d.date); })
    .y0(function(d) { return yScale(d.y0); })
    .y1(function(d) { return yScale(d.y0 + d.y); });


d3.csv("data/energy_generation.csv", function(err, data){
    if(err){
        console.log(err);
        alert("apologies, problem loading data");
        return
    }

    var timeFormating = d3.time.format('%d/%m/%y');

    data.forEach(function(d){
        d.date = timeFormating.parse(d.date);
        d.meter_reading = +d.meter_reading;
        d.output = +d.output;
        d.installed_capacity_kw = +d.installed_capacity_kw
        d.postCodeArea = d.postcode.split(" ")[0] //first part of the postcode to group areas by
    })
    console.log(data)

    //parsing the data
    nestedData = d3.nest().key(function(d){return d.postCodeArea}).sortKeys(d3.ascending)
        .key(function(d){return d.date})
        .rollup(function(leaves){return d3.sum(leaves, function (d){return d.output});})
        .entries(data);

    /**
     * basically pass in above nest of nest
     * @param nestedData
     */
    function getMaxDate(nestedData){
        var maxDateArr = nestedData.map(function(d){
            return d3.max(d.values, function(k){
                return (new Date(k.key).getTime())
            })
        })

        console.log(maxDateArr)
        return new Date(d3.max(maxDateArr));
    }
    //TODO probably put this in with getMaxDate since using pretty much the same logic
    function getMinDate(nestedData){
        var minDateArr = nestedData.map(function(d){
            return d3.min(d.values, function(k){
                return (new Date(k.key).getTime())
            })
        })
        return new Date(d3.min(minDateArr));
    }

    xTimeScale.domain([getMinDate(nestedData), getMaxDate(nestedData)]);

})


var stackedChartSVG = d3.select("#lineChartContainer").append("svg")
                        .attr("width", 600)
                        .attr("height", 500);



//axis

//areas

//transitions