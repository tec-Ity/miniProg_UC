import { request,dns_request } from "../../request/index.js";
import dns from "../../js/dns.js";
import { chooseAddress } from "../../utils/asyncWx.js";
let appInstance = getApp();
var startPoint;
Page({ 
  data: {
    swiperList:[],
    catesList:[],
    dns,
    CitaList:[],
    title:'自定义组件',
    topBarHeight:0,
    background:'#ffffff',
    color:'#000000',   
    homeImage:'/icons/mapInsertLocation.svg',
    border: true,
    loading: false,
    show: true,
    left:false,
    center:false,
    hiden:1,
    cb:0,
    isShowLocationLayer:false,
    locationInfo:{},
    buttonTop: 0,
    buttonLeft: 0,
    windowHeight: '',
    windowWidth: '',
    corner_data:0,
    handleChooseAddress(){
      wx.chooseAddress({
        success: (result) => {
          //console.log(result);
        },
      })
    }
  },
  onLoad: function(options) {
    // this.getSwiperList(); 
    // this.getCateList(); 
    this.getCitaList();
    this.bindAuthLocation();
    this.setData({
      corner_data:0
    })
    var that =this;
    wx.getSystemInfo({
      success: function (res) {
        //console.log(res);
        //console.log('height=' + res.windowHeight);
        //console.log('width=' + res.windowWidth);
        that.setData({
          windowHeight:  res.windowHeight,
          windowWidth:  res.windowWidth,
          buttonTop:res.windowHeight*0.70,
          buttonLeft:res.windowWidth*0.70,
        })
      }
    })
  },
  btn_Suspension_click:function(){
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
    if (buttonLeft+50 >= this.data.windowWidth){
      buttonLeft = this.data.windowWidth-50;
    }
    if (buttonLeft<=0){
      buttonLeft=0;
    }
    if (buttonTop<=0){
      buttonTop=0
    }
    if (buttonTop + 50 >= this.data.windowHeight){
      buttonTop = this.data.windowHeight-50;
    }
    this.setData({
      buttonTop: buttonTop,
      buttonLeft: buttonLeft
    })
  },
  buttonEnd: function (e) {
  },

  // getSwiperList(){
  //   request({ url: "/home/swiperdata"  })
  //   .then(result => {
  //     this.setData({ 
  //        swiperList: result
  //            })
  //   }) 
  // },

  getCitaList(){
    dns_request({ url: "/Citas" })   
    .then(result => {
      this.setData({
         CitaList: result.data.objects
             })
      //console.log(result);
    })
  },
  getLocationInfo: function (e) {
    var that = this;
    wx.getLocation({
      type: 'gcj02',
      success(obj) {
        that.setData({
          locationInfo: obj,
        })
      }
    })
  },
  bindAuthLocation:function(e){
    var that = this;
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userLocation'] == undefined && !res.authSetting['scope.userLocation']) 
          that.getLocationInfo();
        else if (res.authSetting['scope.userLocation'] === false)
          that.setData({isShowLocationLayer: true})
          that.getLocationInfo();
      }
    })
  },
  bindConfirmLocation: function (e) {
    var that = this;
    wx.openSetting({
      success: function (res) {
        if (res.authSetting['scope.userLocation']) {
          that.getLocationInfo();
          that.setData({
            isShowLocationLayer: false,
          })
        }
      }
    });
  },
  bindCancelLocation: function (e) {
    this.setData({
      isShowLocationLayer: false,
    })
  },
})
