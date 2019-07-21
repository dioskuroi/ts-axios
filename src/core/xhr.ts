import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import { isNull, isVoid, isFormData } from '../helpers/util'
import { parseHeaders } from '../helpers/headers'
import { createError } from '../helpers/error'
import { isURLSameOrigin } from '../helpers/url'
import cookie from '../helpers/cookie'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const {
      data = null,
      url,
      method = 'get',
      headers = {},
      responseType,
      timeout,
      cancelToken,
      withCredentials,
      xsrfCookieName,
      xsrfHeaderName,
      onDownloadProgress,
      onUploadProgress,
      auth,
      validateStatus
    } = config

    const request = new XMLHttpRequest()

    request.open(method.toUpperCase(), url!, true)

    configureRequest()

    addEvents()

    processHeaders()

    processCancel()

    request.send(data)

    // 处理请求相关配置
    function configureRequest(): void {
      // 设置响应体类型
      if (responseType) request.responseType = responseType
      // 设置请求超时
      if (timeout) request.timeout = timeout
      // 设置是否携带跨域地址的 Cookie
      if (withCredentials) request.withCredentials = withCredentials
    }

    function addEvents(): void {
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
      // 绑定下载进度事件
      if (onDownloadProgress) {
        request.onprogress = onDownloadProgress
      }
      // 绑定上传进度事件
      if (onUploadProgress) {
        request.upload.onprogress = onUploadProgress
      }
    }

    function processHeaders(): void {
      if (isFormData(data)) {
        delete headers['Content-Type']
      }

      // 设置防 csrf token
      // * 只有在同源或者设置了 withCredentials 时才携带 xsrf token
      if ((withCredentials || isURLSameOrigin(url!)) && xsrfCookieName) {
        const xsrfValue = cookie.read(xsrfCookieName)
        if (xsrfValue && xsrfHeaderName) {
          headers[xsrfHeaderName] = xsrfValue
        }
      }

      if (auth) {
        headers['Authorization'] = 'Basic ' + btoa(auth.username + ':' + auth.password)
      }

      // 设置请求头
      Object.keys(headers).forEach(name => {
        if (isNull(data) && name === 'Content-Type') {
          delete headers[name]
        } else {
          request.setRequestHeader(name, headers[name])
        }
      })
    }

    function processCancel(): void {
      // * 这里将在 CancelToken 类中执行后的 promise 实例传入每次请求中，
      // * 利用这个 promise 调用 then 方法来注册终止请求方法。
      if (!isVoid(cancelToken)) {
        cancelToken.promise.then(reason => {
          request.abort()
          reject(reason)
        })
      }
    }

    // 进一步处理响应状态码
    function handleResponse(response: AxiosResponse): void {
      if (!validateStatus || validateStatus(response.status)) {
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
