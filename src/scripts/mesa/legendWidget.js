define([
    "dojo/query",
    "dojo/on",
    "dojo/touch",
    "dojo/dom",
    "dojo/dom-attr",
    "dojo/dom-construct",
    "dojo/dom-style",
    "dojo/dom-class",
    "esri/geometry/Extent",
    "esri/SpatialReference",
    "dojo/_base/array",
    "esri/dijit/Legend",
    "dojo/_base/declare",
    "dojo/text!./templates/legendDialog.html",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/NodeList-dom",
    "dojo/domReady!"
], function(query, on, touch, dom, domAttr, domConstruct, domStyle, domClass, Extent,
    SpatialReference, array, Legend, declare, template, _WidgetBase, _TemplatedMixin) {

    var legend, legendWidget, defaultBasemap, map, popup, legendLayers = [];

    return declare("legendWidget", [_WidgetBase, _TemplatedMixin], {

        templateString: template,
        mapRef: null,
        defaultBasemap: null,
        popupRef: null,
        attachControl: null,
        legendObject: null,

        postCreate: function() {
            //Place the widget if it hasn't been placed already
            if(!(dom.byId(this.domNode))){
                domConstruct.place(this.domNode, this.srcNodeRef.id, "before");
            }
            legendWidget = this;
            defaultBasemap = legendWidget.defaultBasemap;
            map = legendWidget.mapRef;
            popup = legendWidget.popupRef;
            legendToggleButtonId = legendWidget.attachControl.id;
            legendObject = legendWidget.legendObject;

            on(dom.byId(legendToggleButtonId), touch.release, function() {
                legendWidget.toggleDialog();
            });

            //if the legend is not yet created
            legendWidget.createLegend();
        },

        createLegend: function() {
            legendLayers.push({
                layer: defaultBasemap,
                title: 'Basemap Layers',
                hideLayers: [
                    7,12,17,22,23,24,25,26,27,28,32,35,36,37,38,39,50,51
                ]
            });

            // legendObject.srcNodeRef = dom.byId("legendDiv");
            legendObject.refresh(legendLayers);

            if (popup === 'popup') {
                legendWidget.toggleDialog();
                //Run the makeBoxesMoveable function from app.js
                //this should be pulled out and put in app.js
                makeBoxesMoveable();
            }
        },

        // Legend: function(){
        //     return new Legend({
        //         map: map,
        //         layerInfos: legendLayers
        //     }, dom.byId("legendDiv"))
        //         .startup();
        // },

        toggleDialog: function() { //fires on click of #DTLegend and #IPLegend - toggles the legend
            if (domClass.contains(dom.byId(legendWidget.domNode), "displayNo")) {
                dom.byId(legendWidget.domNode).style.display = "block";
                (domClass.remove(dom.byId(legendWidget.domNode), "displayNo"));
            } else {
                dom.byId(legendWidget.domNode).style.display = "none";
                (domClass.add(dom.byId(legendWidget.domNode), "displayNo"));
            }
        },


        // pushLayers: function(layertitle, layerlist, x) {
        //     legendLayers.length = 0;
        //     push('Basemap Layers', defaultBasemap, [
        //         7,12,17,22,23,24,25,26,27,28,32,35,36,37,38,39,50,51
        //     ]);
        //
        //     if (x === 0 && !(layerlist === 0)) {
        //         for (i = 0; i < layerlist.length; i++) {
        //             push(layertitle, Layers[(layerlist[i])].layerName, Layers[(layerlist[i])].lyrs
        //                 ? Layers[(layerlist[i])].lyrs
        //                 : []);
        //         }
        //
        //     } else if (layerlist === 0 && !(x === 0)) {
        //         push(layertitle, Layers[x].layerName, Layers[x].lyrs
        //             ? Layers[x].lyrs: []);
        //     }
        //
        //     function push(title, layerName, hidelayers) {
        //         legendLayers.push({layer: layerName, title: title, hideLayers: hidelayers});
        //         legend.refresh(legendLayers);
        //     }
        //     legend.refresh(legendLayers);
        // }

    }) //end declare
}); // end define