import {
  AxiosRequestConfig,
  AxiosPromise,
  Method,
  AxiosResponse,
  ResolvedFn,
  RejectedFn
} from '../types'
import InterceptorManager from './interceptorManager'
import dispatchRequest, { transformURL } from './dispatchRequest'
import { isString, isVoid } from '../helpers/util'
import mergeConfig from './mergeConfig'

// * 注意：这里定义的 Interceptors 接口中 request 和 response 是 InterceptorManager 类，
// * 而不是 AxiosinterceptorManager 接口，因为我们需要使用 forEach 函数
interface Interceptors {
  // ? 这里定义时将 AxiosRequestConfig 作为泛型传入，那么在 resolved 函数中的参数是 AxiosRequestConfig 类型，
  // ? 并且返回的也是 AxiosRequestConfig 类型
  request: InterceptorManager<AxiosRequestConfig>
  // ? 同理，利用 response.use() 定义的拦截器接收 AxiosResponse 类型参数
  // ? 返回值为 AxiosResponse 类型
  response: InterceptorManager<AxiosResponse>
}

// 定义 PromiseChain 数组中的每一项接口
interface PromiseChain<T> {
  // resolved 函数有可能是拦截器函数或者 dispatchRequest 请求函数
  resolved: ResolvedFn<T> | ((config: AxiosRequestConfig) => AxiosPromise)
  // rejected 函数非必传
  rejected?: RejectedFn
}

export default class Axios {
  defaults: AxiosRequestConfig
  interceptors: Interceptors

  constructor(initConfig: AxiosRequestConfig) {
    this.defaults = initConfig
    // 这里生成请求拦截器和响应拦截器
    this.interceptors = {
      request: new InterceptorManager<AxiosRequestConfig>(),
      response: new InterceptorManager<AxiosResponse>()
    }
  }

  request(url: any, config?: any): AxiosPromise {
    // ? 这里修改了函数内部实现，为了在兼容axios()时可以传入两个参数，实现函数重载
    // ? 但是我们不必修改 Axios 接口定义的 request，因为当调用 axios.request()时，
    // ? 我们希望用户还是只传入一个 config 参数，这里实现只要满足接口需求就可以，不必一致
    if (isString(url)) {
      if (isVoid(config)) {
        config = {}
      }
      config.url = url
    } else {
      config = url
    }
    // * 合并 config
    config = mergeConfig(this.defaults, config)

    // * 这里泛型传any 因为可能是 undefined 、 AxiosRequestConfig 或者 AxiosResponse
    // * 先将默认的发送请求函数加入 chain 链条中
    const chain: PromiseChain<any>[] = [
      {
        resolved: dispatchRequest,
        rejected: undefined
      }
    ]

    // * 将请求拦截器循环添加到 dispatchRequest 前面
    // * 这里使用 unshift 操作，所以后定义的请求拦截器先执行
    this.interceptors.request.forEach(interceptor => {
      chain.unshift(interceptor)
    })

    // * 将响应拦截器循环添加到 dispatchRequest 后面
    // * 这里使用 push 操作，所以先定义的响应拦截器先执行
    this.interceptors.response.forEach(interceptor => {
      chain.push(interceptor)
    })
    // * 初始化 promise
    let promise = Promise.resolve(config)

    // * 循环调用 chain 中的函数形成 Prmose 链
    chain.forEach(interceptor => {
      const { resolved, rejected } = interceptor
      promise = promise.then(resolved, rejected)
    })
    // * 最后返回最后赋值的 promise
    return promise
  }

  get(url: string, config: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData(url, 'get', config)
  }

  delete(url: string, config: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData(url, 'delete', config)
  }

  head(url: string, config: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData(url, 'head', config)
  }

  options(url: string, config: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData(url, 'options', config)
  }

  post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData(url, 'post', data, config)
  }

  put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData(url, 'put', data, config)
  }

  patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData(url, 'patch', data, config)
  }

  getUri(config?: AxiosRequestConfig): string {
    config = mergeConfig(this.defaults, config)
    return transformURL(config)
  }

  private _requestMethodWithoutData(
    url: string,
    method: Method,
    config?: AxiosRequestConfig
  ): AxiosPromise {
    return this.request(
      Object.assign(config || {}, {
        url,
        method
      })
    )
  }

  private _requestMethodWithData(
    url: string,
    method: Method,
    data?: any,
    config?: AxiosRequestConfig
  ): AxiosPromise {
    return this.request(
      Object.assign(config || {}, {
        url,
        method,
        data
      })
    )
  }
}
