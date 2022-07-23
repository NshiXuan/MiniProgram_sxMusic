// pages/music-player/index.js
import { audioContext, playerStore } from "../../store/index";

const playModeNames = ['loop', 'repeat', 'random']

Page({
  data: {
    id: '',
    currentSong: {},
    lyricInfos: '',
    duration: 0,
    currentTime: 0,
    sliderValue: 0,
    currentLyricText: '',
    currentLyricIndex: 0,

    currentPage: 0,
    contentHeight: 0,
    isSliderChaning: false,
    lyricScrollTop: 0,

    playModeIndex: 0,
    playModeName: 'loop',
    isPlay: false,
    playingName: 'pause'
  },

  onLoad(options) {
    // 1.获取传入id
    const id = options.id
    this.setData({ id })

    // 2.根据id获取歌曲信息
    this.setupPlayerStoreListener()

    // 3.其他逻辑
    // 获取除导航栏外的剩余高度
    const screenHeight = getApp().globalData.screenHeight
    const statusBarHeight = getApp().globalData.statusBarHeight
    const navBarHeight = getApp().globalData.navBarHeight
    const contentHeight = screenHeight - statusBarHeight - navBarHeight
    this.setData({ contentHeight })
  },

  // 事件处理
  handleSwiperChange(event) {
    this.setData({ currentPage: event.detail.current })
  },

  handlePlayBtnClick() {
    playerStore.dispatch('changeMusicPlayStateAction')
  },

  handleSliderChange(event) {
    // 1.获取slider变化的值
    const value = event.detail.value

    // 2.计算需要播放的currentTime
    const currentTime = this.data.duration * value / 100

    // 3.设置context播放currentTime位置的音乐
    // 先暂停防止闪动
    // audioContext.pause()
    // seek支持的是秒s 需要与audioContext.onCanplay(() => { audioContext.play() })一起使用，因为点击进度条后会进行缓存，当缓存完可以播放时，回调onCanplay函数
    audioContext.seek(currentTime / 1000)

    // 4.记录最新的currentTime和sliderValue，并修改isPlay isSliderChaning
    this.setData({ sliderValue: value, isSliderChaning: false })
    if (!this.data.isPlay) playerStore.dispatch('changeMusicPlayStateAction')
  },

  handleSliderChanging(event) {
    const value = event.detail.value
    const currentTime = this.data.duration * value / 100
    this.setData({ isSliderChaning: true, currentTime })
  },

  handleModeBtnClick() {
    let playModeIndex = this.data.playModeIndex + 1
    if (playModeIndex === 3) playModeIndex = 0

    // 设置playerStore中的playModeIndex
    playerStore.setState('playModeIndex', playModeIndex)
  },

  handlePrevBtnClick() {
    playerStore.dispatch('changeNewMusicAction', false)
  },

  handleNextBtnClick() {
    playerStore.dispatch('changeNewMusicAction')
  },

  goBack() {
    wx.navigateBack()
  },

  setupPlayerStoreListener() {
    // 1.监听(["currentSong", "duration", "lyricInfos"]的变化
    playerStore.onStates(["currentSong", "duration", "lyricInfos"], ({
      currentSong,
      duration,
      lyricInfos
    }) => {
      if (currentSong) this.setData({ currentSong })
      if (duration) this.setData({ duration })
      if (lyricInfos) this.setData({ lyricInfos })
    })

    // 2.监听currentTime currentLyricIndex currentLyricText的变化
    playerStore.onStates(['currentTime', 'currentLyricIndex', 'currentLyricText'], ({
      currentTime,
      currentLyricIndex,
      currentLyricText,
    }) => {
      // 时间变化
      if (currentTime && !this.data.isSliderChaning) {
        const sliderValue = currentTime / this.data.duration * 100
        this.setData({ sliderValue, currentTime })
      }
      // 歌词变化
      if (currentLyricIndex) {
        this.setData({ currentLyricIndex, lyricScrollTop: currentLyricIndex * 35 })
      }
      if (currentLyricText) {
        this.setData({ currentLyricText })
      }
    })

    // 3.监听播放模式相关的数据
    playerStore.onStates(['playModeIndex', 'isPlay'], ({ playModeIndex, isPlay }) => {
      if (playModeIndex !== undefined) {
        this.setData({ playModeIndex, playModeName: playModeNames[playModeIndex] })
      }
      if (isPlay !== undefined) {
        this.setData({ isPlay, playingName: isPlay ? 'play' : 'pause' })
      }
    })
  },

  onUnload() {

  }
})