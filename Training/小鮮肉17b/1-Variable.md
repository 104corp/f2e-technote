# Variable

JS是動態（Dynamically-typed）語言

## var

```javascript
var num = 1;
var string = 'hello';
var object = { string: 'hello', num: 12, object: {}, array: []};
var array = [ 'hello', {}, 12, []];
var bool = true;
var func = function(a){ return a; };

var sth;
// sth = ?
```

不給 var => window(browser)、this(node)

```javascript
'use strict';

a = '123';
//error
```

```javascript
var a = 'hello';
a = 20;

//20
```
## 保留字

> implements
> interface
> package
> private
> protected
> public
> static
> yield
> ...etc

務必避開 

## Javascript WAT

```javascript=
console.log( false == null )      // false
console.log( false == undefined ) // false
console.log( false == 0 )         // true
console.log( false == '' )        // true
console.log( false == NaN )       // false
 
console.log( null == undefined ) // true
console.log( null == 0 )         // false
console.log( null == '' )        // false
console.log( null == NaN )       // false
 
console.log( undefined == 0)   // false
console.log( undefined == '')  // false
console.log( undefined == NaN) // false
 
console.log( 0 == '' )  // true
console.log( 0 == NaN ) // false
```
https://pic1.zhimg.com/9fe1bfa72176d5167915357bb940d474_r.png![](https://i.imgur.com/pCso05g.png)

## scope & hoisting

**scope**
```javascript

var global = '123';
// global scope

var func = function() {
    // function scope
}

```
**hoisting(提昇)**

> 在我們定義變項的過程中，可以分成宣告(declaration)和給值(initialization)的兩個過程，只有declaration的內容會在逐行執行程式前先被執行並儲存在記憶體中(hoisted)；給值的內容則是在hoisted後，逐行執行程式時，才會被執行到



```javascript

catName("Chloe");

function catName(name) {
  console.log("My cat's name is " + name);
}

```

> JavaScript Declarations are Hoisted
JavaScript Initializations are Not Hoisted

## const & let

> 以區塊為活動範圍 （類似C語言）

const 不可變
let 可變

沒有hoisting

```javascript

console.log(a);
const a = 1;

// error: a is not defined

```