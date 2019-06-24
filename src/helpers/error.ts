import { AxiosRequestConfig, AxiosResponse } from '../types'

export class AxiosError extends Error {
  isAxiosError: boolean
  config: AxiosRequestConfig
  code?: string | null
  request?: XMLHttpRequest
  response?: AxiosResponse

  constructor(
    message: string,
    config: AxiosRequestConfig,
    code?: string | null,
    request?: XMLHttpRequest,
    response?: AxiosResponse
  ) {
    super(message)
    this.config = config
    this.code = code
    this.request = request
    this.response = response
    this.isAxiosError = true

    // ! 当一个类继承自内置对象时，如 Error Array Map 时，typescript 会有 bug 无法识别 this
    // ! 所以这里要显示的设置一下原形链
    Object.setPrototypeOf(this, AxiosError.prototype)
  }
}

// AxiosError 工厂函数
export function createError(
  message: string,
  config: AxiosRequestConfig,
  code?: string | null,
  request?: XMLHttpRequest,
  response?: AxiosResponse
) {
  const error = new AxiosError(message, config, code, request, response)
  return error
}
