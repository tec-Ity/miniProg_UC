import dns from "../js/dns.js";
let ajaxTimes = 0;
export const request = (params) => {
    let header = {
        ...params.header
    };
    if (params.url.includes("/my/")) {
        header["Authorization"] = wx.getStorageSync("token");
    }
    const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1";
    ajaxTimes++;
    wx.showLoading({
        title: "加载中",
        mask: true
    });

    return new Promise((resolve, reject) => {
        wx.request({
            data: params.data,
            header: header,
            url: baseUrl + params.url,



            success: (result) => {
                resolve(result.data.message);
            },
            fail: (err) => {
                reject(err);
            },
            complete: () => {
                ajaxTimes--;
                if (ajaxTimes === 0) {
                    wx.hideLoading();
                }
            }
        });

    })
};
export const dns_request = (params) => {
    let header = {}
    if (params.header) {
        header = {
            ...params.header
        };
    } else {
        const token = wx.getStorageSync('token')
        header = {
            authorization: 'Bear ' + token
        }
    }
    if (params.url.includes("/my/")) {
        header["Authorization"] = wx.getStorageSync("token");
    }
    // const baseUrl="https://api-hmugo-web.itheima.net/api/public/v1";  
    const baseUrl = dns + "/api/v1";
    ajaxTimes++;
    wx.showLoading({
        title: "加载中",
        mask: true
    });
    let method = params.method || 'GET'
    console.log(method);
    return new Promise((resolve, reject) => {
        wx.request({
            data: params.data,
            header,
            url: baseUrl + params.url,
            method,

            success: (result) => {
                console.log('1111', result.data);
                resolve(result.data);
            },
            fail: (err) => {
                reject(err);
            },
            complete: () => {
                ajaxTimes--;
                if (ajaxTimes === 0) {
                    wx.hideLoading();
                }
            }
        });

    })
}