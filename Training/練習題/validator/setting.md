# Validator.js
Basic JS Validator exercise with Testing

## Get Started

### Node.js
```javascript
const Validator = require("./src/validatorV2");
const my = new Validator();
```

### Client
```javascript
<script src="./src/validatorV2.js"></script>
<script>
    const Validator = require("./src/validatorV2");
    const my = new Validator();
</script>
```

### Usage
```javascript
my.validate("test@test.com", "email");
my.validate("test@test.com", { name: "email", maxLength: 100 });

var data = {
    email: "test@test.com",
    password: "tegjspdgiojsd757"
};
var options = {
    email: {
        maxLength: 100
    },
    password: {
        acceptTypes: ['uppercase', 'lowercase', 'number'],
        avoidConfusedChars: false,
        atLeastOneUppercase: true,
        minLength: 8,
        maxLength: 30
    }
};
my.validate(data, options);
```

-----

## Configuration

### Default Validator Option

* 預設支援3種validator：email、password、_id
* 未傳入option時，將預設套用defaultOptions的設定。
* 傳入option時，新設定會覆蓋舊的設定。


```javascript
const defaultOptions = {
    email:{
        maxLength: 250
    },
    password:{
        acceptTypes: ['uppercase', 'lowercase', 'number', 'symbol'],
        avoidConfusedChars: false,
        atLeastOneUppercase: false,
        minLength: 8,
        maxLength: 30
    },
    _id:{
        // default for mongodb objectId (type = string)
        length: 24,
        encoding: 'hex',
    }
}
```

### Support Options

* 內部使用的設定

```javascript
const supportOptions = {
    email: {
        regexp: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    },
    password: {
        confusedCharsRegexp: /0oO1lIi/,
        oneUppercaseRegexp: /[A-Z]/,
        types: {
            uppercase: 'A-Z',
            lowercase: 'a-z',
            number: '0-9',
            symbol: '!%@#',
        },  
    },
    _id: {
        hexRegexp: /[a-fA-F\d]+\b/,
        base64Regexp: /[a-fA-F\d]+\b/,
    }
} 
```

-----

## Public Method

### validate(input, option)
```javascript
/**
 * @param {string, object} input  
 * @param {object}         option
 */
```
* 驗證字串或物件的方法
* 自訂option時，必須input和option的property name相同才能比對

-----

## Private Method

### __checkParameters(input, option)
```javascript
/**
 * @param {string, object} input  
 * @param {object}         option
 */
```
* 檢查輸入參數的型態


### __process(input, option)
```javascript
/**
 * @param {string, object} input  
 * @param {object}         option
 */
```
* 根據input的property，自動判斷要取用哪支validator
* 檢查是否支援某個validator時，會依序做以下檢查：
    1. 檢查 supportOptions 是否有此 property
    2. 檢查 Validator物件原型是否有對應的 private method
    3. 以上都沒有，會根據 option 呼叫 __customized() 做regular expression的比較

### __email(str, customized)
```javascript
// customized
{
    maxLength: 250  // 最大可接受長度
}
```

### __password(str, customized)
```javascript
// customized
{
    acceptTypes: ['uppercase', 'lowercase', 'number', 'symbol'],  // 允許的密碼字元
    avoidConfusedChars: false,   // 是否避免易混淆字元
    atLeastOneUppercase: false,  // 是否要求至少1大寫英文字元
    minLength: 8,                // 最短可接受密碼長度
    maxLength: 30                // 最長可接受密碼長度
}
```

### __id(str, customized)
```javascript
// customized
{
    // default for mongodb objectId (type = string)
    length: 24,           // id長度, 不多不少
    encoding: 'hex',      // 接受的編碼設定
}
```
* accept encoding：hex、base64

### __customize(str, customized)
```javascript
// customized
{
    regexp: /test/     // 自訂的正規表達式
}
```

-----

## Test Environment

選擇使用Mocha + Chai，理由如下：
* Mocha屬於test framework，沒有內建的assertion library
* Chai屬於assertion library，很多人使用

```javascript
npm install mocha
npm install chai
```

### Test Concept
* [Introducing code coverage](https://dotblogs.com.tw/hatelove/2011/12/25/introducing-code-coverage)

### Test tools的介紹與比較
* [What is the difference between a test runner, testing framework, assertion library, and a testing plugin](http://amzotti.github.io/testing/2015/03/16/what-is-the-difference-between-a-test-runner-testing-framework-assertion-library-and-a-testing-plugin/)
* [Jasmine vs mocha, chai, and sinon](http://thejsguy.com/2015/01/12/jasmine-vs-mocha-chai-and-sinon.html)

### Test tools for React.js
* [jest](https://facebook.github.io/jest/)
* [enzyme](https://github.com/airbnb/enzyme)

### Test tools for Node.js
* [Mocha]() + [Chai]() / [Sinon]()
* [Jasmine]()