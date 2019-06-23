import { isPlainObject, isString } from './util'

export function transformRequest(data: any): any {
  // 如果是对象则返回 JSON 对象
  if (isPlainObject(data)) {
    return JSON.stringify(data)
  }
  return data
}

export function transformResponse(data: any): any {
  if (isString(data)) {
    try {
      data = JSON.parse(data)
    } catch (e) {
      // do nothing...
    }
  }
  return data
}
