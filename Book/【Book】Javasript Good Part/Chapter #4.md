# Chapter 4: 函式

## 重點提要

---

Object Literal (Object.prototype)
function(){ (Function.prototype -> Object.prototype)}
兩個隱藏的property: context, source code
prototype property



### Default Parameters

1. 傳統作法: 在function一開始檢查參數是否有undefined
2. 初始化參數: 直接設定參數預設值，ES2015後的語法，有以下特性:
    * 每次function被呼叫時才設定default
    * 只會由左到右依序覆寫, 不會因有設定default parameter而自動推移
    * 可以是數值、陣列、object literal、function literal...
    * 不可以在function內才定義default func
3. 引數和傳入參數數量不同時，多的忽略、少的undefined替代，不會有型別檢查
> https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Functions/Default_parameters


### 不小心就壞了的this

1. 是一個指標，指向當前的function
2. 透過invocation pattern(呼叫function的方式)來決定this指向誰，一共有4種:
    * Method: 當作物件的method
    * Function: 直接呼叫函式，包含存成variable，是壞掉的主因。
        * 宣告一個global變數存function的話，this會指向global
        * function中還有function時，執行到內層function時this會指向內層 -> 另外命名變數儲存this指標
    * Consturctor: (待補)
    * Apply: (待補)
3. Arrow Function與傳統function的比較
    * (待補)


### argument

### closure

### scope