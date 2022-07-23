const BASE_URL1 = 'http://localhost:3000'
const BASE_URL2 = 'http://123.207.32.32:9001'
const LOGIN_BASE_URL = 'http://123.207.32.32:3000'

const token = wx.getStorageSync('token')

class SXRequest {
  constructor(baseUrl, authHeader) {
    this.baseUrl = baseUrl
    this.authHeader = authHeader
  }

  request(url, method, params, isAuth = false, header = {}) {
    const finalHeader = isAuth ? { ...this.authHeader, ...header } : header
    return new Promise((resolve, reject) => {
      wx.request({
        url: this.baseUrl + url,
        method: method,
        header: finalHeader,
        data: params,
        success: function (res) {
          resolve(res.data)
        },
        fail: reject
      })
    })
  }

  get(url, params, isAuth = false, header) {
    return this.request(url, 'GET', params, isAuth, header)
  }

  post(url, data, isAuth = false, header) {
    return this.request(url, 'POST', data, isAuth, header)
  }
}

const sxRequest = new SXRequest(BASE_URL1)
const sxRequest2 = new SXRequest(BASE_URL2)
const sxLoginRequest = new SXRequest(LOGIN_BASE_URL, { token })

export {
  sxRequest,
  sxRequest2,
  sxLoginRequest
} 