export default function throttle(fn, interval = 1000, options = { leading: true, trailing: false }) {
  const { leading, trailing, resultCallback } = options
  let lastTime = 0
  let timer = null

  const _throttle = function (...args) {
    return new Promise((resolve, reject) => {
      const nowTime = new Date().getTime()

      // leading为false remainTime为定义的时间，第一次输入就不会触发
      if (lastTime === 0 && leading === false) lastTime = nowTime
      // 与下面等价
      // if (!lastTime && !leading) lastTime = nowTime

      const remainTime = interval - (nowTime - lastTime)
      if (remainTime <= 0) {
        if (timer) {
          clearTimeout(timer)
          timer = null
        }

        const result = fn.apply(this, args)
        resolve(result)
        lastTime = nowTime
        return
      }

      if (trailing && !timer) {
        timer = setTimeout(() => {
          timer = null
          // 如果leading为false lastTime=0,重新记时
          // leading为true  remainTime = interval - (nowTime - lastTime)>0 不会触发两次
          lastTime = !leading ? 0 : new Date().getTime()
          const result = fn.apply(this, args)
          resolve(result)
        }, remainTime)
      }
    })
  }

  _throttle.cancel = function () {
    if (timer) clearTimeout(timer)
    timer = null
    lastTime = 0
  }

  return _throttle
}