import { sxRequest } from './index'

export function getTopMV(offset, limit = 10) {
  return sxRequest.get('/top/mv', {
    offset,
    limit
  })
}

/**
 * 
 * 请求MV的播放地址
 * @param {number} id MV的id
 */
export function getMVURL(id) {
  // console.log(id);
  // console.log(isNaN(id));
  if (isNaN(id)) {
    return sxRequest.get("/video/url", {
      id
    })
  } else {
    return sxRequest.get("/mv/url", {
      id
    })
  }
}

/**
 * 请求MV的详情
 * @param {number} mvid MV的id
 */
export function getMVDetail(mvid) {
  if (isNaN(mvid)) {
    return sxRequest.get('/video/detail', {
      id: mvid
    })
  } else {
    return sxRequest.get('/mv/detail', {
      mvid
    })
  }
}

/**
 * 请求相关视频
 * @param {number} id MV的id
 */
export function getRelatedVideo(id) {
  // /related/allvideo
  return sxRequest.get('/related/allvideo', {
    id
  })
}