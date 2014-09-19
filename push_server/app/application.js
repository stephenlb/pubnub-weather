process.title = 'demo-push-server'

var config = require('../config/config'),
    eventsource = require('./eventsource'),
    websocket = require('./websocket'),
    Channel = require('./channel')

var channels = {
  'pubnub-weather': new Channel('pubnub-weather')
}

var main = function (subscription) {
  subscription.onsubscribe(function (details) {
    var channel = Channel.getByName(details.channel)
    subscription.subscribeTo(channel)
  })
}

eventsource.createServer(main).listen(config.eventsource.port)
websocket.createServer(main, config.websocket)

var Listener = require('./listener'),
    listener = new Listener

listener.on('message', function (data) {
  var message = JSON.parse(data.contents)
  var channel = channels[message.channel]
  channel.broadcast(data.contents)
})

listener.setup(config.listener.port)

process.on('uncaughtException', function (err) {
  console.error((new Date).toUTCString() + ' uncaughtException:', err.message)
  console.error(err.stack)
  process.exit(1)
})

var exitHandler = function(){
  process.exit(0)
}

;['SIGINT', 'SIGTERM'].forEach(function(signal){
  process.on(signal, exitHandler);
})

