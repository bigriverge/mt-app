import Koa from 'koa'
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')

import mongoose from 'mongoose'
import bodyParser from 'koa-bodyparser'
import session from 'koa-generic-session'
import Redis from 'koa-redis'
import json from 'koa-json'
import Config from './dbs/config'
import passport from './interface/utils/passport'
import users from './interface/users'

//import proxy from 'koa-better-http-proxy'

const app = new Koa()

const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000

app.keys = ['mt', 'keyskeys']
app.proxy = true
app.use(session({
  key: 'mt',
  prefix: 'mt:uid',
  store: new Redis()   //session 借助redis存储
}))
app.use(bodyParser({
  extendTypes: ['json', 'form', 'text']
}))

app.use(json())

// 连接数据库
mongoose.connect(Config.dbs, {
  useNewUrlParser: true
})

app.use(passport.initialize())
app.use(passport.session())

// app.use(proxy('/register', {
//   target: 'http://127.0.0.1:3000',
//   changeOrigin: true
// }))

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = app.env !== 'production'

async function start () {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)

  // const {
  //   host = process.env.HOST || '127.0.0.1',
  //   port = process.env.PORT || 3000
  // } = nuxt.options.server

  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  app.use(users.routes()).use(users.allowedMethods())

  app.use((ctx) => {
    ctx.status = 200
    ctx.respond = false // Bypass Koa's built-in response handling
    ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    nuxt.render(ctx.req, ctx.res)
  })

  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

start()


// 启动redis服务
// redis-server
// 遇到问题:
// Creating Server TCP listening socket *:6379: bind: Address already in use
// 解决方法:
// 1. ps -ef | grep -i redis 查找redis-server进程
// 2. kill -9 进程ID

// 启动mongodb
// mongod
