import axios from '../../src/index'
import { isVoid } from '../../src/helpers/util'

axios({
  url: '/extend/post',
  method: 'post',
  data: {
    msg: 'hi'
  }
})

axios('/extend/post', {
  method: 'post',
  data: {
    msg: 'haha'
  }
})

axios.request({
  url: '/extend/post',
  method: 'post',
  data: {
    msg: 'hello'
  }
})

axios.get('/extend/get')

axios.delete('/extend/delete')

axios.head('/extend/head')

axios.options('/extend/options')

axios.post('/extend/post', { msg: 'post' })

axios.put('/extend/put', { msg: 'put' })

axios.patch('/extend/patch', { msg: 'patch' })
// 定义后端响应数据格式
interface ResponseData<T> {
  code: number
  message: string
  result: T
}
// 定义该接口数据结构
interface User {
  name: string
  age: number
}
// 调用 api 时传入响应数据结构
function getUser<T>() {
  // 这里传入 axios 的 泛型为 响应数据格式泛型
  return axios<ResponseData<T>>('/extend/user')
    .then(res => res.data)
    .catch(err => console.error(err))
}

async function test() {
  // 当后端查不到用户时，返回的是 result 返回的是 null
  // 所以这里需要传一个联合类型 User | void
  const user = await getUser<User | void>()
  // 这里判断 user 是否存在，因为有 catch 逻辑，所以 user 不一定有值
  if (!user) return
  // 这里判断 result 是否为空
  if (isVoid(user.result)) return
  // 至此 typescript 就可以顺利推导出 result 是 User 类型
  console.log(user.result.name)
}

test()
