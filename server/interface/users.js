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
  return Passport.authenticate('local', function() {
    
  })
})
