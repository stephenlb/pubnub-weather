var fs = require('fs'),
    Posix = require('posix-fork')

var pidPath = './tmp/server.pid',
    logPath = './log/application.log',
    logFile,
    daemonize = false

var i = 0
while (typeof process.argv[i] !== 'undefined') {
  if (process.argv[i] === '-p')
    pidPath = process.argv[i + 1]

  if (process.argv[i] === '-d') {
    process.argv.splice(i, 1)
    daemonize = true
  }

  if (process.argv[i] === '-l')
    logPath = process.argv[i + 1]

  i++
}

if (daemonize) {
  Posix.daemon()
  logFile = fs.createWriteStream(logPath, {flags: 'a'})
  process.__defineGetter__('stdout', function(){
    return logFile
  })
  process.__defineGetter__('stderr', function(){
    return logFile
  })
}

fs.writeFileSync(pidPath, Posix.getpid())
require('./app/application')
