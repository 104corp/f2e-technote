# Javascript 模組化
基本封裝 -> 管理、載入模組


## 最早的封裝方式

### Global Function
* 所有function都是global和public，容易彼此影響

```javascript
function a(){
    ....
}

function b(){
    ....
}
```

### Namespace
* 封裝成單一物件，減少global上變數

#### 簡單封裝
* 所有function都是public

```javascript
var App = {
    a: function(){
        ....
    },
    b: function(){
        ....
    }
}
```

#### IIFE封裝
* IIFE內產生新scope，因此外部無法存取，成為private
* 可以傳入依賴的模組或變數

```javascript
var Module = (function(){
    var msg = "Hello";
    function a(){
        console.log(`${msg} Henry!`);
    }
    var b = function(){
        console.log(`${msg} Mary!`);
    }
    
    return {  // 需要對外export的method
      a,
      b,
    }
})();

Module.a();                  // "Hello Henry!"
Module.b();                  // "Hello Mary!"
console.log(Module.msg);     // undefined
```

-----

## Script Loader：以文件為單位

### 談談 Script Tags 的特性

* 有順序性，DOM的擺放順序代表執行順序
    * 舊的瀏覽器：一個一個載完並執行
    * 新的瀏覽器：平行載入，依序執行，彼此間會有預設的延遲
* 重點是：難以維護、同時發出過多的HTTP request

```html
<!-- 同時讀取，執行順序由01~03 -->
<script src="./js/module01.js"></script>
<script src="./js/module02.js"></script>
<script src="./js/module03.js"></script>
```

### 邁出第一步：LABjs (Loading And Blocking JavaScript)

* [LABjs](https://github.com/getify/LABjs) 是動態載入sciprt的loader
* 支援平行載入、盡可能快地執行(FIFO)，除非使用wait()等待。

```html
<!-- 同時讀取，執行順序由01~03 -->
<script src="LAB.js"></script>
<script>
    $LAB.script("./js/module01.js")
        .script("./js/module02.js").wait()
        .script("./js/module03.js")
</script>
```

-----

## Module Loader：以模組為單位

### YUI

* [YUI](https://yuilibrary.com/) 可以編寫、載入Module
* 語法近似jQuery，將所有dependency寫入Y物件中，不同檔案間不需特地引用文件也能使用模組
* 快速上手：[From jQuery to YUI](https://www.slideshare.net/clayliao/handbook-from-jquery-to-yui-3)，**BUT NOW DEPRECATED**
* 使用YUI COMBO將眾多HTTP requests組成單一的request

-----

## 模組化規範

### CommonJS

* 同步模組載入的規範

#### Node.js

* server-side，現已不支援CommonJS規範
* 同步載入、就近依賴、運行到時才同步下載 & 執行

```javascript
var ModuleA = require("./module-a");  // 此時才下載 & 執行 module-a
ModuleA.func();

var ModuleB = require("./module-b");  
ModuleB.func();                        // 相同func，依賴離他最近的module
```

#### Browserify

* client-side


### AMD (Async Module Definition)

* 非同步載入模組的規範，常用於瀏覽器端。

#### RequireJS

* [RequireJS](http://requirejs.org/)，事先把依賴的模組下載完
* 快速上手：[初探RequireJS](https://www.openfoundry.org/tw/tech-column/8678-beginning-requirejs)
* 使用Function Wrapping的寫法，但也支援類似CommonJS的寫法

```javascript

```

### CMD (Common Module Definition)

* 類似AMD，但相對簡潔、保持和CommonJS的兼容性
    * SeaJS

### ES6 Module

-----

## Reference
* [JavaScript 模块化七日谈](http://huangxuan.me/2015/07/09/js-module-7day/)
* [React 生態系（Ecosystem）入門簡介](https://github.com/kdchang/reactjs101/blob/master/Ch01/react-ecosystem-introduction.md)
* [使用 AMD、CommonJS 及 ES Harmony 编写模块化的 JavaScript](http://justineo.github.io/singles/writing-modular-js/)