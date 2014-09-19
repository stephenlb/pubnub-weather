var http = require('http'),
    parseUrl = require('url').parse,
    EventEmitter = require('events').EventEmitter,
    util = require('util')

var Listener = function () {
  this.server = http.createServer(this.processRequest.bind(this))
}

util.inherits(Listener, EventEmitter)

Listener.Message = function (requestUrl, requestBody) {
  var parsedUrl = parseUrl(requestUrl)
  this.contents = requestBody
}

Listener.prototype.processRequest = function (request, response) {
  if (request.method === 'POST') {
    var listener = this
    request.on('close', function () {
      response.end()
    })
    request.on('readable', function () {
      var message = new Listener.Message(request.url, request.read().toString())
      listener.processMessage(message)
      response.end()
    })
  }
}

Listener.prototype.processMessage = function (message) {
  console.log(message)
  this.emit('message', message)
}

Listener.prototype.setup = function (port) {
  this.server.listen(port)
}

module.exports = Listener
