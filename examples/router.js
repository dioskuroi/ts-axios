const express = require('express')

const router = express.Router()

router.get('/simple/get', (req, res) => {
  res.json({
    msg: 'Hello World'
  })
})

router.get('/base/get', (req, res) => {
  res.json(req.query)
})

router.post('/base/post', (req, res) => {
  res.json(req.body)
})

router.post('/base/buffer', (req, res) => {
  const msg = []
  req.on('data', chunk => {
    if (chunk) msg.push(chunk)
  })
  req.on('end', () => {
    const buf = Buffer.concat(msg)
    res.json(buf.toJSON())
  })
})

router.get('/error/get', (req, res) => {
  if (Math.random() > 0.5) {
    res.json({
      msg: 'Hello World'
    })
  } else {
    res.status(500)
    res.end()
  }
})

router.get('/error/timeout', (req, res) => {
  setTimeout(() => {
    res.json({
      msg: 'Hello World'
    })
  }, 3000)
})

router.post('/extend/post', (req, res) => {
  res.json(req.body)
})

router.put('/extend/put', (req, res) => {
  res.json(req.body)
})

router.patch('/extend/patch', (req, res) => {
  res.json(req.body)
})

router.get('/extend/get', (req, res) => {
  res.json({
    msg: 'hello world'
  })
})

router.delete('/extend/delete', (req, res) => {
  res.end()
})

router.head('/extend/head', (req, res) => {
  res.end()
})

router.options('/extend/options', (req, res) => {
  res.end()
})

router.get('/extend/user', (req, res) => {
  res.json({
    code: 0,
    message: 'ok',
    result: {
      name: 'jack',
      age: 18
    }
  })
})

router.get('/interceptor/get', (req, res) => {
  res.end('Hello')
})

module.exports = router
