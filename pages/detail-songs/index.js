import { playerStore, rankingStore } from "../../store/index"
import { getRankings } from "../../service/api_music";

// pages/detail-songs/index.js
Page({
  data: {
    ranking: "",
    rankingInfo: {}
  },

  onLoad(options) {
    const id = options.id
    if (id == 3779629) {
      this.setData({ ranking: 'newRanking' })
    } else if (id == 2884035) {
      this.setData({ ranking: 'originRanking' })
    } else if (id == 19723756) {
      this.setData({ ranking: 'upRanking' })
    } else if (id == 3778678) {
      this.setData({ ranking: 'hotRanking' })
    } else {
      getRankings(id).then(res => {
        this.getRankingDataHandler(res.playlist)
      })
      return
    }

    // 获取数据
    rankingStore.onState(this.data.ranking, this.getRankingDataHandler)
  },

  handleSongItemClick(event) {
    const index = event.currentTarget.dataset.index
    playerStore.setState('playListSongs', this.data.rankingInfo.tracks)
    playerStore.setState('playListIndex', index)
  },

  onUnload() {
    if (!this.data.ranking) return
    rankingStore.offState(this.data.ranking, this.getRankingDataHandler)
  },

  getRankingDataHandler(res) {
    this.setData({ rankingInfo: res })
  }
})