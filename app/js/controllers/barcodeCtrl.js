'use strict';

/* Barcode Camera*/


controllers.controller('barcodeCtrl',['$scope','$rootScope','CameraService','$timeout',
   
  function($scope,$rootScope,CameraService,$timeout){
  
  $scope.title = "Barcode";
  $rootScope.alertmsg = "";
  $scope.audioSelected = {};
  $scope.videoSelected = {};
  $scope.media={};
  $scope.autoscan=false;
  $scope.scanning="" ;
  $scope.timeScan=3000;
  var stopauto;
 
 //test i dont know i think the best is take the video from id 
 // $scope.video  = document.querySelector("video");
  $scope.video  = document.getElementById("video1");
 
  //get the available camera and audio sources   
  CameraService.Sources().then(function(data){
     $scope.medias=data;
  });;
  
  
  
  //start the camera stream
  $scope.start=function(){
  $rootScope.alertmsg =  "";
  if($scope.audioSelected.id && $scope.videoSelected.id){
    
    CameraService.Start( $scope.audioSelected.id,$scope.videoSelected.id).then(function(url) {

  $scope.video.src = url
  $scope.video.play();
});

     }
     else{
       $rootScope.alertmsg =  "Select Camera and Audio sources";
     }

}




//stop the camera stream
$scope.stop=function(){
  $rootScope.alertmsg =  "";
     $scope.video.src="";
     CameraService.Stop();
     $scope.scanning="" ;
}






//on barcodeData BarcodeScanSuccess
  $rootScope.$on('$BarcodeScanSuccess',function(){
      $scope.barcodeData= CameraService.barcodeData(); 
     $scope.scanning="" ;
  });
  
//on barcodeData BarcodeScanSuccess
  $rootScope.$on('$BarcodeScanFailed',function(){
   
     $scope.scanning="Decoding failed" ;
  });
  
  


//se snan to auto 
  $scope.autoscanON= function() {
   $scope.autoscan=true;
       setAutoScan();
  }
 
 
  function setAutoScan(){
    stopauto=  $timeout(function() {
             $scope.scanBarcode();
    
    },  $scope.timeScan);
   
  }
    
    
  $scope.autoscanOFF= function() {
    $timeout.cancel(stopauto); 
     $scope.autoscan=false;
      $scope.scanning="" ;
  }
    
  

$scope.scanBarcode=function(){
 
 if(CameraService.isStarted()){
  $rootScope.alertmsg =  "";
 $scope.image=  "";
 $scope.image=    CameraService.getBarcode(  $scope.video  );
 $scope.barcodeData= CameraService.barcodeData();
 $scope.scanning="scanning" ;
}else{
  $scope.scanning="" ;
   $rootScope.alertmsg =  "Start the camera first!!";

}

if( $scope.autoscan){
  setAutoScan();
  
}
}


}]);
