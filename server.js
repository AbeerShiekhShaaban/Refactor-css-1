var express = require('express');
var path = require('path');
var bcrypt = require('bcrypt');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var models = require('./backend-api/models-db');
var parseBody = require('body-parser');
var multeerr  = require('multer');
var upload = multeerr({ dest: './general/uploaded/' });
var auth = require('express-session');
var MongoStore = require('connect-mongo')(auth);
var  funcs = require('./backend-api/middleware');


var Ppt = models.Ppt;
var User = models.User;
var Comment = models.Comment;
var Reply = models.Reply;
var Temp = models.Temp;

var lookAt = funcs.lookFor;
var del = funcs.del;


mongoose.connect('mongodb://node:node@ds219879.mlab.com:19879/data' , {useMongoClient: true}); //mongodb://localhost:27017/pttt

mongoose.connection.on('error' , function(err){
	console.log('there is problem in connection');
	console.log(err);
});

// error event must have listener
/*mongoose.connection.on('error').then( function(err){
	console.log('there is problem in connection');
	console.log(err);
});*/

mongoose.connection.once('open' , function(){
	console.log('mongoose is connecting');
})



var app = express();

app.use(auth({
	secret: 'ab',
	resave: false ,
	saveUninitialized: false,
	store: new MongoStore({
    mongooseConnection: mongoose.connection
  	})
 	//cookie: { secure: true }
}));

// express.static is a middleware to serve static files from general folder
//app.use('/abeer' , express.static(__dirname + '/../general'));
app.use('/abeer', express.static(path.join(__dirname +  '/./general'))); // path.join require('path')
app.use('/show/abeer', express.static(path.join(__dirname +  '/./general')));
app.use('/profile/abeer', express.static(path.join(__dirname +  '/./general')));
app.use('/edit/abeer', express.static(path.join(__dirname +  '/./general')));

// without this middleware req.body = {} empty object
app.use(parseBody.urlencoded({extended: false}));

// middleware parse application/json
app.use(parseBody.json());

// map a different extension (html) to the template engine.
app.engine('html', require('ejs').renderFile);
//or
//app.engine('.html', require('ejs').__express);

//path
app.set('views', __dirname + '/./vviewss');
//app.set('view engine', 'ejs');


app.get('/appp' , function(req , res){
	console.log(app.settings);
	res.end();
});



app.get('/signup' , function(req , res , next){
	// console.log('abeer');
	res.render('sign-up.html' , {error:'' , errorTwo:''});
});

app.post('/signup' , function(req , res , next){
	//console.log(req.body);
 	User.find({$or: [ {email: req.body.email}, {userName: req.body.userName} ]}).then(function(result){
 		if(result.length===0){
 			if(req.body.password === req.body.confirm){
				bcrypt.hash(req.body.password , 10).then(function(hash){
					req.body.password = hash;

					User.create(req.body , function(err , user){
						//console.log(err);
						//console.log(user);
						req.session.userId = user._id;
						//console.log(req.session);
						if(req.session.userId === user._id){
							res.redirect('/');
							//res.end();
						}				
					});
				});
			}
			else{
				res.render('sign-up.html' , {error: 'Password does not match confirm password' , errorTwo:''});
			}
 		}
 		else{
 			res.render('sign-up.html' , {error:'' , errorTwo: 'repeated user check email and user name'});
 		}
 	});		
});

app.get('/log' , function(req , res , next){
	res.render('log-in.html' , {err: ''});
	next();
});

app.post('/log' , function(req , res , next){
	//console.log(req.body);
	User.find({email: req.body.emaill}).then(function(users){
		if(users.length===1){
			//console.log(users);
			bcrypt.compare(req.body.ppasswrd , users[0].password).then(function(result){
				//console.log(result);
				if(result === true){
					req.session.userId = users[0]._id;
					//console.log(req.session);
					res.redirect('/');
					//console.log(res.headersSent)
				}
				else{
					res.render('log-in.html' , {err: 'Wrong password'});
				}
			});
		}
		else{
			res.render('log-in.html' , {err: 'Email does not exist'});
		}
	});
	//res.redirect('/'); //Does not work incase of using $http in angular
});

app.get('/logout' , function(req , res , next){
	req.session.destroy(function(err){
		if(err === null){
			//res.end();
			res.redirect('/');
		}
  		console.log(err);
	});
});

app.post('/profile' , upload.any() , function(req , res , next){
	//console.log(req.body.files); // wrong
	console.log(req.files);

	var picture = 'abeer\\uploaded\\' + req.files[0].filename;

	User.findOne({_id: req.session.userId}).then(function(user){
		//console.log(user.image);
		user.image = picture;
		user.save(function(err , user){
			if(err){
				console.log(err);
			}
			else{
				//Ppt.find({user: req.session.userId}).then(function())
				console.log(user.image);
				res.redirect('/profile/'+req.session.userId);
			}
		});		
	});
});

app.get('/boolean' , function(req , res , next){
	var bool = {show: false , userId:''};
	if(req.session.userId){
		User.findOne({_id:req.session.userId}).then(function(user){
			bool = {show: true , userId: req.session.userId , userNname: user.userName , userImage: user.image};
			//console.log(bool);
			res.send(bool);
		});
	}
	else{
		res.send(bool);
	}
});

app.get('/upload' , function(req , res , next){
	res.render('upload.html' , {err: ''});
	next();
});

app.post('/upload' , upload.any() , function(req , res , next){
	//console.log(req.body);
	//console.log(req.file); //undefined
	//console.log(req.files);

	Ppt.find({embed: req.body.embed}).then(function(arr){
		
		if(arr.length === 0){
			req.body.thumbnail = 'abeer\\uploaded\\' + req.files[0].filename;
			//console.log(req.body);
			req.body.user = req.session.userId;
			var newPpt = new Ppt(req.body);
			//console.log(newPpt.validateSync())
			newPpt.save(function(err , ppt){
				if(err){
					console.log(err);
				}
				else{
					//console.log(ppt);
					//console.log(ppt.userInfo);
					User.findOneAndUpdate({_id: req.session.userId} , {$push:{pptsUploaded:ppt}} , {new:true})
					.then(function(user){
						console.log('ppt pload');
					});
				}
			});
			//res.redirect('/');
			res.render('main.html');
		}
		else{
			var e = 'Repeated ppt' ;
			res.render('upload.html' , {err: e });
		}
	});
	
});
/*
app.get('/pptUser' , )*/

app.get('/api' , function(req , res , next){

	var qApi = Ppt.find({private: 'false'}).populate({path: 'user' , model: User});

	if(req.query.p === undefined){
		qApi.then(function(pptArr){
			res.json({pptArr}); 
			next()
		});
	}
	else if(req.query.p === '1'){
		qApi.sort({date: -1}).limit(8).then(function(subPptArray){
		   res.json({subPptArray});
		   next();
		});
	}
	else{

		var x = 8*(req.query.p - 1);
		qApi.sort({date: -1}).skip(x).limit(8)
		.then(function(subPptArray){
		   res.json({subPptArray});
		   next();
		});
	}	
});



// Be carful about array name
app.get('/apiSort' , function(req , res , next){

	var qApiSort = Ppt.find({private: 'false'}).populate({path: 'user' , model: User});

	if(req.query.sortt === 'title'){
		var ssort = {title: 1};
	}
	else if(req.query.sortt === 'date'){
		var ssort = {date: 1};
	}
	else if(req.query.sortt === 'views'){
		var ssort = {veiws: -1};
	}


	if(req.query.p === undefined){
		qApiSort.then(function(pptArr){
			res.json({pptArr}); 
			next()
		});
	}
	else if(req.query.p === '1'){
		qApiSort.sort(ssort).limit(8)
		.then(function(subPptArray){
		   res.json({subPptArray});
		   next();
		});
	}
	else{
		var x = 8*(req.query.p - 1);
		qApiSort.sort(ssort).skip(x).limit(8)
		.then(function(subPptArray){
		   res.json({subPptArray});
		   next();
		});
	}	
});



app.get('/search' , function(req , res , next){
	var word = req.query.word;
	var minimum = parseInt(req.query.minn);
	var maximum = parseInt(req.query.maxx);

	/*var q = Ppt.find({$and:[ {$text:{ $search:word}} , {private:'false'} ]});*/
	var q = Ppt.find({$and:[ {$text:{ $search:word}} , {private: 'false'} , {rating:{$gte:minimum}} , {rating:{$lte:maximum}} ]})
				.populate({path: 'user' , model: User});  
	//var q = Ppt.find({$text:{ $search:word}});

	if(req.query.sortt === 'title'){
		var sssort = {title: 1};
	}
	else if(req.query.sortt === 'date'){
		var sssort = {date: 1};
	}
	else if(req.query.sortt === 'views'){
		var sssort = {veiws: -1};
	}

	
	if(req.query.p === undefined){
		q.then(function(pptArr){
			res.json({pptArr}); 
		});
	}
	else if(req.query.p === '1'){
		q.sort(sssort).limit(8).then(function(subPptArray){
		   res.json({subPptArray});
		});
	}
	else{
		var x = 8*(req.query.p - 1);
		q.sort(sssort).skip(x).limit(8).then(function(subPptArray){
		   res.json({subPptArray});
		});
	}
/*	Ppt.find({$and:[ {$text:{ $search:word}} , {day:{$gte:minimum}} , {day:{$lte:maximum}} ]}) */
});



app.get('/' , function(req , res , next){

	res.render('main.html');
	next();
});

/******************************************************************************************************************************************************************************************************************************************************************************************************************************************************/

app.get('/dis//:id' , function(req , res , next){
	//console.log(req.params.id);
	//var look = (req.params.id).toString()

	Ppt.updateOne({_id: req.params.id} , { $inc: {veiws: 1} }).then(function(status){
		//console.log(status);
		Ppt.find({_id: req.params.id}).populate({path: 'user' , model: User}).then(function(ppt){
			//console.log(ppt[0]);
			res.send(ppt[0]);
			//next();
		});
	});

});

app.get('/show/:id' , function(req , res , next){
	//console.log(req.session);
	res.render('id.html');
});

app.get('/like//:id' , function(req , res){

	if(req.session.userId){
		User.findOne({_id: req.session.userId}).then(function(user){
			//console.log(user);
			 
			//console.log(user.pptsLikes); //user.pptsLikes of ids not object

			if((user.pptsLikes).indexOf(req.params.id)===-1){
				Ppt.findOneAndUpdate({_id: req.params.id} , {$inc: {likes: 1}} , {new: true}).then(function(ppt){
					//console.log(ppt);
					//user.pptsLikes.push(ppt);
					//console.log(ppt.likes);
					User.findOneAndUpdate({_id: req.session.userId} , {$push: {pptsLikes: ppt}})
						.then(function(user){
							console.log(user.pptsLikes.length);
							//console.log(ppt.likes);
							res.send({ppt});
						});
				});
			}
			else{
				//console.log('you cannt like again');//res.end();
				Ppt.findOneAndUpdate({_id: req.params.id} , {$inc: {likes: -1}} , {new: true}).then(function(ppt){
					//console.log(ppt);
					//user.pptsLikes.push(ppt);
					//console.log(ppt.likes);
					User.findOneAndUpdate({_id: req.session.userId} , {$pull: {pptsLikes: req.params.id}})
						.then(function(user){
							console.log(user.pptsLikes.length);
							//console.log(ppt.likes);
							res.send({ppt});
						});
				});
			}	
		});
	}
	else{console.log('there is no user');res.end();}
});

app.get('/ylike//:id' , function(req,res){

	if(req.session.userId){
		User.findOne({_id: req.session.userId}).then(function(user){
			//console.log(user.pptsLikes.length)
			//var i = lookAt(user.pptsLikes , req.params.id);
			if((user.pptsLikes).indexOf(req.params.id)!==-1){/*i!==-1*/
				res.send({like:true});
			}
			else{
				res.send({like:false});
			}
		});
	}
	
});

/********************************************************************************************************************************************************************************************************************************************/

app.get('/rate//:id/:val' , function(req , res){

	if(req.session.userId){
		User.findOne({_id: req.session.userId}).then(function(user){
			//console.log(user.rated);
			var i = lookAt(user.rated , req.params.id);
			if(i===-1){ 
				//console.log(req.params.val);
				console.log(user.rated[i]);
				Ppt.findOneAndUpdate({_id: req.params.id} , {$inc: {ratSum:req.params.val , ratNum:1}} , {new: true}).then(function(ppt){
						console.log(ppt.ratSum);
						var avg = ppt.ratSum/ppt.ratNum;
						Ppt.findOneAndUpdate({_id: req.params.id} , {$set: {rating: avg}} , {new: true})
							.then(function(newPpt){
								user.rated.push({pptId:newPpt._id , pptRate:req.params.val});
								user.save(function(err){
									//console.log(err);
									//console.log(user.rated);
									//console.log('new');
									//console.log(newPpt);
									res.send({newPpt});
								});
						});
				});
			}
			else{
				//console.log(user.rated[i].pptRate);
				Ppt.findOneAndUpdate({_id: req.params.id} , {$inc: {ratSum: -user.rated[i].pptRate , ratNum: -1}} , {new: true}).then(function(ppt){
					//console.log(user.rated[i]);
					//console.log(req.params.val);
					//user.rated.pptId(req.params.id).remove();
					del(user.rated , req.params.id);
					user.save(function(err){
						//console.log(err);
						//console.log(user.rated[i]); //undefined deleted
						Ppt.findOneAndUpdate({_id: req.params.id} , {$inc: {ratSum: req.params.val , ratNum: 1}} , {new: true}).then(function(ppt){
							var avg = ppt.ratSum/ppt.ratNum;
							//console.log(avg);
							//console.log(ppt.ratSum);
							//console.log(ppt.ratNum);
							Ppt.findOneAndUpdate({_id: req.params.id} , {$set: {rating: avg}} , {new: true})
							.then(function(newPpt){
								user.rated.push({pptId:req.params.id , pptRate:req.params.val});
								user.save(function(err){
									//console.log(err);
									//console.log('old');
									//console.log(user.rated.length);
									//console.log(newPpt);
									res.send({newPpt});
								});
							});
						});
					});	
				});
			}
		});
	}
	else{console.log('there is no user');res.end();}
});

app.get('/yrate//:id' , function(req,res){

	if(req.session.userId){
		User.findOne({_id: req.session.userId}).then(function(user){
			var i = lookAt(user.rated , req.params.id);
			if(i!==-1){
				var yourRate = user.rated[i].pptRate;
				res.send({r:yourRate});
			}
			else{
				res.send({r: 0});
			}
		});
	}
	
});

app.get('/file' , function(req,res){
	res.sendFile(path.join(__dirname +  '/../vviewss/main.html'));
});

/********************************************************************************************************************************************************************************************************************************************/
app.post('/comm//:id', function(req,res){
	//console.log('post');
	if(req.session.userId){
		Comment.create({content: req.body.con , user:req.session.userId , parentPpt:req.params.id})
		.then(function(com){
			//console.log(com);

			Ppt.findOneAndUpdate({_id:req.params.id} , {$push:{comments:com}} , {new: true}).then(function(ppt){
				//console.log(ppt);
				User.findOne({_id:req.session.userId}).then(function(user){
					//console.log(ppt._id);
					//console.log(user.pptsComminted);
					if((user.pptsComminted).indexOf(ppt._id)==-1){
						User.findOneAndUpdate({_id:req.session.userId} , {$push:{pptsComminted:ppt}} , {new: true})
							.then(function(user){
								//console.log(user);
								res.end();
							});
					}
					else{
						res.end();
					}
				});
			});
		});
	}
});


app.get('/comm//:id' , function(req,res){
	//console.log('get');
	Ppt.findOne({_id:req.params.id}).populate({
		path:'comments' , 
		model: Comment ,
		populate : {
			path: 'replies' ,
			model: Reply ,
			populate: {
				path: 'user' ,
				model: User
			}	
		},
			
	}).populate({
		path:'comments' , 
		model: Comment ,
		populate : {
			path: 'user' ,
			model: User
		}
		
	}).then(function(ppt){
			//console.log(ppt.comments);	
			res.json({arrCom:ppt.comments});
		});
});

app.put('/updateComm/:id' , function(req,res){//it works good with post
	//console.log(req.body.up);
	Comment.findOneAndUpdate({_id: req.params.id} , {$set: {content: req.body.up}} , {new: true})
	.then(function(comm){
		console.log(comm);
		res.end();
	});
});

app.delete('/del/:id//:idppt' , function(req,res){
/*	Ppt.findOne({_id:req.params.idppt}).then(function(ppt){
		console.log(ppt.comments.length);*/
	Comment.findOne({_id: req.params.id}).then(function(comm){
		User.findOneAndUpdate({_id: comm.user} , {$pull: {pptsComminted: req.params.idppt}} , {new: true}).then(function(user){

			Comment.deleteOne({_id: req.params.id}).then(function(result){
				//console.log(result);
				Ppt.findOneAndUpdate({_id: req.params.idppt} , {$pull: {comments: req.params.id}} , {new: true})
				.then(function(ppt){
					res.end();
					//extra you have to delete its replies
				});
			});
		/*	});*/
		});
	});
});

/********************************************************************************************************************************************************************************************************************************************/

app.post('/comRep/:id' , function(req,res){
	if(req.session.userId){
		Reply.create({content:req.body.textrep , user:req.session.userId , parentComment:req.params.id})
		.then(function(rep){
			Comment.findOneAndUpdate({_id:req.params.id} , {$push: {replies: rep}} , {new:true}).then(function(com){
				//console.log(com);
				res.end();
			});
		});
	}
});

app.delete('/deleteCom/:idCom/:idRep' , function(req,res){
	Reply.deleteOne({_id: req.params.idRep}).then(function(result){
		//console.log(result);
		Comment.findOneAndUpdate({_id: req.params.idCom} , {$pull: {replies: req.params.idRep}} , {new:true})
		.then(function(com){
			//console.log(com);
			res.end();
		});
	});
});

app.put('/updateReply/:idComm/:idRep' , function(req,res){
	//console.log(req.body.updateRepp);
	//console.log(req.params.idRep);

	Reply.findOneAndUpdate({_id: req.params.idRep} , {$set: {content: req.body.updateRepp}} , {new:true})
	.then(function(rep){
		//console.log(rep);
		res.end();
	});
});

/****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
app.get('/profile/:userId' , function(req , res , next){
	if(req.session.userId === req.params.userId){
		//console.log(req.session.userId);
		res.render('profile.html');
	}
	else{
		res.redirect('/log');
	}
});

app.get('/pptsUser/:userId' , function(req,res){
	User.findOne({_id: req.params.userId})
	.populate({path: 'pptsUploaded' , model: Ppt})
	.populate({path: 'pptsComminted' , model: Ppt})
	.populate({path: 'pptsLikes' , model: Ppt})
	.then(function(user){
		//console.log(user);
		//res.end();
		res.send({userObj: user});
	});
});

app.delete('/delete/:idppt' , function(req , res){

	Ppt.findOne({_id: req.params.idppt}).then(function(ppt){
		//console.log(ppt);
		//console.log('why??????????')
		Ppt.deleteOne({_id: req.params.idppt}).then(function(result){
			//console.log(result);
			//console.log(ppt.user);
			//console.log(ppt._id);

			User.findOneAndUpdate({_id: ppt.user} , {$pull: {pptsUploaded: req.params.idppt}} , 
			/*{$pull: {pptsComminted: req.params.idppt}} , {$pull: {pptsLikes: req.params.idppt}} ,*/ {new: true})
			.then(function(user){

				del(user.pptsComminted , req.params.idppt);
				del(user.pptsLikes , req.params.idppt);
				del(user.rated , req.params.idppt);

				user.save(function(err, user){
					if(err){
						console.log(err);
					}
					else{
						//console.log(user);
						res.end();
					}
				});

			});
		});

		
	});
});

/**************************************************************/
app.get('/edit/:pptId' , function(req,res){
	res.sendFile(path.join(__dirname +  '/./vviewss/editYourPpt.html'));
});

app.get('/pptInfo/:pptId' , function(req,res){
	Ppt.findOne({_id: req.params.pptId}).then(function(ppt){
		res.send({info: ppt});
	});
});

app.post('/pptInfo/:pptId' , upload.any() , function(req,res){
	//console.log(req.body);
	//console.log(req.body.pp);
	//console.log(req.files);

	if((req.files).length == 0){
		Ppt.findOneAndUpdate({_id: req.params.pptId} , {$set: {title: req.body.tit , description: req.body.desc , 
			private: req.body.pp}} , {new: true})
			.then(function(ppt){
				//console.log(ppt);
				res.redirect('/profile/'+req.session.userId);
		});
	}
	else{
		//console.log(req.files);
		var pic = 'abeer\\uploaded\\' + req.files[0].filename;
		Ppt.findOneAndUpdate({_id: req.params.pptId} , {$set: {title: req.body.tit , description: req.body.desc , 
			private: req.body.pp , thumbnail: pic}} , {new: true})
			.then(function(ppt){
				console.log(ppt);
				res.redirect('/profile/'+req.session.userId);	
		});
	}
	
});



var port = process.env.PORT || 3000; //port for heroku
app.listen(port , function(){
	console.log('Express app is listening on port 3000');
});

/*http://localhost:3000/abeer/comment.js*/