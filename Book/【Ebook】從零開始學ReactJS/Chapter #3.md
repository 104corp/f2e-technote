# ReactJS 與 Component 設計入門介紹

## 元件 (Component) 式設計

### 模板 (Template) vs. 元件 (Component)

* 模板 (Template) 
    * 頁面按區塊分割成 partials，依需求組合成 view
    * 資料傳遞：一律外部輸入，透過 view engine 渲染在一起
    * 使用模板語言 (ex: EJS、Pug...)，彈性較小，完全依賴模板語言提供的功能

* 元件 (Component)
    * 類似 Template 的 partials，按區塊劃分成獨立的元件，依需求組合成 view
    * 資料傳遞：可外部輸入、元件內儲存資料，透過資料流在不同元件中傳遞
    * 可將所有相依的HTML、CSS、JS包在一起，以達到跨平台
    * 使用JSX、JS語言，彈性較大，可以充分發揮JS的便利性


### 談談指令式 (Imperative)、宣告式 (Declarative) 差異

* 指令式(Imperative)
    * 「一個口令一個動作，逐步帶著實作」，直接撰寫每一步要做什麼。
    * 運作邏輯隱藏在指揮者腦中，他人只能透過指令揣測背後整體的邏輯。

* 宣告式(Declarative)
    * 「先講大綱和結論 (運作邏輯 & 預期結果)，再講實作細節」
    * 先宣告，撰寫運作邏輯(function、module...)，最後再寫各模組的執行指令串。


```javascript
// Example：計算全班學生平均成績
const score = [ 90, 75, 100, 49, 39, 60];

// Imperative：寫出運算指令
let avg = (score.reduce((total, curr) => total += curr)) / score.length;
console.log(`Average Score = ${avg}`);


// Declarative：寫出運算邏輯 (avgScore(score))，宣告每個部分的詳細運算 (function宣告)
function getAvgScore (s){
    return (s.reduce((total, curr) => total += curr)) / s.length;
}
console.log(`Average Score = ${getAvgScore(score)}`);
```

### 建立Component
React採用宣告式的UI設計，經常搭配JSX使用。元件的建立方式有兩種：

#### Class
1. 採用ES6的類別宣告(class declaration)，一定要有render方法。class寫法請參考[這篇](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Classes#類別主體與方法定義)
2. Method採用shorthand syntax語法，可以參考 [這篇](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Method_definitions)。
3. 特點：可進行複雜操作、生命週期控制，效能較差

```javascript
<div id="example"></div>
<script type="text/babel">
    const todoList = [
        { name: "Task1", link: "link1" },
        { name: "Task2", link: "link2" },
        { name: "Task3", link: "link3" },
        { name: "Task4", link: "link4" },
    ];
    class TodoList extends React.Component{
        render() {
            return (
                <h2>TodoList</h2>
                <ul>
                    {todoList.map((event) => <li><a href={event.link}>{event.name}</a></li>)}
                </ul>
            );
        }
    }

    // 注意：class沒有hoisting，因此擺放順序很重要。
    ReactDOM.render(
        <TodoList />,
        document.getElementById('example')
    );
</script>
```

#### Function
1. Arrow Function寫法
2. 特點：單純render UI使用、沒有生命週期和狀態，效能較佳

```javascript
<div id="example"></div>
<script type="text/babel">
    const todoList = [
        { name: "Task1", link: "link1" },
        { name: "Task2", link: "link2" },
        { name: "Task3", link: "link3" },
        { name: "Task4", link: "link4" },
    ];

    const TodoList = () => (
        <h2>TodoList</h2>
        <ul>
            {todoList.map((event) => <li><a href={event.link}>{event.name}</a></li>)}
        </ul>
    );

    ReactDOM.render(
        <TodoList />,
        document.getElementById('example')
    );
</script>
```

## Virtual DOM
* MVVM(Model、View、ViewModel)架構，使用一個 JS Object 表示整個DOM Tree，稱為Virtual DOM。
* 每當有新更動時：JS Object => DOM Tree
    1. 重新建構 JS Object
    2. 透過演算法比較 & 記錄 Virtual DOM 和真實的DOM差異 (DOM diff)
    3. 將記錄的差異實際修改真實 DOM ，重繪整個網頁

實際上，Virtual DOM 和 Real DOM 確實都一律重繪 (Always Redraw)，但是**「大幅減少重繪次數 & 重繪的部分」**
> ## Reference
> * [React 初學者筆記與教學](http://sweeteason.pixnet.net/blog/category/1884404)
> * Virtual DOM 詳細運作請參考[這篇](https://github.com/livoras/blog/issues/13)
> * DOM Diff演算法請參考[這篇](https://calendar.perfplanet.com/2013/diff/)
> * MVVM相關探討請參考[這篇](https://github.com/livoras/blog/issues/11)
> * 關於如何降低網頁重繪(reflow)的技巧，請參考[這篇](https://developers.google.com/speed/articles/reflow?csw=1)，DocumentFragmen相關請參考[這篇](https://developer.mozilla.org/en-US/docs/Web/API/Document/createDocumentFragment)

-----

### Component PropType 防呆機制
(待整理)

### Component 生命週期（Life Cycle）、狀態 (Status)
(待整理)

### 單向資料流（Unidirectional Data Flow）
(待整理)

* [Flux簡介](https://dotblogs.com.tw/lapland/2015/07/13/151850)




-----

## 快速上手JSX (和傳統javascript語法比較)
(待整理)

1. JS部分用{}包起來，會將執行結果return當作JSX的一部分
    * 註解： 位在子元件中，註解要加{}  {/* 註解 */}
2. 使用render方法時，只能return一個root node
3. html的class改用className、for改用htmlFor取代
4. [spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator)
5. [HTML5自定義資料屬性](https://www.w3schools.com/tags/att_global_data.asp)
6. css可以直接寫在component中，也可以分開撰寫
7. event直接寫在component中


* [官方Turtorial](https://facebook.github.io/react/tutorial/tutorial.html)
* [官方Docs](https://facebook.github.io/react/docs/react-dom.html)
* [一看就懂的 JSX 簡明入門教學指南](http://blog.techbridge.cc/2016/04/21/react-jsx-introduction/)