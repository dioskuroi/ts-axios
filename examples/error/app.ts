import axios, { AxiosError } from '../../src/index'

axios({
  url: '/error/get1',
  method: 'get'
})
  .then(res => {
    console.log(res)
  })
  .catch((e: AxiosError) => {
    console.log(e)
  })

axios({
  url: '/error/get',
  method: 'get'
})
  .then(res => {
    console.log(res)
  })
  .catch((e: AxiosError) => {
    console.log(e)
  })

setTimeout(() => {
  axios({
    method: 'get',
    url: '/error/get'
  })
    .then(res => {
      console.log(res)
    })
    .catch((e: AxiosError) => {
      console.log(e)
    })
}, 5000)

axios({
  method: 'get',
  url: '/error/timeout',
  timeout: 2000
})
  .then(res => {
    console.log(res)
  })
  .catch((e: AxiosError) => {
    console.log(e.message)
    console.log(e.isAxiosError)
    console.log(e.code)
    console.log(e.config)
    console.log(e.request)
    console.log(e.response)
  })
