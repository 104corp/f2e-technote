# 糟糕部分
## Global Variable
避免使用以下方式，直接在global命名、宣告，汙染global

```javascript
var foo = "test";

foo = "test";  // implied global

window.foo = "test";
```

## Scope
JS只有function scope、沒有block scope，又有hoisting。因此，建議在函式一開始先宣告所有變數 (let、const取代var)。

```javascript
// DON'T
function test(){
    let a = 1;
    a += 10;

    let b = 20;
    return a + b;
}


// DO
function test(){
    let a = 1;  //  建議變數各自分一行宣告，主要是為了git好判斷更動
    let b = 20;

    return a + 10 + b;
}
```

## 自動安插分號機制
避免以下書寫風格即可

```javascript
// DON'T
return   // 這邊會被自動安插分號
{
    status: true
};


// DO
return {
    status: true
};
```

## 一堆沒用到的保留字
盡量避開保留字。若真的需要當作key値，請用引號包起來，也要注意不能用.取用property的value。

```javascript
let obj = {
    "case": 10,
    "implements": 20,
    "return": "hehe"
};
```

## Unicode
這部分請參考 [這邊](https://github.com/104corp/f2e-technote/blob/master/Book/%E3%80%90Book%E3%80%91Javasript%20Good%20Part/Chapter%20%237.md#3-比對中文)，總之就是了解它，然後小心使用。

## 容易誤判的typeof
因為 Primitive Wrapper 的機制，有些値會被誤判。請多寫幾個檢查式以確保偵測的正確性。

```javascript
typeof null;     // 'object'...!?
typeof /[a-z]/;  // 'object'...!?
```

## parseInt
遇到非數字部分會停止轉換，並回傳目前結果，這造成很多誤會。
```javascript
parseInt("612");      // 612
parseInt("612test");  // 612
```

## NaN
字串轉數字時可能會出現。它的各種運算都會導致NaN，總之盡量小心不要讓它出現。

## + 運算子
會導致型別轉換，使用上要特別小心，知道自己到底在幹嘛。

```javascript
console.log(126 + "789");  // "126789"
```

## 浮點數的不精準
JS使用了IEEE 754表示所有數値，因此小數運算會特別容易不精準。請記得轉成整數再運算，算完再轉回小數。

```javascript
console.log(0.1+0.2);  // 0.30000000000000004
```

## 偽陣列
JS中不存在真正的陣列，平常使用的陣列其實是物件的一種，雖然方便使用，但效能比起真貨卻糟很多。

順道一提，arguments雖然用法像陣列，但並不是陣列，其實也是一種物件。

## true類的値? false類的値?
JS中什麼型態的數値都可以轉換成Boolean，因此要特別記得哪些是「轉換後為true」、哪些是「轉換後為false」。

若掌握的話其實滿好用的，簡化不少檢查的程式碼。

## 永遠都留一手的物件
取值會動用到原型鏈，因此以下兩種狀況都需要小心判斷：

1. 判斷物件是否為空
2. scan一個物件的property

一般使用```hasOwnProperty```判斷「物件自身有的」而非 ```for..in```。若有需要連原型鏈都掃過就另當別論了。

## 萬惡的eval

書中雖然歸類「不良部分」，但除了效能、難以維護以外，更牽涉到資安問題，最好這輩子都不要再用eval了。

-----

# 不良部分

## 小心極簡的程式碼風格
有時為了追求程式碼簡潔，使用一些神奇的語言特性。但是往往容易造成意料之外的Bug，而且還很難查。建議盡量少用。

一共包含以下幾種

```javascript
// 1. switch fall through
switch(a){
    case 1:
    case 2:
        a += 10;
        break;
    case 3:
    default:
        a *= 20;
}


// 2. 不寫 {} ，尤其常出現在只有一行的 if-else 中
if(!test)
    return { status: false, msg: "cannot find test" };


// 3. ++ / --
for(let i = 0; i < 10; ++i){
    //.....
}
```

## bitwise
按照常理思考：位元的運算靠近硬體，因此效能會很好，

**但在JS中並非如此。**

JS數値都是雙精度浮點數，因此bitwise運算需要 double -> 轉成integer -> 運算 -> 轉回double，反而效能緩慢。加上容易和「&&」混淆，建議少用。


## 盡量少用function declaration
function expression更清楚的表達「函式是數值的一種」，並且不會有function hoisting，寫起來相對嚴謹。如果可以的話，盡量使用IIFE減少函式對global的汙染。

相關請參考 [這篇](https://github.com/104corp/f2e-technote/blob/master/Training/%E5%B0%8F%E9%AE%AE%E8%82%8917b/3-Function.md)

## 別使用typed wrapper
簡單說，除了function以外，其他變數的宣告賦値都不要使用 new 的方法。型別判斷上為object，有些特性和literal賦値的變數差很多，反而造成很多不必要的困擾。

```javascript
// DON'T : typed wrapper
let a = new Boolean(false);
let b = new String("str");


// DO : literal
let a = false;
let b = "str";
```

## void
在JS中void並非數値，而是某種不明所以的運算子，別用它，平常也不會用到。