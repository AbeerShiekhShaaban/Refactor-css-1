

app.controller('comments' , ['$scope' , '$window' , '$http' , function($scope,$window,$http){

	$scope.commentArr=[]; // this line to use in showEdit function
	var id = ($window.location.href).slice(26,($window.location.href).length);


	var booleanShowHide = function(){
		$http({
				method: 'get',
				url: '/boolean'
			}).then(function(res){

				if(res.data.show){
					$("#addCom").attr("class" , "ng-show");
				}

				for(var c=0 ; c<$scope.commentArr.length ; c++){
					//console.log($scope.commentArr[c].replies.length);
					if($scope.commentArr[c].replies.length==0){
						var ViewReps = '#ViewReps-' + c.toString();
						//console.log(ViewReps);
						$(ViewReps).attr("class" , "ng-hide");
					}
					if(res.data.show){
						var replyBtn = "#replyBtn-" + c.toString();
						$(replyBtn).attr("class" , "ng-show roundedBttn");
					}
				}
			//console.log($scope.commentArr[5])

				for(var i=0 ; i<$scope.commentArr.length ; i++){
					//console.log( $scope.commentArr[i].user._id);
					var editIconId = '#editIcon-'+i.toString();
					
					if(res.data.userId === $scope.commentArr[i].user._id){
						$(editIconId).attr('class' , 'ng-show');
					}
					else{
						$(editIconId).attr('class' , 'ng-hide');
					}
				}
				

			} , function(err){console.log(err);});
	}



	$http({
		method: 'get',
		url: '/comm/' + id
	}).then(function(res){
		//console.log(res);
		$scope.commentArr = (res.data.arrCom).reverse();

		booleanShowHide()

	} , function(e){console.log(e);});




	$scope.cont = '';

	$scope.addCom = function(){
		if($scope.cont === ''){
			//$('#bttn').prop('disabled',true);
			console.log('empty');
			//$scope.cont = 'Type something here';
		}
		else{
			$http({
				method: 'post',
				url: '/comm/' + id,
				data: {con: $scope.cont}
			}).then(function(ress){
					//console.log(ress);
					$http({ // to avoid refresh
						method: 'get',
						url: '/comm/' + id
					}).then(function(res){
						//console.log(res);
						$scope.commentArr = (res.data.arrCom).reverse();
						$scope.cont = '';

						booleanShowHide();

					} , function(e){console.log(e);});

				} , function(err){
					console.log(err);
			});
		}
	}

	var currentInd='embty';

	$scope.showEditDelete = function(i){
		//console.log($scope.currentInd);
		if(currentInd!=='embty'){

			var edId = '#ed-'+currentInd.toString(); //$scope.currentInd , i
			$(edId).attr('class' , 'ng-hide');
			var editId = '#edit-'+currentInd.toString();//$scope.currentInd , i
			$(editId).attr('class' , 'ng-hide');
			currentInd='embty';
		}
		var eleId = '#ed-'+i.toString();
		$(eleId).attr('class' , 'ng-show');
		currentInd = i;
	}

	//$scope.edit = false;
	

	$scope.showEdit = function(i){
		//$scope.edit = true;
		var editId = '#edit-'+i.toString(); //$scope.currentInd==i
		$(editId).attr('class' , 'ng-show'); 
		//console.log(i);
		//$scope.update = $scope.commentArr[$scope.currentInd].content; //problem in data binding and ng-model so use jquery 

		var inputId = '#inp-'+i.toString();
		$(inputId).val($scope.commentArr[i].content);

		var editIconId = '#editIcon-'+i.toString();
		$(editIconId).attr('class' , 'ng-hide');

		var cont = '#content-'+i.toString();
		$(cont).attr('class' , 'ng-hide');

		var ed = '#ed-'+i.toString();
		//$(ed).attr('class' , 'ng-hide');

		var style="display: inline-block; background-color: #666666;position: absolute; top: 100px; padding: 8px; color: white; font-weight: normal; z-index: 1;";
		$(ed).attr('style' , style);
	}

	
	$scope.saveUpdate = function(i){
		//$scope.update = ''; //problem in data binding and ng-model so use jquery
		//console.log($scope.update); //problem in data binding so use jquery
		//console.log(i);
		var inputId = '#inp-'+i.toString(); //i=$scope.currentInd

		$http({
			method: 'put', //it works good with post
			url: '/updateComm/' + $scope.commentArr[i]._id,
			data: {up: $(inputId).val()} //ng-model
		}).then(function(res){
			//console.log('yes');

			$http({
				method: 'get',
				url: '/comm/' + id
			}).then(function(res){
					console.log(res);
					$scope.commentArr = (res.data.arrCom).reverse();

					booleanShowHide();

			} , function(e){console.log(e);});

		} , function(ee){console.log(ee);});
	}

	$scope.del = function(i){
		$http({
			method: 'delete',
			url: '/del/' + $scope.commentArr[i]._id + '/'+ id //i=$scope.currentInd
		}).then(function(res){
			//console.log(res);
			$http({
				method: 'get',
				url: '/comm/' + id
			}).then(function(res){
					//console.log(res);
					$scope.commentArr = (res.data.arrCom).reverse();

					booleanShowHide();

			} , function(e){console.log(e);});

		} , function(er){console.log(er);})
	}

	$scope.ccancel = function(i){
		var canc1 = '#ed-'+i.toString();
		var canc2 = '#edit-'+i.toString();
		$(canc1).attr('class' , 'ng-hide');
		$(canc2).attr('class' , 'ng-hide');

		var contt = '#content-'+i.toString();
		$(contt).attr('class' , 'ng-show col-xl-7 col-lg-7 col-md-9 col-xl-7 col-10 content');

		var editIconId = '#editIcon-'+i.toString();
		$(editIconId).attr('class' , 'ng-show');

		var ed = '#ed-'+i.toString();
		var style="display: inline-block; background-color: #666666;position: absolute; top: 40px; padding: 8px; color: white; font-weight: normal; z-index: 1;";
		$(ed).attr('style' , style);
	}

/*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
	
	$scope.thisComRepArr = function(i){ //$http does not work in ng repeat dynamic array
		return $scope.commentArr[i].replies; //.reverse(); give error
	}

	var booleanShowHideReply = function(i){
		$http({
			method: 'get',
			url: '/boolean'
		}).then(function(res){
			var reps= '#reps-' + i.toString();
			$(reps).attr('class' , 'ng-show');
			var ViewReps = '#ViewReps-' + i.toString();
			$(ViewReps).html('Hide all replies');

			for(var c=0 ; c<$scope.commentArr.length ; c++){
				//console.log($scope.commentArr[c].replies.length);
				if($scope.commentArr[c].replies.length==0){
					var ViewReps = '#ViewReps-' + c.toString();
					//console.log(ViewReps);
					$(ViewReps).attr("class" , "ng-hide");
				}
				if(res.data.show){
					var replyBtn = "#replyBtn-" + c.toString();
					$(replyBtn).attr("class" , "ng-show roundedBttn");
				}
			}
			
			for(var j=0 ; j<$scope.commentArr.length ; j++){
				var editIconId = '#editIcon-'+j.toString();
				
				if(res.data.userId === $scope.commentArr[j].user._id){
					$(editIconId).attr('class' , 'ng-show');
				}
				else{
					$(editIconId).attr('class' , 'ng-hide');
				}
			}
			console.log(i);
			console.log($scope.commentArr[i].replies);
			for(var k=0 ; k<$scope.commentArr[i].replies.length ; k++){
				var editIconIdRep = '#editIconRep-'+k.toString()+i.toString();
				if(res.data.userId == $scope.commentArr[i].replies[k].user._id){

					$(editIconIdRep).attr('class' , 'ng-show');
				}
				else{
					$(editIconIdRep).attr('class' , 'ng-hide');
				}
			}	
		} , function(ee){console.log(ee);});
	}

	//var status = 'hide';
	//console.log(status)
	$scope.replyToggle = function(i){
		var inpRepId = '#replyWrite-' + i.toString();
		var addBttn = '#addBttn-' + i.toString();
		var ViewReps = '#ViewReps-' + i.toString();
		var reps = '#reps-' + i.toString();
		
		if($(inpRepId).attr('class') !== 'ng-show'){
			$(inpRepId).attr('class' , 'ng-show');
			$(addBttn).attr('class' , 'ng-show');
			$(ViewReps).attr('class' , 'ng-hide');
			$(reps).attr('class' , 'ng-hide');
			$(ViewReps).html('View all replies');
			//status = 'show';
		}
		else{
			$(inpRepId).attr('class' , 'ng-hide');
			$(addBttn).attr('class' , 'ng-hide');
			$(ViewReps).attr('class' , 'ng-show roundedBttn2');
		}
	}

	$scope.addRep = function(i){
		console.log(i)
		var inpRepId = '#replyWrite-' + i.toString();
		var contrep = $(inpRepId).val();

		if(contrep === ''){
			console.log('empty');
		}
		else{
			$http({
				method: 'post',
				url: '/comRep/' + $scope.commentArr[i]._id,
				data: {textrep: contrep}
			}).then(function(res){
				//console.log(res);
				$http({ // to update commentArr field replies
						method: 'get',
						url: '/comm/' + id
					}).then(function(res){
						//console.log(res);
						$scope.commentArr = (res.data.arrCom).reverse();
						var inpRepId = '#replyWrite-' + i.toString();
						var addBttn = '#addBttn-' + i.toString(); 
						$(inpRepId).attr('class' , 'ng-hide');
						$(addBttn).attr('class' , 'ng-hide');

						 
						//$(reps).attr('class' , 'ng-show');
						var ViewReps = '#ViewReps-' + i.toString(); 
						$(ViewReps).html('Hide all replies');

						booleanShowHideReply(i);

					} , function(e){console.log(e);});

			} , function(e){console.log(e);});
		}
	}

	
			

	$scope.displayReps = function(i){
		//console.log('hh');
		var ViewReps = '#ViewReps-' + i.toString(); 
		var reps= '#reps-' + i.toString(); 
		//console.log(reps)
		if($(reps).attr('class') !== 'ng-show'){
			
			$http({
				method: 'get',
				url: '/boolean'
			}).then(function(res){
				//console.log(i)
				$(reps).attr('class' , 'ng-show');
				$(ViewReps).html('Hide all replies');
				for(var k=0 ; k<$scope.commentArr[i].replies.length ; k++){

					var editIconIdRep = '#editIconRep-'+k.toString()+i.toString();
					if(res.data.userId == $scope.commentArr[i].replies[k].user._id){

						$(editIconIdRep).attr('class' , 'ng-show');
					}
					else{
						$(editIconIdRep).attr('class' , 'ng-hide');
					}
				}
				
			} , function(e){console.log(e);});			
		}
		else{
			$(reps).attr('class' , 'ng-hide');
			$(ViewReps).html('View all replies');
		}
	}


	var currComII = "empty";
	var currRepKK = "empty";

	$scope.showEditDeleteRep = function(i,k){
		//console.log('why');
		if(currComII!=="empty" && currRepKK!=="empty"){
			var editReply = '#editRep-' + currRepKK.toString() + currComII.toString();
			$(editReply).attr('class' , 'ng-hide');
			currComII = "empty";
			currRepKK = "empty";
		}

		if(currentInd!=='embty'){

			var edId = '#ed-'+currentInd.toString(); //$scope.currentInd , i
			$(edId).attr('class' , 'ng-hide');
			var editId = '#edit-'+currentInd.toString();//$scope.currentInd , i
			$(editId).attr('class' , 'ng-hide');
			currentInd='embty';
		}
		
		currComII = i;
		currRepKK = k;
		var editReply = '#editRep-' + k.toString() + i.toString();
		$(editReply).attr('class' , 'ng-show btn-group');
	}

	$scope.delRep = function(c , k){
		console.log($scope.commentArr[c]._id);
		console.log($scope.commentArr[c].replies[k]._id);

		$http({
			method: 'delete',
			url: '/deleteCom/' + $scope.commentArr[c]._id + '/' + $scope.commentArr[c].replies[k]._id
		}).then(function(res){
			//console.log(res);
			$http({
				method: 'get',
				url: '/comm/' + id
			}).then(function(res){
				$scope.commentArr = (res.data.arrCom).reverse();
				
				booleanShowHideReply(c);

			} , function(er){console.log(er);})

		} , function(er){console.log(er);})
	}


	$scope.ccancelRep = function(c , k){
		var editRep = '#editRep-'+ k.toString() + c.toString();
		var updateRep = '#updateRep-'+ k.toString() + c.toString();
		$(editRep).attr('class' , 'ng-hide');
		$(updateRep).attr('class' , 'ng-hide');
		var repCont = '#repCont-' + k.toString() + c.toString();
		$(repCont).attr('class' , 'ng-show col-xl-8 content');

		var editIconRep = '#editIconRep-'+ k.toString() + c.toString();
		$(editIconRep).attr('class' , 'ng-show');
	}

	$scope.showEditRep = function(c,k){
		var updateRep = '#updateRep-' + k.toString() + c.toString();
		var inpRep = '#inpRep-' + k.toString() + c.toString();
		var repCont = '#repCont-' + k.toString() + c.toString();
		var editIconRep = '#editIconRep-'+ k.toString() + c.toString();

		$(updateRep).attr('class' , 'ng-show');
		$(inpRep).val($scope.commentArr[c].replies[k].content);
		$(repCont).attr('class' , 'ng-hide');
		$(editIconRep).attr('class' , 'ng-hide');
	}

	$scope.saveUpdateRep = function(c,k){

		var inpRep = '#inpRep-' + k.toString() + c.toString();

		$http({
			method: 'put',
			url: '/updateReply/' + $scope.commentArr[c]._id + '/' + $scope.commentArr[c].replies[k]._id ,
			data: {updateRepp: $(inpRep).val()}
		}).then(function(res){
			$http({
				method: 'get',
				url: '/comm/' + id
			}).then(function(res){
				$scope.commentArr = (res.data.arrCom).reverse();

				booleanShowHideReply(c);

			} , function(e){console.log(e);});

		} , function(err){console.log(err);})
	}


/******************************************************************************************************************
*********************************************************************************************************************
*********************************************************************************************************************/

$scope.evenOddBackground = function(i){
	if(i){
		return {'background-color':'#e6e6ff'}
	}
	else{
		return {'background-color':'#f2f2f2'}
	}
}

$scope.evenOddBackgroundRep = function(i){
	if(i){
		return {'background-color':'#ffffb3'}
	}
	else{
		return {'background-color':'#ffffcc'}
	}
}

//Note: refactor the code instead of for loops use ng-show="invoke function at $index"

}]);