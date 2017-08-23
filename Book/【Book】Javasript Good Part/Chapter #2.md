# Chapter 2: 文法

## 重點提要
---
### Strong Typing vs Loose Typing
1. JS屬於動態型別語言，每個型別背後都是物件(繼承自Object.prototype)。
2. 因沒有強型別語言的class hierachy結構，有些設計模式(Design Pattern)無法直接套用到Javascript。


### Data Types
1. 數值型別只有一種：number(64 bits double)，巧妙的避免短整數溢位問題
2. 文字型別只有一種：string(16 bits unicode)，沒有字元(character)型別
    * 轉義序列(escape sequence):\uxxxx，用以表示16進位的unicode字元
3. 特殊型別有: null(該有卻沒有)、undefined(不存在)、NaN、Infinity
4. 同型別的比較: 
    * NaN、Infinity無法直接比較，它們不等於任何值(包含自己本身)，需使用特別的Method判別(isNaN、isFinite)
5. 轉成boolean再比較:
    * false家族: null、undefined、NaN、''、0、false等所有奇怪的值
    * true家族: 除了上述以外所有值
    * 易混淆: object、'false' -> true


### 讓人誤會的block和scope
1. JS具有block語法，但沒有block語法的local scope概念。
2. 簡單說，兩個{}包起來並不能劃分變數的作用域；只有function literal宣告才有作用域的區別(closure)。


### 關於註解
```javascript
/*
  var regExp = /(abc)*\d+/ig;    // 多行註解若包含正規表達式，可能導致錯誤
*/
```

### try-catch-finally
1. try當中遇到throw，會將控制權轉給catch區塊；最後再跑完finally
2. catch雖然可以放condition，但此為非正規語法，可能有很大的相容性問題
> [try...catch - MDN](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Statements/try...catch)


### Compare Operators as Shortcut
1. || 如果前者false，會回傳後者的value -> 設定變數default值
2. && 如果前者false，會回傳前者的value -> 隱藏TypeError (詳見Chapter #3)


---
## 補充
---

### Unicode
1. 每個字元佔2 bytes，一共可表示2^16個字元，也就是使用4個16進制數字代表字元
2. 平面：有一個基本16位元的基本多文種平面(BMP)以及16個輔助平面，目前只使用少數平面
> 詳細請參閱 [Unicode Plane 字元平面](https://en.wikipedia.org/wiki/Plane_(Unicode))

--- 
## 補充待查
---

* dynamic object
* expressive object literal notation
* lexical scooping & first class
* lambda language
* Lisp