/**
 * Created by wwymak on 12/12/2015.
 */

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
    })
})