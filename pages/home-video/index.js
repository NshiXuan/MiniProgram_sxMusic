import {
  getTopMV
} from "../../service/api_video"

Page({
  data: {
    topMVs: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getTopMV(0).then(res => {
      this.setData({
        topMVs: res.data.data
      })
    })
  }
})