require 'pubnub'

class PubnubListener

  CONFIG = ::Psych.load_file "#{::Rails.root}/config/pubnub.yml"

  @pubnub = Pubnub.new(
    :subscribe_key => CONFIG['weather_key']
  )

  WEATHER_CHANNEL = 'pubnub-weather'

  class << self
    attr_reader :subscribed

    def subscribe channel = WEATHER_CHANNEL, &block
      @pubnub.subscribe :channel  => channel, &block
    end

    def unsubscribe channel = WEATHER_CHANNEL, &block
      @pubnub.unsubscribe :channel  => channel, &block
    end

  end

end
