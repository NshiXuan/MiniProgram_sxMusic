// pages/home-profile/index.js
import { getUserInfo } from "../../service/api-login";

Page({
  data: {

  },

  onLoad(options) {

  },

  async handleGetUser(event) {
    const userInfo = await getUserInfo()
    console.log(userInfo);
  }
})