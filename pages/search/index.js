import { request,dns_request } from "../../request/index.js";
import { getSetting,openSetting,chooseAddress } from "../../utils/asyncWx.js";
import regeneratorRuntime from '../../lib/runtime/runtime.js';
Page({
    data: {
        address:{},
        goods:[],
        isFocus:false,
        inpValue:"",
        buttonTop: 0,
    buttonLeft: 0,
    windowHeight: '',
    windowWidth: ''
    },
    onShow(){
        const address=wx.getStorageSync("address");
        this.setData({address});
        this.setData({
            address
        });
    },
    async handleChooseAddress() {
        try {
        const res1=await getSetting();
        const scopeAddress = res1.authSetting["scope.address"];
        if (scopeAddress === false) {
            await openSetting();
        }
        let address = await chooseAddress();
        address.all=address.provinceName+address.cityName+address.countyName+address.detailInfo;
        wx.setStorageSync("address", address);
    } catch(error) {
        //console.log(error);
    }
},
    TimeId:-1,
    handleInput(e){
        const {value}=e.detail;
        if(!value.trim()){
            this.setData({
                goods:[],
                isFocus:false
            })
            return;
        }
        this.setData({
            isFocus:true
        })
        clearTimeout(this.TimeId);
        this.TimeId=setTimeout(()=>{
            this.qsearch(value);
        },1000);
    }, 
    handleCancel(){
        this.setData({
            inpValue:"",
            isFocus:false,
            goods:[]
        })
    },

    getUserLocation: function () {
        let vm = this
        wx.getSetting({
            success: (res) => {
                if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
                    //console.log('authSetting:status:拒绝授权后再次进入重新授权', res.authSetting['scope.userLocation'])
                    wx.showModal({
                        title: '',
                        content: '需要获取你的地理位置，请确认授权',
                        success: function (res) {
                            if (res.cancel) {
                                wx.showToast({
                                    title: '拒绝授权',
                                    icon: 'none'
                                })
                                setTimeout(() => {
                                    wx.navigateBack()
                                }, 1500)
                            } else if (res.confirm) {
                                wx.openSetting({
                                    success: function (dataAu) {
                                        //console.log('dataAu:success', dataAu)
                                        if (dataAu.authSetting["scope.userLocation"] == true) {
                                            vm.getLocation(dataAu)
                                        } else {
                                            wx.showToast({
                                                title: '授权失败',
                                                icon: 'none'
                                            })
                                            setTimeout(() => {
                                                wx.navigateBack()
                                            }, 1500)
                                        }
                                    }
                                })
                            }
                        }
                    })
                }
                else if (res.authSetting['scope.userLocation'] == undefined) {
                    //console.log('authSetting:status:初始化进入，未授权', res.authSetting['scope.userLocation'])
                    vm.getLocation(res)
                }
                else if (res.authSetting['scope.userLocation']) {
                    //console.log('authSetting:status:已授权', res.authSetting['scope.userLocation'])
                    vm.getLocation(res)
                }
            }
        })
    },

    getLocation: function (userLocation) {
        let vm = this
        wx.getLocation({
            type: "wgs84",
            success: function (res) {
                //console.log('getLocation:success', res)
                var latitude = res.latitude
                var longitude = res.longitude
                vm.getDaiShu(latitude, longitude)
            },
            fail: function (res) {
                //console.log('getLocation:fail', res)
                if (res.errMsg === 'getLocation:fail:auth denied') {
                    wx.showToast({
                        title: '拒绝授权',
                        icon: 'none'
                    })
                    setTimeout(() => {
                        wx.navigateBack()
                    }, 1500)
                    return
                }
                if (!userLocation || !userLocation.authSetting['scope.userLocation']) {
                    vm.getUserLocation()
                } else if (userLocation.authSetting['scope.userLocation']) {
                    wx.showModal({
                        title: '',
                        content: '请在系统设置中打开定位服务',
                        showCancel: false,
                        success: result => {
                            if (result.confirm) {
                                wx.navigateBack()
                            }
                        }
                    })
                } else {
                    wx.showToast({
                        title: '授权失败',
                        icon: 'none'
                    })
                    setTimeout(() => {
                        wx.navigateBack()
                    }, 1500)
                }
            }
        })
    }
})