define([
    "dojo/dom-construct", "dojo/query", "dojo/dom-attr", "dojo/on", "dojo/dom", "esri/geometry/Extent", "esri/SpatialReference", "dojo/dom-style", "dojo/_base/array",
    "dijit/ConfirmDialog", "dojo/cookie", "esri/tasks/IdentifyTask", "esri/tasks/IdentifyParameters", "mesa/IdentifyTemplates", "esri/layers/ArcGISDynamicMapServiceLayer",
    "mesa/legendWidget", "dijit/registry",
    "dojo/_base/declare", "dijit/_WidgetBase", "dojo/NodeList-dom", "dojo/domReady!"
], function(domConstruct, query, domAttr, on, dom, Extent, SpatialReference, domStyle, array,
    ConfirmDialog, cookie, IdentifyTask, IdentifyParameters, IdentifyTemplates, ArcGISDynamicMapServiceLayer,
    legendWidget,registry,
    declare, _WidgetBase) {
    var layer, layerTitle, option, pVal, control, changeThemeWidget, layerConstructor, themeLayers, map, basemap, checkboxClick, infoWindow, infoTemplate, checkboxids, Legend;

    return declare("changeTheme", [_WidgetBase], {

            newLayer: null,
            layerTitle: null,
            option: null,
            mapRef: null,
            basemapRef: null,
            infoWindowRef: null,
            infoTemplateRef: null,
            mapLegend: null,
            components: null,

            postCreate: function() {
                changeThemeWidget = this;
                map = changeThemeWidget.mapRef;
                infoWindow = changeThemeWidget.infoWindowRef;
                infoTemplate = changeThemeWidget.infoTemplateRef;
                layer = changeThemeWidget.newLayer;
                layerTitle = changeThemeWidget.layerTitle;
                option = changeThemeWidget.option;
                pVal = changeThemeWidget.components === undefined? null: changeThemeWidget.components.pVal;
                basemap = changeThemeWidget.basemapRef;
                Legend = changeThemeWidget.mapLegend;
                checkboxids = changeThemeWidget.components === undefined? null: changeThemeWidget.components.checkboxid;
                control = dom.byId(layer + "Select") ? (layer + "Select") : "noControl";
                layerConstructor = {
                    "mapFolder": 'https://mcmap2.mesacounty.us/arcgis/rest/services/maps/',
                    "serverType": '/MapServer',
                    "layers": [{
                        "layerId": "asbuilt",
                        "serviceName": "EngineeringTechDocs",
                        "opacity": 0.5,
                        "visible": [4]
                    }, {
                        "layerId": "board",
                        "serviceName": "eElections",
                        "opacity": 0.5,
                        "visible": [6]
                    }, {
                        "layerId": "boardbound",
                        "serviceName": "Schools",
                        "opacity": 0.5,
                        "visible": [2]
                    }, {
                        "layerId": "book",
                        "serviceName": "eSurveyor",
                        "opacity": 0.5,
                        "visible": [20]
                    }, {
                        "layerId": "calib",
                        "serviceName": "eSurveyor",
                        "opacity": 1,
                        "visible": [3]
                    }, {
                        "layerId": "camera",
                        "serviceName": "PublicSafety",
                        "opacity": 1,
                        "visible": [0]
                    }, {
                        "layerId": "cells",
                        "serviceName": "Schools",
                        "opacity": 0.5,
                        "visible": [3]
                    }, {
                        "layerId": "cemetery",
                        "serviceName": "Districts",
                        "opacity": 0.5,
                        "visible": [10]
                    }, {
                        "layerId": "census2010",
                        "serviceName": "Census_Zip",
                        "opacity": 0.5,
                        "visible": [0]
                    }, {
                        "layerId": "citylimits",
                        "serviceName": "Districts",
                        "opacity": 0.5,
                        "visible": [19]
                    }, {
                        "layerId": "commdist",
                        "serviceName": "eElections",
                        "opacity": 0.5,
                        "visible": [2]
                    }, {
                        "layerId": "conserv",
                        "serviceName": "Districts",
                        "opacity": 0.5,
                        "visible": [11]
                    }, {
                        "layerId": "contours01",
                        "serviceName": "Elevation",
                        "opacity": 0.8,
                        "visible": [0]
                    }, {
                        "layerId": "contours12",
                        "serviceName": "Elevation",
                        "opacity": 0.8,
                        "visible": [2]
                    }, {
                        "layerId": "coundist",
                        "serviceName": "eElections",
                        "opacity": 0.5,
                        "visible": [7]
                    }, {
                        "layerId": "currentdev",
                        "serviceName": "Land_Development_Projects",
                        "opacity": 0.8,
                        "visible": [0]
                    }, {
                        "layerId": "datumdif",
                        "serviceName": "eSurveyor",
                        "opacity": 0.5,
                        "visible": [25]
                    }, {
                        "layerId": "ded",
                        "serviceName": "eSurveyor",
                        "opacity": 0.5,
                        "visible": [18]
                    }, {
                        "layerId": "deed",
                        "serviceName": "eSurveyor",
                        "opacity": 0.5,
                        "visible": [17]
                    }, {
                        "layerId": "deltasims",
                        "serviceName": "eSurveyor",
                        "opacity": 1,
                        "visible": [1]
                    }, {
                        "layerId": "dem",
                        "serviceName": "Elevation",
                        "opacity": 0.6,
                        "visible": [1]
                    }, {
                        "layerId": "dep",
                        "serviceName": "eSurveyor",
                        "opacity": 0.5,
                        "visible": [15]
                    }, {
                        "layerId": "distbound",
                        "serviceName": "Schools",
                        "opacity": 0.5,
                        "visible": [1]
                    }, {
                        "layerId": "drain",
                        "serviceName": "Districts",
                        "opacity": 0.7,
                        "visible": [4]
                    }, {
                        "layerId": "drainplan",
                        "serviceName": "EngineeringTechDocs",
                        "opacity": 0.5,
                        "visible": [6]
                    }, {
                        "layerId": "drnrep",
                        "serviceName": "EngineeringTechDocs",
                        "opacity": 0.5,
                        "visible": [1]
                    }, {
                        "layerId": "elem",
                        "serviceName": "Schools",
                        "opacity": 0.5,
                        "visible": [5]
                    }, {
                        "layerId": "enterprise",
                        "serviceName": "Enterprise_Zones",
                        "opacity": 0.5,
                        "visible": [0]
                    }, {
                        "layerId": "firedist",
                        "serviceName": "Districts",
                        "opacity": 0.5,
                        "visible": [0]
                    }, {
                        "layerId": "floodbase",
                        "serviceName": "Floodmap",
                        "opacity": 0.7,
                        "visible": [1]
                    }, {
                        "layerId": "floodbasins",
                        "serviceName": "Floodmap",
                        "opacity": 0.7,
                        "visible": [12]
                    }, {
                        "layerId": "floodcontours",
                        "serviceName": "Floodmap",
                        "opacity": 0.7,
                        "visible": [3]
                    }, {
                        "layerId": "floodlewis",
                        "serviceName": "Floodmap",
                        "opacity": 0.7,
                        "visible": [6]
                    }, {
                        "layerId": "floodnonreg",
                        "serviceName": "Floodmap",
                        "opacity": 0.7,
                        "visible": [11]
                    }, {
                        "layerId": "floodpanelindex",
                        "serviceName": "Floodmap",
                        "opacity": 0.7,
                        "visible": [4]
                    }, {
                        "layerId": "floodreg",
                        "serviceName": "Floodmap",
                        "opacity": 0.7,
                        "visible": [5]
                    }, {
                        "layerId": "floodsections",
                        "serviceName": "Floodmap",
                        "opacity": 0.7,
                        "visible": [0]
                    }, {
                        "layerId": "floodstud",
                        "serviceName": "EngineeringTechDocs",
                        "opacity": 0.5,
                        "visible": [5]
                    }, {
                        "layerId": "floodswtrln",
                        "serviceName": "Floodmap",
                        "opacity": 0.7,
                        "visible": [2]
                    }, {
                        "layerId": "fruita",
                        "serviceName": "Schools",
                        "opacity": 0.5,
                        "visible": [7]
                    }, {
                        "layerId": "futureland",
                        "serviceName": "Future_Land_Use",
                        "opacity": 0.8
                    }, {
                        "layerId": "geotech",
                        "serviceName": "EngineeringTechDocs",
                        "opacity": 0.5,
                        "visible": [2]
                    }, {
                        "layerId": "glo",
                        "serviceName": "eSurveyor",
                        "opacity": 0.5,
                        "visible": [16]
                    }, {
                        "layerId": "high",
                        "serviceName": "Schools",
                        "opacity": 0.5,
                        "visible": [8]
                    }, {
                        "layerId": "hist",
                        "serviceName": "eSurveyor",
                        "opacity": 0.5,
                        "visible": [14]
                    }, {
                        "layerId": "histdev",
                        "serviceName": "Land_Development_Projects",
                        "opacity": 0.5,
                        "visible": [1]
                    }, {
                        "layerId": "hospital",
                        "serviceName": "Districts",
                        "opacity": 0.5,
                        "visible": [14]
                    }, {
                        "layerId": "improv",
                        "serviceName": "Districts",
                        "opacity": 0.5,
                        "visible": [6]
                    }, {
                        "layerId": "irrig",
                        "serviceName": "Districts",
                        "opacity": 0.65,
                        "visible": [5]
                    }, {
                        "layerId": "irrigbound",
                        "serviceName": "Districts",
                        "opacity": 0.5,
                        "visible": [5]
                    }, {
                        "layerId": "load",
                        "serviceName": "transportation",
                        "opacity": 0.5,
                        "visible": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
                    }, {
                        "layerId": "loadLabels",
                        "serviceName": "transportation",
                        "opacity": 1,
                        "visible": [9, 10, 11, 12, 13, 14, 15]
                    }, {
                        "layerId": "mesasims",
                        "serviceName": "eSurveyor",
                        "opacity": 1,
                        "visible": [0]
                    }, {
                        "layerId": "middle",
                        "serviceName": "Schools",
                        "opacity": 0.5,
                        "visible": [6]
                    }, {
                        "layerId": "monuments",
                        "serviceName": "eSurveyor",
                        "opacity": 1,
                        "visible": [2]
                    }, {
                        "layerId": "mosquito",
                        "serviceName": "Mosquito",
                        "opacity": 0.5
                    }, {
                        "layerId": "ohv",
                        "serviceName": "transportation",
                        "opacity": 1,
                        "visible": [0]
                    }, {
                        "layerId": "patrol",
                        "serviceName": "SO_Areas",
                        "opacity": 0.3,
                        "visible": [0]
                    }, {
                        "layerId": "perm",
                        "serviceName": "eSurveyor",
                        "opacity": 0.5,
                        "visible": [22]
                    }, {
                        "layerId": "persigo",
                        "serviceName": "Persigo",
                        "opacity": 0.5
                    }, {
                        "layerId": "pest",
                        "serviceName": "Districts",
                        "opacity": 0.5,
                        "visible": [7]
                    }, {
                        "layerId": "precincts",
                        "serviceName": "eElections",
                        "opacity": 1,
                        "visible": [0]
                    }, {
                        "layerId": "proc",
                        "serviceName": "eSurveyor",
                        "opacity": 0.5,
                        "visible": [21]
                    }, {
                        "layerId": "proposedenterprise",
                        "serviceName": "Enterprise_Zones",
                        "opacity": 0.5,
                        "visible": [1]
                    }, {
                        "layerId": "propsales",
                        "serviceName": "Sales",
                        "opacity": 0.5
                    }, {
                        "layerId": "san",
                        "serviceName": "Districts",
                        "opacity": 0.5,
                        "visible": [2]
                    }, {
                        "layerId": "schools",
                        "serviceName": "Schools",
                        "opacity": 0.5,
                        "visible": [0]
                    }, {
                        "layerId": "septic",
                        "serviceName": "Septic_Locations",
                        "opacity": 0.7
                    }, {
                        "layerId": "sewer",
                        "serviceName": "Districts",
                        "opacity": 0.5
                    }, {
                        "layerId": "shoot",
                        "serviceName": "SO_Areas",
                        "opacity": 0.8,
                        "visible": [1, 2]
                    }, {
                        "layerId": "soilcon",
                        "serviceName": "Districts",
                        "opacity": 0.5,
                        "visible": [12]
                    }, {
                        "layerId": "soils",
                        "serviceName": "Soils",
                        "opacity": 0.5
                    }, {
                        "layerId": "speed",
                        "serviceName": "transportation",
                        "opacity": 1,
                        "visible": [16]
                    }, {
                        "layerId": "sthouse",
                        "serviceName": "eElections",
                        "opacity": 0.5,
                        "visible": [4]
                    }, {
                        "layerId": "stormwater",
                        "serviceName": "Stormwater",
                        "opacity": 0.5
                    }, {
                        "layerId": "struc",
                        "serviceName": "EngineeringTechDocs",
                        "opacity": 0.5,
                        "visible": [0]
                    }, {
                        "layerId": "stsen",
                        "serviceName": "eElections",
                        "opacity": 0.5,
                        "visible": [5]
                    }, {
                        "layerId": "sub",
                        "serviceName": "eSurveyor",
                        "opacity": 0.5,
                        "visible": [13]
                    }, {
                        "layerId": "tac",
                        "serviceName": "Districts",
                        "opacity": 0.5,
                        "visible": [13]
                    }, {
                        "layerId": "towers",
                        "serviceName": "PublicSafety",
                        "opacity": 1,
                        "visible": [1]
                    }, {
                        "layerId": "traffic",
                        "serviceName": "EngineeringTechDocs",
                        "opacity": 0.5,
                        "visible": [3]
                    }, {
                        "layerId": "trails",
                        "serviceName": "eTrailsRecreation",
                        "opacity": 1,
                        "visible": [0, 1, 2, 3, 4]
                    }, {
                        "layerId": "trs",
                        "serviceName": "eSurveyor",
                        "opacity": 0.5,
                        "visible": [26]
                    }, {
                        "layerId": "vac",
                        "serviceName": "eSurveyor",
                        "opacity": 0.5,
                        "visible": [19]
                    }, {
                        "layerId": "vacant",
                        "serviceName": "Vacant_Lands",
                        "opacity": 0.5
                    }, {
                        "layerId": "water",
                        "serviceName": "Districts",
                        "opacity": 0.5,
                        "visible": [1]
                    }, {
                        "layerId": "weeds",
                        "serviceName": "Weeds",
                        "opacity": 0.5
                    }, {
                        "layerId": "zip",
                        "serviceName": "Census_Zip",
                        "opacity": 0.5,
                        "visible": [1]
                    }, {
                        "layerId": "zoning",
                        "serviceName": "Zoning",
                        "opacity": 0.5
                    }]
                };
                //layer visibiliity in the legend is controlled by the lyrs value
                themeLayers = {
                    "towers": {
                        layerName: lmG.towers,
                        popupFunc: 'towers',
                        service: 'PublicSafety'
                    },
                    "eassessor": 0,
                    "enterprise": {
                        layerName: lmG.enterprise,
                        popupFunc: 'enterprise',
                        service: 'Enterprise_Zones'
                    },
                    "firedist": {
                        layerName: lmG.firedist,
                        popupFunc: 'subList',
                        service: 'Districts'
                    },
                    "flood": {
                        layerName: lmG.flood,
                        popupFunc: 'flood',
                        service: 'Floodmap'
                    },
                    "futureland": {
                        layerName: lmG.futureland,
                        popupFunc: 'flu',
                        service: 'Future_Land_Use',
                        lyrs: [4, 6, 8, 9, 12, 13, 14, 15, 17]
                    },
                    "currentdev": {
                        layerName: lmG.currentdev,
                        popupFunc: 'landDev',
                        service: 'Land_Development_Projects'
                    },
                    "histdev": {
                        layerName: lmG.histdev,
                        popupFunc: 'landDev',
                        service: 'Land_Development_Projects'
                    },
                    "mosquito": {
                        layerName: lmG.mosquito,
                        popupFunc: 'mos',
                        service: 'Mosquito',
                        // lyrs: [0, 3, 6, 18]
                    },
                    "weeds": {
                        layerName: lmG.weeds,
                        popupFunc: 'wds',
                        service: 'Weeds',
                        lyrs: [0]
                    },
                    "persigo": {
                        layerName: lmG.persigo,
                        popupFunc: 'persigo',
                        service: 'Persigo'
                            // lyrs: [0, 1, 2, 3, 4, 5, 6]
                    },
                    "propsales": {
                        layerName: lmG.propsales,
                        popupFunc: 'sales',
                        service: 'Sales',
                        // lyrs: [0]
                    },
                    "sewer": {
                        layerName: lmG.sewer,
                        popupFunc: 'subList',
                        service: 'Districts'
                    },
                    "septic": {
                        layerName: lmG.septic,
                        popupFunc: 'sep',
                        service: 'Septic_Locations',
                        lyrs: [0]
                    },
                    "patrol": {
                        layerName: lmG.patrol,
                        popupFunc: 'law',
                        service: 'SO_Areas'
                    },
                    "shoot": {
                        layerName: lmG.shoot,
                        popupFunc: 'law',
                        service: 'SO_Areas',
                        lyrs: [1]
                    },
                    "law": {
                        layerName: lmG.law,
                        popupFunc: 'law',
                        service: 'SO_Areas'
                    },
                    "soils": {
                        layerName: lmG.soils,
                        popupFunc: 'soilTyp',
                        service: 'Soils'
                            // lyrs: [0,1,3,4,5]
                    },
                    "stormwater": {
                        layerName: lmG.stormwater,
                        popupFunc: 'strm',
                        service: 'Stormwater'
                            // lyrs: [1, 2, 3, 4, 5, 7, 8, 9, 10, 12, 14]
                    },
                    "survey": {
                        layerName: lmG.survey,
                        popupFunc: 'subList',
                        service: 'eSurveyor'
                    },
                    "camera": {
                        layerName: lmG.camera,
                        popupFunc: 'camera',
                        service: 'PublicSafety'
                    },
                    "trails": {
                        layerName: lmG.trails,
                        popupFunc: 'trl',
                        service: 'Trails',
                        lyrs: [0, 1, 2]
                    },
                    "vacant": {
                        layerName: lmG.vacant,
                        popupFunc: 'vac',
                        service: 'Vacant_Lands'
                    },
                    "zoning": {
                        layerName: lmG.zoning,
                        popupFunc: 'zon',
                        service: 'Zoning',
                        lyrs: [16, 15]
                    },
                    "mesasims": {
                        layerName: lmG.mesasims,
                        popupFunc: 'subList',
                        service: 'eSurveyor'
                    },
                    "deltasims": {
                        layerName: lmG.deltasims,
                        popupFunc: 'subList',
                        service: 'eSurveyor'
                    },
                    "districts": {
                        layerName: lmG.districts,
                        popupFunc: 'dist',
                        service: 'Districts'
                    },
                    "soilcon": {
                        layerName: lmG.soilcon,
                        popupFunc: 'dist',
                        service: 'Districts'
                    },
                    "cemetery": {
                        layerName: lmG.cemetery,
                        popupFunc: 'dist',
                        service: 'Districts'
                    },
                    "conserv": {
                        layerName: lmG.conserv,
                        popupFunc: 'dist',
                        service: 'Districts'
                    },
                    "hospital": {
                        layerName: lmG.hospital,
                        popupFunc: 'dist',
                        service: 'Districts'
                    },
                    "san": {
                        layerName: lmG.san,
                        popupFunc: 'dist',
                        service: 'Districts'
                    },
                    "pest": {
                        layerName: lmG.pest,
                        popupFunc: 'dist',
                        service: 'Districts'
                    },
                    "water": {
                        layerName: lmG.water,
                        popupFunc: 'dist',
                        service: 'Districts'
                    },
                    "improv": {
                        layerName: lmG.improv,
                        popupFunc: 'dist',
                        service: 'Districts'
                    },
                    "tac": {
                        layerName: lmG.tac,
                        popupFunc: 'dist',
                        service: 'Districts'
                    },
                    "citylimits": {
                        layerName: lmG.citylimits,
                        popupFunc: 'dist',
                        service: 'Districts'
                    },
                    "monuments": {
                        layerName: lmG.monuments,
                        popupFunc: 'subList',
                        service: 'eSurveyor'
                    },
                    "datumdif": {
                        layerName: lmG.datumdif,
                        popupFunc: 'subList',
                        service: 'eSurveyor'
                    },
                    "calib": {
                        layerName: lmG.calib,
                        popupFunc: 'subList',
                        service: 'eSurveyor'
                    },
                    "irrig": {
                        layerName: lmG.irrig,
                        popupFunc: 'subList',
                        service: 'Districts'
                    },
                    "drain": {
                        layerName: lmG.drain,
                        popupFunc: 'subList',
                        service: 'Districts'
                    },
                    "schools": {
                        layerName: lmG.schools,
                        popupFunc: 'schools',
                        service: 'Schools'
                    },
                    "cells": {
                        layerName: lmG.cells,
                        popupFunc: 'schools',
                        service: 'Schools'
                    },
                    "distbound": {
                        layerName: lmG.distbound,
                        popupFunc: 'schools',
                        service: 'Schools'
                    },
                    "elem": {
                        layerName: lmG.elem,
                        popupFunc: 'schools',
                        service: 'Schools'
                    },
                    "middle": {
                        layerName: lmG.middle,
                        popupFunc: 'schools',
                        service: 'Schools'
                    },
                    "fruita": {
                        layerName: lmG.fruita,
                        popupFunc: 'schools',
                        service: 'Schools'
                    },
                    "high": {
                        layerName: lmG.high,
                        popupFunc: 'schools',
                        service: 'Schools'
                    },
                    "commdist": {
                        layerName: lmG.commdist,
                        popupFunc: 'pol',
                        service: 'eElections'
                    },
                    "precincts": {
                        layerName: lmG.precincts,
                        popupFunc: 'pol',
                        service: 'eElections'
                    },
                    "board": {
                        layerName: lmG.board,
                        popupFunc: 'pol',
                        service: 'eElections'
                    },
                    "sthouse": {
                        layerName: lmG.sthouse,
                        popupFunc: 'pol',
                        service: 'eElections'
                    },
                    "stsen": {
                        layerName: lmG.stsen,
                        popupFunc: 'pol',
                        service: 'eElections'
                    },
                    "coundist": {
                        layerName: lmG.coundist,
                        popupFunc: 'pol',
                        service: 'eElections'
                    },
                    "demograph": {
                        layerName: lmG.demograph,
                        popupFunc: 'demograph',
                        service: 'Census_Zip'
                    },
                    "zip": {
                        layerName: lmG.zip,
                        popupFunc: 'demograph',
                        service: 'Census_Zip'
                    },
                    "census2010": {
                        layerName: lmG.census2010,
                        popupFunc: 'demograph',
                        service: 'Census_Zip'
                    },
                    "topo": {
                        layerName: lmG.topo,
                        popupFunc: 'topo',
                        service: 'Elevation'
                    },
                    "contours01": {
                        layerName: lmG.contours01,
                        popupFunc: 'topo',
                        service: 'Elevation'
                    },
                    "contours12": {
                        layerName: lmG.contours12,
                        popupFunc: 'topo',
                        service: 'Elevation'
                    },
                    "dem": {
                        layerName: lmG.dem,
                        popupFunc: 'subList',
                        service: 'Elevation'
                    },
                    "sub": {
                        layerName: lmG.sub,
                        popupFunc: 'subList',
                        service: 'eSurveyor'
                    },
                    "dep": {
                        layerName: lmG.dep,
                        popupFunc: 'subList',
                        service: 'eSurveyor'
                    },
                    "hist": {
                        layerName: lmG.hist,
                        popupFunc: 'subList',
                        service: 'eSurveyor'
                    },
                    "glo": {
                        layerName: lmG.glo,
                        popupFunc: 'subList',
                        service: 'eSurveyor'
                    },
                    "deed": {
                        layerName: lmG.deed,
                        popupFunc: 'subList',
                        service: 'eSurveyor'
                    },
                    "ded": {
                        layerName: lmG.ded,
                        popupFunc: 'subList',
                        service: 'eSurveyor'
                    },
                    "vac": {
                        layerName: lmG.vac,
                        popupFunc: 'subList',
                        service: 'eSurveyor'
                    },
                    "book": {
                        layerName: lmG.book,
                        popupFunc: 'subList',
                        service: 'eSurveyor'
                    },
                    "proc": {
                        layerName: lmG.proc,
                        popupFunc: 'subList',
                        service: 'eSurveyor'
                    },
                    "engdocs": {
                        layerName: lmG.engdocs,
                        popupFunc: 'engdocs',
                        service: 'EngineeringTechDocs'
                    },
                    "struc": {
                        layerName: lmG.struc,
                        popupFunc: 'engdocs',
                        service: 'EngineeringTechDocs'
                    },
                    "drnrep": {
                        layerName: lmG.drnrep,
                        popupFunc: 'engdocs',
                        service: 'EngineeringTechDocs'
                    },
                    "geotech": {
                        layerName: lmG.geotech,
                        popupFunc: 'engdocs',
                        service: 'EngineeringTechDocs'
                    },
                    "traffic": {
                        layerName: lmG.traffic,
                        popupFunc: 'engdocs',
                        service: 'EngineeringTechDocs'
                    },
                    "asbuilt": {
                        layerName: lmG.asbuilt,
                        popupFunc: 'engdocs',
                        service: 'EngineeringTechDocs'
                    },
                    "floodstud": {
                        layerName: lmG.floodstud,
                        popupFunc: 'engdocs',
                        service: 'EngineeringTechDocs'
                    },
                    "drainplan": {
                        layerName: lmG.drainplan,
                        popupFunc: 'engdocs',
                        service: 'EngineeringTechDocs'
                    },
                    "load": {
                        layerName: lmG.load,
                        popupFunc: 'trans',
                        service: 'LoadLimits'
                    },
                    "ohv": {
                        layerName: lmG.ohv,
                        popupFunc: 'trans',
                        service: 'transportation'
                    },
                    "trans": {
                        layerName: lmG.trans,
                        popupFunc: 'trans',
                        service: 'transportation'
                    },
                    "speed": {
                        layerName: lmG.trans,
                        popupFunc: 'trans',
                        service: 'transportation'
                    },
                    "perm": {
                        layerName: lmG.perm,
                        popupFunc: 'subList',
                        service: 'eSurveyor'
                    },
                    "landdev": {
                        layerName: lmG.landdev,
                        popupFunc: 'landDev',
                        service: 'Land_Development_Projects'
                    },
                    "political": {
                        layerName: lmG.political,
                        popupFunc: 'pol',
                        service: 'eElections'
                    },
                    "loadLabels": {
                        layerName: lmG.loadLabels,
                        popupFunc: 'subList',
                        service: 'LoadLimits'
                    },
                    "trs": {
                        layerName: lmG.trs,
                        popupFunc: 'subList',
                        service: 'eSurveyor'
                    },
                    "floodsections": {
                        layerName: lmG.floodsections,
                        popupFunc: 'flood',
                        service: 'Floodmap'
                    },
                    "floodbase": {
                        layerName: lmG.floodbase,
                        popupFunc: 'flood',
                        service: 'Floodmap'
                    },
                    "floodswtrln": {
                        layerName: lmG.floodswtrln,
                        popupFunc: 'flood',
                        service: 'Floodmap'
                    },
                    "floodcontours": {
                        layerName: lmG.floodcontours,
                        popupFunc: 'flood',
                        service: 'Floodmap'
                    },
                    "floodpanelindex": {
                        layerName: lmG.floodpanelindex,
                        popupFunc: 'flood',
                        service: 'Floodmap'
                    },
                    "floodreg": {
                        layerName: lmG.floodreg,
                        popupFunc: 'flood',
                        service: 'Floodmap'
                    },
                    "floodlewis": {
                        layerName: lmG.floodlewis,
                        popupFunc: 'flood',
                        service: 'Floodmap'
                    },
                    "floodnonreg": {
                        layerName: lmG.floodnonreg,
                        popupFunc: 'flood',
                        service: 'Floodmap'
                    },
                    "floodbasins": {
                        layerName: lmG.floodbasins,
                        popupFunc: 'flood',
                        service: 'Floodmap'
                    },
                    "boardbound": {
                        layerName: lmG.boardbound,
                        popupFunc: 'schools',
                        service: 'Schools'
                    }
                };


                if (checkboxids) {
                    // if boxes are checked through url parameters
                    changeThemeWidget.autoCheckBoxes(checkboxids);
                }

                on(query("." + layer + "cbx"), "change", function(e) {
                    //if boxes are checked manually
                    changeThemeWidget.changeBox();
                    changeThemeWidget.manualCheckBoxes(e.currentTarget.id);
                });
                changeThemeWidget.resetMap();
                changeThemeWidget.addFunction(layer, themeLayers[layer].popupFunc, themeLayers[layer].service, themeLayers);
                changeThemeWidget.loadTheme(themeLayers); //call loadTheme for the first time
            },

            then: function() {
                // callback();
            },

            autoCheckBoxes: function(boxes) {
                for (var i = 0; i < boxes.length; i++) {
                    checkBox(boxes[i]);
                }

                function checkBox(box) {
                    dom.byId(box.replace("-", "")).checked = box.indexOf("-") > -1 ? false : true;
                }
                checkboxids = "";
            },

            manualCheckBoxes: function(box) {
                dom.byId(box).checked = dom.byId(box).checked ? true : false;
            },

            changeBox: function() {
                changeThemeWidget.addFunction(layer, themeLayers[layer].popupFunc, themeLayers[layer].service, themeLayers);
                changeThemeWidget.loadTheme(themeLayers);
                layer === "survey" ? (changeThemeWidget.setCalibZoom()) : "";
                layer === "trans" ? (changeThemeWidget.checkOHVDisclaimer(themeLayers)) : "";
            },

            addFunction: function(layer, name, path, Layers) {
                var layers = Layers[layer].lyrs ? Layers[layer].lyrs : [];
                var checked = query("input." + layer + "cbx:checked");
                var len = checked.length;
                for (var i = 0; i < len; i++) {
                    changeThemeWidget.createLayer(Layers, domAttr.get(checked[i], "data-value"));
                    layers.push(domAttr.get(checked[i], "data-opt"));
                }
                changeThemeWidget.runIT(path, name, layers);
            },

            createLayer: function(Layers, id) {
                if (lmG[id] === undefined) {
                    for (var x in layerConstructor["layers"]) {
                        if (layerConstructor["layers"][x].layerId === id) {
                            lmG[id] = new ArcGISDynamicMapServiceLayer(layerConstructor["mapFolder"] + layerConstructor["layers"][x].serviceName + layerConstructor["serverType"], {
                                id: id,
                                opacity: layerConstructor["layers"][x].opacity
                            });
                            layerConstructor["layers"][x].visible ? (lmG[id].setVisibleLayers(layerConstructor["layers"][x].visible)) : void(0);
                            Layers[id].layerName = lmG[id]; //add to themeLayers
                        }
                    }
                } //end main if
            },

            resetMap: function() {
                map.infoWindow.hide();
                map.infoWindow.resize(350, 300);
                lmG.pLay.infoTemplate = '';
                //use the maptype variable when sharing a map through email. First set it to empty, then fill it with the current selection.
                lmG.maptype = "";
                lmG.maptype = layer;
                 //Set theme dropdown text node
                dom.byId("layerSelect").childNodes[0].nodeValue = layerTitle;
                query('#enterpriseSelect, #surveySelect, #demographSelect, #districtsSelect, #engdocsSelect, #landdevSelect, #politicalSelect, #schoolsSelect, #topoSelect, #floodSelect, .noLoad, #transSelect, #lawSelect').style("display", "none");
                dom.byId(control).style.display = "block";
            },

            setCalibZoom: function() {
                if (dom.byId("calib").checked) {
                    dom.byId('calibzoom').removeAttribute("disabled", "disabled");
                } else {
                    dom.byId('calibzoom').setAttribute("disabled", "disabled");
                }

                on(dom.byId("calibzoom"), "click", function() {
                    var utm12 = new SpatialReference({
                        wkid: 102206
                    });
                    var calibExt = new Extent({
                        "xmin": 697322,
                        "ymin": 4334595,
                        "xmax": 698932,
                        "ymax": 4335382,
                        "spatialReference": utm12
                    });
                    map.setExtent(calibExt);
                });
            },

            checkOHVDisclaimer: function(Layers) {
                query(".noLoad").forEach(function(node) {
                    domStyle.set(node, "display", "none");
                });
                if (query("input.transcbx")[0].checked === true) {
                    map.addLayers([lmG.loadLabels]);
                    query(".noLoad").forEach(function(node) {
                        domStyle.set(node, "display", "block");
                    });
                } else if (query("input.transcbx")[0].checked !== true &&
                    lmG.loadLabels !== undefined){
                    map.removeLayer(lmG.loadLabels);
                }

                if (query("input.transcbx")[1].checked === true) {
                    if (!(document.cookie.indexOf("ohvDisclaimer") >= -1) || (window.localStorage.getItem("ohvDisclaimer") !== "Accepted OHV Disclaimer")) {
                        var dial = new ConfirmDialog({
                            title: "Disclaimer",
                            href: "_static/ohvDisclaimer.html",
                            closable: false,
                            draggable: false,
                            style: "width:50em;margin:0 auto;color:white;background:#A59F91;padding:1em;border-radius:4px;font-size:0.75em;",
                            class: "ohvDisclaimer",
                            buttonOk: "Accept",
                            ButtonCancel: "Reject",
                            onCancel: function() {
                                query("input.transcbx")[1].checked = false;
                                changeThemeWidget.loadTheme(Layers);
                            },
                            onExecute: function() {
                                var useLocalStorage = changeThemeWidget.supports_local_storage();
                                var useCookie = cookie.isSupported();
                                if (useLocalStorage) {
                                    window.localStorage.setItem("ohvDisclaimer", "Accepted OHV Disclaimer");
                                } else {
                                    var exp = 1; // number of days to persist the cookie
                                    cookie("ohvDisclaimer", "Accepted OHV Disclaimer", {
                                        expires: 1
                                    });
                                }
                            }
                        });
                        dial.startup();
                        dial.show();
                    }
                }
            },

            loadTheme: function(Layers) {
                var themeArray = loadArray(Layers); //Create an array of layer names from themeLayers keys
                removeLayers(themeArray); // Remove all loaded layers in the map

                function loadArray(data) {
                    var newArray = [];
                    for (var t in data) {
                        if (data.hasOwnProperty(t)) {
                            newArray.push(t);
                        }
                    }
                    return newArray;
                }

                //Add the selected theme layer to the map
                for (var x in Layers) {
                    if (x === layer) {
                        if ((layer === "eassessor")) {
                            map.infoWindow = infoWindow;
                            lmG.pLay.infoTemplate = infoTemplate;
                            pushLayers('Basemap Layers', l = 0, x = 0);
                        } else if (control !== "noControl") {
                            function layerlist() {
                                return array.map(query("input." + layer + "cbx:checked"), function(item) {
                                    return item.attributes['data-value'].value;
                                });
                            }
                            addLayers(layerlist(), x = 0);
                            pushLayers(" ", layerlist(), x = 0);
                        } else {
                            changeThemeWidget.createLayer(Layers, x);
                            addLayers(l = 0, x);
                            pushLayers(layerTitle, l = 0, x);
                        }
                    } //end main if
                } //end for loop

                function pushLayers(layertitle, layerlist, x) {
                    var mapLegendLayers = [];
                    push('Basemap Layers', basemap, [7, 12, 17, 22, 23, 24, 25, 26, 27, 28, 32, 35, 36, 37, 38, 39, 50, 51]);

                    if (x === 0 && !(layerlist === 0)) {
                        for (i = 0; i < layerlist.length; i++) {
                            push(layertitle, Layers[(layerlist[i])].layerName, Layers[(layerlist[i])].lyrs ? Layers[(layerlist[i])].lyrs : []);
                        }

                    } else if (layerlist === 0 && !(x === 0)) {
                        push(layertitle, Layers[x].layerName, Layers[x].lyrs ? Layers[x].lyrs : []);
                    }

                    function push(title, layerName, hidelayers) {
                        mapLegendLayers.push({
                            layer: layerName,
                            title: title,
                            hideLayers: hidelayers
                        });
                        Legend.refresh(mapLegendLayers);
                    }
                    Legend.refresh(mapLegendLayers);
                }

                function addLayers(layerlist, x) {
                    if (!(layerlist === 0)) {
                        len = layerlist.length
                        for (i = 0; i < len; i++) {
                            map.addLayer(Layers[(layerlist[i])].layerName);
                        }
                    } else {
                        map.addLayer(Layers[x].layerName);
                    }
                }

                function removeLayers(themeArray) {
                    var mappingLayers = map.layerIds; //Array of all currently loaded map layers
                    var graphicsLayers = map.graphicsLayerIds; //Array of all currently loaded graphics layers

                    //Here we intersect mappingLayers and the themeArray which is an array of all the possible layer themes in the map
                    var frank = intersectArrays(themeArray, mappingLayers);
                    var joe = intersectArrays(themeArray, graphicsLayers);

                    //http://www.falsepositives.com/index.php/2009/12/01/javascript-function-to-get-the-intersect-of-2-arrays/ This was the solution for array intersection
                    function intersectArrays(firstArray, secondArray) {
                        var dict = {},
                            intersected = [],
                            selected;

                        var arrayLength1 = firstArray.length;
                        for (i = 0; i < arrayLength1; i++) {
                            dict[firstArray[i]] = true;
                        }
                        arrayLength2 = secondArray.length;
                        for (i = 0; i < arrayLength2; i++) {
                            selected = secondArray[i];
                            if (selected in dict) {
                                intersected.push(selected);
                            }
                        }
                        return intersected;
                    }

                    if (frank.length != 0) {
                        for (i = 0; i < frank.length; i++) {
                            map.removeLayer(map.getLayer(frank[i]));
                        }
                    }

                    if (joe.length > 0) {
                        for (var i = 0; i < joe.length; i++) {
                            var mac = map.getLayer(joe[i]).id;
                            for (var x in Layers) {
                                if (x === mac) {
                                    map.removeLayer(Layers[x].layerName);
                                }
                            }
                        }
                    }

                }
            },

            runIT: function(opt, name, lyrs) {
                map.graphics.clear();
                var len = lyrs.length;
                lmG.pLay.infoTemplate = '';
                var deferred;
                if(checkboxClick){
                    checkboxClick.remove()
                }
                checkboxClick = on(map, "click", function(evt) {
                        var IT = new IdentifyTask("https://mcmap2.mesacounty.us/arcgis/rest/services/maps/" + opt + "/MapServer/");
                        var IP = new IdentifyParameters();
                        IP.geometry = evt.mapPoint;
                        IP.layerOption = IdentifyParameters.LAYER_OPTION_VISIBLE;
                        IP.returnGeometry = false;
                        IP.layerIds = lyrs;
                        IP.width = map.width;
                        IP.height = map.height;
                        IP.mapExtent = map.extent;
                        //Set how far away you can click and still select the item
                        IP.tolerance = (name === "towers" ? 8 : 3);
                        deferred = IT.execute(IP, function() {
                            name !== null ? IdentifyTemplates[name](evt, deferred, len, map, opt) : null;
                        });
                    }) //end click or tap
            },

            supports_local_storage: function() {
                try {
                    return 'localStorage' in window && window['localStorage'] !== null;
                } catch (e) {
                    return false;
                }
            }

        }) //end declare
}); // end define
