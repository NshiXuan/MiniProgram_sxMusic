import { sxRequest, sxRequest2 } from "./index";

export function getSearchHot() {
  return sxRequest.get('/search/hot')
}

export function getSearchSuggest(keywords) {
  return sxRequest.get('/search/suggest', {
    keywords,
    type: 'mobile'
  })
}

export function getSearchResult(searchValue) {
  return sxRequest2.get('/search', {
    keywords: searchValue
  }, 2)
}