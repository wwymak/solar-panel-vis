/**
 * Created by wwymak on 12/12/2015.
 */

var nestedData
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

    nestedData = d3.nest().key(function(d){return d.postCodeArea}).entries(data)
})

var stackedChartSVG = d3.select("#lineChartContainer").append("svg")
                        .attr("width", 600)
                        .attr("height", 500)