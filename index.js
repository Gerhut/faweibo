/**
 * 延迟返回内容
 * @template T
 * @param {number} ms 延迟毫秒数
 * @param {T} [value] Promise 返回内容
 * @returns {Promise<T>}
 */
function delay (ms, value) {
  return new Promise(resolve => setTimeout(resolve, ms, value))
}

/**
 * 发微博
 * @param {import('puppeteer').Page} page Puppeteer 页面
 * @param {string} username 用户名
 * @param {string} password 密码
 * @param {string} content 微博内容
 * @param {string} [image] 图片路径
 */
module.exports = async function faweibo (page, username, password, content, image) {
  await page.goto('https://weibo.cn/')

  if (await page.$('[name="composer"]') === null) {
    await Promise.all([
      page.waitForNavigation(),
      page.click('.ut a:first-child')
    ])
    await delay(1000)

    await page.waitForSelector('#loginName')
    await page.type('#loginName', username)
    await page.type('#loginPassword', password)

    await Promise.all([
      page.waitForNavigation(),
      page.click('#loginAction')
    ])
  }

  await Promise.all([
    page.waitForNavigation(),
    page.click('[name="composer"]')
  ])

  await page.type('[name="content"]', content)

  if (image !== undefined) {
    const [fileChooser] = await Promise.all([
      page.waitForFileChooser(),
      page.click('[name="pic"]')
    ])
    await fileChooser.accept([image])
  }

  await Promise.all([
    page.waitForNavigation(),
    page.click('[value="发布"]')
  ])
}
