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
* hoisting：function declaration的位置不影響程式執行，包含放在if-else判斷式內。
* 宣告完會產生一個**包含closure**的Function物件。

```javascript
function test (){ .... }
test();
```

### Function Expression
* 函式名稱可以忽略，稱為匿名函式(anonymous function)，名稱存在name的property。
* 函式有命名的話，可以在function內部遞迴呼叫自己(Recursive)，但不能在外部呼叫。
* NO hoisting：位置會影響程式執行。
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
var func = function(num){ return num + 10; }
console.log(func);        // 輸出 function(num){ return num + 10; }
console.log(func(10));    // 輸出 20
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
* 是一個指標，按照function使用方式不同，指向不同的object
```javascript
// 1. Method Pattern: this指向物件本身(obj)
//    這種從this取得物件環境的方法，被稱為 public method
var obj = { addTen: function(num){ this.value = num + 10; } }
```

```javascript
// 2. Function Pattern: this指向當前的function，最常被誤會的點
var func = function(num){ 
    this.value = num;  // this -> func
    
    // 10秒後加上10
    setTimeout(function(){
        this.value += 10;  // this -> 匿名function，這邊會壞掉
    }, 10000);
}

// 如果要讓內部function也能用外面的this，將this另存變數保存
var func = function(num){ 
    var self = this;
    self.value = num;  // this -> func, self -> func
    
    setTimeout(function(){
        self.value += 10;  // this -> 匿名function, self -> func
    }, 10000);
}
```

```javascript
// 3. Constructor Pattern: this指向當前new出來instance
function Person(name, age){
    this.name = name;
    this.age = age;
}

var p1 = new Person("Henry", 20);  // this -> p1
var p2 = new Person("Joe", 28);    // this -> p2
```

```javascript
// 4. Apply & Call Pattern: 傳入this要指向的物件
var func = function(name){ 
    return "Hello "+name+", you are "+(this.age >= 18) ? "adult" : "teenager" + ".";
};
var person1 = { age: 12 }, 
    person2 = { age: 22 };
    
console.log(func.call(person1, "Paul"));      // this -> person1
console.log(func.apply(null, ["Merry"]));     // this -> null, 會壞掉
```

* Arrow Function 和 Function在this上的差異

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
詳細請參考 [箭頭函式 Arrow Function - MDN](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Functions/Arrow_functions)。

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