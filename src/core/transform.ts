import { AxiosTransformer } from '../types'
import { isVoid, isArray } from '../helpers/util'

export default function transform(
  data: any,
  headers: any,
  fns?: AxiosTransformer | AxiosTransformer[]
): any {
  if (isVoid(fns)) return data

  if (!isArray(fns)) fns = [fns]

  fns.forEach(fn => {
    data = fn(data, headers)
  })

  return data
}
