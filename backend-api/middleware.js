var lookFor = function(arr , pptIdd){
	for (var i=0 ; i<arr.length ; i++) {
		if(arr[i].pptId === pptIdd){
			return i;
		}
	}
	return -1;
}

exports.lookFor = lookFor;

/**********************************************************************************************************************************************************************************************************************************************************/

var del = function(arr , id){
	for (var i=0 ; i<arr.length ; i++) {
		if(arr[i].pptId===id){
			arr.splice(i , 1);
		}
	}
}

exports.del = del;


