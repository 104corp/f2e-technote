# React 開發環境設置與 Webpack 入門教學

## Javascript 模組化

### 最早的封裝方式

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

