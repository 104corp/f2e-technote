# 正規表達式 Regular Expression

## 建立RegExp物件

### 一次建好

```javascript
// 1. regexp literal
var myReg = /[A-Z]+/g;


// 2. RegExp constructor
var myReg = new RegExp("[A-Z]+", "g");
```

### 動態建立

```javascript
// 每種支援option對應的正規式
var passRegExp = {
    confusedCharsRegexp: /[0oO1lIi]/,
    oneUppercaseRegexp: /[A-Z]/,
    types: {
        uppercase: 'A-Z',
        lowercase: 'a-z',
        number: '0-9',
        symbol: '!%@#',
    }
};

// 根據傳入的option, 建立密碼比對規則
var inputOptions = {
    acceptTypes: ['uppercase', 'lowercase', 'number', 'symbol'],
    avoidConfusedChars: false,
    atLeastOneUppercase: false,
    minLength: 8,
    maxLength: 30
};

var str = inputOptions.acceptTypes.map((type) => passRegExp.types[type] || '').join('');
// "A-Za-z0-9!%@#"

var regexp = new RegExp(`[${str}]{${inputOptions.minLength},${inputOptions.maxLength}}`);
// /[A-Za-z0-9!%@#]{8,30}/
```

## 使用情境

這邊僅列出常用的情境。每個符號的意義，請直接參考 [檢驗工具 & Cheatsheet](https://github.com/104corp/f2e-technote/blob/master/Book/%E3%80%90Book%E3%80%91Javasript%20Good%20Part/Chapter%20%237.md#檢驗工具--cheatsheet) 這個section。

### 1. 檢查字串格式符合與否
```javascript
var myReg = /[A-Z]+/g;
var str = "Abda123";

myReg.test(str);  // false
```

### 2. 從字串比對片段
```javascript
// no global flag
var str = "AbdaBDAbda123";
var myReg1 = /bda/;
var myReg2 = /pda/;

console.log(str.match(myReg1));  // ["bda"] -> first match
console.log(str.match(myReg2));  // null
```
```javascript
// with global flag
var str = "AbdaBDAbda123";
var myReg1 = /bda/ig;
var myReg2 = /pda/ig;

console.log(str.match(myReg1));  // ["bda", "BDA", "bda"] -> all match
console.log(str.match(myReg2));  // null
```


### 3. 比對中文
JS採用unicode表示字元，因此要比對中文或是任意體系的文字，必須了解兩個部分：

1. unicode字元的表示法 (escape sequence)
2. 文字的unicode範圍，可以從 [Unicode Standard](http://www.unicode.org/versions/Unicode10.0.0/) 查詢。常用的中文字為 CJK Unified Ideographs (Han)，範圍從 ```U+4E00``` 到 ```U+9FFF```，詳情參考 [Unicode 10.0.0 / Chapter 18 East Asia](http://www.unicode.org/versions/Unicode10.0.0/ch18.pdf)


#### 延伸閱讀
1. [JavaScript character escape sequences](https://mathiasbynens.be/notes/javascript-escapes)
    * code points、code units
    * single character escape sequence (```\n```、```\f```...)
    * octal escape sequences (```\0``` to ```\256```)
    * hexadecimal escape sequences (2位hex，```\x00``` to ```\xff```)
    * control escape sequences (不分大小寫a-z，```\ca``` to ```\cz```)
    * unicode escape sequences (4位hex，```\u0000``` to ```\uffff```)
    * unicode code point escapes (ES6，```\u{1A9FB}```，可表示所有unicode字元)

2. [Unicode basics](https://mathiasbynens.be/notes/javascript-unicode#unicode-basics)
    * Basic Multilingual Plane (BMP， ```U+0000 (\u0000)``` to ```U+ffff (\uffff)```)
    * Supplementary Planes (astral planes，超過4位hex表示的字元)
    * Surrogate pairs (ES6轉換成ES5 unicode表示，```\uD83D\uDCA9``` 相當於 ```\u{1F4A9}```，計算公式請看[這篇](https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae))

3. [Unicode-aware regular expressions in ECMAScript 6](https://mathiasbynens.be/notes/es6-unicode-regex)
    * new ES6 flag： ```y``` (sticky)
    * new ES6 flag： ```u``` (可以在RegExp使用 ```\u{0024}``` ，但同時也造成不少issue)
    * issues about ```u``` flag

```javascript
// 比對中文字，包含繁簡體
var hanReg = /[\u4e00-\u9fff]+/;
console.log(hanReg.test("測試"));  // true
console.log(hanReg.test("测试"));  // true，如果加了g flag會變false


// 取得文字的 unicode code point
var getUnicode = (str) => str.split("").map((char) => char.charCodeAt(0).toString(16));
console.log(getUnicode("測試"));
```

### 4. 進階使用

#### regexp choice (或)
```javascript
"Hello World".match(/Hello|World/);  // ["Hello"]
"Hello World".match(/Hello|World/g);  // ["Hello", "World"];
```

#### regexp sequence (出現次數)
```javascript
// 只出現1次
var regOnes = /[A-Z]?/;
var regOnes = /[A-Z]{0,1}/;


// 至少0次以上
var regAtleastZeros = /[A-Z]*/;
var regAtleastZeros = /[A-Z]{0,}/;


// 至少1次以上
var regAtleastOnes = /[A-Z]+/;
var regAtleastOnes = /[A-Z]{1,}/;


// 出現 n 到 m 次 (regexp quantifier)
var regCustom = /[A-Z]{n,m}/;
```

#### group
* 可以把某段字詞包成group，方便簡化撰寫
* ```(  )```：比對 & 記憶符合規則的group內容
    * backreference to groups：可以使用index ```\1``` 取用先前記憶過的group內容
* ```(?:  )```：比對 & **不記憶**符合規則的group內容，效能較前者快
* lookahead不建議使用

```javascript
// 時間格式，yyyy-mm-dd hh:mm:ss
var TimeReg1 = /\d{4}\-\d{2}\-\d{2}\s\d{2}\:\d{2}\:\d{2}/g;  // yyyy-mm-dd\shh:mm:ss
var TimeReg2 = /\d{4}(?\-\d{2}){2}\s(?\d{2}\:){2}\d{2}/g;    // yyyy(-mm)(-dd)\s(hh:)(mm:)ss


// Backreference
var BFReg = /Hello (\w+)\! Your name is \1\./;
console.log(BFReg.test("Hello Angus! Your name is Angus."));  // true
console.log(BFReg.test("Hello Kitty! Your name is Joe."));    // false
```

## 檢驗工具 & Cheatsheet
撰寫遇到問題時，可以直接到 [這個網站](http://regexr.com/) 查閱 & 測試效果，再套用回程式比較有效率。