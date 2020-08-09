//index.js
const app = getApp()
const userMath = require('../../libs/userMath')

Page({
  mixins: [require('../../mixin/themeChanged')],
  data: {
    inputShowed: false,
    inputVal: "",
    userInputData: '',
    calculateResult: '计算结果',
    progress: 'width: 10%;',
    canceled: false
  },

  showInput: function () {
    this.setData({
        inputShowed: true
    });
  },

  hideInput: function () {
    this.setData({
        inputVal: "",
        inputShowed: false
    });
  },

  clearInput: function () {
    this.setData({
        inputVal: ""
    });
  },

  inputTyping: function (e) {
    this.setData({
        inputVal: e.detail.value
    });
    console.log(this.data.inputVal)
  },

  userInput: function(event) {
    this.setData({
      userInputData: event.detail.value
    })
  },
  startCaculate: function() {
    console.log(eval(this.data.userInputData));
    console.log("click button")
  },
  cancelCalculate: function() {
    
  }

})
