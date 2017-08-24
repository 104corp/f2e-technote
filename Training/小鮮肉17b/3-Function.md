# Function
function是JS中很強大的一部份，有一些觀念很容易搞混，要仔細弄清楚。

## 函式的定義
有四種定義函式的方法

### Function Constructor
* 宣告完會產生一個**不含closure**的Function物件。
```javascript
// 幾乎不太會使用
var test = new Function(arg1, arg2, 'return arg1+arg2;');
```

### Function Declaration
* hoisting：提昇整個function宣告，因此擺放位置不影響程式執行，包含放在if-else判斷式內。
* 宣告完會產生一個**包含closure**的Function物件。

```javascript
function test (){ .... }
test();
```

### Function Expression
* 函式名稱可以忽略，稱為匿名函式(anonymous function)，名稱存在name的property。
* 函式有命名的話，可以在內部使用函式名稱遞迴呼叫(Recursive)，例如：test()，但不能在外部呼叫。
    * 補充：以前匿名函式可以用arguments.callee呼叫自己，但ES5後strict mode被禁用。詳情參考[這篇](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Functions/arguments/callee)。
* hoisting：只有提昇宣告(var)的變數，不提昇賦值(initialize)部分。因此，位置會影響程式執行。
* 可使用立即執行函式(IIEF)。

```javascript
// function有命名
var variable = function test(arg){ ... };  
variable(arg);  // variable.name == 'test', work
test(arg);      // variable.name == 'test', but NOT work

var variable = function test(arg){ 
    return (arg > 1) ? true : test(arg);  // in the function body will work
};  

// function名稱可以忽略
var variable = function(arg){ ... };       
variable(arg);  // variable.name == 'variable', work
```

```javascript
// Compare hoisting behavior

// Function Declaration
console.log(a);                        // function a(){....}, 輸出宣告
console.log(a());                      // 'function a', 輸出執行結果
function a(){ return 'function a'; }

// Function Expression
console.log(b);       // undefined, 僅輸出宣告(b), 未賦值(function)
console.log(b());     // error, b的值為undefined而非function
var b = function(){ return 'function b'; }
```

### 立即執行函式 IIFE (Immediately Invokable Function Expression)
* 一次性的匿名函式，可傳入參數
* 避免全域變數的汙染、variable hoisting

```javascript
(function(parameters) {
    .....
})(input);


var a = 50;

(function(num){
  console.log(num + 10);  // 60
})(a)
```

## 函式的使用方式 (Invokation Pattern)
* func vs func()：有括號代表函式的**執行結果(return)**。
* 預設return undefined(沒有new) / this(有new)
```javascript
// 沒有new
var func = function(){}
console.log(func);        // 輸出 function(){}
console.log(func());      // 輸出 undefined

// 有new
function Person(){}
console.log(Person);       // 輸出 function Person(){}
console.log(new Person()); // 輸出 this, 這邊為物件 Person{}
```

* 四種常見的函式呼叫pattern
```javascript
// 1. Method Pattern
var obj = { addTen: function(num){ return num + 10; } }
obj.addTen(15);  // 25


// 2. Function Pattern
var func = function(num){ return num + 10; }
func(15);  // 25


// 3. Constructor Pattern
function Test(){
    this.addTen = function(num){ return num + 10; }
}

var instance = new Test();
instance.addTen(15);  // 25


// 4. Apply & Call Pattern
// 可傳入不同物件自定this的指向，讓Method可以被多個物件共用而不需繼承
var func = function(name){ 
    return "Hello "+name+", you are "+(this.age >= 18) ? "adult" : "teenager" + ".";
};
var person1 = { age: 12 }, 
    person2 = { age: 22 };
    
console.log(func.call(person1, "Paul"));      // Hello Paul, you are teenager.
console.log(func.apply(person2, ["Merry"]));  // Hello Merry, you are adult.
```
* [func.call() - MDN](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Function/call)
* [func.apply() - MDN](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)

-----

## 函式的核心觀念

### 又愛又恨的this

* 由於 browser 和 server side 有些不同，以下暫以 browser 環境說明。詳細請看 [補充]()。
* 是一個指標，根據「被呼叫的情境」決定值，詳細的解說請參考[這篇](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)。
    * Global Context：在global直接呼叫，不論是否為strict mode，this皆指向global object。在瀏覽器中為window物件。
    * Function Context：若在function中，根據function被呼叫的方式有所不同
        * Method呼叫：透過 obj.func 或者 obj[func] 呼叫，this指向obj
        * 一般函式呼叫：func() 直接呼叫函式，不論巢狀與否，this一律使用預設值(strict mode為undefined、一般瀏覽器中為window)
        * 建構式呼叫：由於new的運作，使得this指向新產生的instance物件。
        * 手動綁定：透過bind、apply、call等方式，將this明確指向某物件。如果傳入值不是object，會自動wrap成對應的物件。
        * event handler：指向觸發事件的DOM物件。

#### Global Context
```javascript
console.log(this);  // window
```
#### Function Context
```javascript
// 1. Method Pattern: this指向物件本身(obj)
//    這種從this取得物件環境的方法，被稱為 public method
var obj = { addTen: function(num){ this.value = num + 10; } }
obj.addTen(10);  // this -> obj;
```

```javascript
// 2. Function Pattern: this採用預設值
var func = function(num){ 
    console.log(this);       // this -> window (non-strict mode) / undefined (strict mode)
    setTimeout(function(){
        console.log(this);   // this -> window (either strict mode & non-strict mode) 
                             // 因為setTimeout為window的method
    }, 10000);
}
func();

// 如果要讓內部function也能用外面的this，將this另存變數保存
var func = function(num){ 
    var self = this;
    self.value = num;  // this -> window, self -> window
    
    setTimeout(function(){
        self.value += 10;  // this -> window, self -> window
    }, 10000);
}
```

```javascript
// 3. Constructor Pattern: this指向當前new出來instance
function Person(name, age){
    this.name = name;
    this.age = age;
}

// 關於new如何實作的細節, 請參考下一節的 [關於new operator的運作]
var p1 = new Person("Henry", 20);  // this -> p1
var p2 = new Person("Joe", 28);    // this -> p2
```

```javascript
// 4. Apply & Call Pattern: 傳入this要指向的物件
// 若使用 non-strict mode ，apply(null, ["Merry"]) 會將 this 綁到 window/global
var func = function(name){ 
    return "Hello "+name+", you are "+(this.age >= 18 ? "adult" : "teenager") + ".";
};
var person1 = { age: 12 }, 
    person2 = { age: 22 };
    
console.log(func.call(person1, "Paul"));      // this -> person1
console.log(func.apply(null, ["Merry"]));     // this -> null, 會壞掉
```

```html
<!-- 5. event handler -->
<a id="test" href="#">test</a>
<script>
    document.getElementById("test").onclick = function(){
        console.log(this);    // <a id="test" href="#">test</a>
    };
</script>
```

#### Arrow Function 和 Function在this上的差異
* Arrow Function不產生自己的this值，因此call、apply等方式對它無效
* 以「所在作用域的this」當作自己的this值。

```javascript
// Arrow function的this永遠指向new建立時的function
function Person(){
  var timer = setInterval(() => {
    this.age = (this.age !== undefined) ? this.age + 10: 0;  // this -> p1
  }, 1000);
}
var p1 = new Person();


// Function的this會隨著所在function不同而改變指向
function Person(){
  var timer = setInterval(function(){
    this.age = (this.age !== undefined) ? this.age + 10: 0;  // this -> 匿名function
  }, 1000);
}
var p2 = new Person();
```
詳細請參考以下資料：
* [Arrow Function - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
* [this - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)。
* [this值的產生歸則是什麼？](https://eyesofkids.gitbooks.io/javascript-start-from-es6/content/part4/this.html#this值的產生規則是什麼？)

#### [補充] 淺談 Browser 與 Server side 的差異
* Browser的最頂層物件為window，有document物件 (window.document)
* Node的最頂層物件包含許多global objects，沒有window、document
```javascript
// global直接呼叫
console.log(this);

// 在瀏覽器中, this -> window;
// 在Node的cli中, this -> 一個包含所有global objects的物件
```

* 全域變數、函式等宣告差異，請參考[這篇](https://nodejs.org/api/globals.html#globals_global)。
    * Browser中，var、function會成為window物件上的新property
    * Node中，var、function會成為module物件上的新property
```javascript
var a = 10;  

// [browser]  window.a = 10, global scope
// [node]  module.a = 10, local scope

-------------------------------------
function a(){ .... }

// [browser]  window.a = a(), global scope
// [node]  module.a = a(), local scope
```

* 事件執行差異，請參考以下文章
    * [非同步程式碼之霧：Node.js 的事件迴圈與 EventEmitter](https://simeneer.blogspot.tw/2016/09/nodejs-eventemitter.html)

### JS中的物件導向設計(OOP)：Prototype Based
* JS是原型繼承語言(prototypal inheritance language)，可以直接繼承其他物件的特性，不使用類別(Class)(ES6+的class其實是語法糖)。
* 讓人聯想到class的物件製造方法：Function Declaration + new

```javascript
function Dog(){
    this.voice = "汪";
    this.legs = 4;
}

var Laicy = new Dog();
```
更多請參考[Javascript 物件導向介紹 - MDN](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript)

#### 關於new operator的運作
當執行 ``` new Dog() ```時，會做以下的處理：
```javascript
==> {}          // 1. 從Dog.prototype建立新的空物件
==> {}.Dog()    // 2. 呼叫Dog()當作constructor, 此時this -> {}
                
                
// 3. 若Dog()有return object, 最後將回傳此object當作處理結果
//    若沒有return任何object, 將上一步的 {} 當作處理結果。
//    一般而言，不會在constructor function內return任何的object
```
詳細請參閱[這篇](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Operators/new)。

### Closure & Scoping

> JS中雖然有block的語法({})，但並**不會產生block scope**。只有建立function時才會產生新的scope。
> Closure是指function建立新的scope時，隱藏的context屬性記憶了function被建立時的環境。
> 因此，除了this和arguments以外，**function內部可以直接取用外部的變數(並非複製一份傳入)**。

### Scope Chain
* 取用變數時，依據scope chain一層一層往global的方向找變數的宣告，直到global都找不到就回傳undefined。
* function內若重複宣告變數，將會**暫時覆寫變數值**，執行到function外時又恢復原本的宣告。
```javascript
// scope chain: f2 -> f1 -> global
var str = "scope 01";
function f1(){
    console.log(str);            // "scope 01", f1 -> global
    var str = "scope 02";        // "scope 02", f1, overwrite
    
    function f2(){
        console.log(str);        // "scope 02", f2 -> f1
        var str = "scope 03";
        console.log(str);        // "scope 03", f2, overwrite
        
        console.log(char);       // undefined, f2 -> f1 -> global -> not found
    }
    
    console.log(str);            // "scope 02", f1, overwrite
}
console.log(str);                // "scope 01", global
```


### Cascade(Fluent Interface): 鏈狀程式碼書寫
刻意設計每個Method的return值為this或自訂物件，串成鍊狀的程式碼書寫風格。
相似者有: jQuery、ES6 Promise、Array的操作...

```javascript
// 凱薩加密 (Caesar cipher): 將每個英文字按字母序換成後5個位置的字母
function CaesarCipher(plaintext){
    return plaintext
        .toLowerCase()
        .split('')
        .map((char) => {
            let nowCode = char.charCodeAt(0);
            let newCode = ((nowCode + 5) > 122) ? nowCode + 5 - 26 : nowCode + 5 ;
            return String.fromCharCode(newCode);
        })
        .join('');
}

console.log(CaesarCipher("zoo"));  // "ett"
```

-----

## 關於函式的參數

### 處理不固定的參數數量
當引數和傳入參數數量不同時，多的會忽略、少的以undefined替代，**不會有型別檢查**。

1. Argument陣列：取得傳入參數的陣列
```javascript
// 如果傳入參數大於2個，計算平均值；否則計算兩數加總 or 0
var cal = function(){
    // check for empty input
    if(arguments.length === 0) return 0;
    
    // sum adding only if arguments[i] is number
    var sum = 0;
    for(var i = 0; i < arguments.length; i++){
        sum += (typeof arguments[i] === 'Number') ? arguments[i] : 0;
    }
    
    return (arguments.length > 2) ? sum / arguments.length : sum;
}

// test
cal(10, 20, 30, 40, 50);  // 30
cal(60, 70);              // 130
cal(80);                  // 80
cal('test');              // 0
cal(null);                // 0
cal(0);                   // 0
```

2. function開頭檢查undefined & 加上預設值
```javascript
// 如果pid存在，更新現有使用者資料 (update)；否則新增一位使用者 (insert)
var putMember = function(modifyData, pid){
    return (!pid) ? DB.updateMember(modifyData, pid) : DB.insertMember(modifyData);
}

putMember({name: 'Tim'}, 10025);  // update member with pid = 10025
putMember({name: 'Clark'});       // insert new member
```

### 設定參數預設值 (Default Parameters)
ES6語法，有以下特性:
* 可以是數值、陣列、object literal、function literal...
* 每次function被呼叫時才給定default值
* 只會由左到右依序覆寫, 不會因有設定default parameter而自動推移
* 不可以在function內才定義default func

```javascript
var putMember = function(modifyData = {}, pid = null){
    return (!pid) ? DB.updateMember(modifyData, pid) : DB.insertMember(modifyData);
}

putMember({name: 'Clark'});       // insert new member
putMember(10025);                 // error! insert new member with data = 10025
```
