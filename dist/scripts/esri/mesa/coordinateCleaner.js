define(["dijit/ConfirmDialog"],function(Dialog){"use strict";function showDialog(content){coordDialog.set("content",content),coordDialog.show()}function compareMS(lat,lon){var i,message="<div class='alertmessageIP alertmessage'>Minute and Second entries must be 0-60. Please correct the following indicated entries.",latM=" <b>"+lat[1]+"</b> ",lonM=" <b>"+lon[1]+"</b> ",latS=lat[2]?" <b>"+lat[2]+"</b> ":"",lonS=lon[2]?" <b>"+lon[2]+"</b> ":"",lats=lat.slice(1,3),lons=lon.slice(1,3),dialogSwitch=0;for(i=0;i<2;i+=1)(lats[i]>60||lats[i]<0)&&(i<1?String(latM=" <u style='color:red;'>"+lats[i]+"</u> "):String(latS=" <u style='color:red;'>"+lats[i]+"</u> "),dialogSwitch=1);for(i=0;i<2;i+=1)(lons[i]>60||lons[i]<0)&&(i<1?String(lonM=" <u style='color:red;'>"+lons[i]+"</u> "):String(lonS=" <u style='color:red;'>"+lons[i]+"</u> "),dialogSwitch=1);message=message+"</div><br><b>Lat: "+lat[0]+"</b>"+latM+latS+"<br><br><b>Lon: "+lon[0]+"</b>"+lonM+lonS;var ret=dialogSwitch>0?message:0;return ret}function processCoordinates(latD,lonD){if((latD.match(/[ a-zA-Z][a-zA-Z!@#$%\^&*()°\-_+=\[\]{}?<>`~;:'"\|\,\\]/g)||lonD.match(/[ a-zA-Z][a-zA-Z\W\WC!@#$%\^&*()°\-_+=\[\]{}?<>`~;:'"\|,\\]/g))&&(latD=latD.replace(/[ a-zA-Z][a-zA-Z!@#$%\^&*()°\-_+=\[\]{}?<>`~;:'"\|,\\]/g,"").replace(/^\s+|\s+$/g,""),lonD=lonD.replace(/[ a-zA-Z][a-zA-Z!@#$%\^&*()°\-_+=\[\]{}?<>`~;:'"\|,\\]/g,"").replace(/^\s+|\s+$/g,"")),latDproc=latD.split(" "),lonDproc=lonD.split(" "),1===latDproc.length&&1===lonDproc.length){if(latDproc[0]>=-90&&latDproc[0]<=90&&lonDproc[0]>=-180&&lonDproc[0]<=180)return[latD,lonD];showDialog("<div class='alertmessageIP alertmessage'>Latitude entries must be -90 and 90 and longitude entries must be between -180 and 180.")}else if(latDproc.length>1||lonDproc.length>1){var x=compareMS(latDproc,lonDproc);if(0===x){if(Dlat=parseFloat(latDproc[0]),Dlon=parseFloat(lonDproc[0]),Dlat>=-90&&Dlat<=90&&Dlon>=-180&&Dlon<=180)return latD=latDproc[2]?(parseFloat(latDproc[2])/60+parseFloat(latDproc[1]))/60+Dlat:latDproc.length>1?parseFloat(latDproc[1])/60+Dlat:Dlat,lonD=lonDproc[2]?(parseFloat(lonDproc[2])/60+parseFloat(lonDproc[1]))/60+Dlon:lonDproc.length>1?parseFloat(lonDproc[1])/60+Dlon:Dlon,[latD.toFixed(7),lonD.toFixed(7)];showDialog("<div class='alertmessageIP alertmessage'>Latitude entries must be -90 and 90 and longitude entries must be between -180 and 180.")}else showDialog(x,coordDialog)}}var latDproc,lonDproc,Dlat,Dlon,latD,lonD,coordDialog=new Dialog({title:"<span style='margin:0 auto;width:auto;font-size:1.2em;font-weight:bolder;'>Coordinate Entry Error!</span><br><br>",content:"",style:"width: 33%; background-color:white;border-radius:5px;padding:1em;"});return{cleanCoordinates:function(coordinates,callback){var mycoords=coordinates.indexOf(",")>-1?coordinates.split(","):coordinates.split(":");if(mycoords[0]&&mycoords[1]){latD=mycoords[0].replace(/^\s+|\s+$/g,""),lonD=mycoords[1].replace(/^\s+|\s+$/g,"");var cors=processCoordinates(latD,lonD);if(cors&&callback)return callback(cors[0],cors[1]);if(cors)return[cors[0],cors[1]]}else showDialog("<div class='alertmessageIP alertmessage'>Please enter valid Latitude and Longitude values separated by a comma.<br><br>Examples:<br><br>39.27595,-108.547315</u><br><br>or<br><br>39 25 45.325,-108 28 15.22<br><br>Separate Degrees Minutes and Seconds with a space.</div>")}}});