var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

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

module.exports = router;
