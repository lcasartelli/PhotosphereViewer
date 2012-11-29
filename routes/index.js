
/*
 * GET home page.
 */

var easyimg = require('easyimage');


exports.index = function(req, res){

	/*var image_0 = "./public/images/img0.jpg";
	var image_0_thm = "./public/images/img0_thumb.jpg";

	easyimg.thumbnail(
		{
			src: image_0, dst:image_0_thm,
			width:128, height:128,
			x:0, y:0
		},
		function(err, image) {
			if (err) throw err;
			console.log('Thumbnail created');
			console.log(image);
		}
	);*/

	res.render('index', { title: 'Home' });
};

exports.viewer = function(req, res) {
	var pos = 0;
	//var image = "./public/images/img"+req.query.id+".jpg";
	var image = "/images/img"+pos+".jpg";

	res.render('detail', { title:'Detail', image:image });
};