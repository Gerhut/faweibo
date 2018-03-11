const assert = require('assert')
const Koa = require('koa')
const mount = require('koa-mount')
const bodyparser = require('koa-bodyparser')

const login = require('./login')
const send = require('./send')

const faweibo = module.exports = async (username, password) => {
  const browser = login(username, password)

  return async context => {
    const content = context.request.body.content
    browser.then(browser => send(browser, content))
    context.status = 204
  }
}

const main = async () => {
  const username = process.env.WEIBO_USERNAME
  const password = process.env.WEIBO_PASSWORD

  assert(username, 'WEIBO_USERNAME environment variable is empty.')
  assert(password, 'WEIBO_PASSWORD environment variable is empty.')

  const app = module.exports = new Koa()
  app.use(bodyparser())
  app.use(mount('/' + (process.env.URL_PREFIX || ''), await faweibo(username, password)))

  app.listen(process.env.PORT)
}

if (require.main === module) {
  main().catch(error => {
    console.error(error)
    process.exit(1)
  })
}
