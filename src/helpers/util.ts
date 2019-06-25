const toStr = Object.prototype.toString

export function isDate(val: any): val is Date {
  return toStr.call(val) === '[object Date]'
}

export function isUndef(val: any): val is undefined {
  return val === undefined
}

export function isNull(val: any): val is null {
  return val === null
}

export function isArray(val: any): val is any[] {
  return Array.isArray(val)
}

export function isObject(val: any): val is Object {
  return val !== null && typeof val === 'object'
}

export function isPlainObject(val: any): val is Object {
  return toStr.call(val) === '[object Object]'
}

export function isNumber(val: any): val is number {
  return typeof val === 'number'
}

export function isBoolean(val: any): val is boolean {
  return typeof val === 'boolean'
}

export function isString(val: any): val is string {
  return typeof val === 'string'
}

export function isVoid(val: any): val is null | undefined | void {
  return isNull(val) || isUndef(val)
}

export function isEmptyArray(val: any): val is [] {
  return isArray(val) && val.length === 0
}

export function extend<T, U>(to: T, from: U): T & U {
  for (const key in from) {
    ;(to as T & U)[key] = from[key] as any
  }
  return to as T & U
}
