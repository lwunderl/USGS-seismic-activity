//create variable for url
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//d3.json the variable to get the url data
d3.json(url).then(function(data){
    console.log(data);
    // getDataFeatures(data.features)
    createMap(data.features)

});

//function to create maps
function createMap(dataFeatures) {

    //create layer for street map
    let streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    //create layer for topo map
    let topoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    //create objects for control group for base layers
    baseLayers = {
        "Street View": streetMap,
        "Topographic View": topoMap
    };

    //set conditional for color based on variable
    function getColor(d) {
        return d > 90 ? "#FF00FE" :
                d > 50 ? "#FF0069" :
                d > 40 ? "#FF0000" :
                d > 30 ? "#FF4700" :
                d > 20 ? "#FF7F00" :
                d > 10 ? "#FFEF00" :
                "#75FF00";
    }

    // create array variables to store marker points (lat, lon, depth), magnitude, depth
    let earthquakeEvents = [];

    //loop through dataFeatures and set variables for lat, lon, depth, and magnitude
    for (let i = 0; i < dataFeatures.length; i++) {
        let lon = dataFeatures[i].geometry.coordinates[0]
        let lat = dataFeatures[i].geometry.coordinates[1]
        let depth = dataFeatures[i].geometry.coordinates[2]
        let mag = dataFeatures[i].properties.mag

        //get color based on depth
        let color = getColor(depth)

        //add to earthquakeEvents array with a dynamic circle and pop-up information
        earthquakeEvents.push(
            L.circle([lat, lon], {
                color: "",
                fillColor: color,
                fillOpacity: .75,
                radius: mag * 10000
            }).bindPopup(
                `<h4>${dataFeatures[i].properties.place}</h4>
                <p>Magnitude: ${dataFeatures[i].properties.mag}<br>
                Depth: ${dataFeatures[i].geometry.coordinates[2]}<br>
                ${new Date(dataFeatures[i].properties.time)}</p>`
                )
        );
    }

    //turn earthquakeEvents array into a layer
    let earthquakes = L.layerGroup(earthquakeEvents);

    //create objects for control group for over lays
    overLayers = {
        "Earthquakes": earthquakes,
    };

    //create legend for depth colors
    let legend = L.control({position: "bottomright"});

    //construct format for legend upon adding legend to myMap
    legend.onAdd = function () {
        let div = L.DomUtil.create('div', 'info legend');
        let depthRanges = [0,10,20,30,40,50,90];
        let labels = [];

        // loop through depthRange intervals and generate a label with a colored square for each interval, push to labels array
        for (let i = 0; i < depthRanges.length; i++) {
            let depthRange = depthRanges[i] + (depthRanges[i + 1] ? ' &ndash; ' + depthRanges[i + 1] : '+');
            labels.push(
                "<i style=\"text-align:right;background-color:" + 
                getColor(depthRanges[i] + 1) + 
                ";color:" + 
                getColor(depthRanges[i] + 1) + 
                "\">_____</i> " + depthRange + 
                "<br>")
            }
        
        // use innerHTML to add the array of labels and format legend
        div.innerHTML += 
            "<div style=\"background-color: white; padding: 0px 10px\" class=\"labels\">"+
                "<h2 style=\"text-align:center\">Depth of<br>Epicenter</h2>"+
                    "<p>" + labels.join("") + "</p>"+
            "</div>";

        return div;
    };
    
    //create myMap variable
    let myMap = L.map("map", {
        center: [44.9778, -93.2650],
        zoom: 5,
        layers: [streetMap, earthquakes]
    });

    //add legend to the map
    legend.addTo(myMap);

    //create layer control panel
    L.control.layers(baseLayers, overLayers, {
        collapsed: false
    }).addTo(myMap);

}