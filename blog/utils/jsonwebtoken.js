var JWT = require("jsonwebtoken");
var secret = 'jianmnbvcxzasdfghjklpoiuytrewq';//随便设置一个私钥

function creatToken(Payload){//生成token
	return JWT.sign(Payload,secret,{expiresIn:'2h'})
}

function verifyToken(token){
	return new Promise ((resolve,reject)=>{
		JWT.verify(token,secret,(err,data)=>{
			if(err)reject({
				code:1,
				msg:'无效的token'
			});
			else resolve({
				code:0,
				token:data
			})
		})
	})
}

module.exports = {creatToken,verifyToken}