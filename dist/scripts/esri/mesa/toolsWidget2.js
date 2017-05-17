define(["dojo/_base/declare","dojo/dom-construct","dojo/dom","dojo/dom-class","dojo/dom-attr","dojo/dnd/move","dojo/query","dojo/dom-style","esri/tasks/PrintTask","esri/tasks/PrintParameters","esri/tasks/PrintTemplate","esri/dijit/Print","dojo/on","dojo/_base/lang","dojo/touch","mesa/themeTools","mesa/searchTools","dijit/_WidgetBase","dijit/_TemplatedMixin","dojo/text!./templates/toolsView2.html","mesa/measureWidget","mesa/printWidget","mesa/queryWidget","mesa/bookmarkWidget","mesa/helpWidget","mesa/shareFormWidget","dijit/registry","mesa/basemapWidget2","dojo/NodeList-traverse"],function(declare,domConstruct,dom,domClass,domAttr,move,query,domStyle,PrintTask,PrintParameters,PrintTemplate,Print,on,lang,touch,themeTools,searchTools,_WidgetBase,_TemplatedMixin,template,measureWidget,printWidget,queryWidget,bookmarkWidget,helpWidget,shareFormWidget,registry,basemapWidget2){var map,toolsWidget,gsvc,popupObject,popupTemplateObject,Images,initialBasemap,device,parcels,legendObject;return declare("toolsWidget2",[_WidgetBase,_TemplatedMixin],{templateString:template,baseClass:"mesaTools",geometryServiceURL:null,printURL:null,imageList:null,mapRef:null,basemap:null,deviceUsed:null,popupRef:null,popupTemplateRef:null,legendRef:null,parcelLayer:null,postCreate:function(){function baseLayersSwitch(e,ParcelLayerObject,basemapObject,roadLabelObject){require(["dojo/query","dojo/dom-attr"],function(query,domAttr){var target=e.target?e.target:e.srcElement,thisClassName=domAttr.get(target,"class");thisClassName="input."+thisClassName.split(" ").pop();var box=query(thisClassName),layers={"input.pclcbx":ParcelLayerObject,"input.lbsgcbx":roadLabelObject,"input.bgcbx":basemapObject};for(i=0;i<box.length;i++)box[i].checked=!!target.checked;for(var x in layers)query(x)[0].checked?layers[x].show():layers[x].hide()})}function togglePanel(e){"none"===domStyle.get("toolsView2","display")?(null!==domAttr.get(dom.byId("backMenu"),"data-from")&&backButtonEvent(),domStyle.set("toolsView2","display","block")):(domAttr.get(this,"data-to")===domAttr.get(dom.byId("backMenu"),"data-from")&&domStyle.set("toolsView2","display","none"),backButtonEvent()),"panelTab"!==this.id&&dispatchMainMenuClick.call(this,e)}function backButtonDisplay(){"block"===domStyle.get(query(".stacked-toggle span")[0],"display")?domStyle.set("backMenu","visibility","visible"):domStyle.set("backMenu","visibility","hidden")}function dispatchMainMenuClick(e){e.stopPropagation(),toPage=domAttr.has(this,"data-to")?domAttr.get(this,"data-to"):void 0,void 0!==toPage&&(backButtonDisplay(),domClass.add(query(".mainSideMenu")[0],"displayNo"),domClass.remove(query("."+toPage)[0],"displayNo"),domAttr.set("backMenu","data-to","mainSideMenu"),domAttr.set("backMenu","data-from",toPage))}function backButtonEvent(){var backToPage=domAttr.get(dom.byId("backMenu"),"data-to"),fromPage=domAttr.get(dom.byId("backMenu"),"data-from");"searchBox"===fromPage&&domClass.contains(query(".searchMenu")[0],"displayNo")===!1?(backToPage="mainSideMenu",fromPage="searchMenu"):"problemForm"===fromPage&&domClass.contains(query(".helpTool")[0],"displayNo")===!1&&(backToPage="mainSideMenu",fromPage="helpTool"),domClass.add(query("."+fromPage)[0],"displayNo"),domClass.remove(query("."+backToPage)[0],"displayNo"),domClass.contains(query(".mainSideMenu")[0],"displayNo")===!1&&domStyle.set("backMenu","visibility","hidden")}function dispatchSearchMenuClick(e){e.stopPropagation();var to="submen"===this.parentNode.className?"mainSideMenu":"searchMenu";"submen"===this.parentNode.className?"searchFieldDialog":"searchBox";domAttr.set("backMenu","data-to",to),domAttr.set("backMenu","data-from","searchBox"),domClass.add(query(".searchMenu")[0],"displayNo"),dom.byId("searchLI").childNodes[0].nodeValue=this.childNodes[0].innerHTML,registry.byId("searchFieldDialog")&&registry.byId("searchFieldDialog").destroyRecursive(),searchTools.searchBy(getLayerValue(this),void 0,"desktop",void 0,function(){domClass.remove(query(".searchMenu")[0],"displayNo"),toolsWidget.domNode.style.display="none"})}function dispatchMeasureTool(){if(dom.byId("measureTool")&&!registry.byId("measureTool")){var measure=new measureWidget({mapRef:map,gsvc:esriConfig.defaults.geometryService.url,device:device,parcelLayer:parcels},"measureTool");measure.startup()}}function dispatchQueryTool(){if(dom.byId("queryTool")&&!registry.byId("queryTool")){var Query=new queryWidget({device:device,mapRef:map,geometryServiceURL:esriConfig.defaults.geometryService.url,exportURL:"scripts/php/toCSV.php",csvOutputLocation:"scripts/php/"},"queryTool");Query.startup()}}function dispatchBookmarks(){if(!registry.byId("bookmarkTool")){var bookmarks=new bookmarkWidget({mapRef:map},"bookmarkTool");bookmarks.startup()}}function dispatchPrinter(){if(!registry.byId("printTool")){var printer=new printWidget({printUrl:printerURL,mapRef:map,device:device,panel:registry.byId("toolsView2").domNode},"printTool");printer.startup()}}function dispatchHelp(){if(dom.byId("helpTool")&&!registry.byId("helpTool")){var help=new helpWidget({printUrl:printerURL,device:device},"helpTool");help.startup()}}function dispatchShareForm(map){if(!registry.byId("shareTool")){new shareFormWidget({emailServiceUrl:"scripts/php/ShareMail.php",mapRef:map},"shareTool")}}function checkmarks(){return{get:function(spanList){for(i=0;i<spanList.length;i++)if(""!==spanList[i].innerHTML)return defaultYearElement=spanList[i].parentNode,defaultYearElement},set:function(spanList,thisSpan){for(i=0;i<spanList.length;i++)spanList[i].innerHTML="";thisSpan.innerHTML="&#10004;"}}}function dispatchImageChange(e){var spanList=this.parentNode.getElementsByTagName("span"),thisSpan=this.getElementsByTagName("span")[0];domAttr.get(this,"data-value");lmG.imageTool.basemapChanger(this),(new checkmarks).set(spanList,thisSpan)}function dispatchImageryToggle(e){function createImageList(imageConfig){require(["esri/layers/ArcGISTiledMapServiceLayer"],function(ArcGISTiledMapServiceLayer){for(var x in imageConfig.images)lmG[imageConfig.images[x].imageId]=new ArcGISTiledMapServiceLayer(imageConfig.mapFolder+imageConfig.images[x].serviceName+imageConfig.serverType,{id:imageConfig.images[x].imageId})})}registry.byId("imagelist")||(createImageList(Images),lmG.imageTool=new basemapWidget2({mapRef:map,device:device,initialBasemap:initialBasemap},"imagelist"))}domConstruct.place(this.domNode,this.srcNodeRef.id,"before"),domConstruct.place(dom.byId("legendDiv"),dom.byId("leg"),"replace"),toolsWidget=this,map=toolsWidget.mapRef,gsvc=toolsWidget.geometryServiceURL,popupObject=toolsWidget.popupRef,popupTemplateObject=toolsWidget.popupTemplateRef,Images=toolsWidget.imageList,initialBasemap=toolsWidget.basemap,device=toolsWidget.deviceUsed,printerURL=toolsWidget.printURL,parcels=toolsWidget.parcelLayer,legendObject=toolsWidget.legendRef;var legLayers=[];legLayers.push({layer:initialBasemap,title:"Basemap Layers",hideLayers:[7,12,17,22,23,24,25,26,27,28,32,35,36,37,38,39,50,51]}),legendObject.refresh(legLayers);var getLayer=function(obj){return domAttr.get(obj,"data-name")},setHeader=function(layerName){query("#headerMessage span")[0].innerText=layerName},getLayerValue=function(obj){return domAttr.get(obj,"data-value")};on(query(".mainSideMenu li"),"click",dispatchMainMenuClick),on(query("#DTtoolstrip button, #panelTab, #sharebutton, .submen li, #headerMessage span"),"click",togglePanel),on(query(".themeMenu li, #layerSelect ul li"),"click",function(e){setHeader(getLayer(this)),toolsWidget.dispatchThemeMenuClick(getLayerValue(this)),"none"===domStyle.get(dom.byId("toolsView2"),"display")&&togglePanel.call(this,e)}),on(query(".measureClick"),"click",dispatchMeasureTool),on(query(".queryClick"),"click",dispatchQueryTool),on(query(".bookmarkClick"),"click",dispatchBookmarks),on(query(".printClick"),"click",dispatchPrinter),on(query(".helpClick"),"click",dispatchHelp),on(query(".shareClick, #sharebutton"),"click",dispatchShareForm),on(query(".searchMenu li, .submen li"),"click",dispatchSearchMenuClick),on(query(".Imagery, .DTimagery"),"click",dispatchImageryToggle),on(query(".imageYears li"),"click",dispatchImageChange),on(dom.byId("backMenu"),touch.release,backButtonEvent),on(query(".baselyrs"),"click",function(e){baseLayersSwitch(e,parcels,initialBasemap,map._layers.roadLabels)}),window.onresize=function(event){backButtonDisplay()}},startup:function(){this.inherited(arguments)},backToMap:function(){toolsWidget.domNode.style.display="none"},dispatchThemeMenuClick:function(layer,components){var thisSpan,spanList=query(".themeMenu")[0].getElementsByTagName("span");!function(){for(s=0;s<spanList.length;s++)domAttr.get(spanList[s].parentNode,"data-value")===layer&&(thisSpan=spanList[s].parentNode.getElementsByTagName("span")[0]);for(i=0;i<spanList.length;i++)spanList[i].innerHTML="";thisSpan.innerHTML="&#10004;"}(),setTimeout(function(){themeTools.themeClick(thisSpan.parentNode,map,popupObject,popupTemplateObject,legendObject,initialBasemap,components)},10),registry.byId("toolsView2").domNode.style.display="none"}})});