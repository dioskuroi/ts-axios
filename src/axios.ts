import { AxiosRequestConfig, AxiosStatic } from './types'
import Axios from './core/Axios'
import defaults from './defaults'
import { extend, deepMerge } from './helpers/util'

function createIntance(config: AxiosRequestConfig): AxiosStatic {
  const context = new Axios(config)
  // ? 这里是为了可以直接调用 axios()
  // ? bind 是用来处理 Axios.prototype.request 函数中 this 指向问题
  const instance = Axios.prototype.request.bind(context)
  // 将实例上的方法合并到 axios 函数上
  extend(instance, context)
  return instance as AxiosStatic
}

const axios = createIntance(defaults)

axios.create = function(config) {
  return createIntance(deepMerge(defaults, config))
}

export default axios
