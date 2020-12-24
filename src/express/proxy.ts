const http = require('http')
const url = require('url')
const port = 80

const storePort = 544;
const productPort = 543;

const storeDomain = "localhost";

const proxy = http.createServer( (req, res) => {
  const path = req.url;
  const { method, headers } = req
  const hostname = headers.host.split(':')[0].replace('www.', '')

  let forwardPort = (storeDomain == hostname) ? storePort : productPort;

  const proxiedRequest = http.request({
    hostname,
    path,
    port: forwardPort,
    method,
    headers 
  })

  proxiedRequest.on('response', remoteRes => {
    res.writeHead(remoteRes.statusCode, remoteRes.headers)  
    remoteRes.pipe(res)
  })
  proxiedRequest.on('error', () => {
    res.writeHead(500)
    res.end()
  })

  req.pipe(proxiedRequest)
})

export function init() {
  proxy.listen(port, () => {
    console.log(`reverse proxy listening on port ${port}`)
  })
}
