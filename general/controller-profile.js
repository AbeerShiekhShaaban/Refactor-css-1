app.controller('prof' , ['$scope' , '$http' , '$window' , function($scope , $http , $window){

	var id = ($window.location.href).slice(30,($window.location.href).length);
	console.log(id);

	$scope.editYourPpt = function(x){
		//console.log('edit')
		$window.location.href = '/edit/'+x._id;
	}

	$scope.delYourPpt = function(x){
		//console.log('edit')
		$http({
			method: 'delete',
			url: '/delete/' + x._id
		}).then(function(res){
			console.log(res);
			$window.location.href = '/profile/'+ id;

		} , function(er){console.log(er);})	
	}

	//$scope.uploaded = '<h1>fffffffff</h1>';

	$scope.getPptsUser = function(){
		$http({
			method: 'get' ,
			url: '/pptsUser/' + id
		}).then(function(res){
			console.log(res);
			$scope.pptsForUser = res.data.userObj;

			if( (res.data.userObj.pptsUploaded).length == 0){
				//console.log('There is no uploaded ppt')
				//element(by.id('content')).getInnerHTML
				document.getElementById("uploaded").innerHTML = '<h1>There is no uploaded ppt</h1>';
				document.getElementById("uploaded").style.marginLeft = "50px";
				//document.getElementById("uploaded").style.marginTop = "50px";
			}
			if(res.data.userObj.pptsLikes.length == 0){
				//console.log('There is no liked ppt')
				document.getElementById("liked").innerHTML = '<h1>There is no liked ppt</h1>';
				document.getElementById("liked").style.marginLeft = "50px";
			}
			if(res.data.userObj.pptsComminted.length == 0){
				//console.log('There is no comminted ppt')
				document.getElementById("comminted").innerHTML = '<h1>There is no comminted ppt</h1>';
				document.getElementById("comminted").style.marginLeft = "50px";
			}
			

		} , function(er){console.log(er);})
	}


	$scope.getPptsUser(); //invoke the above function



	$scope.showUploaded = true;
	$scope.showLiked = false;
	$scope.showCommented = false;
	$scope.showForm = false;

	$scope.showHide = function(id){
		if(id=='pptsUploaded'){
			$scope.showUploaded = true;
			$scope.showLiked = false;
			$scope.showCommented = false;
			$scope.showForm = false;
		}
		else if(id=='pptsLiked'){
			$scope.showUploaded = false;
			$scope.showLiked = true;
			$scope.showCommented = false;
			$scope.showForm = false;
		}
		else if(id=='form'){
			$scope.showUploaded = false;
			$scope.showLiked = false;
			$scope.showCommented = false;
			$scope.showForm = true;
		}
		else{
			$scope.showUploaded = false;
			$scope.showLiked = false;
			$scope.showCommented = true;
			$scope.showForm = false;
		}
	}


	



}]);