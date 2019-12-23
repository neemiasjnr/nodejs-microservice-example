
path  = "/create-token"
wrk.method = "POST"
wrk.headers["Content-Type"] = "application/json"
wrk.headers["x-api-key"] = "ABC123"
wrk.body = '{"userId": "user123","countryCode":"DE","deviceId": "device123","ipAddress": "192.168.0.2","userAgent": "PS1"}'

request = function()
   return wrk.format(nil, path)
end
