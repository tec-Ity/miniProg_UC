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
Page({
    data: {
        dns,
        isPaid: false, 
        isFinished: false,
        isServiced: false,
        isCanceled: false,
},
onLoad: async function (options) {
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
        order: res.data.objects[0]
    })
},
toPay () {
    var bol = this.data.isPaid; // 获取状态
    this.setData({
    isPaid:!bol // 改变状态
    
    })
    
    },
    toProcess () {
        var bol = this.data.isFinished; // 获取状态
        this.setData({
        isFinished:!bol // 改变状态
        
        })
        
        },
        toServiced () {
            var bol = this.data.isServiced; // 获取状态
            this.setData({
                isServiced:!bol // 改变状态
            
            })
            
            },
            toCanceled () {
                var bol = this.data.isCanceled; // 获取状态
                this.setData({
                    isCanceled:!bol // 改变状态
                
                })
                
                },
onShow:function (options){
}
})