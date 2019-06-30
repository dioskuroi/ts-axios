import { AxiosRequestConfig } from '../types'
import { isUndef, isPlainObject, deepMerge } from '../helpers/util'

function defaultStrat(val1: any, val2: any): any {
  return isUndef(val2) ? val1 : val2
}

function fromVal2Strat(val1: any, val2: any): any {
  if (isUndef(val2)) return
  return val2
}

function deepMergeSrat(val1: any, val2: any): any {
  if (isPlainObject(val2)) {
    return deepMerge(val1, val2)
  } else if (!isUndef(val2)) {
    return val2
  } else if (isPlainObject(val1)) {
    return deepMerge(val1)
  } else if (!isUndef(val1)) {
    return val1
  }
}

const strats = Object.create(null)

const stratKeysFromVal2 = ['url', 'params', 'data']

stratKeysFromVal2.forEach(key => {
  strats[key] = fromVal2Strat
})

const stratKeysDeepMerge = ['headers']

stratKeysDeepMerge.forEach(key => {
  strats[key] = deepMergeSrat
})

export default function mergeConfig(
  config1: AxiosRequestConfig,
  config2: AxiosRequestConfig = {}
): AxiosRequestConfig {
  const config = Object.create(null)
  for (const key in config2) {
    mergeField(key)
  }

  for (const key in config1) {
    if (!config2[key]) {
      mergeField(key)
    }
  }

  function mergeField(key: string): void {
    const strat = strats[key] || defaultStrat
    config[key] = strat(config1[key], config2[key])
  }
  return config
}
