import { request,dns_request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime.js';
import dns from "../../js/dns.js";
var startPoint;
Page({
    data: {
        CitaList:[],
        dns,
        Shops:[],  
        buttonTop: 0,
        buttonLeft: 0,
        windowHeight: '',
        windowWidth: '',
        corner_data: 0
    },
    kind: function (e) {
      getApp().globalData.homeCurrentTab = e.currentTarget.dataset.id;
       //console.log("kind", e.currentTarget.dataset.id);
     },

    onLoad: function (options) {
        this.getCitaList();
        this.getShops(); 
        this.setData({
          corner_data: 0
        })
        var that = this;
        wx.getSystemInfo({
          success: function (res) {
            console.log(res);
            console.log('height=' + res.windowHeight);
            console.log('width=' + res.windowWidth);
            that.setData({
              windowHeight: res.windowHeight,
              windowWidth: res.windowWidth,
              buttonTop: res.windowHeight * 0.70,
              buttonLeft: res.windowWidth * 0.70,
            })
          }
        })
    },
    btn_Suspension_click: function () {
      wx.switchTab({
        url: '/pages/order/index'
      })
    },
    buttonStart: function (e) {
      startPoint = e.touches[0]
    },
    buttonMove: function (e) {
      var endPoint = e.touches[e.touches.length - 1]
      var translateX = endPoint.clientX - startPoint.clientX
      var translateY = endPoint.clientY - startPoint.clientY
      startPoint = endPoint
      var buttonTop = this.data.buttonTop + translateY
      var buttonLeft = this.data.buttonLeft + translateX
      if (buttonLeft + 50 >= this.data.windowWidth) {
        buttonLeft = this.data.windowWidth - 50;
      }
      if (buttonLeft <= 0) {
        buttonLeft = 0;
      }
      if (buttonTop <= 0) {
        buttonTop = 0
      }
      if (buttonTop + 50 >= this.data.windowHeight) {
        buttonTop = this.data.windowHeight - 50;
      }
      this.setData({
        buttonTop: buttonTop,
        buttonLeft: buttonLeft
      })
    },
    buttonEnd: function (e) {},
    getCitaList(){
        dns_request({ url: "/Citas" })   
        .then(result => {
          this.setData({
             CitaList: result.data.objects
                 })
          //console.log(result);
        })
      },
    async getShops(){
      try {
        dns_request({ url: "/Shops" })   
        .then(result => {
          this.setData({
             Shops: result.data.objects
                 })
          //console.log(result);
          wx.setStorageSync('_id',this.data.objects)  //key表示data中的参数 把shopid存儲起來
        })
      } catch (error) {
        //console.log(error);
      }
      },
})