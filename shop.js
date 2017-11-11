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