const express = require('express')
const atob = require('atob')

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

router.post('/config/post', (req, res) => {
  res.json(req.body)
})

router.post('/transform/post', (req, res) => {
  res.json(req.body)
})

router.get('/cancel/get', (req, res) => {
  setTimeout(() => {
    res.json(req.query)
  }, 1000)
})

router.post('/cancel/post', (req, res) => {
  setTimeout(() => {
    res.json(req.body)
  }, 1000)
})

router.get('/more/get', (req, res) => {
  res.json(req.cookies)
})

router.post('/more/upload', (req, res) => {
  console.log(req.body, req.files)
  res.end('upload success!')
})

router.post('/more/post', (req, res) => {
  const auth = req.headers.authorization
  const [type, credentials] = auth.split(' ')
  console.log(atob(credentials))
  const [username, password] = atob(credentials).split(':')
  if (type === 'Basic' && username === 'Yee' && password === '123456') {
    res.json(req.body)
  } else {
    res.status(401)
    res.end('UnAuthorization')
  }
})

router.get('/more/304', (req, res) => {
  res.status(304)
  res.end()
})

router.get('/more/A', (req, res) => {
  res.end('A')
})

router.get('/more/B', (req, res) => {
  res.end('B')
})

module.exports = router
