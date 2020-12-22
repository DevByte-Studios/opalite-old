const http = require('http')
const url = require('url')
const port = 80
const sites = {
  localhost: 544,
  other: 543
}

const proxy = http.createServer( (req, res) => {
  // const { pathname: path } = url.parse(req.url)
  const path = req.url;
  const { method, headers } = req
  const hostname = headers.host.split(':')[0].replace('www.', '')
  if (!sites.hasOwnProperty(hostname)) throw new Error(`invalid hostname ${hostname}`)

  const proxiedRequest = http.request({
    hostname,
    path,
    port: sites[hostname],
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
