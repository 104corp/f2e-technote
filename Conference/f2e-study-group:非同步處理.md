# 非同步處理

## 教材

- [ECMAScript 6 入门](http://es6.ruanyifeng.com)
- [範例](https://github.com/lllllinli/async-practice)



## Callback Function

- 直覺，僅限一層的話很好用
- 用太多層會出現 callback hell

```javascript
const log = (massage, callback) => {
  console.log(massage);

};

const sum = (x = 0, y = 0, callback) => {
  const result = x + y;
  callback(result);
};

sum(1, 1, log);
```



## Custom Event

- 可以使用原生的Web API（Document）、jQuery
- DOM上面找一個根點，建立客製事件
- 通常全域事件、資料流相關綁在body
- 其他UI相關邏輯會綁在UI的根點

```javascript
/**
 * 解決 IE 沒有 CustomEvent
 * 參考：https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
 */
(function () {
  if ( typeof window.CustomEvent === "function" ) return false;

  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
  }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
})();

function simulateClick() {
  const rootDom = document.querySelector('#root');
  // create and dispatch the event
  const event = new CustomEvent('cat', {
    detail: {
      hazcheeseburger: true
    }
  });

  // add an appropriate event listener
  rootDom.addEventListener('cat', function(e) { console.log(e.detail); });
  // 發出事件
  rootDom.dispatchEvent(event);
}

simulateClick();
```



## Promise

-  jQuery 的 deferred 與 promise 混用？Code寫得漂亮就好，不要為了解決問題而載入太多套件
- unhandle promise pending
- 實際上就是把callback包在一個class裡，看起來語法比較好看而已

```javascript
const promise = new Promise((resolve, reject) => {
  // const value = '成功';
  const reason = '失敗';
  // 成功時
  $.ajax().done((result) => {
    resolve(result);
  });
  // resolve(value);
  // 失敗時
  // reject(reason)
});

promise
  .then((value) => {
  // on fulfillment(已實現時)
    console.log(value);
  }, (reason) => {
    // on rejection(已拒絕時)
    console.log(reason);
  })
  .catch((reason) => {
    // rejection
    console.log('reason:', reason);
  });
```



## Generator

- Iterator 的 Design Pattern，可以想成是一個Array和一個指標，每次執行 next() 將指標往下一個移動，並回傳 {.Array[index], done } 物件
- 這個Array中可以放 function 或是 value
- yield 會 block 住
- 可以混合使用 Promise 做流程控管
- 是iterator的再包裝，會加入symbol

```javascript
function * gen() {
  console.log('start');
  const got = yield 'called';
  console.log(got);
}
const g = gen();
const a = g.next();
console.log('a:', a);
//顯示start
const b = g.next('hello generator');
//顯示hello generator
console.log('b:', b);

function * run() {
  yield 1;
  yield 2;
  return 3;
}

const r = run();

console.log(r.next());
console.log(r.next());
console.log(r.next());

function* generatorFoo() {
  for (let i=0; i<=1E10; i++) {
    console.log(i);
    yield i
  }
}
const iterator = generatorFoo();
console.log('iterator:', iterator.next());// 0
console.log('iterator:', iterator.next());// 1
console.log('iterator:',iterator.next());// 2

// function* generatorFoo01() {
//   const arr =[1, 2, 3, 4];
//   for(let i = 0; i < arr.length; i++) {
//     yield arr[i];
//   }
// }
//
// const f01 = generatorFoo01();
//
// // setInterval(() => {
// //   console.log('f01:', f01.next());
// // }, 1000)

const f001 = () => console.log('foo1');
const f002 = () => console.log('foo2');
const f003 = () => console.log('foo3');
const f004 = () => console.log('foo4');
const f005 = () => console.log('foo5');


function* generatorFoo02() {
  const arr =[f001, f002, f003, f004, f005];
  for(let i = 0; i < arr.length; i++) {
    yield arr[i];
  }
}

const f02 = generatorFoo02();

const setInterval02 = setInterval(() => {
  const result = f02.next();
  const isDone = !result.done;
  const value = result.value;
  if (isDone) {
    console.log('f02:', value());
  } else {
     clearInterval(setInterval02)
  }
}, 1000);
```



## Async / Await

- 實質上是generator的語法糖

```javascript
function timeout(ms) {
  return new Promise((resolve) => {
    console.log(`ms: ${ms}`);
    setTimeout(resolve, ms);
  });
}

function getUser() {
  return new Promise((resolve, reject) => {
    const value = 'test';
    setTimeout(() => {
      return resolve(value);
    }, 4000);
  })

}


async function asyncPrint(value, ms) {
  console.time();
  await timeout(ms);
  await timeout(ms + 3000);
  await getUser()
    .then((r) => {
      console.log(r)
    });

  console.timeEnd();
}


asyncPrint('hello world', 50);
```



## Middleware

- 中介層處理，會攔截訊息並按順序執行middleware處理
- 以 express 為例，就是在 request 和 response 中間
- 以 redux 為例，就是 action 和 reducer 中間

#### 相關套件

- [redux-thunk](https://github.com/gaearon/redux-thunk)：generator
- [redux-saga](https://github.com/redux-saga/redux-saga)：promise
- [redux-multi](https://github.com/ashaffer/redux-multi)
- [koajs](https://github.com/koajs/koa)
- [tj/co](https://github.com/tj/co)
- [fetch](https://www.npmjs.com/package/fetch)
- [async-fetch-helper](https://www.npmjs.com/package/async-fetch-helper)
- (非套件) [Fetch API](https://developer.mozilla.org/zh-TW/docs/Web/API/Fetch_API)

-----

## Resource

- [從Promise開始的JavaScript異步生活](https://www.gitbook.com/book/eyesofkids/javascript-start-es6-promise/details)
- [Generator - MDN](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Statements/function*)
- [Promise - MDN](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [CustomEvent - MDN](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent)

-----

## 前端資料儲存

四種儲存方式

1. [window.localStorage](https://developer.mozilla.org/zh-TW/docs/Web/API/Window/localStorage)
2. [window.sessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)
3. [document.cookie](https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie)
4. [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)

-----

## 練習作業

從上面五種挑一個主題（Middleware以外），製作小簡報 + 範例