let shopItemTemplate = JsT.loadById('shop-item-template');
let shopTooltip = new JsDataBindings(document.getElementById('shop-item-tooltip'));

function Shop(gameObj, shopListId) {
    let _thisShop = this;
    let _shopList = document.getElementById(shopListId);
    this.inventory = [];

    this.buyItem = function (item) {
        if (gameObj.money >= item.price){
            gameObj.money -= item.price;
            item.action(item);
            item.price *= item.priceMod;
            item.level++;
            if (item.level > item.maxLevel){
                _thisShop.inventory.splice(_thisShop.inventory.indexOf(item), 1);
            }
            console.log(item);
            return true;
        }
        else {
            console.log("Not enough money to buy :(((");
            return false;
        }
    };

    this.reset = function () {
        _thisShop.inventory = [];


        _thisShop.addItem('Upgrade stocklist',
            'Adds more stock',
            600,
            5,
            20,
            'playlist_add',
            function () {
                gameObj.stocks++;
            });
        _thisShop.addItem('Upgrade vol',
            'More volatile stocks',
            1000,
            0.3,
            20,
            'trending_up',
            function (obj) {
                game.stockVolitile++;
            });
        _thisShop.addItem('Downgrade vol',
            'Less volatile stocks',
            game.stockVolitile*100,
            1,
            20,
            'trending_down',
            function (obj) {
                game.stockVolitile--;
            });
    };

    this.addItem = function (name,description,price,priceMod, maxLvl,icon,func) {
        _thisShop.inventory.push(new Item(name,description,price,priceMod, maxLvl,icon,func))
    };

    function Item(name,description,price,priceMod, maxLvl,icon,func) {
        this.name = name;
        this.desc = description;
        this.price = price;
        this.priceMod = priceMod;
        this.maxLevel = maxLvl;
        this.level = 0;
        this.action = func;
        this.icon = icon;
        let _thisItem = this;

        let i = document.createElement('li');
        i.classList.add('shop-item');
        i.innerHTML = shopItemTemplate.render({icon: this.icon});
        i.querySelector('button').onclick = function () { _thisShop.buyItem(_thisItem); };
        i.onmouseover = function() { showItemTooltip(_thisItem); };
        i.onmouseout = hideItemTooltip;
        _shopList.appendChild(i);
        console.log(this);
    }
}

function showItemTooltip(item) {
    shopTooltip.name = item.name;
    shopTooltip.desc = item.desc;
    shopTooltip.price = item.price;
    shopTooltip.style = "opacity: 1";
}

function hideItemTooltip() {
    shopTooltip.style = "opacity: 0";
}