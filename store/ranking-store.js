import { HYEventStore } from "hy-event-store";

import { getRankings } from "../service/api_music";

const rankingStore = new HYEventStore({
  state: {
    hotRanking: {}, // 热歌
    newRanking: {}, // 新歌
    originRanking: {}, // 原创
    upRanking: {} // 飙升
  },
  actions: {
    getRankingDataAction(ctx) {
      // 热门榜id为3778678 原创榜id为2884035 新歌榜id为3779629 飙升榜id为19723756
      getRankings(3778678).then(res => {
        // console.log('热门榜', res);
        ctx.hotRanking = res.playlist
      })
      getRankings(3779629).then(res => {
        // console.log('新歌榜', res);
        ctx.newRanking = res.playlist
      })
      getRankings(2884035).then(res => {
        // console.log('原创榜', res);
        ctx.originRanking = res.playlist
      })
      getRankings(19723756).then(res => {
        // console.log('飙升榜', res);
        ctx.upRanking = res.playlist
      })
    }
  }
})

export {
  rankingStore
}