import {
    getSetting,
    chooseAddress,
    openSetting,
    showModal,
    showToast,
    requestPayment
} from "../../utils/asyncWx.js";
import regeneratorRuntime, {
    async
} from '../../lib/runtime/runtime.js';
import {
    request,
    dns_request
} from "../../request/index.js";
import dns from "../../js/dns.js";

var app = getApp()
Page({
    data: {
        shopid: '',
        totPrice: 0,
        dns,
        paddress:"",
        paddresscode:"",
        preceiver:"", 
        preceivernum:"",     
        pchoosetime:"",
        currentIndex: 0,
        orderPaid:false,
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

        var that = this
    that.countDown();

        const {
            orderId
        } = options;

        const populateObjs = [{
            path: 'OrderProds',
            select: 'Prod nome unit OrderSkus prod_sale prod_regular',
            populate: [{
                path: 'OrderSkus',
                select: 'Sku attrs price_sale quantity '
            }, {
                path: 'Prod',
                select: 'img_urls'
            }]
        }]

        const res = await dns_request({
            url: "/Orders?includes=" + [orderId] + "&&populateObjs=" + JSON.stringify(populateObjs)
        })
        console.log(res);
        this.setData({
            order: res.data.objects[0],
            orderId,
        })
    },
    countDown() {
        var that = this
    
        var starttime = '2019/07/30 09:04:19'
    
        var start = new Date(starttime.replace(/-/g, "/")).getTime()
        var endTime = start + 15 * 60000
    
        var date = new Date(); //现在时间
        var now = date.getTime(); //现在时间戳
    
        var allTime = endTime - now
        var m, s;
        if (allTime > 0) {
          m = Math.floor(allTime / 1000 / 60 % 60);
          s = Math.floor(allTime / 1000 % 60);
          that.setData({
            countdown: m + "：" + s,
          })
          setTimeout(that.countDown, 1000);
        } else {
          console.log('已截止')
          that.setData({
            countdown: '00:00'
          })
        }
      },
      async PayLater(){
        const res = await dns_request({
            url: "/Order_change_status/"+this.data.orderId, method:'PUT',data:{action:'PLACE'}});

        console.log(
            res
        );
        if(res.status === 200){
            this.setData({orderPaid:true})
        }
      }
})