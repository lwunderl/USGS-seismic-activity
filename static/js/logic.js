//create variable for url
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//d3.json the variable to get the url data
d3.json(url).then(function(data){
    console.log(data);
});

//create myMap variable
let myMap = L.map("map", {
    center: [44.9778, -93.2650],
    zoom: 5
});

//create layer for street map
let streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})

//create layer for topo map
let topoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

//create control group for base layers
baseLayers = {
    "Street View": streetMap,
    "Topographic View": topoMap
}

//create control group for over lays
overLayers = {}