import {
  request,
  dns_request
} from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime.js';
import dns from "../../js/dns.js";
import {
  getSetting,
  chooseAddress,
  openSetting,
  showModal,
  showToast
} from "../../utils/asyncWx.js";
Page({
  data: {
    pageSize : 30,
    currentPage : 1,
    catesSons: [],
    leftMenuList: [],
    prods: [],
    cart: {},
    dns,
    currentIndex: 0,
    scrollTop: 0,
    Cates: [],
    shopid: '',
    showModalStatus: false
  },
  onLoad: async function (options) {
    const categ2 = await this.getCates();
    this.getProds(categ2); 
    // const Categ2 = await this.getProds(); 
    // this.getProds(Categ2,currentPage);
  },
  onShow: async function () {
    const shopid = getApp().globalData.homeCurrentTab
    this.setData({
      shopid
    })
    wx.setStorageSync("currentShop", shopid);
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
  async getCates() {
    return new Promise(async (resolve) => {
      const populateObjs = [{
        path: "Categ_sons",
        select: "code",
      }]
      const res = await dns_request({
        url: "/Categs?populateObjs=" + JSON.stringify(populateObjs)
      })
      const cates1 = res.data.objects;
      const catesSons = [];
      cates1.forEach(categ1 => {
        const cates2 = categ1.Categ_sons;
        cates2.forEach(cate2 => {
          catesSons.push(cate2)
        })
      })
      this.setData({
        catesSons
      })
      return resolve((catesSons.length > 0) ? catesSons[this.data.currentIndex] : null);
    })
  },
  async getProds(Categ2,currentPage=1) {
    // let queryCateg = "";
    // if (Categ2 && Categ2._id) queryCateg = "&Categs=" + Categ2._id;
    const queryPage = '&currentPage=' + this.data.currentPage
    console.log(queryPage);
    const queryShop = '&Shops=' + this.data.shopid
    console.log(queryShop);
    let Categ = Categ2._id 
    let queryCateg = '&Categs=' + Categ
    console.log(queryCateg);
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
      url: "/Prods?populateObjs=" + JSON.stringify(populateObjs) + queryCateg + queryShop + queryPage
    });
    this.Prods = res.data.objects;

    // let prods = this.Prods
    if(this.data.currentPage === 1){
      this.setData({
        prods : [...this.Prods]
      })
    } else {
      this.setData({
        prods : [...this.Prods , ...res.data.objects]
      }) 
    }
    this.getCarts();
  },
  onReachBottom(Categ2) {
    console.log(this.data.currentPage);
    var that = this;
      if( that.data.pageSize === 30 * (that.data.currentPage)){
      that.data.currentPage = that.data.currentPage + 1;
      that.data.currentCateg2  
      that.getProds(Categ2,that.data.currentPage)
 
      // let prods = that.data.objects
      // that.setData({
      //   prods 
      // })
    } else {
      wx.showToast({
        title: '没有更多数据了',
        icon: 'none',
        duration: 1000,
        mask: true
      })
    }
  },
  onPullDownRefresh() {
    console.log(that.data.currentPage);
    var that = this;
    if (that.data.currentPage === 1) { 
        wx.stopPullDownRefresh() 
  } else { 
      that.data.currentPage = that.data.currentPage - 1;
      that.getProds()
      wx.stopPullDownRefresh()
    }
  },
  async getCarts(e) {
    let Carts = wx.getStorageSync("Carts") || [];
    const cart = Carts.find((cart) => {
      return cart.shopid === this.data.shopid
    });
    if (cart) {
      const prods = this.data.prods
      for (let i = 0; i < prods.length; i++) {
        for (let j = 0; j < cart.orderProds.length; j++) {
          if (prods[i]._id === cart.orderProds[j].orderProdId) {
            prods[i].quantity = cart.orderProds[j].orderProdQuantity
          } else {}
        }
      }
      this.setData({
        prods,
        cart
      })
    }

  },
  handleCatesTap(e) {
    const {
      index
    } = e.currentTarget.dataset;
    const Categ2 = this.data.catesSons[index];
    this.getProds(Categ2);
    // const prods = Categ2._id;
    this.setData({
      currentIndex: index,
      currentCateg2: Categ2,
    })
  },
  handleMultiTap: function (e) {
    const {
      prodid
    } = e.currentTarget.dataset

    const prod = this.data.prods.find(prod => prod._id === prodid);
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
  async handleSkuNumEdit(e) {
    // 有數量的商品 點擊加減按鈕之後觸發的
    let Carts = wx.getStorageSync("Carts") || [];
    const {
      operation,
      prodid,
      skuid,
      price
    } = e.currentTarget.dataset;
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
    const prods = this.data.prods;
    let is_simple = true;
    for (let i = 0; i < prods.length; i++) {
      if (prods[i]._id === prodid) {
        prods[i].quantity += operation
        is_simple = prods[i].is_simple
      }
    }
    this.setData({
      prods
    })

    if (!is_simple) {
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
      const prods = this.data.prods;
      prods.forEach(prod => {
        if (prod._id === prodid) {
          prod.quantity = 0;
        }
      })
      this.setData({
        prods
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

    const tempProd = this.data.prods.find((tempProd) => {
      return tempProd._id === prodid
    });

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
          if (cart.orderProds[i].orderProdId === prodid) {
            cart.orderProds[i] = orderProd
            break;
          }
        }
      }

      cart.totPrice += price;

      for (let i = 0; i < Carts.length; i++) {
        if (Carts[i].shopid === this.data.shopid) {
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
    const prods = this.data.prods;
    let is_simple = true;
    for (let i = 0; i < prods.length; i++) {
      if (prods[i]._id === prodid) {
        prods[i].quantity = 1
        is_simple = prods[i].is_simple
      }
    }
    const newCurrentSkus = this.data.currentSkus
    if (!is_simple && newCurrentSkus) {
      for (let i = 0; i < newCurrentSkus.length; i++) {
        if (newCurrentSkus[i]._id === skuid) {
          newCurrentSkus[i].quantity = 1;
        }
      }
    }

    this.setData({
      prods,
      currentSkus: newCurrentSkus,
      cart
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
  }
})