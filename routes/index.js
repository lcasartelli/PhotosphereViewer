
var easyimg = 	require('easyimage');
var mongoose = 	require('mongoose');
var fs = 		require('fs');

//The complete path id PUBLIC_PATH + *_PATH
var PUBLIC_PATH = "./public"
var IMAGES_PATH = "/uploads/images/";
var THUMBNAILS_PATH = "/uploads/images/thumbnails/";

var THUMB_WIDTH = 	128;
var THUMB_HEIGHT = 	128;


var db = mongoose.createConnection('mongodb://localhost/database', 
									function(err) { if(err) throw err; });		//MongoDB init
	
var PhotoSchema_def = {											//Schema structure
    titolo: 		String,
    descrizione: 	String,
    path: 			String,
    filename: 		String,
    thumbnail: 		String
};
var photoSchema = new mongoose.Schema(PhotoSchema_def);
var Photo = db.model('Photo', photoSchema);						//Instance use for all queries

exports.index = function(req, res){

	//Prende dal db tutte le istanze di Photo e processa il template

	Photo.find().exec(function (err, results) {
  							if (err) 
  								throw err;

  							res.render('index', { title: 'Home',photos: results});
	});	
};

exports.viewer = function(req, res) {

	//Ottiene partendo dall'id l'istanza di Photo corrispondente e processa il template

	var photo = Photo.findById(req.params.id).exec(function(err, result) {
			
				if (err) 
					throw err;
		
  				photo ? res.render('detail', { title:result.titolo, descrizione:result.descrizione, image:result.path}) : res.render('404');
	});
};


exports.upload = function(req, res) {

	fs.readFile(req.files.image.path, function (err, data) {			//Salva dalla cartella temporanea a /uploads/images l'immagine caricata

			fs.writeFile(PUBLIC_PATH+IMAGES_PATH+req.files.image.name, data, function (err) {
				if(err)	throw err;
 			});
	});

	function save() {
		
		//Memorizza del db foto e metadati associati

		var saved_image = new Photo({titolo: req.body.titolo, descrizione:req.body.descr, path: IMAGES_PATH+req.files.image.name, filename:req.files.image.name, thumbnail: THUMBNAILS_PATH+req.files.image.name});
		saved_image.save(function (err) {
  					if (err) return handleError(err);
		});
	}

	easyimg.thumbnail(
		{
			//Creazione thumbnail
			
			src: PUBLIC_PATH+IMAGES_PATH+req.files.image.name, dst:PUBLIC_PATH+THUMBNAILS_PATH+req.files.image.name,
			width:THUMB_WIDTH, height:THUMB_HEIGHT,
			x:0, y:0
		},
		function(err, image) {
			if (err) 
				throw err;

			console.log('Thumbnail created');
			console.log(image);
	
			save();

			res.redirect('/');
		}
	);
};

exports.add = function(req, res) {
	
	res.render('add', { title:"Carica immagine"});
};
