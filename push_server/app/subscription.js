var Subscription = function () {}

Subscription.prototype.subscribeTo = function (channel) {
  channel.subscribe(this)
  this.channels.push(channel)
}

Subscription.prototype.destroy = function () {
  this.destroyed = true
  this.channels.forEach(function (channel) {
    channel.unsubscribe(this)
  }, this)
}

Subscription.prototype.send = function (data) {
  if (!this.destroyed)
    try {
      this._send(data)
    } catch (err) {
      this.destroy()
      console.error('An error occured while sending: ' + err)
    }
}

module.exports = Subscription
