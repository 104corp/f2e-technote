# CSS 重要觀念一覽

## Basic
只要有一個property-value pair出錯，整條css rule都會被忽略

瀏覽器呈現web page的解析順序

### shorthand properties
* font
* background
* padding
* margin
* border

-----

## CSS statement

### At-rules
* Metadata
    * @charset
    * @import
* Descriptive
    * @font-face
* Conditional Information (Nested statements)
    * @media：for devices
    * @support：for browser actually support feature
    * @document：for current page

```css
@media (min-width: 960px){
    body{
        /* ..... */
    }
}
```

## Selectors' Specificity and Performance

### Selectors
* Type / Element
* Class
* ID
    * 效率最好
* Universal
    * \*：全部頁面元素，有很高的效能代價
* Attribute

| Presence & Value | meaning |
| ---- | ---- |
| [attr] | attr存在 |
| [attr=val] | 全等於val |
| [attr~=val] | 空白為分隔符號，是否有値全等於val |
        
| RegExp-like | meaning |
| ---- | ---- |
| [attr|=val] | 全等於 or val-開頭 |
| [attr^=val] | val開頭 |
| [attr$=val] | val結尾 |
| [attr*=val] | 是否包含val字串 |
  
* Pseudo-classes(偽類) and pseudo-elements(偽元素)

| Pseudo-classes | pseudo-elements |
| ----- | ----- |
| 選取已存在元素的某種狀態、或是前述幾種selector無法取得的元素(ex: 第n個元素) | 創造新的假元素，以選取現有元素的一部分 |
| :active | ::before |

> 參考[【CSS FAQ】偽元素 (PSEUDO ELEMENT) 和偽類 (PSEUDO CLASS) 差在哪？](https://stringpiggy.hpd.io/pseudo-element-pseudo-class-difference/)

* Combinators：DOM元素相對位置
    * (space)：更低階層
    * \> ：直接的子元素
    * \+ ：隔壁鄰居
    * \~ ：同階層

* 多個selector對應一個css rule
    * \,：逗號分隔


## Cascade & Inheritance

* 相同屬性透過「權重」比較，權重高的獲勝
* 主要比較階級：Importance > Specificity > Source Order

### Importance (!important)
* 神一般的存在，直接打趴其他權重
* 只有另一個相同屬性的!important可以蓋過前一個

### Specificity (權重)
* 平凡人，權力(權重)越大的獲勝
* 按照撰寫的selector內容計算權重 (Specificity)
    * 相同元素，selector寫法不同，權重也不同
    * selectors 指定越明確 & 越長，權重越高
    * inline > ID > [class, attribute, pseudo-class] > [element, combinators] > universal 
* 參考
    * [利用 The Shining 解說CSS權重](http://cssspecificity.com/)
    * [權重計算機](https://specificity.keegan.st/)

```html
<style>
body div p{
    color: blue;    /* spec: 0-0-3 */
}
p{
    color: yellow;  /* spec: 0-0-1 */
}
div p{
    color: red;     /* spec: 0-0-2 */
}
</style>

<body>
    <div>
        <p>Hello Specificity</p> <!-- blue -->
    </div>
</body>
```

### Source Order
* 越新越高：相同權重下，原始碼越後面的rule，優先性越高

```css
a:link{}
a:visited{}
a:hover{}
a:active{}

/* 
    一般撰寫a的偽類，通常建議照上述順序書寫，理由如下：
    1. 當滑鼠hover時，會同時觸發hover、link、(visited)
    2. 這4種偽類的權重相同，根據書寫順序(source order)，越後面獲勝

    [參考來源](https://stackoverflow.com/questions/16994383/why-do-anchor-pseudo-classes-alink-visited-hover-active-need-to-be-in-cor)
*/
```

## Inheritance
* CSS屬性分成可以繼承 & 不能繼承兩類。可繼承者，根據DOM結構繼承父元素的屬性
* 可以手動修改屬性「是否能繼承」
    * inherit：繼承自parent
    * initial：使用瀏覽器預設的style値，如果沒有預設値，會自動改繼承parent
    * unset：Reset，恢復到預設

-----

## Box Model



## Display

