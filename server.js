const express = require('express')
const app = express()
const http = require('http')

const port = process.env.PORT || 3000
let result = {
  'response':'Hello World!',
  'status' : 'Alles OK!'
}

const server = http.createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'appliaction/json')
  res.end(JSON.stringify(result))
})

server.listen(port, () => {
  console.log(`Server running at http://:${port}/`)
})