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
var datePicker = require('../../utils/dateSetting.js')
const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1;
var dateTimePicker = require('../../utils/dateTimePicker.js');
Page({
  data: {
    address:"",
    addresscode:"",
    receiver:"",
    receivernum:"",
    choosetime:"",
    cart: {},
    shopid: '',
    totPrice: 0,
    dns,
    time: '',
    multiArray: [],
    multiIndex: [0, 0, 0, 0, 0],
    choose_year: "",
    date: '2018-10-01',
    time: '12:00',
    dateTimeArray: null,
    dateTime: null,
    dateTimeArray1: null,
    dateTime1: null,
    startYear: 2000,
    endYear: 2050,
  },
  onLoad: function (options) {
    var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    // 精确到分的处理，将数组的秒去掉
    var lastArray = obj1.dateTimeArray.pop();
    var lastTime = obj1.dateTime.pop();
    
    this.setData({
      dateTime: obj.dateTime,
      dateTimeArray: obj.dateTimeArray,
      dateTimeArray1: obj1.dateTimeArray,
      dateTime1: obj1.dateTime
    });


    const {
      shopid
    } = options;
    const Carts = wx.getStorageSync('Carts')
    let cart = Carts.find((cart) => {
      return shopid === cart.shopid
    })

    this.setData({
      multiArray: [
        [year + "年", year + 1 + "年", year + 2 + "年"],
        datePicker.determineMonth(),
        datePicker.determineDay(year, month),
        datePicker.determineHour(),
        datePicker.determineMinute()
      ],
      cart
    })
  },
  i_address:function(res){
    this.setData({
      address: res.detail.value
    })
   },
   i_addresscode: function (res) {
     this.setData({
       addresscode: res.detail.value
     })
   },
   i_receiver: function (res) {
     this.setData({
      receiver: res.detail.value
     })
   },
   i_receivernum: function (res) {
    this.setData({
     receivernum: res.detail.value
    })
  },
  i_choosetime: function (res) {
    this.setData({
      choosetime: res.detail.value
    })
  },
  go:function (){
     wx.navigateTo({
       url: '../orderDetail/index?address='+this.data.address +"&addresscode="+this.data.addresscode+"&receiver="+this.data.receiver+"&receivernum="+this.data.receivernum+"&choosetime="+this.data.choosetime 
     })
   },
  onShow: function () {},
  bindDateChange : function (e){
    this.setData({
      date: e.detail.value
    });
  },
  //最后呈现时间的函数。
  bindMultiPickerChange: function (e) {
    var dateStr = this.data.multiArray[0][this.data.multiIndex[0]] +
      this.data.multiArray[1][this.data.multiIndex[1]] +
      this.data.multiArray[2][this.data.multiIndex[2]] +
      this.data.multiArray[3][this.data.multiIndex[3]] +
      this.data.multiArray[4][this.data.multiIndex[4]];
    this.setData({
      time: dateStr
    })
  },
  //当时间选择器呈现并进行滚动选择时间时调用该函数。
  bindMultiPickerColumnChange: function (e) {
    //e.detail.column记录哪一行发生改变，e.detail.value记录改变的值（相当于multiIndex）
    switch (e.detail.column) {
      //这里case的值有0/1/2/3/4,但除了需要记录年和月来确定具体的天数外，其他的都可以暂不在switch中处理。
      case 0:
        //记录改变的年的值
        let year = this.data.multiArray[0][e.detail.value];
        this.setData({
          choose_year: year.substring(0, year.length - 1)
        })
        break;
      case 1:
        //根据选择的年与月，确定天数，并改变multiArray中天的具体值
        let month = this.data.multiArray[1][e.detail.value];
        let dayDates = datePicker.determineDay(this.data.choose_year, month.substring(0, month.length - 1));
        //这里需要额外注意，改变page中设定的data，且只要改变data中某一个值，可以采用下面这种方法
        this.setData({
          ['multiArray[2]']: dayDates
        })
        break;
    }
    //同上，上面改变的是二维数组中的某一个一维数组，这个是改变一个一维数组中某一个值，可供参考。
    this.setData({
      ["multiIndex[" + e.detail.column + "]"]: e.detail.value
    })
  },
  handleInput(e) {
    const {
      value
    } = e.detail;
    if (!value.trim()) {
      this.setData({
        goods: [],
        isFocus: false
      })
      return;
    }
    this.setData({
      isFocus: true
    })
    clearTimeout(this.TimeId);
    this.TimeId = setTimeout(() => {
      this.qsearch(value);
    }, 1000);
  },
  async ConfirmOrder(e) {
    const cart = this.data.cart 
    const OrderProds = [];
    for (let i = 0; i < cart.orderProds.length; i++) {
      const tempOrderProd = cart.orderProds[i]
      const OrderSkus = [];
      for (let j = 0; j < tempOrderProd.orderSkus.length; j++) {
        const tempSku = tempOrderProd.orderSkus[j];
        OrderSkus.push({
          Sku: tempSku._id,
          quantity: tempSku.quantity,
        })
      }
      OrderProds.push({
        Prod: tempOrderProd.orderProdId,
        OrderSkus,
      })
    }

    const obj = {
      Shop: cart.shopid,
      OrderProds,
      type_ship: 0
    }
    const token = wx.getStorageSync('token')
    const header = {
      "content-type": "application/json",
      authorization: 'Bear ' + token,
    }
    const res = await dns_request({
      url: "/Order",
      method: 'POST',
      header,
      data: {
        obj
      },
    })
    console.log(res);
    if (res.status === 200) wx.navigateTo({
      url: '/pages/orderDetail/index?orderId=' + res.data.object._id,
    })
  },
  async PlzChooseTime (e){
    wx.showToast({
      title: '請選擇時間',
      icon: 'none',
      duration: 1000,
      mask: true
    })
  },
  changeDate(e){
    this.setData({ date:e.detail.value});
  },
  changeTime(e){
    this.setData({ time: e.detail.value });
  },
  changeDateTime(e){
    this.setData({ dateTime: e.detail.value });
  },
  changeDateTime1(e) {
    this.setData({ dateTime1: e.detail.value });
  },
  changeDateTimeColumn(e){
    var arr = this.data.dateTime, dateArr = this.data.dateTimeArray;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    this.setData({
      dateTimeArray: dateArr,
      dateTime: arr
    });
  },
  changeDateTimeColumn1(e) {
    var arr = this.data.dateTime1, dateArr = this.data.dateTimeArray1;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    this.setData({ 
      dateTimeArray1: dateArr,
      dateTime1: arr
    });
  }
})