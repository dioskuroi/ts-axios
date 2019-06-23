import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from './types'
import { isNull } from './helpers/util'
import { parseHeaders } from './helpers/headers'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise(resolve => {
    const { data = null, url, method = 'get', headers = {}, responseType } = config

    const request = new XMLHttpRequest()
    // 设置响应体类型
    if (responseType) request.responseType = responseType

    request.open(method.toUpperCase(), url, true)
    // 处理响应函数
    request.onreadystatechange = function handleLoad() {
      if (request.readyState !== 4) return
      const responseHeaders = parseHeaders(request.getAllResponseHeaders())
      const responseData = responseType === 'text' ? request.responseText : request.response
      const response: AxiosResponse = {
        headers: responseHeaders,
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        request,
        config
      }
      resolve(response)
    }
    // 设置请求头
    Object.keys(headers).forEach(name => {
      if (isNull(data) && name === 'Content-Type') {
        delete headers[name]
      } else {
        request.setRequestHeader(name, headers[name])
      }
    })

    request.send(data)
  })
}
