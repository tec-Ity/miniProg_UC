// pages/userCard/index.js
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
        pname:"",
        pphone:"",
        paddress:"",
        paddressdetail:"",
    },

  onLoad: function (options) {
    const address=wx.getStorageSync("address");
    this.setData({address});
    this.setData({
        address
    });

    console.log(options.name,options.phone,options.address,options.addressdetail)
    var that = this
    that.setData({
      pname:options.name,
      pphone:options.phone,
      paddress:options.address,
      paddressdetail:options.addressdetail,
    })
},
    go:function (){
        wx.navigateTo({
          url: '../addressDetail/index?address='+this.data.address +"&addresscode="+this.data.addresscode+"&receiver="+this.data.receiver+"&receivernum="+this.data.receivernum+"&choosetime="+this.data.choosetime 
        })
      },
})
