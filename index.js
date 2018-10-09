const axios = require('axios')
const debug = require('debug')('faweibo')
const Koa = require('koa')
const Router = require('koa-router')
const bodyparser = require('koa-bodyparser')
const querystring = require('querystring');


const weibo = axios.create({
  baseURL: 'https://api.weibo.com/2',
  maxRedirects: 0
})

const router = new Router()
router.get('/:accessToken', async ({ params, response }) => {
  try {
    const { data } = await weibo.get('/account/rate_limit_status.json', {
      params: { access_token: params.accessToken }
    })
    response.body = data
  } catch (error) {
    debug(error)
    response.status = 500
    if (error.response) {
      response.body = error.response.data
    }
  }
})
router.post('/:accessToken', bodyparser({
  enableTypes: [ 'text' ]
}), async ({ params, request, response }) => {
  try {
    const { data } = await weibo.post('statuses/share.json', querystring.stringify({
      status: request.body,
      rip: request.ip
    }), {
      params: { access_token: params.accessToken }
    })
    response.body = data
  } catch (error) {
    debug(error)
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
