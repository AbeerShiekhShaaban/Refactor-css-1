
app.controller('changer' , ['$scope' , '$http' ,  'obj' , function($scope , $http , obj){
/*
	$scope.generalSort = true ;
	$scope.searchSort = false;*/

	//$scope.phrase = 'Search text';
	$scope.minn = '';
	$scope.maxx = '';

	//$scope.func = "angular.element(this).scope().changeArr('/apiSort?sortt=' , this.value)";


	$scope.changeArr = function(url , by){
		if(url.slice(0,7) === '/search'){
		
			//search body
			$scope.phrase = $scope.phrase;
			$scope.minn = $('#f').val();
			$scope.maxx = $('#s').val();

			url= '/search?word='+$scope.phrase+'&minn='+$scope.minn+'&maxx='+$scope.maxx+'&sortt=' ;

			var onchangeValue =  "angular.element(this).scope().changeArr("+'"' + url +'"'+ ", this.value)" ;
	

			//sort
			$(document).ready(function(){

       			$("#select").attr("onchange", onchangeValue);

			});
	/*		$scope.generalSort = false;
			$scope.searchSort = true;*/
			

		}
		console.log(onchangeValue)

		//Step-1
		$http({
			method: 'get' ,
			url: url + by +'&p=1' 
		}).then(function(res){
				$scope.array = res.data.subPptArray; // Do not change this name

				if( (res.data.subPptArray).length == 0 ){
					console.log('No result');
					$('#ppt').html('<h1 style="margin:auto; font-weight:bold;">No result</h1>');
				}

			} , function(resErr){console.log(resErr);});


		//Step-2
		$scope.showFirst = true;
		$scope.showLast = true;
		
		$http({
			method: 'get' ,
			url: url + by
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
					$scope.pagesArray = [1];
					//console.log('no pages')
				}
				//console.log($scope.pagesArray);
			} , function(resErr){
					console.log(resErr)
			});


		//Step-3 : function-1
		$scope.page = function(strNum){
			
			$scope.q = '&p=' + strNum; 

			$http({
				method: 'get' ,
				url: url + by + $scope.q , 

			}).then(function(res){
				$scope.array = res.data.subPptArray;
			} , function(resErr){
				console.log(resErr);
			});

			

			$scope.currentPage = strNum;
			$http({
				method: 'get' ,
				url: url + by
			}).then(function(res){
					var pagesNums = obj.makeArr(res.data.pptArr);
					if($scope.currentPage%3 === 0){
						var subPagesArr = [$scope.currentPage];
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
				} , function(resErr){
					console.log(resErr)
				});
		}


		//......function-2
		$scope.firstPage = function(){
			$http({method: 'get',
				   url: url + by
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
						url: url + by + '&p=1' 
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
				url: url + by
			}).then(function(res){
				var pagesNums = obj.makeArr(res.data.pptArr);
				var lastIndx = pagesNums.length - 1;
				$scope.pagesArray = [pagesNums[lastIndx]];
				
				if(pagesNums[lastIndx]%3 === 0){
					lastIndx = lastIndx - 1;
					$scope.pagesArray.push(pagesNums[lastIndx]);
				}
				while(pagesNums[lastIndx]%3 !== 0){
					lastIndx = lastIndx - 1;
					$scope.pagesArray.push(pagesNums[lastIndx]);
				}
				$scope.pagesArray.reverse();
				$scope.q = pagesNums.length;
				$http({
					method: 'get',
					url: url + by + '&p=' + $scope.q
				}).then(function(res){
					$scope.array = res.data.subPptArray;
				} , function(resErr){
					console.log('err');
				})


			} , function(resErr){
				console.log('err');
			});
		}
	}

	

/*	$scope.onSelect = function(x){
		console.log(x);
	}*/

	

}]);
	
$(document).ready(function(){
    $(".ui-slider-track .ui-shadow-inset .ui-bar-inherit .ui-corner-all .ui-mini").attr("id", "jmbar");
    $(".ui-slider-track.ui-mini .ui-slider-handle").attr("id", "move");
   /*$("#m > div > div:nth-child(2) > a:nth-child(2)").attr("id", "move1")*/
   /*$(#m > div > div:nth-child(1)).attr("id" , "why")*/
    $("#m > div > div:nth-child(1) > div").attr("id" , "str")
});












