# 題目說明

實作一個 Javascript validator 套件，能夠接收『字串』或『Object』進行相對應的
EX:（僅為舉例，實際輸入跟回傳的方式只要方便使用即可）
```javascript
var result = myValidator('notValidEmail@emailcomtw','email'); 
console.log(result);
/*
{
    status: false,
    msg: 'input email is not valid'
}
*/
var result = myValidator({
    username: 'derek',
    email: 'notValidEmail@emailcomtw',
    phone: '09333333333333333'
}); 

console.log(result);
/*
{
    status: false,
    msgStack: [
        { type: 'email', msg: 'input email is not valid'},
        { type: 'phone', msg: '長度過長！'},
    ]
}
*/

```

> 請隨意參考網路上的既有開源專案的API跟模型的設計，這不是考試XD

## 省點力氣

正則表達式直接copy 網路上的即可（但要正確）

## 上傳方式

請直接上傳到此repo 

## DeadLine

8/18 14：00 review

## 能有最好

1. 使用者可藉由option 設定想要的validator
2. 完整的文件說明
3. Unit test

