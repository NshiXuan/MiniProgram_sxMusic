export default function debounce(fn, delay = 200, immediate = false, resultCallback) {
   let timer = null
   let isInvoke = false
 
   const _debounce = function (...args) {
     return new Promise((resolve, reject) => {
       if (timer) clearTimeout(timer)
 
       // 是否需要立即执行
       if (immediate) {
         const result = fn.apply(this, args)
         resolve(result)
         immediate = false
       } else {
         // 延迟执行
         timer = setTimeout(() => {
           const result = fn.apply(this, args)
           resolve(result)
           isInvoke = true
         }, delay)
       }
     })
   }
 
   return _debounce
 }