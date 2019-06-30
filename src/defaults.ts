import { AxiosRequestConfig } from './types'
import { processHeaders } from './helpers/headers'
import { transformRequest, transformResponse } from './helpers/data'
// 定义 axios 默认的配置
const defaults: AxiosRequestConfig = {
  method: 'get',
  headers: {
    common: {
      Accept: 'application/json, text/plain, */*'
    }
  },
  transformRequest: [
    function(data: any, headers: any): any {
      processHeaders(headers, data)
      return transformRequest(data)
    }
  ],
  transformResponse: [
    function(data: any): any {
      return transformResponse(data)
    }
  ]
}

const defaultsWithNoData = ['get', 'delete', 'head', 'options']

defaultsWithNoData.forEach(method => {
  defaults.headers[method] = {}
})
// 有请求体的请求默认 Content-Type 为表单提交类型
const defaultsWithData = ['post', 'put', 'patch']

defaultsWithData.forEach(method => {
  defaults.headers[method] = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

export default defaults
