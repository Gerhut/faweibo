const assert = require('assert')
const debug = require('debug')('faweibo')

exports.goto = async (page, url) => {
  debug('Go to', url)
  const response = await page.goto(url, {
    waitUntil: 'networkidle0'
  })
  assert.equal(response.url(), url)
  debug('Loaded', url)
}

exports.wait = async (page, url) => {
  debug('Wati to', url)
  const response = await page.waitForNavigation({
    waitUntil: 'domcontentloaded'
  })
  assert.equal(response.url(), url)
  debug('Navigated', url)
}
