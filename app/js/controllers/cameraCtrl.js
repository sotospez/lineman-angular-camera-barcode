'use strict';

/* Controller Camera*/


controllers.controller('cameraCtrl',['$scope','$rootScope','CameraService',
   
  function($scope,$rootScope,CameraService){
    $scope.canvas = document.getElementById('canvas');
  $scope.title = "Camera";
  $rootScope.alertmsg = "";
  $scope.audioSelected = {};
  $scope.videoSelected = {};
  $scope.media={};
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
}



//stop the camera stream
$scope.takePhoto=function(){
  if(CameraService.isStarted()){
 $rootScope.alertmsg =  "";
 $scope.image=  "";
 $scope.image=    CameraService.getImage(  $scope.video  );
}else{
  
   $rootScope.alertmsg =  "Start the camera first!!";
}
}

}]);
