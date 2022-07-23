import { HYEventStore } from "hy-event-store";

import { getSongDetail, getSongLyric } from "../service/api_player";
import { parseLyric } from "../utils/parse-lyric";

// const audioContext = wx.createInnerAudioContext()
const audioContext = wx.getBackgroundAudioManager()

const playerStore = new HYEventStore({
  state: {
    id: 0,
    currentSong: {},
    duration: 0,
    lyricInfos: [],

    currentTime: 0,
    currentLyricIndex: 0,
    currentLyricText: '',

    isPlay: false,

    playModeIndex: 0, // 0：循环播放 1：单曲循环 2：随机播放
    playListSongs: [],
    playListIndex: 0,

    isFirstPlay: true,
    isStoping: false
  },
  actions: {
    playMusicWithSongIdAction(ctx, { id, isRefresh = false }) {
      if (ctx.id == id && !isRefresh) { return }
      ctx.id = id

      // 0.修改播放状态
      ctx.isPlay = true
      ctx.currentSong = {}
      ctx.duration = 0
      ctx.lyricInfos = []
      ctx.currentTime = 0
      ctx.currentLyricIndex = 0
      ctx.currentLyricText = ''

      // 1.根据id请求数据
      // 请求歌曲详情
      getSongDetail(id).then(res => {
        // console.log(res);
        ctx.currentSong = res.songs[0]
        ctx.duration = res.songs[0].dt
        audioContext.title = res.songs[0].name
      })

      // 请求歌词
      getSongLyric(id).then(res => {
        const lyricString = res.lrc.lyric
        const lyrics = parseLyric(lyricString)
        ctx.lyricInfos = lyrics
      })

      // 2.播放对应id的歌曲
      // 先停止上一首的播放
      audioContext.stop()
      audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
      audioContext.title = id
      audioContext.autoplay = true

      // 3.监听audioContext一些事件
      if (ctx.isFirstPlay) {
        this.dispatch('setupAudioContextListenerAction')
        ctx.isFirstPlay = false
      }

      // 4.监听音乐暂停/播放
      audioContext.onPlay(() => {
        ctx.isPlay = true
      })
      audioContext.onPause(() => {
        ctx.isPlay = false
      })
      // 关闭后台音乐
      audioContext.onStop(() => {
        ctx.isPlay = false
      })
    },

    setupAudioContextListenerAction(ctx) {
      // 1.使用audioContext监听播放歌曲
      audioContext.onCanplay(() => {
        audioContext.play()
      })

      // 2.监听时间改变
      audioContext.onTimeUpdate(() => {
        // 1.获取当前时间
        const currentTime = audioContext.currentTime * 1000

        // 2.根据当前时间修改currentTime/sliderValue
        ctx.currentTime = currentTime

        // 3.根据当前时间查找播放的歌词
        if (!ctx.lyricInfos.length) return
        for (let i = 0; i < ctx.lyricInfos.length; i++) {
          const lyricInfo = ctx.lyricInfos[i]
          if (currentTime < lyricInfo.time) {
            const currentIndex = i - 1
            if (ctx.currentLyricIndex !== currentIndex) {
              const currentLyricInfo = ctx.lyricInfos[currentIndex]
              if (!currentLyricInfo) break
              ctx.currentLyricText = currentLyricInfo.lyricText
              ctx.currentLyricIndex = currentIndex
            }
            break
          }
        }
      })

      // 3.监听播放器歌曲完成
      audioContext.onEnded(() => {
        this.dispatch('changeNewMusicAction')
      })
    },

    changeMusicPlayStateAction(ctx) {
      ctx.isPlay = !ctx.isPlay
      if (ctx.isPlay && ctx.isStoping) {
        audioContext.src = `https://music.163.com/song/media/outer/url?id=${ctx.id}.mp3`
        audioContext.title = ctx.currentSong.name
        ctx.isStoping = false
      }
      ctx.isPlay ? audioContext.play() : audioContext.pause()
    },

    changeNewMusicAction(ctx, isNext = true) {
      // 1.获取当前索引
      let index = ctx.playListIndex

      // 2.根据不同的播放模式，获取下一首的索引
      switch (ctx.playModeIndex) {
        case 0: // 顺序播放
          index = isNext ? index + 1 : index - 1
          if (index === -1) index = ctx.playListSongs.length - 1
          if (index === ctx.playListSongs.length) index = 0
        case 1: // 单曲循环
          break
        case 2: // 随机播放
          index = Math.floor(Math.random() * ctx.playListSongs.length)
          break
      }

      // 3.获取歌曲
      let currentSong = ctx.playListSongs[index]
      if (!currentSong) {
        console.log('ok1');
        currentSong = ctx.currentSong
      } else {
        // 记录最新的索引
        ctx.playListIndex = index
      }

      // 4.播放新的歌曲
      this.dispatch('playMusicWithSongIdAction', { id: currentSong.id, isRefresh: true })
    }
  }
})

export {
  audioContext,
  playerStore
}