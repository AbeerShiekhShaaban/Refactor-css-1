var mongoose = require('mongoose');
//var Schema = mongoose.Schema;

var pptSchema = new mongoose.Schema({
	title: {type:String , required: [true , 'loooool'] , trim: true }, // create index text using mongo shell 
	description: {type:String , trim: true } ,
	thumbnail: {type:String , required:true , trim: true},
	embed: {type:'String' , required:true , trim: true /*, unique: true , index: true , dropDups: true*/},
	date: { type: Date, default: Date.now , trim: true},
	comments: [{type: mongoose.Schema.Types.ObjectId , ref: Comment}] ,
	veiws: {type: Number , default: 0},
	likes: {type: Number , default: 0},
	private: {type: String/*Boolean*/ , default: 'false' /*false*/ },
	rating: {type: Number , default: 0},
	ratSum: {type: Number , default: 0},
	ratNum: {type: Number , default: 0},
	user: {type: mongoose.Schema.Types.ObjectId , ref: User},
	//////
	userInfoName: String,
	userInfoImage: String //populate
} /*, 	{
            toObject: { virtuals: true },
            toJSON: { virtuals: true }
        }*/);
// It is impossible to query on virtual field:
/*pptSchema.virtual('day').get(function(){
	console.log(this);
	var d = (this.date).toDateString().slice(8,10);
	var dd = parseInt(d);
	return dd;
});*/

/*pptSchema.virtual('userInfo').get(function(){
	//return this.user + "abeer";
	User.findOne({_id:this.user}).then(function(user){
		return user;
	});
});*/

var Ppt = mongoose.model('ppt' , pptSchema);
//module.exports = Ppt;
exports.Ppt = Ppt;


/********************************************************************************************************************************/

var subDocRated = new mongoose.Schema({
	pptId: String,
	pptRate: Number
});


var userSchema = new mongoose.Schema({
	userName: {type:String , required:true , trim: true},
	email: {type:String , required:true , trim: true},
	password: {type:String , required:true , trim: true},
	image: {type:String , trim: true , default: 'abeer\\uploaded\\15163358e05ad5ba82e65b9753ed41a5'},
	pptsUploaded: [{type: mongoose.Schema.Types.ObjectId , ref: Ppt}],
	pptsComminted: [{type: mongoose.Schema.Types.ObjectId , ref: Ppt}],
	pptsLikes: [{type: mongoose.Schema.Types.ObjectId , ref: Ppt}],
	//pptsRated: [{type: mongoose.Schema.Types.ObjectId , ref: Ppt}],
	rated: [subDocRated]
});

var User = mongoose.model('User' , userSchema);
exports.User = User;

/*******************************************************************************************************************************/


var commentSchema = new mongoose.Schema({
	content: {type:String , required:true , trim: true},
	user: {type: mongoose.Schema.Types.ObjectId , ref: User},
	date: { type: Date, default: Date.now , trim: true},
	replies: [{type: mongoose.Schema.Types.ObjectId , ref: Reply}],
	parentPpt: {type: mongoose.Schema.Types.ObjectId , ref: Ppt}
});

var Comment = mongoose.model('Comment' , commentSchema);
exports.Comment = Comment;

/********************************************************************************************************************************/


var replySchema = new mongoose.Schema({
	content: {type:String , required:true , trim: true},
	user: {type: mongoose.Schema.Types.ObjectId , ref: User},
	date: { type: Date, default: Date.now , trim: true},
	parentComment: {type: mongoose.Schema.Types.ObjectId , ref: Comment}
});

var Reply = mongoose.model('Reply' , replySchema);
exports.Reply = Reply;


/********************************************************************************************************************************/

