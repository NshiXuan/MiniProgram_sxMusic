// base-ui/nav-bar/index.js
Component({
  // 小程序中使用多个插槽需要配置
  options: {
    multipleSlots: true
  },

  properties: {
    title: {
      type: String,
      value: '默认标题'
    }
  },

  data: {
    statusBarHeight: getApp().globalData.statusBarHeight,
    navBarHeight: getApp().globalData.navBarHeight,
  },

  methods: {
    handleLeftClick(){
      this.triggerEvent('click')
    }
  }
})
