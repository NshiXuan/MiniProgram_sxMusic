import { sxLoginRequest } from "./index";

export function getLoginCode() {
  return new Promise((resovle, reject) => {
    // 1.获取code
    wx.login({
      timeout: 1000,
      success: res => {
        resovle(res.code);
      },
      fail: err => {
        reject(err);
      }
    })
  })
}

export function sendCodeToServer(code) {
  return sxLoginRequest.post('/login', {
    code
  })
}

export function checkToken(token) {
  return sxLoginRequest.post('/auth', {}, {
    token
  })
}

export function checkSession() {
  return new Promise((resolve) => {
    wx.checkSession({
      success: () => {
        resolve(true)
      },
      fail: () => {
        resolve(false)
      }
    })
  })
}

export function getUserInfo() {
  return new Promise((resolve, reject) => {
    wx.getUserProfile({
      desc: '你好啊，张三',
      success: res => {
        resolve(res);
      },
      fail: err => {
        reject(err)
      }
    })
  })
}