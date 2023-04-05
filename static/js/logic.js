//create variable for url
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//d3.json the variable to get the url data
d3.json(url).then(function(data){
    console.log(data);
    // getDataFeatures(data.features)
    createMap(data.features)
});

//function to extract data properties and create map
// function getDataFeatures(dataDotFeatures) {

//     //create overlays with onEachFeature method
//     function onEachFeature(dataFeatures, layer) {
//         layer.bindPopup(
//             `<h5>
//             ${dataFeatures.properties.place}
//             </h5>
//             <p>
//             ${new Date(dataFeatures.properties.time)}

//             </p>`
//             )
//         }
    
//     let geoJSONdataDotFeatures = L.geoJSON(dataDotFeatures, {
//         onEachFeature: onEachFeature
//     })

// };

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

    //create control group for base layers
    baseLayers = {
        "Street View": streetMap,
        "Topographic View": topoMap
    };

    // create array variables to store marker points (lat, lon, depth), magnitude, depth
    let earthquakeEvents = [];

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

    //loop through dataFeatures and set variables for lat, lon, depth, and magnitude
    for (let i = 0; i < dataFeatures.length; i++) {
        let lon = dataFeatures[i].geometry.coordinates[0]
        let lat = dataFeatures[i].geometry.coordinates[1]
        let depth = dataFeatures[i].geometry.coordinates[2]
        let mag = dataFeatures[i].properties.mag

        //get color based on depth
        let color = getColor(depth)

        //add to earthquakeEvents array with a circle to plot
        earthquakeEvents.push(
            L.circle([lat, lon], {
                color: "",
                fillColor: color,
                fillOpacity: .75,
                radius: mag * 10000
            })
        );
    }

    //turn earthquakeEvents array into a layer
    let earthquakes = L.layerGroup(earthquakeEvents);

    //create control group for over lays
    overLayers = {
        "Earthquakes": earthquakes
    };

    let legend = L.control({position: "bottomright"});

    legend.onAdd = function () {

        let div = L.DomUtil.create('div', 'info legend'),
            severity = [0,10,20,30,40,50,90];
    
        // loop through our density intervals and generate a label with a colored square for each interval
        for (let i = 0; i < severity.length; i++) {
            range = severity[i] + (severity[i + 1] ? ' &ndash; ' + severity[i + 1] : '+');
            backColor = 
            fontColor = 
            div.innerHTML +=
                '<i style="background-color:' + getColor(severity[i] + 1) + '">___</i>'+ range +'<br>'
        }
    
        return div;
    };
    

    //create myMap variable
    let myMap = L.map("map", {
        center: [44.9778, -93.2650],
        zoom: 5,
        layers: [streetMap, earthquakes]
    });

    legend.addTo(myMap);

    //create layer control panel
    L.control.layers(baseLayers, overLayers, {
        collapsed: false
    }).addTo(myMap);

}