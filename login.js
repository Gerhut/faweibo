const puppeteer = require('puppeteer')

const { goto, wait } = require('./utils')

const isProduction = process.env.NODE_ENV === 'production'

module.exports = async (username, password) => {
  const browser = await puppeteer.launch({
    headless: isProduction,
    slowMo: isProduction ? 0 : 100,
    args: ['--incognito', '--no-sandbox', '--disable-setuid-sandbox']
  })

  const page = await browser.newPage()
  await goto(page, 'https://passport.weibo.cn/signin/login')
  await page.waitForSelector('#loginName', {
    visible: true
  })
  await page.type('#loginName', username)
  await page.type('#loginPassword', password)
  page.click('#loginAction')
  await wait(page, 'https://m.weibo.cn/')
  await page.close()

  return browser
}
