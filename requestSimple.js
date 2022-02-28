/*通用request没有loading-->requestSimple*/
function requestSimple(url, data, success, method, error) {
    console.log(url,data);
    var m = method ? method : 'POST';
    var that = this;
    return wx.request({
      url: url,
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      data: data,
      method: m,
      success: function (res) {
        if (res.data.code == "200") {
            success(res.data.data);
            return;
        }else{
            var ndata = {
                code:300,
                msg:"未请求到数据"
            }
          success(ndata);
  
        }
      },
      error: function (res) {
        error(res);
      }
    })
  }