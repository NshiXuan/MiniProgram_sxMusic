// pages/detail-search/index.js
import { getSearchHot, getSearchSuggest, getSearchResult } from "../../service/api_search";
import debounce from "../../utils/debounce";
import { stringToNodes } from "../../utils/stringToNodes";

const debounceGetSearchSuggest = debounce(getSearchSuggest)

Page({
  data: {
    hotKeywords: [],
    suggestSongs: [],
    searchValue: '',
    suggestSongsNodes: [],
    resultSongs: []
  },

  onLoad(options) {
    // 1.获取页面数据
    this.getPageData()
  },

  getPageData() {
    getSearchHot().then(res => {
      this.setData({ hotKeywords: res.result.hots })
    })
  },

  handleSearchChange(event) {
    const searchValue = event.detail
    this.setData({ searchValue })

    // 判断关键字为空字符串的处理逻辑
    if (!searchValue.length) {
      this.setData({ suggestSongs: [], resultSongs: [] })
      return
    }
    debounceGetSearchSuggest(searchValue).then(res => {
      // 获取搜索建议的内容
      const suggestSongs = res.result.allMatch
      if(!suggestSongs) return
      this.setData({ suggestSongs })

      // 转成nodes节点
      const suggestKeywords = suggestSongs.map(item => item.keyword)
      const suggestSongsNodes = []
      for (const keyword of suggestKeywords) {
        const nodes = stringToNodes(keyword, searchValue)
        suggestSongsNodes.push(nodes)
      }
      this.setData({ suggestSongsNodes })
    })
  },

  handleSearchAction() {
    const searchValue = this.data.searchValue
    getSearchResult(searchValue).then(res => {
      this.setData({ resultSongs: res.result.songs })
    })
  },

  handleSuggestItemClick(event) {
    // 1.通过下标从搜索建议数组中拿到点击的搜索建议名称
    const index = event.currentTarget.dataset.index
    const keyword = this.data.suggestSongs[index].keyword

    // 2.将点击的搜索建议拿到的名称设置到搜索框中
    this.setData({ searchValue: keyword })

    // 3.发起网络请求
    this.handleSearchAction()
  },

  handleTagItemClick(event) {
    // 1.获取热门搜索建议关键字
    const keyword = event.currentTarget.dataset.keyword
    // 2.将点击的热门搜索建议拿到的名称设置到搜索框中
    this.setData({ searchValue: keyword })

    // 3.发起网络请求
    this.handleSearchAction()
  }
})