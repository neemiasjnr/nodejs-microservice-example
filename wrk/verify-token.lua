
path  = "/verify-token"
wrk.method = "GET"
wrk.headers["x-api-key"] = "ABC123"
wrk.headers["authorization"] = "Bearer " -- put the token here

request = function()
   return wrk.format(nil, path)
end
