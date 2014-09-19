require 'httparty'

module Notifier

  class << self

    def notify channel, message
      request Hash[channel: channel, message: message].to_json
    end

    private

    CONFIG = ::Psych.load_file "#{::Rails.root}/config/push_server.yml"

    HOST_WITH_PORT = "http://#{CONFIG['host']}:#{CONFIG['port']}"

    REQUEST_TIMEOUT = 1

    def request_url
      "#{HOST_WITH_PORT}"
    end

    def request message
      ::HTTParty.post request_url, body: message, timeout: REQUEST_TIMEOUT
    rescue ::Exception => error
      logger = ::Rails.logger
      logger.error "Tried to send message to push server but: #{error.inspect}"
    end

  end

end
