import { sxRequest } from "./index";

export function getSongDetail(ids) {
  return sxRequest.get('/song/detail', {
    ids
  })
}

// 请求歌词
export function getSongLyric(id) {
  return sxRequest.get('/lyric', {
    id
  })
}