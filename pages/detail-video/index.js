// pages/detail-video/index.js
import { getMVURL, getMVDetail, getRelatedVideo } from '../../service/api_video'
import { playerStore } from "../../store/index";
import formatTime from "../../utils/formatTime";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mvURLInfo: {},
    mvDetail: {},
    relatedVideos: [],
    danmuList: [{
      text: '第 1s 出现的弹幕',
      color: '#ff0000',
      time: 1
    }, {
      text: '第 3s 出现的弹幕',
      color: '#ff00ff',
      time: 3
    }],
    isPlay: false,
    fistIsPlay: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //  1.获取传入id
    const id = options.id

    // 2.获取页面数据
    this.getPageData(id)

    // 3.其他逻辑
    playerStore.onStates(['isPlay'], ({ isPlay }) => {
      this.setData({ isPlay })
    })

    this.setData({ fistIsPlay: this.data.isPlay })
  },

  getPageData: function (id) {
    // 1.请求播放地址
    // 为什么不使用await？ 因为await会等待 只有第一个请求完成的时候才能请求第二个 现在我们的请求其实不需要这样 浪费性能 所以使用promise
    getMVURL(id).then(res => {
      this.setData({ mvURLInfo: res.data || res.urls })
    })

    // 2.请求视频信息
    getMVDetail(id).then(res => {
      let publishTime = res.data.publishTime
      let data = res.data
      if (!isNaN(publishTime)) {
        publishTime = formatTime(publishTime)
        data = { ...data, publishTime }
      }
      this.setData({ mvDetail: data })
    })

    // 3.请求相关视频
    getRelatedVideo(id).then(res => {
      this.setData({ relatedVideos: res.data })
    })
  },

  handleRecommendClick(event) {
    const videoContext = wx.createVideoContext('video', this)
    videoContext.stop()
    const vid = event.currentTarget.dataset.item.vid
    wx.navigateTo({
      url: `/pages/detail-video/index?id=${vid}`,
    })
  },

  handleVideoPlay() {
    if (this.data.isPlay) {
      playerStore.dispatch('changeMusicPlayStateAction')
    }
  },
  handleVideoPause() {
    if (!this.data.fistIsPlay) return
    if (!this.data.isPlay) {
      playerStore.dispatch('changeMusicPlayStateAction')
    }
  },

  onUnload(){
    if (!this.data.isPlay) {
      playerStore.dispatch('changeMusicPlayStateAction')
    }
  }
})