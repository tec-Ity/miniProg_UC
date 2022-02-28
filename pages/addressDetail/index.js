// pages/addressDetail/index.js
import {
    getSetting,
    chooseAddress,
    openSetting,
    showModal,
    showToast,
    requestPayment
  } from "../../utils/asyncWx.js";
  import regeneratorRuntime from '../../lib/runtime/runtime.js';
  import {
    request,
    dns_request
  } from "../../request/index.js";
  import dns from "../../js/dns.js";
Page({
    data: {
        name:"",
        phone:"",
        address:"",
        addressdetail:"",
    },
    onLoad: function (options) {
    },
    i_name:function(res){
     this.setData({
       name: res.detail.value
     })
    },
    i_phone: function (res) {
      this.setData({
        phone: res.detail.value
      })
    },
    i_address: function (res) {
      this.setData({
        address: res.detail.value
      })
    },
    i_addressdetail: function (res) {
        this.setData({
          addressdetail: res.detail.value
        })
      },
    go:function(){
        wx.navigateTo({
          url: '../userCard/index?name='+this.data.name +"&phone="+this.data.phone+"&address="+this.data.address+"&addressdetail="+this.data.addressdetail  
        })
      },
      /**
       * 生命周期函数--监听页面初次渲染完成
       */
      onReady: function () { 
      },
})
