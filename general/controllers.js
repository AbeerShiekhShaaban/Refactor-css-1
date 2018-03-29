var app = angular.module('myApp' , []);

app.service('obj' , function(){ //we have to use service not var function because we want to use it in another controller
	this.makeArr = function(arr){
		var pagesArray = [1];
		var count = 1;
		for(var i=8 ; i<arr.length ; i=i+8){
			count = count + 1;
			//console.log(count);
			pagesArray.push(count);
		}
		return pagesArray ;
	}
});


app.controller('mc' , ['$scope' , '$http' , '$window' , 'obj' , function($scope , $http , $window , obj){
	$scope.abeer = 'sd';

	$scope.array = [];
	$scope.q = '?p=' ;
	$scope.pagesArray = [] ;
	$scope.currentPage = 1;

	/*var makeArr = function(arr){
		var pagesArray = [1];
		var count = 1;
		for(var i=8 ; i<arr.length ; i=i+8){
			count = count + 1;
			//console.log(count);
			pagesArray.push(count);
		}
		return pagesArray ;
	}*/

	$scope.open = function(x){
		//console.log(x);
		console.log(x._id);
		$window.location.href = '/show/'+x._id;
	}


	$scope.page = function(strNum){
		
		$scope.q = '?p=' + strNum; //'5' ;

// what if we invoke $http outside page function
		$http({
			method: 'get' ,
			url: '/api' + $scope.q , 

		}).then(function(res){
			//console.log($scope.q);
			//console.log(res.data);
			$scope.array = res.data.subPptArray;
			//console.log($scope.array[0]);
		} , function(resErr){
			console.log(resErr);
		});

		

		$scope.currentPage = strNum;
		$http({
			method: 'get' ,
			url: '/api' 
		}).then(function(res){
				//console.log(res.data);
				var pagesNums = obj.makeArr(res.data.pptArr);
				//console.log(pagesNums);
				if($scope.currentPage%3 === 0){
					var subPagesArr = [$scope.currentPage];
					//console.log($scope.pagesArray);
					if($scope.pagesArray.indexOf($scope.currentPage-1) !== -1){ 
						for(var i = 1 ; i <= 3 ; i=i+1) {
							$scope.currentPage = $scope.currentPage + 1;
							if(pagesNums.indexOf($scope.currentPage) !== -1){
								subPagesArr.push($scope.currentPage);
							}	
						}
						$scope.pagesArray = subPagesArr;
					}
					else{
						for(var i = 1 ; i <= 3 ; i=i+1){
							$scope.currentPage = $scope.currentPage - 1;
							if($scope.currentPage !== 0){
								subPagesArr.push($scope.currentPage);
							}							
						}
						$scope.pagesArray = subPagesArr.reverse();
					}
				}
				//console.log($scope.pagesArray);
			} , function(resErr){
				console.log(resErr)
			});
		

	}


	$scope.firstPage = function(){
		$http({method: 'get',
			   url: '/api'
		}).then(function(res){
				var pagesNums = obj.makeArr(res.data.pptArr);
				if(pagesNums.length >= 3){
					$scope.pagesArray = [1,2,3];
				}
				else if(pagesNums.length === 2){
					$scope.pagesArray = [1,2];
				}
				else{
					console.log('no pages')
				}
				$http({
					method: 'get' ,
					url: '/api?p=1' 
				}).then(function(res){
					$scope.array = res.data.subPptArray;
					} , function(resErr){
					console.log(resErr);
					});
				
			} , function(resErr){
				console.log(resErr);
			});
	}


	$scope.lastPage = function(){
		$http({
			method: 'get',
			url: '/api'
		}).then(function(res){
			var pagesNums = obj.makeArr(res.data.pptArr);
			var lastIndx = pagesNums.length - 1;
			//$scope.pagesArray = [pagesNums[lastIndx-3] , pagesNums[lastIndx-2] , pagesNums[lastIndx-1] , pagesNums[lastIndx]];
			$scope.pagesArray = [pagesNums[lastIndx]];
			
			if(pagesNums[lastIndx]%3 === 0){
				lastIndx = lastIndx - 1;
				$scope.pagesArray.push(pagesNums[lastIndx]);
			}
			while(pagesNums[lastIndx]%3 !== 0){
				lastIndx = lastIndx - 1;
				//console.log(pagesNums[lastIndx])
				$scope.pagesArray.push(pagesNums[lastIndx]);
			}
			//$scope.pagesArray.push(pagesNums[lastIndx-1])
			$scope.pagesArray.reverse();
			$scope.q = pagesNums.length;
			//console.log(lastIndx)
			$http({
				method: 'get',
				url: 'api?p=' + $scope.q
			}).then(function(res){
				$scope.array = res.data.subPptArray;
			} , function(resErr){
				console.log('err');
			})


		} , function(resErr){
			console.log('err');
		});
	}


	//$scope.page();
	console.log($scope.q);

	$http({
		method: 'get' ,
		url: '/api?p=1' 
	}).then(function(res){
			console.log(res.data);
			$scope.array = res.data.subPptArray;
			//console.log($scope.array[0]);
		} , function(resErr){
			console.log(resErr);
	});


	
	$scope.showFirst = true;
	$scope.showLast = true;
	
	$http({
		method: 'get' ,
		url: '/api' 
	}).then(function(res){
			//console.log(res.data);
			var pagesNums = obj.makeArr(res.data.pptArr);
			//console.log(pagesNums);
			if(pagesNums.length===0 || pagesNums.length===1 || pagesNums.length===2 || pagesNums.length===3){
				$scope.showFirst = false;
				$scope.showLast = false;
			}
			if(pagesNums.length >= 3){
				$scope.pagesArray = [1,2,3];
			}
			else if(pagesNums.length === 2){
				$scope.pagesArray = [1,2];
			}
			else{
				console.log('no pages')
			}
			//console.log($scope.pagesArray);
		} , function(resErr){
				console.log(resErr)
		});
	
	// console.log($scope.pagesArray); //Asynchronous

/****************************************************************************************************************************/

	// search $scope has problems because of changer controller

	// hover angular
	$scope.mouseLeave = function(i){
		var img = '#img-' + i.toString();
		$(img).css('border-width' , '1px');
	}

	$scope.mouseOver = function(i){
		var img = '#img-' + i.toString();
		$(img).css('border-width' , '2px');
	}
	

}]);


var name = 'abeer'