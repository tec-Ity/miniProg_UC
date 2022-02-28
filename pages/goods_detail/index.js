import {
  getSetting,
  chooseAddress,
  openSetting,
  showModal,
  showToast
} from "../../utils/asyncWx.js";
import {
  request,
  dns_request
} from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime.js';
import dns from "../../js/dns.js";
Page({
  data: {
    RecommandProds: [],
    prod: {},
    goodsObj: {},
    isCollect: false,
    showModalStatus: false,
    dns,
    shopid: '',
    showModalStatus: false
  },
  onShow: function () {
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    let options = currentPage.options;
    const {
      _id
    } = options;
  },
  powerDrawer: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu)
  },
  util: function (currentStatu) {
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    });

    this.animation = animation;

    animation.translateY(240).step();
    this.setData({
      animationData: animation.export()
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation
      })

      if (currentStatu == "close") {
        this.setData({
          showModalStatus: false
        });
      }
    }.bind(this), 200)

    if (currentStatu !== "close") {
      this.setData({
        showModalStatus: currentStatu
      });
    }
  },
  moreBtn: function () {
    this.plus();
  },
  plus: function () {
    if (!this.data.isPopping) {
      this.popp();
      this.setData({
        isPopping: true
      })
    } else {
      this.takeback();
      this.setData({
        isPopping: false
      });
    }
  },
  input: function () {},
  transpond: function () {},
  collect: function () {},
  popp: function () {
    let animationPlus = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease'
    })
    let animationcollect = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease'
    })
    let animationTranspond = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease'
    })
    let animationInput = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease'
    })
    animationPlus.rotateZ(180).step();
    animationcollect.translate(-0, -100).rotateZ(0).opacity(1).step();
    animationTranspond.translate(-85, -75).rotateZ(0).opacity(1).step();
    animationInput.translate(-80, 10).rotateZ(0).opacity(1).step();
    this.setData({
      animPlus: animationPlus.export(),
      animCollect: animationcollect.export(),
      animTranspond: animationTranspond.export(),
      animInput: animationInput.export(),
    })
  },
  takeback: function () {
    let animationPlus = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease'
    })
    let animationcollect = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease'
    })
    let animationTranspond = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease'
    })
    let animationInput = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease'
    })
    animationPlus.rotateZ(0).step();
    animationcollect.translate(0, 0).rotateZ(0).opacity(0).step();
    animationTranspond.translate(0, 0).rotateZ(0).opacity(0).step();
    animationInput.translate(0, 0).rotateZ(0).opacity(0).step();
    this.setData({
      animPlus: animationPlus.export(),
      animCollect: animationcollect.export(),
      animTranspond: animationTranspond.export(),
      animInput: animationInput.export(),
    })
  },

  onLoad: async function (options) {
    const {
      prod_id: _id
    } = options;
    const attrsPopulate = {
      path: "attrs",
      select: "nome option"
    }
    const populateObjs = [{
      path: "Skus",
      select: "price_regular price_sale attrs",
      populate: [attrsPopulate]
    }]
    const res = await dns_request({
      url: "/Prod/" + _id + "?populateObjs=" + JSON.stringify(populateObjs)
    })
    const prod = res.data.object;
    //console.log(prod)
    this.setData({
      prod,
      shopid: prod.Shop
    })
this.getCarts( prod,prod.Shop)
  },

  async getCarts(prod,shopid) {
    console.log(shopid);
    let Carts = wx.getStorageSync("Carts") || [];
    const cart = Carts.find((cart) => {
      return cart.shopid === this.data.shopid
    });
    if (cart) {
      console.log(cart);

      console.log(prod);
      for (let i = 0; i < cart.orderProds.length; i++) {
        if (prod._id === cart.orderProds[i].orderProdId) {
          console.log(222);
          prod.quantity = cart.orderProds[i].orderProdQuantity
        }
      }
      this.setData({
        prod,
        cart
      })
    }
  },
  handleMultiTap: function (e) {
    const {
      prodid
    } = e.currentTarget.dataset

    const prod = this.data.prod;
    const currentSkus = prod.Skus.map(sku => ({
      ...sku,
      prodid
    }));

    let Carts = wx.getStorageSync("Carts") || [];
    const cart = Carts.find((cart) => {
      return cart.shopid === this.data.shopid
    });
    if (cart) {
      const orderProd = cart.orderProds.find(orderProd => orderProd.orderProdId === prodid)
      if (orderProd) {
        const orderSkus = orderProd.orderSkus;
        for (let i = 0; i < currentSkus.length; i++) {
          for (let j = 0; j < orderSkus.length; j++) {
            if (currentSkus[i]._id === orderSkus[j]._id) {
              currentSkus[i].quantity = orderSkus[j].quantity;
            }
          }
        }
      }
    }

    this.setData({
      currentSkus,
      showSkus: true
    })
  },

  handleSkuNumEdit: function (e) {
    // 有數量的商品 點擊加減按鈕之後觸發的
    let Carts = wx.getStorageSync("Carts") || [];
    const {
      operation,
      prodid,
      skuid,
      price
    } = e.currentTarget.dataset;

    const prod = this.data.prod
    const is_simple = prod.is_simple

    const cart = Carts.find((cart) => {
      return cart.shopid === this.data.shopid
    })

    for (let i = 0; i < cart.orderProds.length; i++) {
      if (prodid === cart.orderProds[i].orderProdId) {
        for (let j = 0; j < cart.orderProds[i].orderSkus.length; j++) {
          if (skuid === cart.orderProds[i].orderSkus[j]._id) {
            cart.orderProds[i].orderSkus[j].quantity += operation
            cart.orderProds[i].orderProdQuantity += operation
          }
        }
      }
    }
    cart.totPrice += price * operation
    for (let k = 0; k < Carts.length; k++) {
      if (Carts[k].shopid = this.data.shopid) {
        Carts[k] = cart
        break;
      }
    }
    wx.setStorageSync("Carts", Carts)
    this.setData({
      cart
    })

    prod.quantity += operation

    this.setData({
      prod
    })

    if (!is_simple && this.data.currentSkus) {
      const newCurrentSkus = this.data.currentSkus;
      newCurrentSkus.forEach(sku => {
        if (sku._id === skuid) {
          sku.quantity += operation
        }
      })
      this.setData({
        currentSkus: newCurrentSkus
      })
    }
  },

  deleteSku: function (e) {
    let Carts = wx.getStorageSync("Carts") || [];
    const cart = Carts.find((cart) => {
      return cart.shopid === this.data.shopid
    })
    const {
      prodid,
      skuid,
      price
    } = e.currentTarget.dataset;
    let i = 0
    let j = 0
    for (; i < cart.orderProds.length; i++) {
      if (prodid === cart.orderProds[i].orderProdId) {
        for (; j < cart.orderProds[i].orderSkus.length; j++) {
          if (skuid === cart.orderProds[i].orderSkus[j]._id) {
            break
          }
        }
        cart.orderProds[i].orderSkus.splice(j, 1)
        if (this.data.currentSkus && this.data.showSkus) {
          const currentSkus = this.data.currentSkus;
          currentSkus.forEach(sku => {
            if (sku._id === skuid) {
              sku.quantity = 0;
            }
          })
          this.setData({
            currentSkus
          })
        }
        break
      }
    }
    if (cart.orderProds[i].orderSkus.length === 0 || (cart.orderProds[i].is_simple === false && cart.orderProds[i].orderSkus.length === 1)) {
      cart.orderProds.splice(i, 1);
      const prod = this.data.prod;

      prod.quantity = 0;

      this.setData({
        prod
      })
    }
    cart.totPrice -= price;
    let delCart = -1
    for (let k = 0; k < Carts.length; k++) {
      if (Carts[k].shopid = this.data.shopid) {
        if (cart.orderProds.length === 0) {
          delCart = k
          break;
        } else {
          Carts[k] = cart
          break;
        }
      }
    }
    if (delCart > -1) Carts.splice(delCart, 1)
    else this.setData({
      cart
    })

    wx.setStorageSync("Carts", Carts)

  },

  handleSkuNumAdd: function (e) {
    let Carts = wx.getStorageSync("Carts") || [];
    const cart = Carts.find((cart) => {
      return cart.shopid === this.data.shopid
    });

    const {
      prodid,
      skuid,
      price
    } = e.target.dataset;

    const tempProd = this.data.prod

    if (!cart) {
      const newCart = {};
      newCart.shopid = this.data.shopid
      newCart.totPrice = price
      const newOrderProd = {};
      let newOrderSku = {};
      let quantity = 0;
      newOrderProd.orderProdId = prodid
      newOrderProd.orderProdNome = tempProd.nome
      newOrderProd.orderProdImg = tempProd.img_urls[0]
      newOrderProd.orderProdQuantity = 1
      newOrderSku = tempProd.Skus.find(sku => sku._id === skuid)
      newOrderSku.quantity = 1
      newOrderProd.orderSkus = [newOrderSku]
      newCart.orderProds = [newOrderProd]
      Carts.push(newCart)
      this.setData({
        cart: newCart
      })
    } else { //有購物車
      const orderProd = cart.orderProds.find((orderProd) => {
        return orderProd.orderProdId === prodid
      });
      if (!orderProd) {
        const newOrderProd = {};
        let newOrderSku = {};
        newOrderProd.orderProdId = prodid
        newOrderProd.orderProdNome = tempProd.nome
        newOrderProd.orderProdImg = tempProd.img_urls[0]
        newOrderProd.orderProdQuantity = 1
        newOrderSku = tempProd.Skus.find(sku => sku._id === skuid)
        newOrderSku.quantity = 1
        newOrderProd.orderSkus = [newOrderSku]
        cart.orderProds.push(newOrderProd)
      } else {
        //有prod
        let newOrderSku = {};
        newOrderSku = tempProd.Skus.find(sku => sku._id === skuid)
        newOrderSku.quantity = 1
        orderProd.orderSkus.push(newOrderSku)
        orderProd.orderProdQuantity += 1;
        for (let i = 0; i < cart.orderProds.length; i++) {
          if (cart.orderProds[i].orderProdId = prodid) {
            cart.orderProds[i] = orderProd
            break;
          }
        }
      }
      cart.totPrice += price;
      for (let i = 0; i < Carts.length; i++) {
        if (Carts[i].shopid = this.data.shopid) {
          Carts[i] = cart
          break;
        }
      }
      this.setData({
        cart
      })
    }
    wx.setStorageSync("Carts", Carts);
    this.setData({
      Carts
    })

    //update wxml prods & currentSkus
    let is_simple = tempProd.is_simple;

    tempProd.quantity = 1
    if (this.data.currentSkus) {
      const newCurrentSkus = this.data.currentSkus
      if (!is_simple && newCurrentSkus) {
        for (let i = 0; i < newCurrentSkus.length; i++) {
          if (newCurrentSkus[i]._id === skuid) {
            newCurrentSkus[i].quantity = 1;
          }
        }
      }
      this.setData({
        currentSkus: newCurrentSkus,
        cart
      })
    }
    this.setData({
      prod: tempProd,
    })
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
  },
})