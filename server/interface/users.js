// 需求分析
// users/signin
// users/singup
// users/exit
// users/verify
// users/getUser

import Router from 'koa-router'
import Redis from 'koa-redis'
import nodeMailer from 'nodemailer'

import Users from '../dbs/models/users'
import Passport from  './utils/passport'
import axios from './utils/axios'
import Config from '../dbs/config'

//接口前缀
let router = new Router({
  prefix: '/users'
})
//Redis 客户端
let Store = new Redis().client

//注册
router.post('/signup', async (ctx) => {
  const {
    username,
    password,
    email,
    code
  } = ctx.request.body

  if(code) {
    const saveCode = await Store.hget(`nodemail:${username}`, 'code')
    const saveExpire = await Store.hget(`nodemail:${username}`, 'expire')
    if(code === saveCode) {
      if(new Date().getTime() - saveExpire > 0) {
        ctx.body = {
          code: -1,
          msg: '验证码已过期,请重新尝试'
        }
        return false
      }
    }else {
      ctx.body = {
        code: -2,
        msg: '验证码不正确,请填写正确的验证码'
      }
      //return false
    }
  }else {
    ctx,body = {
      code: -3,
      msg: '请填写验证码'
    }
    //return false
  }

  // username password
  let user = await Users.find({
    username
  })

  if(user.length > 0) {
    ctx.body = {
      code: -4,
      msg: '该用户名已被注册'
    }
    return false
  }

  let nuser = await Users.create({
    username,
    password,
    email
  })

  if(nuser) {
    //注册成功 自动登录
    let res = await axios.post('/users/signin', {
      username,
      password
    })

    if(res.data && res.data.code === 0) {
      ctx.body = {
        code: 0,
        msg: '登录成功',
        user: res.data.user
      }
    }else{
      ctx.body = {
        code: -5,
        msg: '登录失败'
      }
    }
  }else{
    ctx.body = {
      code: -6,
      msg: '注册失败'
    }
  }

})

//登录
router.post('/signin', async (ctx, next) => {
  return Passport.authenticate('local', function(err, user, info, status) {
    if(err) {
      ctx.body = {
        code: -1,
        msg: err
      }
    }else{
      if(user) {
        ctx.body = {
          code: 0,
          msg: '登录成功',
          user
        }

        return ctx.login(user)
      }else{
        ctx.body = {
          code: 1,
          msg: info
        }
      }
    }
  })(ctx, next)
})

router.post('/verify', async (ctx, next) => {
  let username = ctx.request.bodyname.username
  const saveExpire = await Store.hget(`nodemail:${username}`, 'expire')
  if(saveExpire && new Date().getTime() - saveExpire < 0) {
    ctx.body = {
      code: -7,
      msg: '验证码请求过于频繁,1分钟1次'
    }
    return false
  }

  // email 发送信息
  let transport = nodeMailer.createTransport({
    host: Config.smtp.host,
    port: 587,
    secure: false,
    auth: {
      user: Config.smtp.user,
      pass: Config.smtp.pass
    }
  })

  // email 接收信息  (用户)
  let ko = {
    code: Config.smtp.code()
    expire: Config.smtp.expire()
    email: ctx.request.body.email,
    user: ctx.request.body.request
  }

  // email 内容
  let mailOptions = {
    from: `"认证邮件"<${Config.smtp.user}>`,
    to: ko.email,
    subject: '<慕课网高仿美团>注册码',
    html: `您在<慕课网高仿美团>课程中注册, 您的邀请码是${ko.code}`
  }

  await transport.sendMail(mailOptions, (error, info) => {
    if(error) {
      return console.log('error')
    }else{
      Store.hmset(`nodemail:${ko.user}`, 'code', ko.code, 'expire', ko.expire, 'email', 'ko.email')
    }
  })

  ctx.body = {
    code: 0,
    msg: '验证码已发送,可能会有延时,有效期1分钟'
  }

})

router.get('/exit', async (ctx, next) => {
  await ctx.logout()
  if(!ctx.isAuthenticated()) {
    ctx.body = {
      code: 0
    }
  }else{
    code: -8
  }
})

router.get('/getUser', async (ctx) => {
  //检查是不是登录状态
  if(ctx.isAuthenticated()) {
    const {username, email} = ctx.session.passport.user
    ctx.body = {
      user: username,
      email
    }
  }else{
    ctx.body = {
      user: '',
      email: ''
    }
  }
})

export default router
