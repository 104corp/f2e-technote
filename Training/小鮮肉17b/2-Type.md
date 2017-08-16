# Type

JS的資料型態有以下特性

1. 弱型別(loose typing)，不需事先宣告型態，解析時自動按內容判斷
2. 6種原始型別(Primitive) + 物件(Object)

## 原始型別 Primitive Type
截至ES6為止，一共有6種Primitive Type + 1種強大的Object

```javascript
true, false                 // Boolean
null                        // Null
undefined                   // Undefined
10, 0b0001, 0xffaa          // Number
'text', "text"              // String
Symbol("text")              // Symbol, new in ES6

{ a:1 }                     // Object
```
> JS會自動將Primitive 轉成標準內建物件(Standard Built-in Objects)方便使用。
> [name=詳見[Distinction between string primitives and String objects - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#Distinction_between_string_primitives_and_String_objects)]
> > 在JavaScript中，差不多**所有事物都是物件**，除了 null 及 undefined 以外其它所有原始類型都可以看成是物件。
> > [name=[物件的使用 - MDN](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Guide/Working_with_Objects#所有事物都是物件)]


以下就直接探討標準內建物件。

---

## Number
不區分Integer、Float、Double，數值型別只有Number一種：64位元雙精度浮點數(IEEE 754)

```javascript
var decimal = 10;       // 10, 十進位(Decimal)
var binary = 0b0011;    // 3, 二進位(Binary), 0b
var octal = 0o64;       // 52, 八進位(Octal), 0o
var hexadecimal = 0x64  // 100, 十六進位(Hexadecimal), 0x
```

> #### [補充] Buffer in Node.js
> Node.js內建的Buffer物件用來儲存binary data、處理streaming，是Unit8Array(固定長度、存放8 bits unsign integer的Array)，和Number的binary不太一樣。
> [name=更多請參考[Node.js Docs](https://nodejs.org/docs/latest/api/buffer.html#buffer_buffer)以及[TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)]


### Bitwise operator
將數值轉成32位元有號二補數整數做邏輯運算。有些情境用此方式運算相當便利。
詳細請參考[Bitewise Operators - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators)。


### 特殊數值
```javascript
// Infinity
1/0 == Infinity       // 正無窮大
-1/0 == -Infinity     // 負無窮大
isFinite(Infinity)    // false, 使用isFinite()判斷

// NaN (Not a Number)
Number(',') == NaN    // 出現在string轉成number時有不合法輸入
NaN == NaN            // false, NaN不等於任何數值
isNaN(NaN)            // true, 使用isNaN()判斷
```
---

## String
文字型別只有String一種，為unicode sequence，沒有字元(character)的型別。
預設編碼為UTF-16，代表每個字元使用16-bit unsigned integer表示。
```javascript=
// string literal
var singal = 'text';      // 單引號, string primitive
var double = "text";      // 雙引號, string primitive

// 單引號、雙引號沒有區別，遇到跳脫字元皆有效
var escape_singal = 'text \n';  // 'text
                                // '
var escape_double = "text \n";  // "text
                                // "

// String() calls, 很少使用!!
var nonConstruc = String("text");  // no new, string primitive
var Construc = new String("text"); // with new, string object
```
* 跳脫字元請參考 [Escape Notation - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#Escape_notation)。
* string primitive和String object差異，請參考[這篇文章](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#Distinction_between_string_primitives_and_String_objects)。


### 連接字串、嵌入變數
```javascript
// concatenation operator (+)
var str = "yang";
console.log("Hello "+str+"!");         // Hello yang!

// concat method
var str1 = "Hello ";
var str2 = "yang";
var str3 = "!";
console.log(str1.concat(str2, str3));  // Hello yang!

// template literal (ES6)
// ${ 變數、運算式 }, 使用 ` ` 取代單雙引號
var str = "yang";
console.log(`Hello ${str}!`);          // Hello yang! 
```
* 詳細請參考 [Template Literals - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)。

---

## String 與 Number 的轉換
### Number 轉成 String
```javascript
// String()
var str = String(10);  // '10', no new

// toString() method
var num = 10;
var str = num.toString();  // '10'

// (+)字串連接運算子觸發自動轉換
var num = 10;
var str = num + "";  // '10'
```

### String 轉成 Number
```javascript
// Number()
var str = '10';
var num = Number(str);  // 10, no new

// parseInt(): 可指定基底base, 無條件捨去
var str = '10';
var num = parseInt(str);        // 10, decimal
var num10 = parseInt(str, 10);  // 10, decimal
var num2 = parseInt(str, 2);    // 0b10, binary
var num16 = parseInt(str, 16);  // 0x10, hexadecimal

var numToNum = parseInt(10, 2); // 0b10, 先toString()再轉換


// parseFloat(): 固定為10進位
var str = '10';
var flt = parseFloat(str);  // 10


// (-)算術運算子觸發轉換
var str = '10';
var num = str - 0;  // 10, 不能使用+, 會被誤認為是字串連接運算子

// unary + operator, 很少使用
var str = '10';
var num = + str;  // 10
```
>要注意字串跟數字的轉換存在相當多地雷（也很難全部記住），因此盡量在撰寫程式的時候避開型態轉換的可能

```javascript
// parsing:
parseInt("20px");       // 20
parseInt("10100", 2);   // 20
parseInt("2e1");        // 2

// type conversion
Number("20px");       // NaN
Number("2e1");        // 20, exponential notation
```

* [parseInt - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt)
* [parseFloat - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseFloat)


### [補充] 字串編碼的轉換
直接在不同編碼的字串中轉換相當麻煩，而且容易出錯。
一般建議先將string轉成binary data，再對其轉換會比較安全。

```javascript
// hex to base64
// 先用Buffer.from()變成binary data，再toString()轉成指定編碼。
Buffer.from("ffad", "hex").toString("base64");  // 'ffad' -> '/60='
```
> * 這邊使用了Node.js的Buffer，算比較進階的應用。
> * ES6的ArrayBuffer、TypedArray也可以做到相同效果，但這部分比較複雜就暫不介紹了。

---

## Boolean
任意型態可透過邏輯運算子觸發轉換，自動轉成boolean做判斷。
```
轉換後為false: null、undefined、''、0、NaN、false

轉換後為true: 除了上述以外都是，包含 []、{}、'false'、Infinity...
```

```javascript
// 將變數轉成boolean並且NOT, 用以檢查不合法值
if(!x){ /* x = null會滿足這條件 */ }   
// 常使用做例外判斷，不過還是必須清楚自己接受到的資料型態有哪些可能 

// 將變數轉成boolean
if(!!x){ /* x = []會滿足這條件 */ }

// shortcut: ||
// 前者為false時, 取用後者的值, 常用來設定變數預設值
var num = x || null;  

// shortcut: && 
// 前者為true時, 執行後者並取用後者的值, 常用來替代簡短的if判斷
var num = x && f(x);  // 如果x的值合法或不為0, 就回傳f(x)的值
```

## 其他特殊型別
### Null
代表「應該有值但卻是空的」

```javascript
var obj = { prop: null };
```

### Undefined
代表「沒有被賦值（initialize）」，出現在以下狀況

```javascript
// 宣告變數卻未指定值
var variable;  

// 物件的Method未指定值
var obj = { prop: undefined };
console.log(obj.prop);

// 物件未擁有property
var obj = {};
console.log(obj.prop);

// 函式沒有return值
function test(){}
console.log(test());
```

* Undefined 和 Null 的差異，請參考[這篇說明](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null#Difference_between_null_and_undefined)。
* Array、Function、Object將留到後面章節一併解說。

```javascript

typeof null          // "object" (not "null" for legacy reasons)
typeof undefined     // "undefined"
null === undefined   // false
null  == undefined   // true
null === null        // true
null == null         // true
!null                // true
isNaN(1 + null)      // false
isNaN(1 + undefined) // true

```

---

* 更多細節請參考以下文章
    *  [A re-introduction to Javascript - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript)
    *  [Data Structures - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures)