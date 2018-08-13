// pages/person/person.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    navbar: [
      { name: "图片", num: "" },
      { name: "收藏", num: "" },
      { name: "作品", num: "" }
    ],
    avatar : "",
    name: "",
    info: "",
    address: "",
    sex: "",
    age: "",
    code: "",
    love: "",
    fans: "",
    atten: "",
    labelArr: [
      { name: ""}
    ],

    photoArr: [
      { src: ""},
    ],
    collectArr: [
      { src: "", num: "3.6w", url: "", id: "", object_id:"" },
    ],
    worksArr: [
      { src: "", num: "",url:"",id:"" },
    ],

    show: false,
    fansShow: false
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var userid = app.d.userId;
    that.navbarTap;
    //用户发布的图片
    wx.request({
      url: app.d.ceshiUrl + '/Api/User/pcount',
      method: 'POST',
      data: { userid: userid },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success:function(res){
        var nav = that.data.navbar;
        nav[0].num=res.data;
        that.setData({
         navbar: nav
       })
      }
    })
    //用户收藏的视频
    wx.request({
      url: app.d.ceshiUrl + '/Api/User/fcount',
      method: 'POST',
      data: { userid: userid },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var nav = that.data.navbar;
        nav[1].num = res.data;
        that.setData({
          navbar: nav
        })
      }
    })
    //用户发布的视频
    wx.request({
      url: app.d.ceshiUrl + '/Api/User/vcount',
      method: 'POST',
      data: { userid: userid },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var nav = that.data.navbar;
        nav[2].num = res.data;
        that.setData({
          navbar: nav
        })
      }
    })
    //查找用户收藏所有作品
    wx.request({
      url: app.d.ceshiUrl + '/Api/User/UserFavorite',
      method: 'POST',
      data: { userid: userid },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var user = res.data;
        var collectArr = [];
        for (var i in user.id) {
          collectArr.push({
            src: user.thumbnail[i],
            url: user.url[i],
            id: user.id[i],
            object_id: user.object_id[i]
          })
        }
        that.setData({
          collectArr: collectArr
        })
      }
    })
    //用户所有信息和他发布的所有作品
    wx.request({
      url: app.d.ceshiUrl + '/Api/User/info',
      method: 'POST',
      data: { userid: userid },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //查找出用户所属标签
        wx.request({
          url: app.d.ceshiUrl + '/Api/Message/labellimit',
          method: 'POST',
          data: { userid: userid },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: function(res){
            that.setData({
              labelArr: res.data
            })
          }
        })
        
       if(res.data.status == 0){
         wx.showToast({
           title: res.data.err,
           icon: 'none',
           duration: 2000
         });
       }
      var user = res.data;
      //遍历用户发布的所有图片
      var photoArr = [];
      for (var i in user.thumbnail) {
        photoArr.push({
          src: user.thumbnail[i]
        })
      }
      //遍历用户发布的所有视频
        var worksArr =[];
        for (var i in user.thumbnail) {
          worksArr.push({
            src: user.thumbnail[i],
            num: user.num[i],
            url: user.post_content[i],
            id : user.id[i]
          })
        }
        that.setData({
          name : user.user_nickname,
          address : user.user_city,
          avatar: user.avatar,
          info : user.user_info,
          age : user.age,
          code: user.wx_code,
          love: user.receive_like_counts,
          fans: user.fans_counts,
          atten: user.follow_counts,
          photoArr: photoArr,
          worksArr: worksArr
       });
        if (user.sex == 1) {
          that.setData({ sex: '男' })
        } else if (user.sex == 2) {
          that.setData({ sex: '女' })
        } else {
          that.setData({ sex: '保密' })
        }
      },
      fail: function (res) {

      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var photoLen = this.data.photoArr.length;
    var collectLen = this.data.collectArr.length;
    var worksLen = this.data.worksArr.length;
    this.data.navbar[0].num = photoLen;
    this.data.navbar[1].num = collectLen;
    this.data.navbar[2].num = worksLen;
    this.setData({
      navbar: this.data.navbar
    })

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function (options) {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  navbarTap(e){
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  },
  showSettings(e){
    this.setData({
      show: true
    })
  },
  closeShow(e){
    this.setData({
      show: false
    })
  },
  toAddLabel(e){
    wx.navigateTo({
      url: '/pages/label/label',
    })
  },
  attenPerson(e) {
    var that = this;
    if (that.data.fansShow == false) {
      that.data.fansShow = true;
      wx.showToast({
        title: '关注成功',
        icon: 'none',
        duration: 500
      })
    } else {
      that.data.fansShow = false;
    }
    that.setData({
      fansShow: that.data.fansShow
    })
  },
  cancleAtten(e) {
    var that = this;
    if (that.data.fansShow == true) {
      that.data.fansShow = false
      wx.showToast({
        title: '您已取消关注',
        icon: 'none',
        duration: 500
      })
    } else {
      that.data.fansShow = true
    }
    that.setData({
      fansShow: that.data.fansShow
    })
  },
  toFans(e){
    wx.navigateTo({
      url: '/pages/fans/fans',
    }) 
  },
  toAtten(e){
    wx.navigateTo({
      url: '/pages/atten/atten',
    })
  },
  previewImg(e) {
    var id = e.currentTarget.dataset.id;
    var picList = [];
    for (var i = 0; i < this.data.photoArr.length;i++){
      picList.push(this.data.photoArr[i].src);
    }
    console.log("这是图片"+picList)
    wx.previewImage({
      current: this.data.photoArr[id].src, // 当前显示图片的http链接
      urls: picList // 需要预览的图片http链接列表
    })
  },
  toDetail(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/video/video?id='+id,
    })
  },
  toFavorite(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/video/video?id=' + id,
    })
  }
})
