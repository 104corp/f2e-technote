# 繼承

## 五種繼承模式

### 擬類別繼承模式

* 定義子物件的建構式，並將子物件的prototype改為父物件的instance
* Child.prototype = new Parent()

```javascript
function Animal(){}
function Dog(){}
Dog.prototype = new Animal();

var Tiff = new Dog();
```

### 物件規格器 (object specifier) 繼承模式

* 傳入單一物件取代多個參數
* 適用於建構式參數太多的狀況

```javascript
// 一般建構式
function Person(name, age, height, weight){
    this.name = name;
    this.age = age;
    this.height = height;
    this.weight = weight;
}
var Tina = new Person('Tina', 20, 168, 60);

// 物件規格器
function Person({ name, age, height, weight }){
    for(let property in arguments[0]){
        this[property] = arguments[0][property];
    }
}
var option = {
    name: "Tina", 
    age: 20,
    height: 168,
    weight: 60
}
var Tina = new Person(option);
```

### 原型繼承模式

* 由舊物件生成新物件，並修改新物件，是一種差別繼承(differential inheritance)
* 與「擬物件繼承模式」的差別在「做法看起來不同」
    * 擬物件：「先修再建」，定義新的constructor & 修改prototype為父物件的instance => new新的繼承子物件
    * 原型：「先建再修僅修改prototype為舊物件 => new新物件 => 根據需求修改新物件

```javascript
// 擴充Object, 新增一個由舊物件產新物件的方法
Object.beget = function(OldObj){
    var NewObj = function(){};
    NewObj.prototype = OldObj
    return new NewObj();
}

var Animal = { name: "", voice: "" };
var Tiff = Object.beget(Animal);
Tiff.name = "Tiff";

// 其實等同於建新物件 => 把__proto__指向舊物件
var Tiff = {};
Tiff.__proto__ = Animal;
Tiff.name = "Tiff";
```

### 函式繼承模式

* 透過函式scope chain特性，巧妙的製作private成員與方法。

(理解不夠完善, 要再補充)

### 零件繼承模式

* 用組合的方式，組出所需的物件

(理解不夠完善, 要再補充)