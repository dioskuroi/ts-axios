import { ResolvedFn, RejectedFn } from '../types'
import { isNull } from '../helpers/util'
// 单个拦截器的接口
interface Interceptor<T> {
  resolved: ResolvedFn<T>
  rejected?: RejectedFn
}
// 拦截器类
// * 该类只在 axios 库内部使用，外部并不能使用该类
export default class InterceptorManager<T> {
  // 该属性用来存储设置的拦截器函数
  private interceptors: Array<Interceptor<T> | null>

  constructor() {
    this.interceptors = []
  }
  // 遍历 this.interceptors 的方法
  forEach(fn: (interceptor: Interceptor<T>) => void): void {
    this.interceptors.forEach(interceptor => {
      if (isNull(interceptor)) return
      fn(interceptor)
    })
  }
  // 设置拦截器
  // ? 将设置的拦截器存储在 this.interceptors，返回该拦截器的 id
  use(resolved: ResolvedFn<T>, rejected: RejectedFn): number {
    this.interceptors.push({ resolved, rejected })
    return this.interceptors.length - 1
  }
  // 去除拦截器
  // 根据拦截器 id 将 this.interceptors 中的指定拦截器至为 null
  eject(id: number): void {
    if (isNull(this.interceptors[id])) return
    this.interceptors[id] = null
  }
}
