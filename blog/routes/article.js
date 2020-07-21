var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var urlencode = require('urlencode');
var moment = require('moment');
require('moment/locale/zh-cn')
moment.locale('zh-cn'); 
var Article = require('../models/article.js')


//获取文章
router.get('/article', (req, res, next) => {
	var page = req.query.page;
	if(req.query.page){
		const pageSize = 4;
		page = (page - 1) * pageSize;
		
		Article.find({}).skip(page).limit(pageSize).exec((findErr, findDoc) => {
			if (findDoc) {
				Article.countDocuments().exec((err, count) => {
					return res.json({
						code: 0,
						msg: '文章获取成功！',
						result: findDoc,
						count: count,
					})
				});
		
			} else {
				return res.json({
					code: 1,
					msg: '文章获取失败！',
					result: findErr,
				})
			}
		})
	}else{
		//获取文章详情
		var id = req.query.id;
		Article.find({_id: id}, (err,data)=>{
			if(data){
				res.json({
					code:0,
					msg:'获取文章详情成功！',
					result:data
				})
			}else{
				res.json({
					code:1,
					msg:'获取文章详情失败！',
					result:err
				})
			}
		})
	}
	
})

//搜索文章
router.get('/search',(req,res,next)=>{
	let search = req.query;
	var title = urlencode.decode(search.title, 'utf-8');
	var Title= new RegExp(title, 'i');//标题模糊查询
	console.log(title);
	let page = req.query.page;
	const pageSize = 4;
	page = (page - 1) * pageSize;
	if(search.title && search.category){
		Article.find({category:search.category,$or:[{title:Title}]}).skip(page).limit(pageSize).exec((allErr,allDoc)=>{
			if(allDoc){
				res.json({
					code:0,
					msg:'搜索成功！',
					result:allDoc,
					count: allDoc.length,
				});
			}else{
				res.json({
					code:1,
					msg:'暂无该文章！',
					result:allErr
				})
			}
		})
	}
	//标题搜索
	else if(search.title){
		Article.find({$or:[{title:Title}]}).skip(page).limit(pageSize).exec((allErr,allDoc)=>{
			if(allDoc){
				res.json({
					code:0,
					msg:'搜索成功！',
					result:allDoc,
					count: allDoc.length,
				});
			}else{
				res.json({
					code:1,
					msg:'暂无该文章！',
					result:allErr
				})
			}
		})
	}
	//分类搜索
	else if(search.category){
		Article.find({category:search.category}).skip(page).limit(pageSize).exec((allErr,allDoc)=>{
			if(allDoc){
				res.json({
					code:0,
					msg:'搜索成功！',
					result:allDoc,
					count: allDoc.length,
				});
			}else{
				res.json({
					code:1,
					msg:'暂无该文章！',
					result:allErr
				})
			}
		})
	}
})

//发布文章
router.post('/publish',(req,res,next)=>{
	let article = req.body;
	var publishTime = moment().format('YYYY-MM-DD HH:mm:ss');
	// console.log(publishTime);
	article.publishTime = publishTime;
	article.likeNum = 0;
	article.reviewNum = 0;
	article.watchNum = 0;
	article.updateTime = '',
	Article.create(article,(Aerr,doc)=>{
		if(Aerr){
			return res.json({
				code:0,
				msg:'发表成功!',
				result:''
			})
		}else{
			return res.json({
				code:1,
				msg:'发表失败!',
				result:Aerr
			})
		}
	})
})


//编辑文章
router.post('/edit',(req,res,next)=>{
	let article = req.body;
	var updateTime = moment().format('YYYY-MM-DD HH:mm:ss');
	article.updateTime = updateTime;
	Article.updateOne({_id:article._id},{
		$set:article,
		},(Eerr,doc)=>{
		if(Eerr){
			return res.json({
				code:0,
				msg:'编辑成功!',
				result:''
			})
		}else{
			return res.json({
				code:1,
				msg:'编辑失败!',
				result:Eerr
			})
		}
	})
})

module.exports = router;
