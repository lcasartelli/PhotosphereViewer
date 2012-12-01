
/*
 * GET home page.
 */

var easyimg = require('easyimage');
var mongoose = require('mongoose');

// [WARNING] Change with correct dir for upload
var images_path = "/public/images/";
thumbnails_path = "/public/images/thumbnails";

var error = function(err) { 
				if(err)
				console.log(error);
};
var db = mongoose.createConnection('mongodb://localhost/database', error);

var PhotoSchema_def = {
    titolo: String,
    descrizione: String,
    path: String,
    filename: String,
    thumbnail: String
};
var photoSchema = new mongoose.Schema(PhotoSchema_def);
var Photo = db.model('Photo', photoSchema);

exports.index = function(req, res){

	var photos;

	var photos = Photo.find().exec(function (err, results) {
  										if (err) return handleError(err);
  										results = photos;
	});

	res.render('index', { title: 'Home',photos: photos});
};

exports.viewer = function(req, res) {
	
	res.render('detail', { title:titolo, descrizione:descrizione, image:image, thumbnail: thumbnail });
};


exports.save = function(req, res) {

	var filename;
	var titolo;
	var descrizione;
	var image = images_path+filename;
	var thumbnail = thumbnails_path+filename;

	function save() {
		
		var saved_image = new Photo({titolo:titolo,descrizione:descrizione,path:image,filename:filename, thumbnail: thumbnail});
		saved_image.save(function (err) {
  					if (err) return handleError(err);
		});
	}

	easyimg.thumbnail(
		{
			src: image, dst:thumbnail,
			width:128, height:128,
			x:0, y:0
		},
		function(err, image) {
			if (err) throw err;
			console.log('Thumbnail created');
			console.log(image);
			save();
		}
	);
};