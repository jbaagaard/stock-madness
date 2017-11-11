

function Shop(gameObj) {
    let _this = this;
    this.inventory = [];

    this.buyItem = function (item) {
        if (gameObj.money >= item.price){
            gameObj.money -= item.price;
            item.action(item);
            item.price *= item.priceMod;
            item.level++;
            if (item.level > item.maxLevel){
                _this.inventory.splice(_this.inventory.indexOf(item), 1);
            }
            console.log(item);
            return true;
        }
        else {
            console.log("Not enough money to buy :(((");
            return false;
        }
    };
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