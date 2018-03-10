const assert = require('assert')
const debug = require('debug')('faweibo')
const puppeteer = require('puppeteer')
const Koa = require('koa')
const mount = require('koa-mount')
const bodyparser = require('koa-bodyparser')

const isProduction = process.env.NODE_ENV === 'production'

const faweibo = module.exports = async (username, password) => {
  const browser = await puppeteer.launch({
    headless: isProduction,
    slowMo: isProduction ? 0 : 100,
    args: ['--incognito', '--no-sandbox', '--disable-setuid-sandbox']
  })

  const goto = async (page, url) => {
    debug('Go to', url)
    const response = await page.goto(url, {
      waitUntil: 'networkidle0'
    })
    assert.equal(response.url(), url)
    debug('Loaded', url)
  }

  const wait = async (page, url) => {
    const response = await page.waitForNavigation({
      waitUntil: 'domcontentloaded'
    })
    assert.equal(response.url(), url)
  }

  const page = await browser.newPage()
  await goto(page, 'https://passport.weibo.cn/signin/login')
  await page.waitForSelector('#loginName', {
    visible: true
  })
  await page.type('#loginName', username)
  await page.type('#loginPassword', password)
  await page.click('#loginAction')
  debug('Will Login')
  await wait(page, 'https://m.weibo.cn/')
  debug('Logged in')
  await page.close()

  return async context => {
    const content = context.request.body.content
    const page = await browser.newPage()
    await goto(page, 'https://m.weibo.cn/compose')
    await page.waitForSelector('textarea', {
      visible: true
    })
    await page.type('textarea', content)
    await page.click('.m-send-btn')
    debug('Will send', content)
    await wait(page, 'https://m.weibo.cn/')
    debug('Sent', content)
    await page.close()
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
