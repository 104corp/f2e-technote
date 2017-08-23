# Chapter 3: 物件

## 重點提要

---

### 取得不存在的物件property

1. 取得不存在的property value會返回undefined
2. 從undefined取得值會跳TypeError
3. 避免上述錯誤的方法:
    * 給定預設值: obj.prop || default
    * 隱藏TypeError: obj.prop && obj.prop.val (回傳前者的值undefined)


### 比較in和hasOwnProperty

1. in會循著protptype chain去尋找繼承的屬性值
2. hasOwnProperty只尋找該object自身的屬性值
3. 若object的內建屬性被覆寫，可以到他的prototype使用func.call()來呼叫
> http://adripofjavascript.com/blog/drips/the-uses-of-in-vs-hasownproperty.html


### 比較call和apply

1. 一言以蔽之：接收的參數形式不同
> https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Function


### Object Prototype Chain 物件原型鍊

1. 透過object literal建立的物件，原型為Object.prototype
2. 委派(delegation): 取得屬性的值時，透過prototype chain一路向上找，除非找不到才undefined
3. 反映(reflecting): 取得屬性值並做檢查，常見的檢查有型別typeof(要小心function)、屬性存在hasOwnProperty
4. 列舉(enumeration): 使用for in列出該物件所有property，包含繼承而來的property，不保證排序
5. 刪除(delete): 刪除物件特定屬性，請參考下一點。


### delete operator的迷思

1. delete可清除該物件本身的property，但無法直接釋放記憶體
2. 若該property原先是繼承而來並複寫，清除以後會循Prototype Chain自動重新繼承該property
3. 透過var、let、const等直接literal宣告的property無法清除
> https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/delete


---
## 補充
---

### Javascript的模組化
```
1. namespace封裝: 以單一全域變數取代亂撒的全域變數
2. 匿名closure封裝: IIFE(Immediately Invoked Function Expression)，利用closure特性進行封裝
3. ....(待補完)
```
* [js模組化七日談](http://huangxuan.me/2015/07/09/js-module-7day/)
* [Javascript Modules: A Beginner's Guide](https://medium.freecodecamp.org/javascript-modules-a-beginner-s-guide-783f7d7a5fcc)