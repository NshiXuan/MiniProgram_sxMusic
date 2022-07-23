// pages/more-menu/index.js
import { getBanners, getSongMenu } from "../../service/api_music";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    songMenu: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const type = options.type
    if (type === 'hot') {
      // 热门歌单
      getSongMenu().then(res => {
        this.setData({ songMenu: res.playlists })
      })
    } else if (type === 'recommend') {
      // 推荐歌单
      getSongMenu("华语").then(res => {
        this.setData({ songMenu: res.playlists })
      })
    }
  },

  handleItemClick(event) {
    const id = event.currentTarget.dataset.item.id
    wx.navigateTo({
      url: `/pages/detail-songs/index?id=${id}`,
    })
  }
})