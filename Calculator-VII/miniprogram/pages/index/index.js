//index.js
const app = getApp()
const UserMath = require('../../libs/userMath')

Page({
  mixins: [require('../../mixin/themeChanged')],
  data: {
    inputShowed: false,
    inputVal: "",
    result: '',
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
  },

  startCaculate: function() {
    console.log('Enter')
    let that = this
    let input = that.data.inputVal.split(' ')
    console.log(input)
    if (that.data.length <= 0) {
      return
    }
    let output = UserMath.shuntingYardAlgorithm(input)
    console.log(output)
    if (!output.status) {
      that.setData({
        result:'转换表达式出错|' + output.errmsg
      })
      return
    }
    let calcResult = UserMath.executeReversePolishNotationExpression(output.result)
    console.log(calcResult)
    if (!calcResult.status) {
      that.setData({
        result:'计算出错|' + calcResult.errmsg
      })
      return
    }
    that.setData({
      result:'表达式计算结果为：' + calcResult.result
    })
  },
})
