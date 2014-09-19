PubnubListener.subscribe do |envelope|
  puts 'asdf'
  if envelope.message
    Notifier.notify PubnubListener::WEATHER_CHANNEL, envelope.message
  end
end
