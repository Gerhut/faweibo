const { goto, wait } = require('./utils')

module.exports = async (browser, content) => {
  const page = await browser.newPage()
  await goto(page, 'https://m.weibo.cn/compose')
  await page.waitForSelector('textarea', {
    visible: true
  })
  await page.type('textarea', content)
  page.click('.m-send-btn')
  await wait(page, 'https://m.weibo.cn/')
  await page.close()
}
