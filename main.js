"use strict";

let stocks = [];
let game = {};
let template = JsT.loadById("stock-template");
let stockList = document.getElementById('stock-list');


 function getRandomNumber(min,max) {
     return max - Math.random()*(max-min)
 }


function generateName() {
    let _mainName = ['Fizz','Bit','Snake','Kaj','Danni','weed'];
    let _ending = ['coin','ly','mønt'];

    let _name = _mainName[Math.floor(getRandomNumber(0,_mainName.length))];
    if(Math.random()*100 > 50)
        return _name;
    else
        return _name + _ending[Math.floor(getRandomNumber(0,_ending.length))]
}

function Stock(fluctuation) {
    let _fluctuation = fluctuation * getRandomNumber(0.8,1.2);
    this.name = generateName();
    this.price = _fluctuation * 10;
    this.state = 'alive';
    let _age = 0;
    let _amoutOwned = 1;
    let _priceMod = _fluctuation - fluctuation/2;

    let i = document.createElement('li');
    i.classList.add('stock');
    i.innerHTML = template.render();

    let db = new JsDataBindings(i);
    stockList.append(i);


    console.log(db);

    this.iterate = function(){
        this.price += (Math.random() * _fluctuation) - _fluctuation / 2 + _priceMod;
        _priceMod += getRandomNumber((_fluctuation*-1)/2,_fluctuation/2);
        console.log(this.price+' '+_priceMod);

    };
    this.showVariables = function () {
        console.log(' age:'+_age+' owned'+_amoutOwned+' pricemod:'+_priceMod+' fluc:'+_fluctuation);
    };
    this.updateUI = function () {
        db.name = this.name;
        db.price = this.price;
        db.owned = _amoutOwned;
        console.log(db);
    }

}

function updateUI() {
    for(var i = 0;i<game.stocks;i++){
        stocks[i].updateUI();
    }
}


function Player() {

     this.newGame = function () {
         this.money = 100;
     }
}

function newGame() {

    game = {
        stocks: 5,
        stockVolitile: 10
    };


    stocks = [];
    for(var i = 0;i<game.stocks;i++){
        stocks.push(new Stock(10));
    }
}

newGame();

