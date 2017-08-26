# 陣列

## 特色

1. 其實是類似List的物件(hash table)，比起其他語言的陣列而言，運算效能稍慢卻相當便利使用。
2. length並非固定的陣列上限 => 可動態擴增陣列大小

## 陣列方法

* [陣列方法簡單分類](http://ricostacruz.com/cheatsheets/js-array.html)
* [各種使用情境的cheatsheet](https://gist.github.com/ourmaninamsterdam/1be9a5590c9cf4a0ab42#user-content-add-new-items-to-beginning)

## 補充探討

### 區分陣列和物件的方式

利用多個細微差異作比較

1. typeof：無法分辨!!
```javascript
typeof [];  // object
typeof {};  // object
```

2. instanceof
```javascript
[] instanceof Array;   // true
[] instanceof Object;  // true

{} instanceof Array;   // false
{} instanceof Object;  // true
```

3. length的型態
```javascript
typeof [].length;  // number
typeof {}.length;  // undefined
```

4. splice
```javascript
typeof [].splice;  // function
typeof {}.splice;  // undefined
```

5. propertyIsEnumerable：無法分辨!!
```javascript
[].propertyIsEnumerable('length')  // false
{}.propertyIsEnumerable('length')  // false
```

### 比較物件、陣列、Map、Set

ES6新增的四種資料結構：Map、WeakMap、Set、WeakSet

| Map | Object |
| --- | ----- |
| key-value 對儲存 | key-value 對儲存 |
| key和value允許任意的型態(含物件、函式) | key僅允許String和Symbol、value則允許任意型態 |
| 有size屬性 | 沒有size和length(需要手動用Object.keys(obj)計算) |

```javascript
var test = new Map();

var keyObject = { name: "User01" };
var keyFunction = function(){}

test.set("index01", "content01");
test.set(keyObject, 1000);
test.set(keyFunction, { c: "content 03" });


// 以上等同於下方寫法
vat test = new Map([ 
    ["index01", "content01"],
    [keyObject, 1000],
    [keyFunction, { c: "content 03" }]
 ]);
```

| Set | Array |
| --- | ----- |
| **唯一且不重複**的value，使用 === 比較 | 允許重複value |
| value允許任意型態 (包含物件、函式) | value允許任意型態 (包含物件、函式) |
| 有size屬性 | 有length屬性 |

```javascript
var test = new Set();

test.add({ name: "test" });
test.add(2000);
test.add("Yoo");
test.add(function find(){});


// 等同於下方寫法
var test = new Set([
    { name: "test" },
    2000,
    "Yoo",
    function find(){}
]);
```

> Weak系列的特色：key 和 GC的行為不同

#### Map vs. WeakMap

* key可能被GC回收
* key有限制型態
* key不能被枚舉

| Map | WeakMap |
| --- | ------- |
| key 允許任意型態 | key **只允許** object，連string等primitive都不接受 |
| key 不會被GC回收 | key **可能會**被GC回收 |
| key 可以枚舉(enumerable) | key 無法枚舉(enumerable)，故無法列出所有的 key |

#### Set vs. WeakSet

| Set | WeakSet |
| --- | ------- |
| value 允許任意型態 | value **只允許** object，連string等primitive都不接受 |
| value 不會被GC回收 | value **可能會**被GC回收 |
| 可以枚舉(enumerable) | 無法枚舉(enumerable)，故無法列出所有的 value |

### 參考

* [Maps and Sets in JavaScript](http://odetocode.com/blogs/scott/archive/2015/10/14/maps-and-sets-in-javascript.aspx)
* [ES5 Objects vs. ES6 Maps – The differences and similarities](https://appendto.com/2016/07/es5-objects-vs-es6-maps-the-differences-and-similarities/)
* [Maps and Sets](http://exploringjs.com/es6/ch_maps-sets.html#sec_overview-maps-sets)