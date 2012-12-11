

var easyimg = 	require('easyimage');
var mongoose = 	require('mongoose');
var fs = 		require('fs');

//The complete path id PUBLIC_PATH + *_PATH
var PUBLIC_PATH = "./public"
var IMAGES_PATH = "/uploads/images/";
var THUMBNAILS_PATH = "/uploads/images/thumbnails/";

var THUMB_WIDTH = 	128;
var THUMB_HEIGHT = 	128;

//MongoDB init	
var db = mongoose.createConnection('mongodb://localhost/database', 
									function(err) { if(err) throw err; });		
//Schema structure
var PhotoSchema_def = {											
    titolo: 		String,
    descrizione: 	String,
    path: 			String,
    filename: 		String,
    thumbnail: 		String
};
var photoSchema = new mongoose.Schema(PhotoSchema_def);
var Photo = db.model('Photo', photoSchema);				//Instance use for all queries
	

//Prende dal db tutte le istanze di Photo e processa il template
exports.index = function (req, res){						

	//Immagini a blocchi di 5

	var parseResult = function parseResult (obj) {

		var i = 0, j = 0, pos = 0;
		var formatted_result = [];

		for(i=0; i<obj.length; i+=5) {

			formatted_result[pos] = [];

			for(j = 0; (j<5 && (j+i)<obj.length); ++j) {

				if (obj[i+j] == undefined || !(obj[i+j])) {

					break;
				}	

				formatted_result[pos][j] = obj[i+j];
			}

			pos += 1;
		}

		console.log(formatted_result);

		return formatted_result;
	}


	Photo.find().exec( function (err, results) {
  							if (err) {

  								throw err;
  							}

  							res.render('index', { title: 'Home', photos_container: parseResult(results)});
	});	
};


//Ottiene partendo dall'id l'istanza di Photo corrispondente e processa il template
exports.viewer = function(req, res) {						
	

	var photo = Photo.findById(req.params.id).exec(function(err, result) {
			
				if (err) {

					throw err;
				}
		
  				photo ? res.render('detail', { title:result.titolo, descrizione:result.descrizione, image:result.path}) : res.render('404');
	});
};


//Salva dalla cartella temporanea a /uploads/images l'immagine caricata
exports.upload = function(req, res) {

    var newfilename = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    var timestamp = Math.round(+new Date()/1000);
    var ext = "";

    


    var generateStr = function generateStr () {

    	var i = 0;
    	var str = "";

    	for(i = 0; i < 5; ++i) {

    		str += possible.charAt(Math.floor(Math.random() * possible.length));
    	}

    	return str;

    }

    var findExtension = function findExtension () {

    	return /(?:\.([^.]+))?$/.exec(req.files.image.name)[1];
    }

    newfilename = generateStr() + timestamp + "." + findExtension();


	fs.readFile(req.files.image.path, function (err, data) {			

			fs.writeFile(PUBLIC_PATH+IMAGES_PATH+newfilename, data, function (err) {
				if(err)	{

					throw err;
				}
					
 			});
	});

	//Memorizza del db foto e metadati associati
	var save = function save() {	

		var saved_image = new Photo({titolo: req.body.titolo, descrizione:req.body.descr, path: IMAGES_PATH+newfilename, filename:newfilename, thumbnail: THUMBNAILS_PATH+newfilename});
		saved_image.save(function (err) {
  					if (err) {

  						return handleError(err);
  					}
		});
	}
	//Creazione thumbnail
		
	easyimg.thumbnail(
		{			
			src: PUBLIC_PATH+IMAGES_PATH+newfilename, dst:PUBLIC_PATH+THUMBNAILS_PATH+newfilename,
			width:THUMB_WIDTH, height:THUMB_HEIGHT,
			x:0, y:0
		},
		function(err, image) {
			if (err) {

				throw err;	
			}

			console.log('Thumbnail created');
			console.log(image);
	
			save();
			res.redirect('/');
		}
	);
};

exports.add = function (req, res) {
	
	res.render('add', { title:"Carica immagine"});
};
