/**
 * Testing the map view using mapbox.js (Leaflet.js extension ) and mapbox tiles wiht
 */


L.mapbox.accessToken = 'pk.eyJ1Ijoid3d5bWFrIiwiYSI6IkxEbENMZzgifQ.pxk3bdzd7n8h4pKzc9zozw';
var map = L.mapbox.map('mapContainer', 'mapbox.emerald').setView([51.5, -2.58], 9);

//load the geojson overlay of Bristol postcodes
d3.json("data/bristol_postcode_simplified.json", function(err, topoData){
    var features = topojson.feature(topoData, topoData.objects.bristol_layers_joined_simplified);

    //TODO filter the features so only the postcodes with data is shown
    //console.log(features.features)
    //and add to the map
    var geoJsonLayer = L.geoJson(features).addTo(map);

    //make the map zoom to the postcodes : note this does not always translate to a close crop since
    //zoom levels on the standard mapbox raster tiles only have integer zoom levels
    map.fitBounds(geoJsonLayer.getBounds()); 

    geoJsonLayer.eachLayer(function (layer) {
        layer.customID = layer.feature.properties.post_area;
        //adding the id to each postcode polygon so they can be hidden etc to interact with the chart
        if(typeof layer._path != 'undefined'){
            layer._path.id = layer.feature.properties.post_area;
        } else{
            layer.eachLayer(function (layer2){
                layer2._path.id = layer.feature.properties.post_area;
            });
        }

        //putting this here temporarily -- basically need the click event to also broadcast to the stacked chart via d3.dispatch
        layer.on('click', function(e){
            console.log("click", e, e.layer.getBounds())
            //put the zoom to polygon inside d3 dispatch so can control the zoom from the stacked?
            var polygonBounds = e.layer.getBounds()
            map.fitBounds(polygonBounds)

            d3EvtDispatcher.mapAreaSelected(e.layer._path.id)
        });


        // this is how you get the bounding box of each postcode area polygon: console.log(layer.getBounds())
    });
    //hmm, trying to select an area in the .eachLayer don't work--
    // Aha, got it-- assing a customID to each layer and do the layer filtering on that
    //
    d3EvtDispatcher.on("postcodeSelected.map", function(data){
        var postCodeKey = data.key; //use this to select the polygon on the map
        console.log(geoJsonLayer)
        geoJsonLayer.eachLayer(function(layer){
            if(layer.customID == postCodeKey){
                map.fitBounds(layer.getBounds())
                //TODO maybe do some other map highlighting things
            }
        });
    });

    //zoom out again to show all the postcodes when stacked chart transitions
    d3EvtDispatcher.on("showAllData.map", function(){
        map.fitBounds(geoJsonLayer.getBounds());
    })

    //TODO add some styling!
    //also some weird artifacts left from the joining...
})