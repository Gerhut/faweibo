const axios = require('axios')
const debug = require('debug')('faweibo')
const Koa = require('koa')
const Router = require('koa-router')
const bodyparser = require('koa-bodyparser')
const querystring = require('querystring');


const weibo = axios.create({
  baseURL: 'https://api.weibo.com/2',
  params: { access_token: process.env.WEIBO_ACCESS_TOKEN },
  maxRedirects: 0
})

const router = new Router()
router.get('/', async ({ response }) => {
  try {
    const { data } = await weibo.get('/account/rate_limit_status.json')
    response.body = data
  } catch (error) {
    debug(error)
    response.status = 500
    if (error.response) {
      response.body = error.response.data
    }
  }
})
router.post('/', bodyparser({
  enableTypes: [ 'text' ]
}), async ({ request, response }) => {
  try {
    const { data } = await weibo.post('statuses/share.json', querystring.stringify({
      status: request.body,
      rip: request.ip
    }))
    response.body = data
  } catch (error) {
    debug(error.config)
    response.status = 500
    if (error.response) {
      response.body = error.response.data
    }
  }
})

const app = module.exports = new Koa()
app.use(router.routes(), router.allowedMethods())

if (require.main === module) {
  app.listen(process.env.PORT)
}
