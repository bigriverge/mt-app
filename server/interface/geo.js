import Router from 'koa-router'
import axios from './utils/axios'
import Province from '../dbs/models/province'
import City from '../dbs/models/cities'
import Menu from '../dbs/models/menus'

//接口前缀
let router = new Router({
  prefix: '/geo'
})

router.get('/getPosition', async (ctx) => {
  let {
    status,
    data: {
      province,
      city
    },
  } = await axios.get(`http://cp-tools.cn/geo/getPosition`)

  if(status === 200) {
    ctx.body = {
      province,
      city
    }
  }else {
    ctx.body = {
      province: '',
      city: ''
    }
  }
})

router.get('/menu', async (ctx) => {
  //操作本地数据库 本地数据库数据不完整
  const result = await Menu.findOne()
  ctx.body = {
    menu: result.menu
  }

  // 第三方接口
  // let {
  //   status,
  //   data: {
  //     menu
  //   },
  // } = await axios.get('http://cp-tools.cn/geo/menu')

  // if(status === 200) {
  //   ctx.body = {
  //     menu
  //   }
  // }else {
  //   menu: []
  // }
})

router.get('/city', async (ctx) => {
  // let city = []
  // let result = await City.find()
  // result.forEach( item => {
  //   city = city.concat(item.value)
  // })

  // ctx.body = {
  //   code: 0,
  //   city: city.map( item => {
  //     return {
  //       province: item.province,
  //       id: item.id,
  //       name: item.name === '市辖区' || item.name === '省直辖县级行政区划' ? item.province : item.name
  //     }
  //   })
  // }

  let {
    status,
    data: {
      city
    }
  } = await axios.get('http://cp-tools.cn/geo/city')

  if(status === 200) {
    ctx.body = {
      city
    }
  }else {
    ctx.body = {
      city: []
    }
  }

})

router.get('/province', async (ctx) => {
  //let province = await Province.find()

  // ctx.body = {
  //   province: province.map(item => {
  //     return {
  //       id: item.id,
  //       name: item.value[0]
  //     }
  //   })
  // }

  let {
    status,
    data: {
      province
    }
  } = await axios.get('http://cp-tools.cn/geo/province')

  if(status === 200) {
    ctx.body = {
      province
    }
  }else {
    ctx.body = {
      province: []
    }
  }

})

router.get('/province/:id', async (ctx) => {
  let {
    status,
    data: {
      city
    }
  } = await axios.get(`http://cp-tools.cn/geo/province/${ctx.params.id}`)

  if(status === 200) {
    ctx.body = {
      city
    }
  }else {
    ctx.body = {
      city: []
    }
  }

})

router.get('/hotCity', async (ctx) => {
  let {
    status,
    data: {
      hots
    }
  } = await axios.get('http://cp-tools.cn/geo/hotCity')

  if(status === 200) {
    ctx.body = {
      hots
    }
  }else {
    ctx.body = {
      hots: []
    }
  }

})

export default router
