var nodemailer = require("nodemailer");

async function send(mail,code){
	//发送者内容
	let transporter = nodemailer.createTransport({
		host:'smtp.qq.com',
		port:465,
		secure:true,
		auth:{
			user:"shixian.mail@qq.com",
			pass:'ntckaqhiutngbigf'
		}
	});
	
	//邮件内容
	let emailDetail = {
		from:'"shixian" <shixian.mail@qq.com>',
		to:mail,
		subject:'一条博客注册验证码待查看！',
		text:`这位小哥哥or小姐姐,你的博客注册验证码为: 【${code}】,打不死再告诉别人噢~`
	};
	
	//发送邮件
	await transporter.sendMail(emailDetail,(err,res)=>{
		return new Promise((resolve,reject)=>{
			if(!err){
				resolve('验证码发送成功!')
			}else{
				reject('验证码发送失败!')
			}
		})
	})
}

module.exports = send;