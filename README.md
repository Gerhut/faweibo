# faweibo

发微博

# Usage

配置环境变量（有 dotenv）

- `PORT` 端口号
- `WEIBO_USERNAME` 微博用户名
- `WEIBO_PASSWORD` 微博密码
- `URL_PREFIX` 可选，URL 前缀

    POST /{{URL_PREFIX}} HTTP/1.1

    Content-Type: application/json

    { "content": "泰斯特" }

# License

[The Unlicense](http://unlicense.org)
