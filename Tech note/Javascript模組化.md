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

### 邁出第一步：LABjs (Loading And Blocking JavaScript) (現已棄用)

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

### YUI (現已棄用)

* [YUI](https://yuilibrary.com/) 可以編寫、載入Module
* [語法近似jQuery](https://www.slideshare.net/clayliao/handbook-from-jquery-to-yui-3)，將所有dependency寫入Y物件中，不同檔案間不需特地引用文件也能使用模組
* 使用YUI COMBO將眾多HTTP requests組成單一的request

-----

## CommonJS 模組化規範：走出瀏覽器
走出瀏覽器，建立模組化的規範

### Modules/1.0
* 同步模組載入
* 就近依賴、運行到時才同步下載 & 執行
* 最早成功的實現：Node.js(server-side)、Browserify(client-side)
```javascript
// server-side，現已不支援CommonJS規範
var ModuleA = require("./module-a");  // 此時才下載 & 執行 module-a
ModuleA.func();

var ModuleB = require("./module-b");  
ModuleB.func();                        // 相同func，依賴離他最近的module
```

-----

## 模組化規範的分歧：推回瀏覽器
CommonJS在server端的成功後(Node.js)，想推進到client端的browser，但對於下一版規範出現意見分歧：

### Modules/1.x
* 認為 Modules/1.x 已夠用，只要移植到瀏覽器端即可，提出了 Modules/Transport 規範，寫好的模組經過工具轉換成瀏覽器可運行的code。
* 代表實現為component、es6 module transpiler，兩者現已棄用並被babel取代。

### Modules/2.0 (現已消失)
* 認為要按瀏覽器端特徵調整 Modules/1.x，但盡可能跟它一樣。
* 代表實現為BravoJS，現已棄用消失。

### CMD (Common Module Definition)
* 前身是 Modules/Wrappings，由BravoJS的作者提出。
* 類似AMD，但相對簡潔、保持和CommonJS的兼容性，代表實現為SeaJS。
* 依賴最近的模組，執行到require才真的載入。

### AMD (Async Module Definition)
* 非同步載入，事先載入 & 提前運行前置模組，require時只有單純取exports的功用。
* 源自Modules/Async規範，認為瀏覽器端不應該直接用 Modules/1.x。自CommonJS社群獨立分出去。
* 代表實現為 RequireJS。
    * 快速上手：[初探RequireJS](https://www.openfoundry.org/tw/tech-column/8678-beginning-requirejs)
    * 支援Function Wrapping、類似CommonJS的書寫風格

-----

### ES6 Module

-----

## Reference
* [JavaScript 模块化七日谈](http://huangxuan.me/2015/07/09/js-module-7day/)
* [React 生態系（Ecosystem）入門簡介](https://github.com/kdchang/reactjs101/blob/master/Ch01/react-ecosystem-introduction.md)
* [使用 AMD、CommonJS 及 ES Harmony 编写模块化的 JavaScript](http://justineo.github.io/singles/writing-modular-js/)