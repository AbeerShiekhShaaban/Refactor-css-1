

app.controller('first' , ['$scope' , '$http' , '$window' /*, '$localstorage'*/ , function($scope , $http , $window /*, $localstorage*/){
	var id = ($window.location.href).slice(26,($window.location.href).length);
	//console.log(id);
	//console.log($window.location.href);

	$scope.pptx = {};


	$http({
		method: 'get',
		url: '/dis/'+ id
	}).then(function(res){
			//console.log(res);
			$scope.pptx = res.data;

			var fromm = parseInt($scope.pptx.embed.search("="));
			var to = parseInt($scope.pptx.embed.search("width"));

			var url = $scope.pptx.embed.slice(fromm+2 , to-2);

			$(document).ready(function(){
				$('#ff').attr('src' , url);

				/*for(var i=20 ; i<=100 ; i=i+20){
					var imgId = '#b-' + i.toString();
					$(imgId).attr('src' , 'abeer/icons/star.png');
				}*/

				var r = parseInt(res.data.rating);
				//console.log(r)
				if(20<=r&&r<30){$('#b-20').attr('src' , 'abeer/icons/star-co.png');}
				else if(30<=r&&r<40){
					$('#b-20').attr('src' , 'abeer/icons/star-co.png');
					$('#b-40').attr('src' , 'abeer/icons/star-co.png');}
				else if(40<=r&&r&&r<50){
					$('#b-20').attr('src' , 'abeer/icons/star-co.png');
					$('#b-40').attr('src' , 'abeer/icons/star-co.png');}
				else if(50<=r&&r<60){
					$('#b-20').attr('src' , 'abeer/icons/star-co.png');
					$('#b-40').attr('src' , 'abeer/icons/star-co.png');
					$('#b-60').attr('src' , 'abeer/icons/star-co.png');}
				else if(60<=r&&r<70){
					$('#b-20').attr('src' , 'abeer/icons/star-co.png');
					$('#b-40').attr('src' , 'abeer/icons/star-co.png');
					$('#b-60').attr('src' , 'abeer/icons/star-co.png');}
				else if(70<=r&&r<80){
					$('#b-20').attr('src' , 'abeer/icons/star-co.png');
					$('#b-40').attr('src' , 'abeer/icons/star-co.png');
					$('#b-60').attr('src' , 'abeer/icons/star-co.png');
					$('#b-80').attr('src' , 'abeer/icons/star-co.png');}
				else if(80<=r&&r<90){
					$('#b-20').attr('src' , 'abeer/icons/star-co.png');
					$('#b-40').attr('src' , 'abeer/icons/star-co.png');
					$('#b-60').attr('src' , 'abeer/icons/star-co.png');
					$('#b-80').attr('src' , 'abeer/icons/star-co.png');}
				else if(90<=r&&r<=100){
					$('#b-20').attr('src' , 'abeer/icons/star-co.png');
					$('#b-40').attr('src' , 'abeer/icons/star-co.png');
					$('#b-60').attr('src' , 'abeer/icons/star-co.png');
					$('#b-80').attr('src' , 'abeer/icons/star-co.png');
					$('#b-100').attr('src' , 'abeer/icons/star-co.png');}
			});

		} , function(err){
				console.log(err);
	});

	//$scope.yourCurrentRate=0
	$http({
			method: 'get',
			url: '/yrate/' + id
		}).then(function(res){
			//console.log(res);
			$scope.yourCurrentRate = res.data.r;
			for(var i=20 ; i<=100 ; i=i+20){
					var imgId = '#a-' + i.toString();
					$(imgId).attr('src' , 'abeer/icons/star.png');
				}

			for(var i=20 ; i<=$scope.yourCurrentRate ; i=i+20){
				var imgId = '#a-' + i.toString();
				$(imgId).attr('src' , 'abeer/icons/star-co.png');
			}

		} , function(err){console.log(err);});



	$http({
		method: 'get',
		url: '/boolean'
	}).then(function(res){
		console.log(res);
		if(res.data.show == false){ // !res.data.show
			$('#yourRating').attr('class' , 'ng-hide');
			$('#v').attr('class' , 'ng-hide');
			$scope.imgSrc = "abeer/icons/unlike.png";
			$('#lik').click(function(){
				$('#msg').toggle();
			});
		}

	} , function(e){console.log(e);});




	

	$scope.rate = function(val){
		var value = val.toString();
		console.log(value);

		$http({
			method: 'get',
			url: '/rate/' + id + '/' + value
		}).then(function(res){
				//console.log(res.data.newPpt.rating);
				$scope.pptx.rating = res.data.newPpt.rating;
				//console.log(res);
				for(var i=20 ; i<=100 ; i=i+20){
					var imgId = '#a-' + i.toString();
					$(imgId).attr('src' , 'abeer/icons/star.png');
				}

				for(var i=20 ; i<=val ; i=i+20){
					var imgId = '#a-' + i.toString();
					$(imgId).attr('src' , 'abeer/icons/star-co.png');
				}
				
				$http({
					method: 'get',
					url: '/yrate/' + id
				}).then(function(res){
					$scope.yourCurrentRate = res.data.r;
				} , function(err){console.log(err);});
				

				for(var i=20 ; i<=100 ; i=i+20){
					var imgId = '#b-' + i.toString();
					$(imgId).attr('src' , 'abeer/icons/star.png');
				}
				var r = parseInt(res.data.newPpt.rating);
				//console.log(r)
				if(20<=r&&r<30){$('#b-20').attr('src' , 'abeer/icons/star-co.png');}
				else if(30<=r&&r<40){
					$('#b-20').attr('src' , 'abeer/icons/star-co.png');
					$('#b-40').attr('src' , 'abeer/icons/star-co.png');}
				else if(40<=r&&r&&r<50){
					$('#b-20').attr('src' , 'abeer/icons/star-co.png');
					$('#b-40').attr('src' , 'abeer/icons/star-co.png');}
				else if(50<=r&&r<60){
					$('#b-20').attr('src' , 'abeer/icons/star-co.png');
					$('#b-40').attr('src' , 'abeer/icons/star-co.png');
					$('#b-60').attr('src' , 'abeer/icons/star-co.png');}
				else if(60<=r&&r<70){
					$('#b-20').attr('src' , 'abeer/icons/star-co.png');
					$('#b-40').attr('src' , 'abeer/icons/star-co.png');
					$('#b-60').attr('src' , 'abeer/icons/star-co.png');}
				else if(70<=r&&r<80){
					$('#b-20').attr('src' , 'abeer/icons/star-co.png');
					$('#b-40').attr('src' , 'abeer/icons/star-co.png');
					$('#b-60').attr('src' , 'abeer/icons/star-co.png');
					$('#b-80').attr('src' , 'abeer/icons/star-co.png');}
				else if(80<=r&&r<90){
					$('#b-20').attr('src' , 'abeer/icons/star-co.png');
					$('#b-40').attr('src' , 'abeer/icons/star-co.png');
					$('#b-60').attr('src' , 'abeer/icons/star-co.png');
					$('#b-80').attr('src' , 'abeer/icons/star-co.png');}
				else if(90<=r&&r<=100){
					$('#b-20').attr('src' , 'abeer/icons/star-co.png');
					$('#b-40').attr('src' , 'abeer/icons/star-co.png');
					$('#b-60').attr('src' , 'abeer/icons/star-co.png');
					$('#b-80').attr('src' , 'abeer/icons/star-co.png');
					$('#b-100').attr('src' , 'abeer/icons/star-co.png');}
			} 
			, function(e){
				console.log(e);
			});
	}

	$http({
		method: 'get',
		url: '/ylike/' + id
	}).then(function(ress){
		//console.log(ress);
		if(ress.data.like==true){
			//$('#lik').attr('class' , 'blue');
			$scope.imgSrc = "abeer/icons/like.png";
		}
		else{
			//$('#lik').attr('class' , 'red');
			$scope.imgSrc = "abeer/icons/unlike.png";
		}

	} , function(e){console.log(e)});


	$scope.like = function(){
		var id = ($window.location.href).slice(26,($window.location.href).length);

		$http({
			method: 'get' ,
			url: '/like/' + id
		}).then(function(res){
			console.log(res.data.ppt.likes);
			$scope.pptx.likes = res.data.ppt.likes;
			$http({
				method: 'get',
				url: '/ylike/' + id
			}).then(function(ress){
				//console.log(ress);
				if(ress.data.like==true){
					//$('#lik').attr('class' , 'blue');
					$scope.imgSrc = "abeer/icons/like.png";
				}
				else{
					//$('#lik').attr('class' , 'red');
					$scope.imgSrc = "abeer/icons/unlike.png";
				}

			} , function(e){console.log(e)});

			
		} , function(err){
			console.log(err);
		});


		/*$.ajax({
			url: '/like/' + id ,
			success: function(result){
				console.log(result);
				$scope.pptx = result;
			}
		});*/
	}

}]);






























/*
	var id = ($window.location.href).slice(22,($window.location.href).length);
	//console.log(id);
	//console.log($window.location.href)

	$scope.pptx = {};
	//$scope.embed = 55;
	$scope.embed ="https://onedrive.live.com/embed?resid=52ED116D99A5BD0D%21768&authkey=%21AJW5p9Nc3sdRTmE&em=2&wdAr=1.3333333333333333"; 

	$http({
		method: 'get',
		url: '/' + id
	}).then(function(res){
		console.log(res);
		$scope.pptx = res.data;
		//$scope.pptx.embed.search("=")
		console.log($scope.pptx.embed);
		var fromm = parseInt($scope.pptx.embed.search("="));
		var to = parseInt($scope.pptx.embed.search("width"));
		console.log($scope.pptx.embed.slice(fromm+2 , to));
		
		$scope.url = $scope.pptx.embed.slice(fromm+2 , to-2); //'https://onedrive.live.com/embed?resid=52ED116D99A5BD0D%21768&authkey=%21AJW5p9Nc3sdRTmE&em=2&wdAr=1.3333333333333333';
		$(document).ready(function(){
			$('#ff').attr('src' , $scope.url);
			//$('#WACStatusBarContainer').remove();
			//$('#ChromelessStatusBar').remove();
			

		});

		//$scope.embed = "'"+$scope.url+"'";

		//$scope.pptx.embed.slice( fromm+1 , to-1 );
		/*var parser = new DOMParser();
     	var doc = parser.parseFromString($scope.pptx.embed, "text/html");
		console.log(doc.body.getElementsByTagName('iframe')[0].src);
		$scope.embed = doc.body.getElementsByTagName('iframe')[0];*/
		//console.log(eval($scope.embed));
		//$scope.embed = eval($scope.embed);
		/*console.log(eval('$scope.pptx.embed'));
		$scope.embed = eval('$scope.pptx.embed')*/

/*	} , function(error){
		console.log(error);
	});
	console.log('ddd');*/
