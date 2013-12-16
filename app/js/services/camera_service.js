'use strict';
   /**
   * CameraService
   * 
   */
   
services.service('CameraService', ['$q','$rootScope',function($q,$rootScope) {
    
   //set the navigator usermedia 
   navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
   var DecodeWorker = new Worker("DecoderWorker.js");
   var FlipWorker = new Worker("DecoderWorker.js");
   var imageData;
   var started=false;
   var resultArray = [];
  	var workerCount = 0;
   angular.isUndefinedOrNull = function(val){ return angular.isUndefined(val) || val === null}
   
    /**
     * if Camera is started.
     */
   this.isStarted= function (){
   return started;
   };
  
      
   
     /**
     * Stop the stream.
     */
   this.Stop= function (){
   if (!!window.stream) {
    window.stream.stop();
    started=false;
  }
   };
  
  
  /**
   * Start the stream from camera
   *
   * @param audioid
   * @param videoid
   * @returns {angular.$q.promise}
   */ 
   this.Start= function (audioid,videoid){
     var deferred = $q.defer();
  
  //stop the stream
  if (!!window.stream) {
    window.stream.stop();
    started=false;
  }
  
 //constraints for the usermedia 
  var constraints = {
    audio: {
      optional: [{sourceId: audioid}]
    },
    video: {
      optional: [{sourceId: videoid}]
    }
  };
  
  //setup navigator usermedia
  navigator.getUserMedia(constraints,
  function(stream){
      //on success
      //return the url for video element
      window.stream = stream; // make stream available to console
      started=true;
      deferred.resolve(window.URL.createObjectURL(stream));
  },  
  function(error){
       console.log("navigator.getUserMedia error: ", error);
        deferred.reject(error);
  });
  
  
  return deferred.promise;
  };
   
   
   
   /**
   * Get the available media sources 
   * obj audio video with label and id
   * @returns {angular.$q.promise}
   */ 
   this.Sources= function() {
         var deferred = $q.defer();
              
      if (typeof MediaStreamTrack === 'undefined'){
      
             deferred.reject('This browser does not support MediaStreamTrack.\n\nTry Chrome Canary.');
      
      }else{
      
           MediaStreamTrack.getSources(function (sourceInfos){
           
           var mediaSources={};
           mediaSources.audio = [];
           mediaSources.video = [];
       
           for (var i = 0; i !== sourceInfos.length; ++i) {
        
              var sourceInfo = sourceInfos[i];
        
              if (sourceInfo.kind === 'audio') {
      
              var obj={};
              obj.label= sourceInfo.label || 'microphone ' + (mediaSources.audio.length + 1);
              obj.id= sourceInfo.id ;
              mediaSources.audio.push(obj) ;  
        
               } else if (sourceInfo.kind === 'video') {
        
               var obj={};
               obj.label=sourceInfo.label || 'camera ' + (mediaSources.video.length + 1);
               obj.id= sourceInfo.id ;
               mediaSources.video.push(obj) ;  
        
               } else {
          
                 console.log('Some other kind of source: ', sourceInfo);
        
               }
            }
      

             deferred.resolve(mediaSources);
     
            });
          }
 
    return deferred.promise;
     
   };
 
 
  /**
   * Get image screenshot from video 
   * @param video element  default new video from stream by is not working always
   * @param width default 640
   * @param height  default 480
   * @returns image
   *
   */
  this.getImage = function(video,width,height){
    width=width || 640;
    height=height || 480;
    
   if (started){
    
    var canvas =  document.createElement("canvas");
    var ctx=canvas.getContext("2d");
    canvas.width=width;
    canvas.height=height;
     if(angular.isUndefinedOrNull (video)){
       
     var videoNew = document.createElement("video");
     videoNew.src = window.URL.createObjectURL( window.stream)
     videoNew.play(); 
     videoNew.muted=true;
     ctx.drawImage(videoNew, 0, 0, width,height);
     //setTimeout(function(){ videoNew.src="";videoNew=null;}, 2000);
     
     }else{
      ctx.drawImage(video, 0, 0, width,height);
       
     }
     
     
   var image = canvas.toDataURL("image/png");
   ctx=null;
  canvas =null; 
  return image;
   
  
   }else{
     return null;
   }
  };
    
    
    
   /**
   * Get barcode  
   * @param video element  
   * barcodeData array if scan is true 
   *
   */
  this.getBarcode = function(video){
  var  width= 640;
   var height = 480;
    
   if (started || !angular.isUndefinedOrNull (video)){
   
    var canvas =  document.createElement("canvas");
   //var canvas = document.getElementById('canvas');
    var ctx=canvas.getContext("2d");
    canvas.width=width;
    canvas.height=height;
  
   ctx.drawImage(video, 0, 0, width,height);
      
   imageData = ctx.getImageData(0,0,canvas.width,canvas.height).data;
  
   Decode(imageData);
  
   }
   return ;
  };
   
    
    
    
   
    /**
   * Get barcodeData  
   * @returns resultArray
   *
   */
   this.barcodeData=function(){
     return resultArray;
   }  
            
      
      
      
      
            
  function  receiveMessage(e) {
				var tempArray=[];
				if(e.data.success === "log") {
				//	console.log(e.data.result);
					return;
				}
				workerCount--;
				if(e.data.success){
					 tempArray = e.data.result;
					for(var i = 0; i < tempArray.length; i++) {
						if(resultArray.indexOf(tempArray[i]) == -1) {
							resultArray.push(tempArray[i]);
                             $rootScope.$broadcast('$BarcodeScanSuccess');
                             $rootScope.$apply();
						}
					}
				workerCount = 0;
				}else {
					if(workerCount == 1) {
						FlipWorker.postMessage({pixels: imageData, cmd: "flip"});
					}
				}
				if(workerCount == 0){
					if(tempArray.length === 0) {
						  $rootScope.$broadcast('$BarcodeScanFailed');
                             $rootScope.$apply();
					   console.log("Decoding failed.");
					}else {
					//console.log(resultArray.join(" "));
					//console.log(tempArray.join(" "));
					}
				}
			}
		
  
  
  function Decode(imageData) {
   DecodeWorker.onmessage = receiveMessage;
	FlipWorker.onmessage = receiveMessage;
    
	if(workerCount > 0) return;
		workerCount = 2;
   
   		DecodeWorker.postMessage({pixels: imageData, cmd: "normal"});
        
};

 
 }]);

