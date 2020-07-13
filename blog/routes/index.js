var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/test', (req,res,next) =>{

	res.json({
		msg:'测试'
	})
})

module.exports = router;
