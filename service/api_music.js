import { sxRequest } from "./index";

export function getBanners() {
  return sxRequest.get('/banner', {
    type: 2
  })
}

// 请求所有榜单
export function getAllRankings(id) {
  return sxRequest.get('/toplist')
}

// 获取榜单详情（实际上就是歌单） 可以通过/toplist 请求所有榜单 其中热门榜id为3778678 原创榜id为2884035 新歌榜id为3779629 飙升榜id为19723756
export function getRankings(id) {
  return sxRequest.get('/playlist/detail', {
    id
  })
}

export function getSongMenu(cat = "全部", limit = 50, offset = 0) {
  return sxRequest.get('/top/playlist', {
    cat,
    limit,
    offset
  })
}