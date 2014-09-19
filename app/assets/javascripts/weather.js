var Weather = (function(){
    var Weather = function(nickname){
        this.$table = $('#weather_table')
        this.connectToServer();
    }

    var rowTemplate = "<tr><td>{{location}}</td>"+
                    "<td>{{temp_fahrenheit}}</td>"+
                    "<td>{{latitude}}</td>"+
                    "<td>{{longitude}}</td>"+
                    "<td>{{weather}}</td>"+
                    "<td>{{wind_direction}}</td>"+
                    "<td>{{weather_station}}</td>"+
                    "<td>{{elevation}}</td>"+
                    "<td>{{ultraviolet_level}}</td></tr>";

    Weather.prototype.newRow = function(data) {
        var raw = rowTemplate.replace(/\{\{(.+?)\}\}/g, function(matcher, variable, res){
            return data[variable];
        })
        this.$table.find('tbody').prepend($(raw));
    }

    Weather.prototype.pushData = function(data){
        this.newRow(data)
    }

    Weather.prototype.connectToServer = function() {
        var self = this
        setupPushServerConnection('pubnub-weather', function(json){
            if(json.message){
                self.pushData(json.message)
            }
        })
    }

    return Weather
})()
