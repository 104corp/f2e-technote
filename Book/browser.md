# Browser 各產品 - 裝置及瀏覽器的支援套件

## navigator.userAgent

* 所有瀏覽器都支援
* 可以人為修改 navigator.userAgent
* 每個瀏覽器對應的特徵字串不一樣，甚至可能會被誤導
(但對於版本低瀏覽器如IE6、IE7只支援這種做法)
* 補充資料
> http://useragentstring.com/pages/useragentstring.php

## 單例模式

* 確保始終只創建一個對象實例時使用的設計模式

```javascript
// main structure
(function(window, name, definition) {
  // cmd check (module & module.exports)
}(window, 'name', function() {
  // code here, return bowser object
});  
```

## 判斷瀏覽器方法

```javascript
function userAgentMatch(userAgent) {
  userAgent = userAgent.toLowerCase();
  var match = /(opr)(?:.*version|)[ \/]([\w.]+)/.exec(userAgent) ||
              /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(userAgent) ||
              /(edge)(?:.*version|)[ \/]([\w.]+)/.exec(userAgent) ||
              /(chrome)[ \/]([\w.]+)/.exec(userAgent) ||
              /(webkit)(?:.*version|)[ \/]([\w.]+)/.exec(userAgent) ||
              /(msie) ([\w.]+)/.exec(userAgent) ||
              userAgent.indexOf('trident') > 0 && /(rv)(?:.*version|)[ \:]([\w.]+)/.exec(userAgent) ||
              userAgent.indexOf('compatible') < 0 && userAgent.indexOf('trident') < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(userAgent) ||
              [];
  return {
    browser: match[1] || "",
    version: match[2] || "0"
  };
}
var userAgent = window.navigator.userAgent;
userAgentMatch(userAgent);
```

* 此判斷方法從JQuery1.8.3版抽出jQuery.browser方法，JQuery1.9版以上則不提供
> https://api.jquery.com/jquery.browser/
* 可用瀏覽器為: opera、chrome、ie、firefix、safari
* 但因JQuery1.8.3版號太舊，有些新瀏覽器判斷方式須做判斷調整(如:edge、opera)
* 可直接取得目前開啟的瀏覽器(browser)與版本號(version)
* 參考資料
> https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent

## console.log()

* console.log 在IE8以下只支援顯示字串，不支援顯示字串+變數

```javascript
console.log('顯示字串'); // IE8以下支援
console.log('顯示字串', string); // IE8以下不支援
```

## document.body.innerHTML

* 因版本低的瀏覽器(IE6、IE7)能使用的方法不多，所以為了能讓低版本瀏覽器可以執行目前只能先用此做法
> https://caniuse.com/#search=innerHTML

* 用javascript做html標籤須注意的地方是IE8以下不支援```'<style>...</style>'```

```javascript
var style = '<style>div { background: #eee; }</style>';
var html = '<div>我是內容</div>';
document.body.innerHTML = style + html;

// ie8以下只會顯示html，style會顯示不出來
```

* 目前解法css只能用inline style方式寫入

```javascript
var html = '<div style="background: #eee;">我是內容</div>';
document.body.innerHTML = html;
```

## document.body.innerHTML 生成 HTML 綁定事件

* 舊IE瀏覽器不支援.addEventListener綁定事件方法，要用早期的.attachEvent方法綁定

```javascript
var closeFunc = function() {
  document.getElementById('closeDivName').style.display = 'none';
}

var html = '<span id="closeButton"><img src="close-icon.png" /></span>';

document.body.innerHTML = html;

if(window.attachEvent) {
  // .attachEvent for IE用，需加on(onclick)
  document.getElementById('closeButton').attachEvent('onclick', closeFunc);
} else if(window.addEventListener) {
  // .addEventListener for 其他瀏覽器用，不需加on(click)
  document.getElementById('closeButton').addEventListener('click', closeFunc);
}
```