# faweibo

发微博

## Install

```shell
npm install faweibo puppeteer
```

## Usage

```JavaScript
puppeteer.launch().then(browser => {
    return browser.newPage()
}).then(page => {
    return faweibo(page, username, password, content, image)
})
```

## License

[The Unlicense](http://unlicense.org)
