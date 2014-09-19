var http = require('http'),
    parseUrl = require('url').parse,
    util = require('util')

var Subscription = function (request, response) {
  this.request = new Subscription.Request(request.url)
  this.response = response
  this.channels = []
  var _this = this
  var intervalId = setInterval(function () {
    _this.keepalive()
  }, 15000)
  response.on('close', function () {
    clearInterval(intervalId)
    response.end()
    _this.destroy()
  })
}

Subscription.Request = function (requestUrl) {
  var parsedUrl = parseUrl(requestUrl)
}

util.inherits(Subscription, require('./subscription'))

Subscription.prototype.keepalive = function () {
  this.response.write('\n\n')
}

Subscription.prototype._send = function (data) {
  this.response.write('data: ' + data + '\n\n')
}

Subscription.prototype.onsubscribe = function (callback) {
  callback('main_channel')
}

exports.createServer = function (callback) {
  return http.createServer(function (request, response) {
    response.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    })
    callback(new Subscription(request, response))
  })
}
