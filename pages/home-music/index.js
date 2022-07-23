import { playerStore, rankingStore } from "../../store/index";

import { getBanners, getSongMenu } from "../../service/api_music";
import queryRect from "../../utils/query-rect";
import throttle from "../../utils/throttle";

const throttleQueryRect = throttle(queryRect, 1000, { trailing: true })

Page({
  data: {
    swiperHeight: 0,
    banners: [],
    recommendSongs: [],
    sliceHotSongMenu: [],
    sliceRecommendSongMenu: [],
    rankings: [],
    currentSong: {},
    isPlay: false,
    playName: 'pause',
    playAnimationState: 'paused'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取页面数据 轮播图
    this.getPageData()

    // 发起共享数据请求
    rankingStore.dispatch('getRankingDataAction')

    // 从store中获取共享数据
    this.setupPlayerStoreListener()
  },

  // 网络请求
  getPageData: function () {
    getBanners().then(res => {
      this.setData({ banners: res.banners })
    })

    // 热门歌单
    getSongMenu().then(res => {
      this.setData({ sliceHotSongMenu: res.playlists.slice(0, 6) })
    })

    // 推荐歌单
    getSongMenu("华语").then(res => {
      this.setData({ sliceRecommendSongMenu: res.playlists.slice(0, 6) })
    })
  },

  handleSearchClick() {
    wx.navigateTo({
      url: '/pages/detail-search/index',
    })
  },

  handleMoreClick(event) {
    const type = event.currentTarget.dataset.type
    if (!type) {
      this.navigateToDetailSongsPage(3778678)
    } else {
      wx.navigateTo({
        url: '/pages/more-menu/index?type=' + type,
      })
    }
  },

  handleRankingItemClick(event) {
    const id = event.currentTarget.dataset.item.id
    this.navigateToDetailSongsPage(id)
  },

  navigateToDetailSongsPage(id) {
    wx.navigateTo({
      url: `/pages/detail-songs/index?id=${id}`,
    })
  },

  handleSwiperImageLoaded() {
    // 获取图片的高度（如果去获取某一个组件的高度）
    throttleQueryRect('.swiper-image').then(res => {
      this.setData({ swiperHeight: res[0].height })
    })
  },

  handleSongItemClick(event) {
    const index = event.currentTarget.dataset.index
    playerStore.setState('playListSongs', this.data.recommendSongs)
    playerStore.setState('playListIndex', index)
  },

  handlePlayBtnClick() {
    playerStore.dispatch('changeMusicPlayStateAction')
  },

  handlePlayBarClick() {
    wx.navigateTo({
      url: '/pages/music-player/index?id=' + this.data.currentSong.id
    })
  },

  setupPlayerStoreListener() {
    // 1.排行榜播放
    rankingStore.onState("hotRanking", res => {
      if (!res.tracks) return
      const recommendSongs = res.tracks.slice(0, 6)
      this.setData({ recommendSongs: recommendSongs })
    })
    rankingStore.onState("newRanking", this.getNewRankingHandler)
    rankingStore.onState("originRanking", this.getNewRankingHandler)
    rankingStore.onState("upRanking", this.getNewRankingHandler)

    // 2.播放器监听
    playerStore.onStates(['currentSong', 'isPlay'], ({ currentSong, isPlay }) => {
      if (currentSong) { this.setData({ currentSong }) }
      if (isPlay !== undefined) {
        this.setData({
          isPlay,
          playName: isPlay ? this.data.playName = 'play' : this.data.playName = 'pause',
          playAnimationState: isPlay ? this.data.playName = 'running' : this.data.playName = 'paused'
        })
      }
    })
  },

  getNewRankingHandler(res) {
    // console.log(res);
    if (Object.keys(res).length === 0 || this.data.rankings.length >= 3) return
    const id = res.id
    const name = res.name
    const coverImgUrl = res.coverImgUrl
    const songList = res.tracks.slice(0, 3)
    const playCount = res.playCount
    const rankingObj = { id, name, coverImgUrl, songList, playCount }
    const originRankings = [...this.data.rankings]
    originRankings.push(rankingObj)
    this.setData({ rankings: originRankings })
  }
})