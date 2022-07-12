import sxRequest from './index'

export function getTopMV(offset,limit=10){
  return sxRequest.get('/top/mv',{
    offset,
    limit
  })
}