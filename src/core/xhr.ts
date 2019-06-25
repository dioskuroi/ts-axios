import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import { isNull } from '../helpers/util'
import { parseHeaders } from '../helpers/headers'
import { createError } from '../helpers/error'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const { data = null, url, method = 'get', headers = {}, responseType, timeout } = config

    const request = new XMLHttpRequest()
    // 设置响应体类型
    if (responseType) request.responseType = responseType
    // 设置请求超时
    if (timeout) request.timeout = timeout

    request.open(method.toUpperCase(), url!, true)
    // 处理响应函数
    request.onreadystatechange = function handleLoad() {
      if (request.readyState !== 4) return
      if (request.status === 0) return
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
      handleResponse(response)
    }
    // 处理 ajax 异常
    request.onerror = function handleError() {
      reject(createError('Network Error', config, null, request))
    }
    // 处理请求超时
    request.ontimeout = function handleTimeout() {
      reject(createError(`Timeout of ${timeout}ms exceeded`, config, 'ECONNABORTED', request))
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
    // 进一步处理响应状态码
    function handleResponse(response: AxiosResponse): void {
      if (request.status >= 200 && request.status < 300) {
        resolve(response)
      } else {
        reject(
          createError(
            `Request failed with status code ${response.status}`,
            config,
            null,
            request,
            response
          )
        )
      }
    }
  })
}
