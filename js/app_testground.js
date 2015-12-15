/**
 * testing code for drawing
 * TODO once its all working nicely put it in a reusuable chart pattern or at least tidy it up a bit
 * TODO Also remove vars etc out of the global scope!!
 */

var nestedData,
    //TODO change these defaults to grabbing e.g. width from page
    width = 500, height = 400, margins = {top:40, left: 50, bottom: 50, right:80};

//scales
var xTimeScale = d3.time.scale().range([0, width]),
    yScale = d3.scale.linear().range([height, 0]),
    colorScale = d3.scale.category20c();

//axes func
var xAxis = d3.svg.axis()
    .scale(xTimeScale)
    .orient("bottom")
    .tickFormat(d3.time.format("%d-%m-%Y")).ticks(6),
    yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")


//layout funcs
var stackFunc = d3.layout.stack()
    .offset("zero")
    .values(function (d) { return d.values; })
    .x(function (d) { return xTimeScale(d.key); })
    .y(function (d) { return d.values; });

//area function for plotting the stacked areas.
//have to make sure you are grabbing the right attributes!
var areaFunc = d3.svg.area()
    .interpolate("linear")
    .x(function(d) { return xTimeScale(d.key); })
    .y0(function(d) { return yScale(d.y0); })
    .y1(function(d) { return yScale(d.y0 + d.y); });

//d3 custom event listeners
var d3EvtDispatcher = d3.dispatch('postcodeSelected', 'mapAreaSelected', 'showAllData');

//init svg for stackedAReaChart
var chartContainerSVG = d3.select("#lineChartContainer").append("svg")
    .attr("width", width + margins.left + margins.right)
    .attr("height", height + margins.top + margins.bottom)


var stackedChartSVG = chartContainerSVG.append("g").attr("class", "chart-area")
    .attr("transform", "translate(" +  margins.left + "," + margins.top + ")");

var legendSVG = chartContainerSVG.append("g").attr("class", "legend-group")
    .attr("transform", "translate(" +(width + margins.right - 10) + "," + 10 + ")");

var showAllBtn = document.getElementById("showAllBtn");

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
    });

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

    function getMaxY(nestedData){
        var maxYArr = nestedData.map(function(d){
            return d3.max(d.values, function(k){
                return (k.y + k.y0)
            })
        })
        return d3.max(maxYArr)
    }

    //apply stacking func to the data -- data modified in place though so TODO check if needed to make a
    //cloned copy of the data with Object.freeze (and make sure it's properly 'deep frozen'
    stackFunc(nestedData);

    //then set the scale domains
    xTimeScale.domain([getMinDate(nestedData), getMaxDate(nestedData)]);
    yScale.domain([0, getMaxY(nestedData)])

    stackedChartUpdate(nestedData);

    //draw the xAxis --apend to the outer container g otherwise axis labels constrained to
    // the chart area
    chartContainerSVG.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + margins.left + "," + (height + margins.top) + ")")
        .call(xAxis);
    //draw the yAxis
    var yAxisG = chartContainerSVG.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + margins.left + "," + margins.top + ")")
        .call(yAxis);

    //also need an axis label
    yAxisG
        .append("text").text("kWh").attr("text-anchor", "middle").attr("dy", "-1em");

    function stackedChartUpdate(nestedData){
        //apply stacking func to the data -- data modified in place though so TODO check if needed to make a
        //cloned copy of the data with Object.freeze (and make sure it's properly 'deep frozen'
        stackFunc(nestedData)
        //update yScale
        yScale.domain([0, getMaxY(nestedData)])

        //data bind and 1 g per series for a postcode area
        var postCodeSel = stackedChartSVG.selectAll(".series")
            .data(nestedData, function(d){
                return d.key
            })

        //throw out any unnecessary elements
        postCodeSel.exit().remove()

        var seriesG = postCodeSel.enter().append("g")
            .attr("class", "series");

        //then draw the actual stacked area
        seriesG.append("path")
            .attr("class", "series-path")
            .attr("d", function(d){
                d.values.forEach(function(item){
                    item.key = new Date(item.key)
                })
                return areaFunc(d.values)
            })
            .style("fill", function(d){
                return colorScale(d.key)
            })
            .on("click", function(d){
                d3EvtDispatcher.postcodeSelected(d)
            })

        //update areas
        d3.selectAll(".series-path").attr("d", function(d){
            d.values.forEach(function(item){
                item.key = new Date(item.key)
            });
            return areaFunc(d.values)
        });


        //update yAxis
        yAxis.scale(yScale)
        d3.select(".y.axis").call(yAxis)

        //update legends
        var legend = legendSVG.selectAll(".legend")
            .data(nestedData, function(d){return d.key});

        var legendG = legend.enter().append("g")
            .attr("class", "legend")
            .attr("transform", function (d, i) {
                return "translate(0," + i * 20 + ")";
            });

        legendG.append("rect").attr("x", 0)
          .attr("width", 20)
          .attr("height", 10)
          .style("fill", function(d){return colorScale(d.key)} )

        legendG.append("text")
          .attr("x", 25)
          .attr("y", 6)
          .attr("dy", ".35em")
          .text(function (d) { return d.key; });

        legend.exit().remove();




    }

    d3EvtDispatcher.on("postcodeSelected.stackedChart", function(data){
        //update the stacked chart to show only 1 dataset
        stackedChartUpdate([data]);
        //and update the control so you ahve the 'showAllbtn'
        showAllBtn.classList.remove("chart-all-state");
        showAllBtn.classList.add("chart-selected-state");
    });

    d3EvtDispatcher.on("showAllData.stackedChart", function(){stackedChartUpdate(nestedData)});

    d3EvtDispatcher.on("mapAreaSelected", function(postcodeID){
        var item = nestedData.filter(function(d){
            return d.key == postcodeID;
        });
        console.log(item);

        stackedChartUpdate(item)
    });

    showAllBtn.onclick =function(e){
        d3EvtDispatcher.showAllData()
    };
});



//transitions