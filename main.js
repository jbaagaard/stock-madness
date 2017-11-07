"use strict";

let stocks = [];
let game = {};
let template = JsT.loadById("stock-template");
let stockList = document.getElementById('stock-list');


let headerbinding = new JsDataBindings('header');
headerbinding.setFormatter(null,'money',function (money) {
    return 'DOLLARDOLLARS '+money.toFixed(8);
});

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
    updateUI();
 }
function newGame() {


     game.stocks = 5;
     game.stockVolitile = 10;
     game.money = 500;




    stocks = [];
    for(var i = 0;i<game.stocks;i++){
        stocks.push(new Stock(10));
    }
    updateUI();
}

newGame();



setInterval(gameUpdate,1000);