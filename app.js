// app.js
import { getLoginCode, sendCodeToServer, checkToken, checkSession } from "./service/api-login";

App({
  globalData: {
    screenWidth: 0,
    screenHeight: 0,
    statusBarHeight: 0,
    navBarHeight: 44
  },
  onLaunch: function () {
    // 1.获取手机信息
    const info = wx.getSystemInfoSync()
    this.globalData.screenWidth = info.screenWidth
    this.globalData.screenHeight = info.screenHeight
    this.globalData.statusBarHeight = info.statusBarHeight

    // 2.让用户默认进行登录
    this.handleLogin()
  },

  async handleLogin() {
    const token = wx.getStorageSync('token')
    // token有没有过期
    const checkResult = await checkToken(token)
    // 判断session是否过期
    const isSessionExpire = await checkSession()
    if (!token || checkResult.errorCoder || !isSessionExpire) {
      this.loginAction()
    }
  },

  async loginAction() {
    const code = await getLoginCode()
    const res = await sendCodeToServer(code)
    const token = res.token
    wx.setStorageSync('token', token)
  }
})
