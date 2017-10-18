const express = require('express')
const app = express()

app.get('/', function (req, res) {
  res.sendFile(__dirname +'/basic.html')
})

app.listen(3001, function () {
  console.log('Example app listening on port 3001!')
})