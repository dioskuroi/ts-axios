// 定义 Method 字符串字面量类
export type Method =
  | 'get'
  | 'GET'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'delete'
  | 'DELETE'
  | 'head'
  | 'HEAD'
  | 'patch'
  | 'PATCH'
  | 'options'
  | 'OPTIONS'

export interface AxiosRequestConfig {
  url: string
  method?: Method
  data?: any
  params?: any
  headers?: any
  responseType?: XMLHttpRequestResponseType
}

export interface AxiosResponse {
  headers: any
  data: any
  status: number
  statusText: string
  config: AxiosRequestConfig
  request: XMLHttpRequest
}

export interface AxiosPromise extends Promise<AxiosResponse> {}