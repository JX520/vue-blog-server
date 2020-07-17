var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var emailSend = require('../utils/sendMail.js');
var User = require('../models/user.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


//type=0 为管理员
//type=1 为普通用户
router.post('/adminLogin',(req,res,next)=>{
	var info = req.body;
	//用户注册
	info.type = 1;
	if(info.mail){
		User.create(info,(inErr,inDoc)=>{
			if(inDoc){
				return res.json({
					code:0,
					msg:'注册成功!',
					result:''
				})
			}else{
				return res.json({
					code:1,
					msg:'注册失败!',
					result:inErr
				})
			}
		})
	}else{
		// 管理员登录 
		User.findOne({user:info.user,type:0},(loginErr,loginDoc)=>{
			 console.log(loginDoc);
			if(loginDoc){
				if(loginDoc.pwd == info.pwd){
					return res.json({
						code:0,
						msg:'登录成功！',
						result:	''
					});	
				}else{
					return res.json({
						code:1,
						msg:'账号密码错误,请重试！',
						result:''	
					})
				}
			}else{
					return res.json({
						code:1,
						msg:'暂无该用户！',
						result:''	
					})
			}
		})
	}
	
	
})

//发送邮件
router.post('/sendEmail',(req,res)=>{
	var email = req.body.email;
	var code = parseInt(Math.random() * 9999);
	emailSend(email,code)
	.then((result)=>{
		return res.json({
			code:0,
			result:code,
			msg:result
		})
	})
	.catch((err)=>{
		return res.json({
			code:1,
			msg:err
		})
	})
})


//用户注册登陆
router.post('/login',(req,res,next)=>{
	var info = req.body;
})
module.exports = router;
