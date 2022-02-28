import {
  getSetting,
  chooseAddress,
  openSetting,
  showModal,
  showToast
} from "../../utils/asyncWx.js";
import regeneratorRuntime from '../../lib/runtime/runtime.js';
import {
  request,
  dns_request
} from "../../request/index.js";
import dns from "../../js/dns.js";
Page({
  data: {
    dns,
    cart: {}
  },
  onLoad: function (options) {},
  onShow: function () {
    const currentTab = wx.getStorageSync("currentTab");
    const shopid = getApp().globalData.homeCurrentTab

    wx.setStorageSync("currentShop", shopid);
    const carts = wx.getStorageSync("Carts") || [];
    let cart = {
      shopid
    };
    for (let i = 0; i < carts.length; i++) {
      if (carts[i].shopid === shopid) {
        cart = carts[i];
        break;
      }
    }
    this.setCart(cart);
  },

  setCart(cart) {
    let totalPrice = 0;
    let totalNum = 0;
    totalNum =
      totalPrice =
      this.setData({
        cart,
        totalPrice,
        totalNum,
      });
    wx.setStorageSync("cart", cart);
  },
  async handlePay() {
    const {
      totalNum
    } = this.data;
    if (totalNum === 0) {
      await showToast({
        title: "您还没有选购商品"
      });
      return;
    }
    wx.navigateTo({
      url: '/pages/pay/index'
    });
  },
  async handleDeleteCart(e) {
    // 購物車詳情頁 點擊刪除后 觸發 1）本頁{cart}裏商品刪除 2）緩存[Carts]中本次購物車{cart}内商品刪除 3)category和goods_detail 頁 添加進購物車的商品也都進行清零 最後返回到category頁面

    let Carts = wx.getStorageSync("Carts") || [];
    const shopid = e.currentTarget.dataset.shopid;
    const res = await showModal({
      content: "確定刪除此購物車?",
      cancelText: "取消",
      confirmText: "確定",
      cancelColor: ' #C0E57B',
      confirmColor: ' #C0E57B',
    });
    let index = 0
    for (; index < Carts.length; index++) {
      if (Carts[index].shopid === shopid) {
          break
      }
    }
    Carts.splice(index, 1);
    this.setCart(Carts);
    wx.setStorageSync("Carts", Carts)
    wx.switchTab({
      url: '/pages/category/index', 
      success: function (e) {
        var page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onShow();
      }
    });
  }
})