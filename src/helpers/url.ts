import { isVoid, isArray, isDate, isPlainObject } from './util'

// 清除哈希值
function clearHash(url: string): string {
  const hashIndex = url.indexOf('#')
  return hashIndex === -1 ? url : url.slice(0, hashIndex)
}

// 转义字符串
function encode(val: string): string {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

export function buildUrl(url: string, params?: any): string {
  // 清除 url 中的 hash
  url = clearHash(url)
  // 如果 params 为 null 或者 undefined 直接返回 url
  if (isVoid(params)) {
    return url
  }
  // 定义一个数组保存参数键值对
  const parts: string[] = []

  Object.keys(params).forEach(key => {
    const val = params[key]
    // 如果参数对值为空，直接 return
    if (isVoid(val)) return

    let values = []
    if (isArray(val)) {
      // 如果值为数组，则将 key 后追加 '[]'
      values = val
      key += '[]'
    } else {
      values = [val]
    }

    values.forEach(val => {
      if (isDate(val)) {
        // 如果 value 时 Date 类型，需要toISOString 转换成字符串
        val = val.toISOString()
      } else if (isPlainObject(val)) {
        // 如果是对象，则转成 JSON 字符串
        val = JSON.stringify(val)
      }
      parts.push(`${encode(key)}=${encode(val)}`)
    })
  })
  // 如果 url 中已经带有参数，则拼接后面的参数，如果没有则需要加上 ? 号
  url += url.indexOf('?') === -1 ? `?${parts.join('&')}` : `&${parts.join('&')}`

  return url
}
