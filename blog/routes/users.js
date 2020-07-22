var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var emailSend = require('../utils/sendMail.js');
var User = require('../models/user.js');
var JWT = require('../utils/jsonwebtoken.js');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


//type=0 为管理员
//type=1 为普通用户
router.post('/adminLogin',(req,res,next)=>{
	var info = req.body;
	//用户注册
	
	if(info.mail){
		info.type = 1;
		User.create(info,(inErr,inDoc)=>{
			if(inDoc){
				//注册成功，生成token传回前端
				let token = JWT.creatToken({
					user:info.user,
					login:true
				});
				return res.json({
					code:0,
					msg:'登录成功！',
					result:	info,
					token:token
				});	
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
			 // console.log(loginDoc);
			if(loginDoc){
				if(loginDoc.pwd == info.pwd){
					//登录成功，生成token传回前端
					let token = JWT.creatToken({
						user:info.user,
						login:true
					});
					return res.json({
						code:0,
						msg:'登录成功！',
						result:	loginDoc,
						token:token
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

//验证token是否有效
router.post('/validToken',(req,res)=>{
	var token = req.body.token;
	JWT.verifyToken(token)
	.then(data=>{
		console.log(data);
		return res.json({
			code:0,
			msg:'token有效',
		})
	})
	.catch(err=>{
		console.log(err);
		if(err.name === 'TokenExpiredError'){
			return res.json({
				code:1,
				msg:'token已过期,请重新登录!'
			})
		}else{
			return res.json({
				code:2,
				msg:'非法的token!'
			})
		}
	})
})


//用户注册登陆
router.post('/login',(req,res,next)=>{
	var info = req.body;
})
module.exports = router;
