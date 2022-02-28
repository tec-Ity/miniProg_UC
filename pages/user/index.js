// pages/user/index.js

Page({
    data: {
        userinfo:{},
        collectNums:0,
        inpValue:"",
       phone:"+39 3293389750",
       timer: "",            
    countDownNum: '60',
    paddress:"",
    paddresscode:"",
    preceiver:"", 
    preceivernum:"",   
    },
    onLoad: async function (options) {
      console.log(options.address,options.addresscode,options.receiver,options.receivernum,options.choosetime)
      var that = this
      that.setData({
        paddress:options.address,
        paddresscode:options.addresscode,
        preceiver:options.receiver,
        preceivernum:options.receivernum,
        pchoosetime:options.choosetime ,
      })
    },
    countDown: function() {
      var _this = this;
      var countDownNum = _this.data.countDownNum;           
      var timer = setInterval(function() {
        countDownNum -= 1;
        _this.setData({
          countDownNum: countDownNum
        })
        if(countDownNum <= -1) {
          clearInterval(timer);
          _this.setData({
            countDownNum: 60,
          })
        }
      }, 1000)
    },
    onShow(){
        const userinfo=wx.getStorageSync("userinfo");
        const collect=wx.getStorageSync("collect")||[];
        this.setData({userinfo,collectNums:collect.length});
          
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
    async qsearch(query){ 
        const res=await request({url:"/goods/qsearch",data:{query}});
        //console.log(res);
        this.setData({
             goods:res
        })
    },
    handleCancel(){
        this.setData({
            inpValue:"",
            isFocus:false,
            goods:[]
        })
    },
 clear:function(){
    wx.clearStorageSync();
    wx.showToast({
       title: '退出登录成功',
       icon: 'none',
       duration: 2000,
       success: function () {
          setTimeout(function () {
             wx.reLaunch({
                url: '/pages/index/index',
             })
          }, 2000);
       }
    })
},
sendmessg: function (e) {
    var that = this;
    var mobile = that.data.mobile;
    if (mobile) {
      var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
      if (!myreg.test(mobile)) {
        wx.showToast({
          title: '手机号有误！',
          icon: "none",
          duration: 1000
        });
        return false;
      } else {
        var timer = 1;
        if (timer == 1) {
          timer = 0;
          var time = 60;
          that.setData({
            sendmsg: "Sendafter",
          })
          var inter = setInterval(function () {
            that.setData({
              getmsg: time + "s后重新发送",
            })
            time--
            if (time < 0) {
              timer = 1
              clearInterval(inter);
              that.setData({
                sendmsg: "sendmsg",
                getmsg: "获取验证码",
              })
            }
          }, 1000)
        }
        that.bindright(e);
      }
    } else {
      wx.showToast({
        title: '手机号码不能为空',
        icon: "none",
        duration: 1000
      });
    }
  },
  go:function (){
    wx.navigateTo({
      url: '../userCard/index?address='+this.data.address +"&addresscode="+this.data.addresscode+"&receiver="+this.data.receiver+"&receivernum="+this.data.receivernum+"&choosetime="+this.data.choosetime 
    })
  },
})