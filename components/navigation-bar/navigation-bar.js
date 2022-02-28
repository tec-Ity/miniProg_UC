// components/ChooseAddress/ChooseAddress.js
Component({
   options:{
    multipleSlots:true,
    addGlobalClass:true
   },
    properties: {
        chooseAddressImage:{
            type:String,
            value:'/icons/mapInsertLocation.svg'
        },
        extClass:{
            type:String,
            value:''
        },
        title:{
            type:String,
            value:''
        },
        background:{
             type:String,
             value:'#ffffff'
        },
        color:{
            type:String,
            value:'#000000'
        },
        dbclickBackTop:{
            type:Boolean,
            value:true
        },
        border:{
            type:Boolean,
            value:false
        },
        loading:{
            type:Boolean,
            value:false
        },
        show:{
            type:Boolean,
            value:true,
            observer:'_showChange'
        },
        left:{
            type:Boolean,
            value:false
        },
        center:{
            type:Boolean,
            value:false
        },
    },

    
    data: {
        displayStyle:'',
        showBack:false
    },
    attached: function attached(){
        var _this = this;

        var isSupport = !!wx.getMenuButtonBoundingClientRect;
        var rect = wx.getMenuButtonBoundingClientRect ? wx.getMenuButtonBoundingClientRect() : null;
        wx.getSystemInfo({
          success: function success (res) {
            var ios = !!(res.system.toLowerCase().search('ios') + 1);
            var statusBarHeight=res.statusBarHeight;
            var topBarHeight=ios ? (44 + statusBarHeight) : (48 + statusBarHeight);
            
            _this.setData({
              ios: ios,
              topBarHeight:topBarHeight, 
              statusBarHeight:statusBarHeight,
              innerWidth: isSupport ? 'width:' + rect.left + 'px' : '',
              innerPaddingRight: isSupport ? 'padding-right:' + (res.windowWidth - rect.left) + 'px' : '',
              leftWidth: isSupport ? 'width:' + (res.windowWidth - rect.left) + 'px' : ''
          }); 

          _this.triggerEvent('getBarInfo', {topBarHeight,statusBarHeight});               
        }
    });
 var pages=getCurrentPages()      
    if(pages.length>1){
      this.setData({showBack:true})
    }
  },
  methods: {
    _showChange: function _showChange(show) {           
      var displayStyle = 'opacity: ' + (show ? '1' : '0') + ';-webkit-transition:opacity 0.5s;transition:opacity 0.5s;';           
      this.setData({
          displayStyle: displayStyle
      });
    },

    goBack: function () {
      wx.navigateBack();
      this.triggerEvent('back');
    },
    
    goHome:function(){
      wx.reLaunch({
        url: '/pages/index/index'
      })
    },
  
    doubleClick(e) {
      if (!this.data.dbclickBackTop){return}
      if (this.timeStamp && (e.timeStamp - this.timeStamp < 300)) {
        this.timeStamp = 0
        wx.pageScrollTo({
          scrollTop: 0,
          duration: 300
        })
      } else {
        this.timeStamp = e.timeStamp
      }
    }
  },
  handleChooseAddress(e){
    wx.navigateTo({
      url: '/pages/search/index',
    })
  }
});