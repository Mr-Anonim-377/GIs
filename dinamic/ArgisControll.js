map_gis = document.querySelector("#viewDiv"),
container = document.querySelector(".container");
bodyr = document.querySelector("body");
map_gis.style.width = "100%";
map_gis.style.height = "100%";

    require([
        "esri/Map",
        "esri/views/MapView",
        "esri/widgets/BasemapToggle",
        "esri/widgets/BasemapGallery",
        "esri/tasks/RouteTask",
        "esri/tasks/support/RouteParameters",
        "esri/tasks/support/FeatureSet",
        "esri/widgets/Search",
        "esri/layers/FeatureLayer",
        "esri/widgets/Editor",
        "esri/Graphic",
        "esri/layers/GraphicsLayer",
        "esri/widgets/CoordinateConversion",
        "esri/widgets/Locate",
        "esri/widgets/Track",
        "esri/widgets/Compass"
    ], function (Map, MapView, BasemapToggle, BasemapGallery, RouteTask, RouteParameters, FeatureSet, Search, FeatureLayer,Editor, Graphic, GraphicsLayer, CoordinateConversion, Locate, Track, Compass) {
        var trailsLayer = new FeatureLayer({
            url: "https://services5.arcgis.com/2ZXFWSTttizDcTqy/arcgis/rest/services/mypoints_nikolaev/FeatureServer",
        });

        var map = new Map({
            basemap:"satellite",
            layers: [trailsLayer]
        });

        map.add(trailsLayer); // Optionally add layer to map

        var view = new MapView({
            container: "viewDiv",
            map: map,
            center: [37.550720, 55.833149],
            zoom: 16
        });


        var graphicsLayer = new GraphicsLayer();
        map.add(graphicsLayer);
        function addGraphics(result) {
            graphicsLayer.removeAll();
            result.features.forEach(function(feature){
                var g = new Graphic({
                    geometry: feature.geometry,
                    attributes: feature.attributes,
                    symbol: {
                        type: "simple-marker",
                        color: [0,0,0],
                        outline: {
                            width: 2,
                            color: [0,255,255],
                        },
                        size: "20px"
                    },
                    popupTemplate: {
                        title: "{name}",
                        content: "Оценка - {mark};Описание - {description};"
                    }
                });
                graphicsLayer.add(g);
            });
        }
        function queryFeatureLayer(point, distance, spatialRelationship, sqlExpression) {
            var query = {
                geometry: point,
                distance: distance,
                spatialRelationship: spatialRelationship,
                outFields: ["*"],
                returnGeometry: true,
                where: sqlExpression
            };
            trailsLayer.queryFeatures(query).then(function(result) {
                addGraphics(result, true);
            });
        }
        view.when(function(){
            queryFeatureLayer(view.center, 1500, "intersects");
        });
        view.on("click", function(event){
            queryFeatureLayer(event.mapPoint, 1500, "intersects");
        });



// Маршрут
        var routeTask = new RouteTask({
            url: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World"
        });

        view.on("click", function (event) {
            if (view.graphics.length === 0) {
                addGraphic("start", event.mapPoint);
            } else if (view.graphics.length === 1) {
                addGraphic("finish", event.mapPoint);

                getRoute();
            } else {
                view.graphics.removeAll();
                addGraphic("start", event.mapPoint);
            }
        });

        function addGraphic(type, point) {
            var graphic = new Graphic({
                symbol: {
                    type: "simple-marker",
                    color: (type === "start") ? "white" : "black",
                    size: "8px"
                },
                geometry: point
            });
            view.graphics.add(graphic);
        }

        function getRoute() {
            // Setup the route parameters
            var routeParams = new RouteParameters({
                stops: new FeatureSet({
                    features: view.graphics.toArray() // Pass the array of graphics
                }),
                returnDirections: true
            });
            // Get the route
            routeTask.solve(routeParams).then(function (data) {
                // Display the route
                data.routeResults.forEach(function (result) {
                    result.route.symbol = {
                        type: "simple-line",
                        color: [5, 150, 255],
                        width: 3
                    };
                    view.graphics.add(result.route);
                });
            });
        }

        //Конец маршрута

        //ПОИСК
        var search = new Search({
            view: view
        });

        search.sources.push({
            layer: trailsLayer,
            searchFields: ["TRL_NAME"],
            displayField: "TRL_NAME",
            exactMatch: false,
            outFields: ["TRL_NAME", "PARK_NAME"],
            resultGraphicEnabled: true,
            name: "Trailheads",
            placeholder: "Example: Medea Creek Trail",
        });

        view.ui.add(search, "top-right");



        view.on("click", function (evt) {
            search.clear();
            view.popup.clear();
            if (search.activeSource) {
                var geocoder = search.activeSource.locator; // World geocode service
                var params = {
                    location: evt.mapPoint
                };
                geocoder.locationToAddress(params)
                    .then(function (response) { // Show the address found
                        var address = response.address;
                        showPopup(address, evt.mapPoint);
                    }, function (err) { // Show no address found
                        showPopup("No address found.", evt.mapPoint);
                    });
            }
        });

        function showPopup(address, pt) {
            view.popup.open({
                title: +Math.round(pt.longitude * 100000) / 100000 + "," + Math.round(pt.latitude * 100000) / 100000,
                content: address,
                location: pt
            });
        }
        //КОНЕЦ ПОИСКА
        //basemap
        var basemapToggle = new BasemapToggle({
            view: view,
            nextBasemap: "dark-gray-vector"
        });

        view.ui.add(basemapToggle, "bottom-right");

        var coordsWidget = document.createElement("div");
        coordsWidget.id = "coordsWidget";
        coordsWidget.className = "esri-widget esri-component";
        coordsWidget.style.padding = "7px 15px 5px";

        view.ui.add(coordsWidget, "bottom-right");

        function showCoordinates(pt) {
            var coords = "Lat/Lon " + pt.x.toFixed(3) + " " + pt.y.toFixed(3) +
                " | Scale 1:" + Math.round(view.scale * 1) / 1 +
                " | Zoom " + view.zoom;
            coordsWidget.innerHTML = coords;
        };

        view.watch("stationary", function (isStationary) {
            showCoordinates(view.center);
        });

        view.on("pointer-move", function (evt) {
            showCoordinates(view.toMap({
                x: evt.x,
                y: evt.y
            }));
        });

        var coordinateConversionWidget = new CoordinateConversion({
            view: view
        });

        view.ui.add(coordinateConversionWidget, "bottom-right");

        var track = new Track({
            view: view,
            graphic: new Graphic({
                symbol: {
                    type: "simple-marker",
                    size: "12px",
                    color: "green",
                    outline: {
                        color: "#efefef",
                        width: "1.5px"
                    }
                }
            }),
            useHeadingEnabled: true // Don't change orientation of the map
        });

        view.ui.add(track, "top-left");

        var compass = new Compass({
            view: view
        });

        view.ui.add(compass, "top-left");

        var editorWidget = new Editor({
            view: view
        });

        view.ui.add(editorWidget, "bottom-left");
    });