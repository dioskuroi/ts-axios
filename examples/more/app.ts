import axios, { AxiosError } from '../../src/index'
import qs from 'qs'

document.cookie = 'a=b'

axios.get('/more/get').then(res => {
  console.log(res)
})

axios
  .post(
    'http://127.0.0.1:8088/more/server2',
    {},
    {
      // 设置该字段来携带跨域地址的 Cookie
      withCredentials: true
    }
  )
  .then(res => {
    console.log(res)
  })

const instance = axios.create({
  xsrfCookieName: 'XSRF-TOKEN-D',
  xsrfHeaderName: 'X-XSRF-TOKEN-D'
})

instance.get('/more/get').then(res => {
  console.log(res)
})

instance
  .post(
    '/more/post',
    {
      a: 1
    },
    {
      auth: {
        username: 'Yee',
        password: '123456'
      }
    }
  )
  .then(res => {
    console.log(res)
  })

instance
  .get('/more/304')
  .then(res => {
    console.log(res)
  })
  .catch((e: AxiosError) => {
    console.log(e.message)
  })

instance
  .get('/more/304', {
    validateStatus(status) {
      return status >= 200 && status < 400
    }
  })
  .then(res => {
    console.log(res)
  })
  .catch((e: AxiosError) => {
    console.log(e.message)
  })

instance
  .get('/more/get', {
    params: new URLSearchParams('a=b&c=d')
  })
  .then(res => {
    console.log(res)
  })

instance
  .get('/more/get', {
    params: {
      a: 1,
      b: 2,
      c: ['a', 'b', 'c']
    }
  })
  .then(res => {
    console.log(res)
  })

instance
  .get('/more/get', {
    params: {
      a: 1,
      b: 2,
      c: ['a', 'b', 'c']
    },
    paramsSerializer(params) {
      return qs.stringify(params, { arrayFormat: 'brackets' })
    }
  })
  .then(res => {
    console.log(res)
  })

const instance2 = axios.create({
  baseURL: 'https://img.mukewang.com/'
})

instance2.get('5cc01a7b0001a33718720632.jpg')

instance2.get('https://img.mukewang.com/szimg/5becd5ad0001b89306000338-360-202.jpg')

function getA() {
  return instance.get('/more/A')
}
function getB() {
  return instance.get('/more/B')
}

axios.all([getA(), getB()]).then(([resA, resB]) => {
  console.log(resA.data)
  console.log(resB.data)
})

axios.all([getA(), getB()]).then(
  axios.spread((resA, resB) => {
    console.log(resA.data)
    console.log(resB.data)
  })
)

const fakeConfig = {
  baseURL: 'https://www.baidu.com/',
  url: '/user/12345',
  params: {
    idClient: 1,
    idTest: 2,
    testString: 'thisIsATest'
  }
}
console.log(instance.getUri(fakeConfig))
