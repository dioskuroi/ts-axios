import { CancelExecutor, CancelTokenSource, Canceler } from '../types'

import Cancel from './Cancel'

interface ResolvePromise {
  (reason?: Cancel): void
}

export default class CancelToken {
  promise: Promise<Cancel>
  reason?: Cancel

  // ? 注意：这里传入的 executor 参数是用于接收类中的内部函数 cancel，
  // ? 也就是将 cancel 内部定义的函数传递给了外部使用者，当外部使用者调用 cancel 时，
  // ? 就会将实例中的 this.promise 从 pending 状态置为 fulfilled，
  // ? 随后在 xhr 中定义的 then 方法中的函数就会被调用，request.abort() 被执行，
  // ? 请求被终止。
  // * 这里使用了异步分离的方式，也就是定义的 promise 和调用 .then()方法分别在两个不同的模块中
  constructor(executor: CancelExecutor) {
    let resolvePromise: ResolvePromise
    this.promise = new Promise(resolve => {
      resolvePromise = resolve
    })
    // * 这里外部传入的 executor 被调用，将匿名函数作为参数传递给了外部，
    // * 外部调用者利用变量保存 cancel 函数，在需要是调用 cancel 函数就能触发 xhr 模块中的 request.abort()
    executor(message => {
      if (this.reason) {
        return
      }
      this.reason = new Cancel(message)
      resolvePromise(this.reason)
    })
  }

  throwIfRequested() {
    if (this.reason) {
      throw this.reason
    }
  }

  // * 定义静态 source 方法，利用工厂模式创建 CancelToken 实例
  static source(): CancelTokenSource {
    let cancel!: Canceler
    const token = new CancelToken(c => {
      cancel = c
    })
    return {
      token,
      cancel
    }
  }
}
