var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var User = require('../models/user.js')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// 管理员登录
router.post('/adminLogin',(req,res,next)=>{
	var userName = req.body.user,
		password = req.body.pwd;
	User.findOne({userName:userName},(loginErr,loginDoc)=>{
		// console.log(loginDoc);
		if(loginDoc){
			if(loginDoc.password == password){
				return res.json({
					code:0,
					msg:'登录成功！',
					result:	''
				});
				
			}else{
				return res.json({
					code:1,
					msg:'密码错误,请重试！',
					result:''	
				})
			}
		}
	})
	
})

module.exports = router;
