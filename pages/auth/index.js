import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime.js';
import { login } from "../../utils/asyncWx.js";
Page({
 async handleGetUserInfo(e){
   //console.log(e);
   wx.login({
     timeout:10000,
     success: (result) => {
       //console.log(result);
       const {code} = result;
     }
   });
     
   try {
    const { encryptedData ,rawData,iv,signature } = e.detail;
    const {code}=await login();    
    const loginParams={ encryptedData ,rawData,iv,signature,code };
    // const {token}=await request({url:"/users/wxlogin",data:loginParams,method:"post"});
    // wx.setStorageSync("token",token);
    wx.navigateBack({
        delta: 1
    });        
   } catch (error) {
      //console.log(error); 
   }
 }
})
