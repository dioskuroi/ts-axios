import axios, { Canceler } from '../../src/index'

// 创建 CancelToken 实例
const CancelToken = axios.CancelToken
const source = CancelToken.source()

axios
  .get('/cancel/get', {
    // 将实例传入 axios 的 config 中
    cancelToken: source.token
  })
  .catch(function(e) {
    if (axios.isCancel(e)) {
      console.log('Request canceled', e.message)
    }
  })

setTimeout(() => {
  // 执行 cancel 方法终止请求
  source.cancel('Operation canceled by the user.')
  // * 这里将已经使用过的 CancelToke 传入了新的请求，请求直接终止
  // ? 由于当 cancel 函数执行完毕后，this.reason 已经存在，所以 这里的 post 请求直接被终止，
  // ? 而上一个 get 请求由于是在 catch 函数中 打印了终止信息，所以会比 post 请求终止打印慢，
  // ? 因为 post 请求此时是同步代码，而 get 请求的终止回调是 mircoTask
  axios.post('/cancel/post', { a: 1 }, { cancelToken: source.token }).catch(function(e) {
    if (axios.isCancel(e)) {
      console.log(e.message)
    }
  })
}, 100)

// * 这里使用了第二种方法，直接利用构造函数创建取消令牌
let cancel: Canceler

axios
  .get('/cancel/get', {
    cancelToken: new CancelToken(c => {
      cancel = c
    })
  })
  .catch(function(e) {
    if (axios.isCancel(e)) {
      console.log('Request canceled')
    }
  })

setTimeout(() => {
  // * 这里由于请求已经响应，xhr 中的 promise 状态已经置为 fulfilled
  // * 所以这里执行 cancel 方法时不会触发 promise 的 reject 方法 
  cancel()
}, 1500)
