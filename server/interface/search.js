import Router from 'koa-router'
import axios from './utils/axios'
import Poi from '../dbs/models/pois'

let router = new Router({prefix: '/search'})

router.get('/top', async (ctx) => {

  let {
    status,
    data: {
      top
    }
  } = await axios.get('http://cp-tools.cn/search/top', {
    params: {
      input: ctx.query.input,
      city: ctx.query.city
    }
  })

  ctx.body = {
    top: status === 200 ? top : []
  }

})

router.get('/hotPlace', async (ctx) => {
  let city = ctx.store ? ctx.store.geo.position.city : ctx.query.city
  console.log(ctx.store, city)
  let {
    status,
    data: {
      result
    } ,
  } = await axios.get('http://cp-tools.cn/search/hotPlace', {
      params: {
        city
      }
    })

  ctx.body = {
    result: status === 200 ? result : []
  }

})

export default router
