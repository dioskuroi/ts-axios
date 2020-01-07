import {
  isDate,
  isUndef,
  isNull,
  isArray,
  isObject,
  isPlainObject,
  isNumber,
  isString,
  isBoolean,
  isVoid,
  isEmptyArray,
  isFormData,
  isURLSearchParams,
  extend,
  deepMerge
} from '../../src/helpers/util'

describe('helpers:util', () => {
  describe('isXX', () => {
    test('should validate Date', () => {
      expect(isDate(new Date())).toBeTruthy()
      expect(isDate(Date.now())).toBeFalsy()
    })

    test('should validate Undefined', () => {
      expect(isUndef(undefined)).toBeTruthy()
      expect(isUndef(null)).toBeFalsy()
    })

    test('should validate Null', () => {
      expect(isNull(null)).toBeTruthy()
      expect(isNull(undefined)).toBeFalsy()
    })

    test('should validate Array', () => {
      expect(isArray([])).toBeTruthy()
      expect(isArray({})).toBeFalsy()
    })

    test('should validate Object', () => {
      expect(isObject({})).toBeTruthy()
      expect(isObject([])).toBeTruthy()
      expect(isObject(new Date())).toBeTruthy()
      expect(isObject(new String(''))).toBeTruthy()
      expect(isObject('')).toBeFalsy()
    })

    test('should validate plain Object', () => {
      expect(isPlainObject({})).toBeTruthy()
      expect(isPlainObject(new Date())).toBeFalsy()
    })

    test('should validate Number', () => {
      expect(isNumber(123)).toBeTruthy()
      expect(isNumber('123')).toBeFalsy()
    })

    test('should validate String', () => {
      expect(isString('123')).toBeTruthy()
      expect(isString(123)).toBeFalsy()
    })

    test('should validate Boolean', () => {
      expect(isBoolean(true)).toBeTruthy()
      expect(isBoolean('true')).toBeFalsy()
    })

    test('should validate Void', () => {
      expect(isVoid(null)).toBeTruthy()
      expect(isVoid(undefined)).toBeTruthy()
      expect(isVoid('undefined')).toBeFalsy()
    })

    test('should validate empty Array', () => {
      expect(isEmptyArray([])).toBeTruthy()
      expect(isEmptyArray([,])).toBeFalsy()
    })

    test('should validate FormData', () => {
      expect(isFormData(new FormData())).toBeTruthy()
      expect(isFormData({})).toBeFalsy()
    })

    test('should validate URLSearchParams', () => {
      expect(isURLSearchParams(new URLSearchParams())).toBeTruthy()
      expect(isURLSearchParams('a=b&c=d')).toBeFalsy()
    })
  })

  describe('extend', () => {
    test('should be mutable', () => {
      const a = Object.create(null)
      const b = { foo: 123 }
      extend(a, b)
      expect(a.foo).toBe(123)
    })

    test('should extend properties', () => {
      const a = { foo: 123, bar: 456 }
      const b = { bar: 789 }
      const c = extend(a, b)
      expect(c.foo).toBe(123)
      expect(c.bar).toBe(789)
    })
  })

  describe('deepMerge', () => {
    test('should be immutable', () => {
      const a = Object.create(null)
      const b: any = {foo: 123}
      const c: any = {bar: 456}
      deepMerge(a, b, c)
      expect(typeof a.foo).toBe('undefined')
      expect(typeof a.bar).toBe('undefined')
      expect(typeof b.bar).toBe('undefined')
      expect(typeof c.foo).toBe('undefined')
    })

    test('should deep merge properties', () => {
      const a = { foo: 123 }
      const b = { bar: 456 }
      const c = { foo: 789 }
      const d = deepMerge(a, b, c)
      expect(d.foo).toBe(789)
      expect(d.bar).toBe(456)
    })

    test('should deep merge recursively', () => {
      const a = { foo: { bar: 123 } }
      const b = { foo: { baz: 456 }, bar: { qux: 789 } }
      const c = deepMerge(a, b)
      expect(c).toEqual({
        foo: {
          bar: 123,
          baz: 456
        },
        bar: {
          qux: 789
        }
      })
    })

    test('should remove all references from nested objects', () => {
      const a = { foo: { bar: 123 } }
      const b = {}
      const c = deepMerge(a, b)

      expect(c).toEqual({
        foo: {
          bar: 123
        }
      })
      expect(c.foo).not.toBe(a.foo)
    })

    test('should handle null and undefined argements', () => {
      expect(deepMerge(undefined, undefined)).toEqual({})
      expect(deepMerge(undefined, {foo: 123})).toEqual({foo: 123})
      expect(deepMerge({foo: 123}, undefined)).toEqual({foo: 123})
      expect(deepMerge(null, null)).toEqual({})
      expect(deepMerge(null, { foo: 123 })).toEqual({ foo: 123 })
      expect(deepMerge({ foo: 123 }, null)).toEqual({ foo: 123 })
    })
  })
})
