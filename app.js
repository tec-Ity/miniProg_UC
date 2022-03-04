//app.js
App({ //onLaunch,onShow: options(path,query,scene,shareTicket,referrerInfo(appId,extraData))
  onLaunch: function (options) {
    wx.login({
      success: (res) => {
        if (res.code) {
          wx.request({
            url: 'https://serverunioncity.com/api/v1/Login',
            method: "POST",
            data: {
              social: {
                login_type: "wx",
                Client_accessToken: res.code,
              }
            },
            success: (result) => {
              console.log(result);
              wx.setStorageSync('token', result.data.data.accessToken)
            }
          })
        } else {
          console.log('获取用户登录状态失败！'+ res.errMsg)
        }
      }

    });
  },
  globalData: {
    homeCurrentTab: 0
  }
})