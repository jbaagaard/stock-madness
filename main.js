"use strict";

let shop = {};
let stocks = [];
let game = {};
let template = JsT.loadById("stock-template");
let template2 = JsT.loadById('shop-item-template');
let stockList = document.getElementById('stock-list');
let shopList = document.getElementById('shop-list');
let tooltipDb = new JsDataBindings(document.getElementById('shop-item-tooltip'));
let tooltip = document.getElementById('shop-item-tooltip');

let names = {
    mainName : ['Fizz','Bit','Snake','Kaj','Danni','weed'],
    ending : ['coin','ly','mønt']
};


for(var i = 0;i<10;i++){

}
let headerbinding = new JsDataBindings('header');
headerbinding.setFormatter(null,'money',function (money) {
    if(money >= 1000000000)
        money = Math.floor(money/1000000) +'m';
    else if(money >= 1000000)
        money = Math.floor(money/1000) +'k';
    else{
        money = money.toFixed(8)
    }
    return 'DOLLARDOLLARS '+money;
});

 function getRandomNumber(min,max) {
     return max - Math.random()*(max-min)
 }


function generateName() {


    let _name = names.mainName[Math.floor(getRandomNumber(0,names.mainName.length))];
    if(Math.random()*100 > 50)
        return _name;
    else
        return _name + names.ending[Math.floor(getRandomNumber(0,names.ending.length))]
}



function Stock(fluctuation) {
    let _fluctuation = fluctuation * getRandomNumber(0.8,1.2);
    this.name = generateName();
    let _price = _fluctuation * 10;
    this.state = 'alive';
    let _age = 0;
    let _amountOwned = 0;
    let _priceMod = _fluctuation - fluctuation/2;
    this.priceHistory = [_price];

    let i = document.createElement('li');
    i.classList.add('stock');
    i.innerHTML = template.render();

    let db = new JsDataBindings(i);
    stockList.append(i);


    console.log(db);

    i.querySelector('.buy-button').onclick = function (){
        //console.log(stocks[]);
        if(db.amount > 0){
            //console.log(parseFloat(db.amount)*this.price);
            //console.log(typeof db.amount);
            //console.log(typeof this.price);
            if(parseFloat(db.amount)*_price <= game.money){
                _amountOwned += parseFloat(db.amount);
                game.money -= _price * db.amount;
                console.log(db.amount);
            }
            else{
                _amountOwned += (game.money/_price);
                game.money = 0;
            }
        }
        else{
            alert('please enter a valid number');
        }
        updateUI();
    };

    i.querySelector('.sell-button').onclick = function (){
        if(db.amount < _amountOwned){

            _amountOwned = _amountOwned - db.amount;
            game.money += db.amount*_price;

        }
        else{
            game.money += _amountOwned * _price;
            _amountOwned = 0;
        }
        updateUI();
    };

    //i.querySelector('.buy-button').onclick = this.buy;


    this.iterate = function(){
        _price += (Math.random() * _fluctuation) - _fluctuation / 2 + _priceMod;
        _priceMod += getRandomNumber((_fluctuation*-1)/2,_fluctuation/2);
        if(_price < 0)
            this.state = 'dead';
        this.priceHistory.push(_price);
        if(this.priceHistory.length > 15)
            this.priceHistory.pop();
    };



    this.showVariables = function () {
        console.log(' age:'+_age+' owned'+_amoutOwned+' pricemod:'+_priceMod+' fluc:'+_fluctuation);
    };
    this.updateUI = function () {
       // i.getElementsByClassName('stock-name').item(0).innerText = this.name;
       // i.getElementsByClassName('stock-price').item(0).innerText = this.price.toFixed(2);
       // i.getElementsByClassName('stock-owned').item(0).innerText = _amoutOwned.toFixed(4);
        db.name = this.name;
        db.price = _price.toFixed(2);
        db.owned = _amountOwned.toFixed(4);
    };

    this.kill = function () {
        i.remove();
        stocks.splice(stocks.indexOf(this),1);
    };
    updateUI();
}

function updateUI() {
    for(var i = 0;i<stocks.length;i++){
        stocks[i].updateUI();
    }
    headerbinding.money = game.money;
}




function gameUpdate() {
    for (var i = 0; i < stocks.length; i++) {
        stocks[i].iterate();
        if(stocks[i].state === 'dead'){
            stocks[i].kill();
            stocks.push(new Stock(game.stockVolitile));
        }
    }
    let stockCount = game.stocks - stocks.length;
    for(;stockCount > 0;stockCount--){
        stocks.push(new Stock(game.stockVolitile))
    }
    updateUI();
 }
function newGame() {


     game.stocks = 5;
     game.stockVolitile = 10;
     game.money = 500;



    resetShop();
    stocks = [];
    for(var i = 0;i<game.stocks;i++){
        stocks.push(new Stock(game.stockVolitile));
    }
    updateUI();
}

function message(s) {
  console.log(s);
}

function showItemTooltip(item,i) {
     console.log(item);
    tooltipDb.name = item.name;
    tooltipDb.desc = item.desc;
    tooltipDb.price = item.price;
    tooltip.classList.remove('hidden');
}

function hideItemTooltip(i) {
  tooltip.classList.add('hidden');
}

function ShopItem(name,description,price,pricemod,icon,func){
  this.name = name;
  this.desc = description;
  this.price = price;
  this.priceMod = pricemod;
  this.level = 0;
  this.priceHistory = [];
  this.action = function() {
    func(_this);
  };
  this.icon = icon;
  let _this = this;

  let i = document.createElement('li');
  i.classList.add('shop-item');
  i.innerHTML = template2.render({icon:this.icon});
  shopList.append(i);

  i.querySelector('button').onclick = this.action;

  i.onmouseover = function() {
    showItemTooltip(_this,i);
  };

  i.onmouseout = function() {
    hideItemTooltip(i)

  }

}



function resetShop(){
     shop.shopItems = [];


    shop.shopItems.push(new ShopItem(
       'Upgrade stocklist',
        'Adds more stock',
        600,
        5,
        'playlist_add',
        function (obj) {
            if(buy(obj.price)){
              game.stocks++;
              obj.price = obj.price * obj.priceMod;
            }
        }
    ));
  shop.shopItems.push(new ShopItem(
      'Upgrade vol',
      'More volatile stocks',
      1000,
      0.3,
      'trending_up',
      function (obj) {
        if(buy(obj.price)){
          game.stockVolitile++;
          obj.price = obj.price * obj.priceMod;
        }
      }
  ));
  shop.shopItems.push(new ShopItem(
      'Downgrade vol',
      'Less volatile stocks',
      game.stockVolitile*100,
      1,
      'trending_down',
      function (obj) {
        if(buy(obj.price)){
          game.stockVolitile--;
          obj.price = game.stockVolitile*100;
        }
      }
  ));

}

function buy(price) {
    console.log(game.money+' '+price);
  if(game.money >= price){
    game.money -= price;
    updateUI();
    return true;
  }
  else{
    message("You can't afford this my dude");
    return false;
  }
}

newGame();




setInterval(gameUpdate,1000);