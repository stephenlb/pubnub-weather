var WsServer = require('websocket').server,
    util = require('util'),
    http = require("http")

var Subscription = function (socket) {
  this.socket = socket
  this.channels = []
  var _this = this
  socket.on('close', function () {
    _this.destroy()
  })
}

util.inherits(Subscription, require('./subscription'))

Subscription.prototype._send = function (data) {
  if(this.socket.connected)
    this.socket.sendUTF(data)
}

Subscription.prototype.onsubscribe = function (callback) {
  var self = this
  this.socket.on('message', function (data) {
    if(data.type === "utf8"){
      data = data.utf8Data
      var json = JSON.parse(data)
      self.nickname = json.name
      callback(json)
    }
  })
}

exports.createServer = function (callback, options) {
  var httpServer = http.createServer(function(request, response) {
    response.end()
  })

  httpServer.listen(options.port, function() {
    console.log((new Date()) + " Server is listening on port " + options.port)
  })

  var wsServer = new WsServer({
    httpServer: httpServer
  })

  wsServer.on('request', function (request) {
    var connection = request.accept(null, request.origin)
    callback(new Subscription(connection))
  })
  return wsServer
}
