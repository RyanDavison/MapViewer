//This widget is meant to be used with the ESRI bookmarks dijit
define([
     "dojo/_base/declare", "esri/geometry/Extent", "esri/dijit/Bookmarks", "dojo/dom", "dojo/on", "dojo/query", "dojo/dom-class", "dojo/dom-construct",
     "dojo/dom-style", "dojo/json", "dojo/cookie", "dojo/dnd/move", "dojo/touch",
     "dojo/_base/array", "dijit/_WidgetBase", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin", "dojo/text!./templates/bookmarkDialog.html",
     "dojo/NodeList-traverse", "dojo/NodeList-manipulate", "dojo/domReady!"
 ], function (declare, Extent, Bookmarks, dom, on, query, domClass, domConstruct, domStyle, json, cookie, move, touch,
    array, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template) {
        var mapReference, useLocalStorage, storageName, mesabookmark, widgetTitle, bookmarkWidget;

    return declare("bookmarkWidget", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {

        templateString: template,
        mapRef: null,
        widgetTitle: "Bookmarks",

        postCreate: function () {
            this.inherited(arguments);
            domConstruct.place(this.domNode, this.srcNodeRef.id, "before");
            bookmarkWidget = this;
            mapReference = bookmarkWidget.mapRef;
            useLocalStorage = supports_local_storage();
            storageName = 'MCGIS_Bookmarks';
            new move.parentConstrainedMoveable(this.domNode, {
                handle: this.printHeader,
                area: "margin",
                within: true
            });

            mesabookmark = new Bookmarks({
                map: mapReference,
                bookmarks: [],
                editable: true
            }, this.mcbookmarks);

            // Look for stored bookmarks
            if (useLocalStorage) {
                var bmJSON = window.localStorage.getItem(storageName);
            } else {
                var bmJSON = cookie(storageName);
            }
            // Load bookmarks
            // Fall back to default bookmarks if no cookie
            if (bmJSON && bmJSON != 'null' && bmJSON.length > 4) {
                var bmarks = json.parse(bmJSON);
                array.forEach(bmarks, function (b) {
                    mesabookmark.addBookmark(b);
                });
            } else {
                _addBookmarks();
            }
        },

        startup: function () {
            this.inherited(arguments);
        },

        _restoreDefault: function () {
            _clearBookmarks() ? _addBookmarks() : '';
        },

        _clearFunction: function () {
            _clearBookmarks();
        }

    }); //end of declare

    function _addBookmarks() {
        var bmList = ({
            "Collbran": {
                "xmin": 760399,
                "ymin": 4346866,
                "xmax": 763944,
                "ymax": 4348730
            },
            "Debeque": {
                "xmin": 738927,
                "ymin": 4356942,
                "xmax": 741155,
                "ymax": 4358459
            },
            "Fruita": {
                "xmin": 691947,
                "ymin": 4335052,
                "xmax": 700722,
                "ymax": 4339472
            },
            "Gateway": {
                "xmin": 674844,
                "ymin": 4282399,
                "xmax": 678100,
                "ymax": 4284666
            },
            "Grand Junction": {
                "xmin": 685960,
                "ymin": 4316261,
                "xmax": 738288,
                "ymax": 4342506
            },
            "Palisade": {
                "xmin": 726789,
                "ymin": 4331334,
                "xmax": 730453,
                "ymax": 4333163
            },
            "Mesa County": {
                "xmin": 666583,
                "ymin": 4262675,
                "xmax": 813186,
                "ymax": 4365745
            }
        })
        for (var key in bmList) {
            if (bmList.hasOwnProperty(key)) {
                mesabookmark.addBookmark({
                    "extent": {
                        "spatialReference": {
                            "wkid": 102206
                        },
                        "xmin": bmList[key].xmin,
                        "ymin": bmList[key].ymin,
                        "xmax": bmList[key].xmax,
                        "ymax": bmList[key].ymax
                    },
                    "name": key
                });
            }
        }
    }

    function _clearBookmarks() {
            var conf = confirm('This action will remove all of your bookmarks!');
            if (conf) {
                if (useLocalStorage) {
                    // Remove from local storage
                    window.localStorage.removeItem(storageName);
                } else {
                    // Remove cookie
                    cookie(storageName, null, {
                        expires: -1
                    });
                }
                // Remove all user defined bookmarks
                // First get all mesabookmark nam
                var bmNames = array.map(mesabookmark.bookmarks, function (bm) {
                    return bm.name;
                });
                // Run removeBookmark
                array.forEach(bmNames, function (bName) {
                    mesabookmark.removeBookmark(bName);
                });
                return conf
            } else {
                return conf
            }
        }
        //
        // source for supports_local_storage function:
        // http://diveintohtml5.org/detect.html
    function supports_local_storage() {
        try {
            return 'localStorage' in window && window['localStorage'] !== null;
        } catch (e) {
            return false;
        }
    }

}); //end of define
