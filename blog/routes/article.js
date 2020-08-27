var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var urlencode = require("urlencode");
var moment = require("moment");
require("moment/locale/zh-cn");
moment.locale("zh-cn");
var Article = require("../models/article.js");
var Tag = require("../models/tag.js");

//获取文章
router.get("/article", (req, res, next) => {
  var page = req.query.page;
  const pageSize = parseInt(req.query.num);
  var type = req.query.type;
  if (type == "get") {
    // const pageSize = 4;
    page = (page - 1) * pageSize;

    Article.find({})
      .skip(page)
      .limit(pageSize)
      .exec((findErr, findDoc) => {
        if (findDoc) {
          Article.countDocuments().exec((err, count) => {
            return res.json({
              code: 0,
              msg: "文章获取成功！",
              result: findDoc,
              count: count,
            });
          });
        } else {
          return res.json({
            code: 1,
            msg: "文章获取失败！",
            result: findErr,
          });
        }
      });
  } else if (type == "detail") {
    //获取文章详情
    var id = req.query.id;
    Article.find({
      _id: id
    }, (err, data) => {
      if (data) {
        res.json({
          code: 0,
          msg: "获取文章详情成功！",
          result: data,
        });
      } else {
        res.json({
          code: 1,
          msg: "获取文章详情失败！",
          result: err,
        });
      }
    });
  } else if (type == "history") {
    //获取所有文章
    Article.find({}, (allErr, allDoc) => {
      if (allDoc) {
        // console.log(res);
        return res.json({
          code: 0,
          msg: "文章获取成功！",
          result: allDoc,
        });
      } else {
        return res.json({
          code: 1,
          msg: "文章获取失败！",
          result: allErr,
        });
      }
    });
  }
});

//后台管理

//搜索文章
router.get("/search", (req, res, next) => {
  let search = req.query;
  var title = urlencode.decode(search.title, "utf-8");
  var category = urlencode.decode(search.category, "utf-8");
  var Title = new RegExp(title, "i"); //标题模糊查询
  console.log(title);
  let page = req.query.page;
  const pageSize = parseInt(req.query.num);
  page = (page - 1) * pageSize;
  if (search.title && search.category) {
    Article.find({
        category: category,
        $or: [{
          title: Title
        }]
      })
      .skip(page)
      .limit(pageSize)
      .exec((allErr, allDoc) => {
        if (allDoc) {
          res.json({
            code: 0,
            msg: "搜索成功！",
            result: allDoc,
            count: allDoc.length,
          });
        } else {
          res.json({
            code: 1,
            msg: "暂无该文章！",
            result: allErr,
          });
        }
      });
  }
  //标题搜索
  else if (search.title) {
    Article.find({
        $or: [{
          title: Title
        }]
      })
      .skip(page)
      .limit(pageSize)
      .exec((allErr, allDoc) => {
        if (allDoc) {
          res.json({
            code: 0,
            msg: "搜索成功！",
            result: allDoc,
            count: allDoc.length,
          });
        } else {
          res.json({
            code: 1,
            msg: "暂无该文章！",
            result: allErr,
          });
        }
      });
  }
  //分类搜索
  else if (search.category) {
    Article.find({
        category: category
      })
      .skip(page)
      .limit(pageSize)
      .exec((allErr, allDoc) => {
        if (allDoc) {
          res.json({
            code: 0,
            msg: "搜索成功！",
            result: allDoc,
            count: allDoc.length,
          });
        } else {
          res.json({
            code: 1,
            msg: "暂无该文章！",
            result: allErr,
          });
        }
      });
  }
});

//标签和分类管理

router.post("/tag", (req, res) => {
  let tag = req.body;
  // console.log(tag);
  //标签和分类修改
  if (tag._id) {
    Tag.updateOne({
        _id: tag._id
      }, {
        $set: {
          tagList: tag.tagList,
          categoryList: tag.categoryList
        }
      },
      (Uerr, Udoc) => {
        if (Udoc) {
          return res.json({
            code: 0,
            msg: "修改分类成功!",
            result: "",
          });
        } else {
          return res.json({
            code: 1,
            msg: "修改分类失败!",
            result: Uerr,
          });
        }
      }
    );
  } else {
    //第一次新增分类
    let tagList = {
      tagList: tag.tagList,
      categoryList: tag.categoryList,
    };
    Tag.create(tagList, (Terr, Tdoc) => {
      if (Tdoc) {
        return res.json({
          code: 0,
          msg: "添加分类成功!",
          result: "",
        });
      } else {
        return res.json({
          code: 1,
          msg: "添加分类失败!",
          result: Terr,
        });
      }
    });
  }
});

//标签和分类查询
router.get("/tag", (req, res) => {
  Tag.find({}, (Ferr, Fdoc) => {
    if (Fdoc) {
      //   console.log(Fdoc);
      let categoryList = Fdoc[0].categoryList;
      let numArr = [];
      categoryList.forEach((item) => {
        Article.find({
          category: item
        }, (err, doc) => {
          numArr.push(doc.length);
        });
      });
      //   console.log(numArr);
      setTimeout(function () {
        return res.json({
          code: 0,
          msg: "查询分类成功!",
          result: Fdoc,
          num: numArr,
        });
      }, 1000);
    } else {
      return res.json({
        code: 1,
        msg: "查询分类失败!",
        result: Ferr,
      });
    }
  });
});

//发布文章
router.post("/publish", (req, res, next) => {
  let article = req.body;
  var publishTime = moment().format("YYYY-MM-DD HH:mm:ss");
  // console.log(publishTime);
  article.publishTime = publishTime;
  article.likeNum = 0;
  article.reviewNum = 0;
  article.watchNum = 0;
  (article.updateTime = ""),
  Article.create(article, (Aerr, doc) => {
    if (Aerr) {
      return res.json({
        code: 0,
        msg: "发表成功!",
        result: "",
      });
    } else {
      return res.json({
        code: 1,
        msg: "发表失败!",
        result: Aerr,
      });
    }
  });
});

//编辑文章
router.post("/edit", (req, res, next) => {
  let article = req.body;
  var updateTime = moment().format("YYYY-MM-DD HH:mm:ss");
  article.updateTime = updateTime;
  Article.updateOne({
      _id: article._id
    }, {
      $set: article,
    },
    (Eerr, doc) => {
      if (Eerr) {
        return res.json({
          code: 0,
          msg: "编辑成功!",
          result: "",
        });
      } else {
        return res.json({
          code: 1,
          msg: "编辑失败!",
          result: Eerr,
        });
      }
    }
  );
});

module.exports = router;