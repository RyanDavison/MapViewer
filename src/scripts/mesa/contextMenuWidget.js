    define([
        "dojo/_base/declare", "dijit/_WidgetBase", "dijit/Menu", "dijit/MenuItem", "dijit/MenuSeparator", "esri/geometry/Point",
        "dojo/dom-construct", "esri/tasks/GeometryService", "esri/SpatialReference"
    ], function (
        declare, _WidgetBase, Menu, MenuItem, MenuSeparator, Point, domConstruct, GeometryService, SpatialReference
    ) {

        var contextMenuWidget, map, trsURL, gsvc, wgs84;
            return declare("contextMenuWidget", [_WidgetBase], {

                mapRef: null,
                geometryServiceURL: null,
                trsURL: null,

                postCreate: function () {
                    this.inherited(arguments);
                    contextMenuWidget = this;
                    map = contextMenuWidget.mapRef;
                    trsURL = contextMenuWidget.trsURL;
                    gsvc = new GeometryService(contextMenuWidget.geometryServiceURL);
                    wgs84 = new SpatialReference({
                        wkid: 4326
                    });

        ctxMenuForMap = new Menu({
            style: "background-color:#EEEEEE;font-size:0.8em;width:140px;height:auto;",
            onOpen: function (box) {
                rightClickGCSCoordinates = getMapPointFromMenuPosition(box);
            },
            targetNodeIds: [map.id],
            onShow: function () {}
        });

        ctxMenuForMap.addChild(new MenuSeparator());
        ctxMenuForMap.addChild(new MenuItem({
            label: "Google Street View",
            iconClass: "googleStreetViewIcon",
            onClick: function (evt) {
                ga('send', 'event', 'ContextMenu', 'Google Street View');
                gsvc.project([rightClickGCSCoordinates], wgs84, function (result) {
                    var googCoords = result[0]
                    var prefix = "https://maps.google.com/maps?output=svembed&layer=c&cbp=12,132.595,,0,4.429&cbll=";
                    var coords = googCoords.y + "," + googCoords.x;
                    var url = prefix + coords;
                    window.open(url);
                });
            }
        }));

        ctxMenuForMap.addChild(new MenuSeparator({
            style: "border-bottom:1px solid lightgray;"
        }));
        ctxMenuForMap.addChild(new MenuSeparator({}));
        ctxMenuForMap.addChild(new MenuItem({
            label: "Copy Geographic Coordinates",
            iconClass: "latLonGlobeIcon",
            onClick: function (evt) {
                ga('send', 'event', 'ContextMenu', 'Geographic Coordinates');
                gsvc.project([rightClickGCSCoordinates], wgs84, function (result) {
                    geogCoords = result[0]
                    var coordString = "Latitude =  " + geogCoords.y.toFixed(7) + "  " + "Longitude =  " + geogCoords.x.toFixed(7);
                    window.prompt("Press Crtl+C to copy coordinates\n\nThen press Enter or click OK to close this window", coordString);
                });
            }
        }));

        ctxMenuForMap.addChild(new MenuSeparator({
            style: "border-bottom:1px solid lightgray;"
        }));
        ctxMenuForMap.addChild(new MenuSeparator({}));
        ctxMenuForMap.addChild(new MenuItem({
            label: "Copy UTM Coordinates",
            iconClass: "utmCubeGlobeIcon",
            onClick: function (evt) {
                ga('send', 'event', 'ContextMenu', 'UTM Coordinates');
                var coordString = "X coordinate =  " + rightClickGCSCoordinates.x.toFixed(7) + "  " + "Y coordinate =  " + rightClickGCSCoordinates.y.toFixed(7);
                window.prompt("Press Crtl+C to copy coordinates\n\nThen press Enter or click OK to close this window", coordString);
            }
        }));

        ctxMenuForMap.addChild(new MenuSeparator({
            style: "border-bottom:1px solid lightgray;"
        }));
        ctxMenuForMap.addChild(new MenuSeparator({}));
        ctxMenuForMap.addChild(new MenuItem({
            label: "Get Township/Range/Section",
            iconClass: "trsIcon",
            //style: "margin:1em;",
            onClick: function (evt) {
                ga('send', 'event', 'ContextMenu', 'Township/Range/Section');
                require([
                    "esri/tasks/QueryTask",
                    "esri/tasks/query"
                ], function (QueryTask, Query) {
                    trsQueryTask = new QueryTask(trsURL);
                    trsQuery = new Query();
                    trsQuery.returnGeometry = false;
                    trsQuery.outFields = ["TRSM"];
                    trsQuery.geometry = rightClickGCSCoordinates;

                    trsQueryTask.execute(trsQuery, function (result) {
                        var trsString = result.features[0].attributes['TRSM'] + " meridian";
                        window.prompt("Press Crtl+C to copy Township Range and Section\nThen press Enter or click OK to close this window\n", trsString);
                    })
                });
            }
        }));

        //        ctxMenuForMap.addChild(new MenuSeparator({
        //            style: "border-bottom:1px solid lightgray;"
        //        }));
        //        ctxMenuForMap.addChild(new MenuItem({
        //            label: "3 Word Position",
        ////            iconClass: "w3wIcon",
        //            onClick: function (evt) {
        //                ga('send', 'event', 'ContextMenu', 'What 3 Words');
        //                gsvc.project([rightClickGCSCoordinates], wgs84, function (result) {
        //                    var w3wCoords = result[0]
        //                    var prefix = "http://api.what3words.com/position?key=JNX6U9YX&lang=en&position=";
        //                    var coords = w3wCoords.y + "," + w3wCoords.x;
        //                    var url = prefix + coords;
        //                    require(["dojo/request/xhr"], function(xhr){
        //                        xhr(url, {
        //                        handleAs: "json",
        //                            method:"GET"
        //                        }).then(function(data){
        //                            window.prompt("Press Crtl+C to copy 3 word position\nThen press Enter or click OK to close this window\n", data.words);
        //                        });
        //                    })
        //                });
        //            }
        //        }));

        ctxMenuForMap.addChild(new MenuSeparator({}));
        ctxMenuForMap.startup();

    }
}); //end declare
        // Method for getting screen coordinates from context menu corner and converting it to GCS coordinates
        function getMapPointFromMenuPosition(box) {

            var x = box.x,
                y = box.y,
                mp;
            switch (box.corner) {
            case "TR":
                x += box.w;
                break;
            case "BL":
                y += box.h;
                break;
            case "BR":
                x += box.w;
                y += box.h;
                break;
            }
            var screenPoint = new Point(x - map.position.x, y - map.position.y);
            var mapPoint = map.toMap(screenPoint);
            return mapPoint;
        }

}); //end declare
