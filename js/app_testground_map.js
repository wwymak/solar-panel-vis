/**
 * Testing the map view using mapbox.js (Leaflet.js extension ) and mapbox tiles wiht
 */

L.mapbox.accessToken = 'pk.eyJ1Ijoid3d5bWFrIiwiYSI6IkxEbENMZzgifQ.pxk3bdzd7n8h4pKzc9zozw';
var map = L.mapbox.map('mapContainer', 'mapbox.emerald').setView([51.5, -2.58], 9);

//load the geojson overlay of Bristol postcodes
d3.json("data/bristol_postcode.json", function(err, topoData){
    var features = topojson.feature(topoData, topoData.objects.bristol_layers_joined)
    //and add to the map
    var geoJsonLayer = L.geoJson(features).addTo(map);

    //make the map zoom to the postcodes
    map.fitBounds(geoJsonLayer.getBounds()); //todo  check if this works

    geoJsonLayer.eachLayer(function (layer) {
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
            var polygonBounds = e.layer.getBounds()
            map.fitBounds(polygonBounds)
        })
        // this is how you get the bounding box of each postcode area polygon: console.log(layer.getBounds())
    });

    //TODO add some styling!
})