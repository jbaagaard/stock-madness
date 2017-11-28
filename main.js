

'use strict';

toastr.options = {
  "closeButton": false,
  "debug": false,
  "newestOnTop": false,
  "progressBar": false,
  "positionClass": "toast-bottom-left",
  "preventDuplicates": false,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
};

// let shop = {};
let stocks = [];
let game = {};
let stockTemplate = JsT.loadById('stock-template');
let stockList = document.getElementById('stock-list');

let shopList = document.getElementById('shop-list');
let tooltipDb = new JsDataBindings(
    document.getElementById('shop-item-tooltip'));
let tooltip = document.getElementById('shop-item-tooltip');
let messageDb = new JsDataBindings(document.getElementById('message'));
let messageDiv = document.getElementById('message');

// let template2 = JsT.loadById('shop-item-template');
// let shopList = document.getElementById('shop-list');
// let tooltipDb = new JsDataBindings(document.getElementById('shop-item-tooltip'));
// let tooltip = document.getElementById('shop-item-tooltip');
let shop = new Shop(game, 'shop-list');

let names = {
  mainName: ['Bit', 'Snake', 'Kaj', 'Danni'],
  ending: ['coin', 'ly', 'mønt'],
};

let headerbinding = new JsDataBindings('header');
headerbinding.setFormatter(null, 'money', function(money) {
  if (money >= 1000000000)
    money = Math.floor(money / 1000000) + 'm';
  else if (money >= 1000000)
    money = Math.floor(money / 1000) + 'k';
  else {
    money = money.toFixed(8);
  }
  return 'DOLLARDOLLARS ' + money;
});

function getRandomNumber(min, max) {
  return max - Math.random() * (max - min);
}

function generateName() {
  let _name = names.mainName[Math.floor(
      getRandomNumber(0, names.mainName.length))];
  if (Math.random() * 100 > 50)
    return _name;
  else
    return _name +
        names.ending[Math.floor(getRandomNumber(0, names.ending.length))];
}

function Stock(fluctuation) {
  let _fluctuation = fluctuation * getRandomNumber(0.8, 1.2);
  this.name = generateName();
  let _price = _fluctuation * 10;
  this.state = 'alive';
  let _age = 0;
  let _amountOwned = 0;
  let _priceMod = _fluctuation - fluctuation / 2;
  this.priceHistory = [_price];

  let i = document.createElement('li');
  i.classList.add('stock');
  i.innerHTML = stockTemplate.render();

  let _upArrow = i.querySelector('.arrow-up');
  let _downArrow = i.querySelector('.arrow-down');
  console.log(_upArrow);

  let db = new JsDataBindings(i);
  stockList.append(i);

  //
  // console.log(db);

  i.onclick = ()=> {
    UITargetStock = this;
    if(gameSessionTicks>3){
      chartData = formatSelectedStock();
      drawChart();
    }

    $('.stock.selected').removeClass('selected');
    i.classList.add('selected');
  };

  i.querySelector('.buy-button').onclick = function() {
    //console.log(stocks[]);
    if (db.amount > 0) {
      //console.log(parseFloat(db.amount)*this.price);
      //console.log(typeof db.amount);
      //console.log(typeof this.price);
      if (parseFloat(db.amount) * _price <= game.money) {
        _amountOwned += parseFloat(db.amount);
        game.money -= _price * db.amount;
        console.log(db.amount);
      }
      else {
        _amountOwned += (game.money / _price);
        game.money = 0;
      }
    }
    else {
      alert('please enter a valid number');
    }
    updateUI();
  };

  i.querySelector('.sell-button').onclick = function() {
    if (db.amount < _amountOwned) {

      _amountOwned = _amountOwned - db.amount;
      game.money += db.amount * _price;

    }
    else {
      game.money += _amountOwned * _price;
      _amountOwned = 0;
    }
    updateUI();
  };

  //i.querySelector('.buy-button').onclick = this.buy;

  this.randomEvent = function(priceChange) {
    console.log(_price + ' ' + _priceMod);
    _price += priceChange * (_fluctuation * 2);
    _priceMod += priceChange * (_fluctuation * 2);
    console.log(_price + ' ' + _priceMod);
  };

  this.iterate = function() {
    _price += (Math.random() * _fluctuation*2) - _fluctuation + _priceMod;
    _priceMod += getRandomNumber((_fluctuation * -1), _fluctuation);
    if (_price < 0)
      this.state = 'dead';
    this.priceHistory.push(_price);
    if (this.priceHistory.length > 15)
      this.priceHistory.splice(0,1);
    if (_priceMod >= 0) {
      //up
    }
    else {
      //down
    }
    if(_priceMod > _fluctuation*2)
      _priceMod = _fluctuation*2
  };

  this.showVariables = function() {
    console.log(' age:' + _age + ' owned' + _amoutOwned + ' pricemod:' +
        _priceMod + ' fluc:' + _fluctuation);
  };
  this.updateUI = function() {
    // i.getElementsByClassName('stock-name').item(0).innerText = this.name;
    // i.getElementsByClassName('stock-price').item(0).innerText = this.price.toFixed(2);
    // i.getElementsByClassName('stock-owned').item(0).innerText = _amoutOwned.toFixed(4);
    db.name = this.name;
    db.price = _price.toFixed(2);
    db.owned = _amountOwned.toFixed(4);
  };

  this.kill = function() {
    i.remove();
    stocks.splice(stocks.indexOf(this), 1);
  };
  updateUI();
}

let goodNewsMsg = [
  'increase in sales',
  'just got a huge investor',
];

let badNewsMsg = [
  ', big investors getting sued left and right',
  ', bug found in blockchain',
];

function randomEvent() {
  let rdmNumber = Math.random() - 0.5;
  let rdmStock = stocks[parseInt(Math.random() * stocks.length)];
  if (rdmNumber > 0) {
    message(rdmStock.name + ' ' +
        goodNewsMsg[parseInt(Math.random() * goodNewsMsg.length)]);
  }
  else {
    message(rdmStock.name + ' ' +
        badNewsMsg[parseInt(Math.random() * badNewsMsg.length)]);
  }
  rdmStock.randomEvent(rdmNumber);

}

function updateUI() {
  for (let i = 0; i < stocks.length; i++) {
    stocks[i].updateUI();
  }
  headerbinding.money = game.money;
}

let gameSessionTicks = 0;

function gameUpdate() {
  for (let i = 0; i < stocks.length; i++) {
    stocks[i].iterate();
    if (stocks[i].state === 'dead') {
      stocks[i].kill();
      stocks.push(new Stock(game.stockVolitile));
    }
  }
  let stockCount = game.stocks - stocks.length;
  for (; stockCount > 0; stockCount--) {
    stocks.push(new Stock(game.stockVolitile));
  }
  updateUI();
  if(gameSessionTicks>3){
    chartData = formatSelectedStock();
    drawChart();
  }
  gameSessionTicks++;
}

function newGame() {
  game.stocks = 5;
  game.stockVolitile = 10;
  game.money = 500;

  shop.reset();
  stocks = [];
  for (let i = 0; i < game.stocks; i++) {
    stocks.push(new Stock(game.stockVolitile));
  }
  updateUI();
}

function message(s) {
  toastr["info"](s);
  console.log(s);

  //messageDb.message = s;
  //messageDiv.classList.remove('hidden');
  //messageDiv.classList.add('hidden');
}

function showItemTooltip(item, i) {
  tooltipDb.name = item.name;
  tooltipDb.desc = item.desc;
  tooltipDb.price = item.price;
  tooltip.classList.remove('hidden');
}

function hideItemTooltip(i) {
  tooltip.classList.add('hidden');
}

google.charts.load('current', {'packages': ['corechart']});
google.charts.setOnLoadCallback(drawChart);

let UITargetStock = {priceHistory:[1,2,3]};

function formatSelectedStock() {
  let selectedStock = UITargetStock;
  let value = [['', 'Price']];
  for (let i = 0; i < selectedStock.priceHistory.length; i++) {
    value.push(['', parseInt(selectedStock.priceHistory[i])]);
  }
  return value;
}

let chartData = [
  ['', 'Price'],
  ['', 1000],
  ['', 1170],
  ['', 660],
  ['', 1030],
];

let chartOptions = {
  title: 'stock price history',
  backgroundColor: {fill: 'transparent'},
  hAxis: {
    gridlines: {},
    baselineColor: 'red',
  },
};

function drawChart() {
  let data = google.visualization.arrayToDataTable(chartData);

  let chart = new google.visualization.AreaChart(
      document.getElementById('stock-chart'));

  chart.draw(data, chartOptions);
}

newGame();

setInterval(gameUpdate, 1000);

