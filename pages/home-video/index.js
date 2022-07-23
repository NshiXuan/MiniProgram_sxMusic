import {
  getTopMV
} from "../../service/api_video"

Page({
  data: {
    topMVs: [],
    hasMore:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const res = await getTopMV(0)
    this.setData({ topMVs: res.data })
  },

  onPullDownRefresh: async function(){
    wx.showNavigationBarLoading()
    const res=await getTopMV(0)
    this.setData({topMVs: res.data})
    wx.stopPullDownRefresh()
    wx.hideNavigationBarLoading()
  },

  onReachBottom: async function(){
    if(!this.data.hasMore) return
    const res=await getTopMV(this.data.topMVs.length)
    this.setData({topMVs: this.data.topMVs.concat(res.data)})
    this.setData({hasMore: res.hasMore})
  },

  // 封装事件处理方法
  handleVideoItemClick: function(event){
    const id=event.currentTarget.dataset.item.id
    wx.navigateTo({
      url: `/pages/detail-video/index?id=${id}`,
    })
  }
})