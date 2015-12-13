<h2>Solar Panel Vis</h2>

**Questions a user may ask of the data:**

1. how is the total output changing on a time basis?
2. what is the contribution from each postcode area? (potentially this question may be less important in a small 
city but imagine a country-- then you can see which counties/states are getting more energy from the panels
3. what does the output from one postcode look like?
4. where are the solar panels? 
5. which postcodes have more capacity?
6. can I look at what is happening to the generation/ energy mix of one panel installation? (ie one house in this dataset)
7. what is the energy output vs total energy requirement? 
8. how much money is saved? (possibly link to another data set?)

**Potential answers**

For 1, 2, and 3 => a stacked area chart with Date as the x axis and total output as y. Contribution from each area 
indicates the postcode area (e.g. BS6) 

_Interactions:_
 
 when you click on one area corresponding to a postcode, the chart updates to show a line chart of that 
postcode's output, and using a 'view all' (?) button to go back up to the default view
- can also do this via the legend and the map (see below)
- tooltip line to show actual values of data points on a day

4, 5, 6: idea is to use a map with a postcode area overlay (potentially color corresponding to a quantised generation
value from that postcode) 

_Interactions:_

- click on a postcode area to zoom into postcode area and show dots(?) of where the data is coming from
(caveat being that this isn't going to work nicely if everyone installs panels! -- maybe if data set is larger
could use areas withing areas?)

- also tie postcode area zoom with the stacked area transition to data of one postcode only

6: assuming that the dots are not too dense, when you click on one dot it gives you a tooltip box with info about
the solar panel info (and/or data) about that property e.g. linking to the other datasets you can get info about 
when the panel is installed, and the capacity, as well as historic feed in tarrif claims (<em>note this 
may work better with a new view? e.g. replacing the stacked chart with info about one house only</em>)



**Tech**

- Javascript: d3.js
- CSS: Bootstrap (it's well established does responsive out of the box. Having said that, it may be more
than is needed for a simple project, but assuming the prototype grows larger then it may be a useful choice. 
Also I am most familiar with it so for something quick I am just putting it in for the grid based and 
also responsive reflows. Could have used e.g. Pure.css for a lighter weight option if necessary)

**Code structure**

- data loader/parser
- one to control the stacked chart
- one to control the map
- d3.dispatch (?) to tie them together



**Testing**

Don't know much about testing frameworks etc but is hoping to learn!
- Browser testing: does it work as expected on Chrome, FF, Safari and IE (and which version of IE is the
absolute min for support?)
-

**Notes**

Data source: https://data.gov.uk/dataset/energy-generation-from-solar-pv-arrays-for-selected-bristol-buildings

**TODOs:**

LOTS at the moment:

- tidy up code from the prototype testing ground into closure/ reusable chart module as per structure started 
 in 'app.js'
- map from mapbox(?) with geojson overlay
- intro text
- menu buttons 
- **transitions, transitions!!**
- nicer colors for the stacked chart -- cateogory20c colours _are_ a bit garish...
- window resize handlers
- what to show on mobile view?

Geojson overlay: 

- shapefiles from http://www.opendoorlogistics.com/data/
- get info about the Sectors.shp `ogrinfo -q Sectors.shp -sql "SELECT * FROM Sectors" -fid 1`
- then use ogr to parse the shapefile `ogr2ogr bristol_layer.shp Sectors.shp -sql "SELECT * FROM Sectors where (name like '%BS%')"`
- use QGis to add a column with only the first part of the post code, then join the polygons with 
`ogr2ogr bristol_layers_joined.shp bristol_layer_2.shp -dialect sqlite -sql "SELECT post_area ,ST_Union(geometry) as geometry FROM bristol_layer_2 GROUP BY post_area"`

