app.controller('editPpt' , ['$scope' , '$http' , '$window' , function($scope , $http , $window){

	var id = ($window.location.href).slice(27,($window.location.href).length);

	//console.log($window.location.href);
	//console.log(id)
	$scope.postUpdate = '/pptInfo/'+id


	$http({
		method: 'get' ,
		url: '/pptInfo/' + id
	}).then(function(res){
		console.log(res);
		$scope.title = res.data.info.title;
		$scope.description = res.data.info.description;
		$scope.privacy = (res.data.info.private).toString();

	} , function(er){console.log(er);});

/*
	$scope.postUpdate = function(){

		$http({
			method: 'post',
			url: '/pptInfo/' + id ,
			data: {tit: $scope.title , des: $scope.description , priv: $scope.privacy}
		}).then(function(res){
			console.log(res);

		} , function(e){console.log(e);});
	}*/

	

	



}]);
