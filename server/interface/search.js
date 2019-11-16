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

export default router
