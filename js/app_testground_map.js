/**
 * Testing the map view using mapbox.js (Leaflet.js extension ) and mapbox tiles wiht
 */

L.mapbox.accessToken = 'pk.eyJ1Ijoid3d5bWFrIiwiYSI6IkxEbENMZzgifQ.pxk3bdzd7n8h4pKzc9zozw';
var map = L.mapbox.map('mapContainer', 'mapbox.emerald').setView([51.5, -2.58], 9);

//load the geojson overlay of Bristol postcodes
d3.json("data/bristol_postcode.json", function(err, topoData){
    var features = topojson.feature(topoData, topoData.objects.bristol_layers_joined)
    //and add to the map
    L.geoJson(features).addTo(map);

    //TODO add some styling!
})