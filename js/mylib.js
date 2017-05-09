var Sprite = Class.create({
    initialize: function(x,y,w,h,container){

        this.actualX = x;
        this.actualY = y;
        this.actualWidth = w;
        this.actualHeight = h;
        this.container = container;
        this.x = Math.round(x/100*this.container.width);
        this.y = Math.round(y/100*this.container.height);
        this.width = Math.round(w/100*this.container.width);
        this.height = Math.round(h/100*this.container.height);
        this.spdX = 0;
        this.spdY = 0;
        if(this.width < 1)
        {
            this.width = 1;
        }
        if(this.height < 1)
        {
            this.height = 1;
        }

    },
    getCenterX: function()
    {
        return (this.x + this.width)/2;
    },
    getCenterY: function()
    {
        return (this.y + this.height)/2;
    },
    getCenter: function()
    {
        return {x: this.getCenterX(),y: this.getCenterY()};
    },
    getActualX: function()
    {
        return this.actualX;
    },
    getActualY: function()
    {
        return this.actualY;
    },
    getActualWidth: function()
    {
      return this.actualWidth;
    },
    getActualHeight: function()
    {
      return this.actualHeight;
    },
    getX: function()
    {
        return this.x;
    },
    getY: function()
    {
        return this.y;
    },
    getWidth: function()
    {
        return this.width;
    },
    getHeight: function()
    {
        return this.height;
    },
    setX: function(x)
    {
        this.actualX = x;
        this.x = Math.round(x/100*this.container.width);
    },
    setY: function(y)
    {
        this.actualY = y;
        this.y = Math.round(y/100*this.container.height);
    },
    setWidth: function(w)
    {
        this.actualWidth = w;
        this.width = Math.round(w/100*this.container.width);
    },
    setHeight: function(h)
    {
        this.actualHeight = h;
        this.height = Math.round(h/100*this.container.height);
    },
    setLoc: function(x,y)
    {
        this.setX(x);
        this.setY(y);
    },
    moveX: function(dx){
        this.x += Math.round(dx/100*this.container.width);
        this.spdX = dx;
        this.spdY = 0;
    },
    moveY: function(dy){
        this.y += Math.round(dy/100*this.container.height);
        this.spdY = dy;
        this.spdX = 0;
    },
    getXSpd: function()
    {
      return this.spdX;
    },
    getYSpd: function()
    {
      return this.spdY;
    },
    contains: function(x,y)
    {
        return x >= this.x && x <= this.x+this.width && y >= this.y && y <= this.y+this.height;
    },
    intersects: function(sprite)
    {
        return this.contains(sprite.getX(),sprite.getY());
    },
    resize: function()
    {
        this.x = Math.round(this.actualX/100*this.container.width);
        this.y = Math.round(this.actualY/100*this.container.height);
        this.width = Math.round(this.actualWidth/100*this.container.width);
        this.height = Math.round(this.actualHeight/100*this.container.height);
        if(this.width < 1)
        {
            this.width = 1;
        }
        if(this.height < 1)
        {
            this.height = 1;
        }
    },
    draw: function(graphics){
        graphics.save();
        graphics.lineWidth = 3;
        graphics.strokeStyle = "rgb(0,0,0)";
        graphics.strokeRect(this.x,this.y,this.width,this.height);
        graphics.restore();
    }
});

var imageSprite = Class.create(Sprite,{
    initialize: function($super,x,y,w,h,image,container){
        $super(x,y,w,h,container);
        this.img = image;
        this.debug = false;
        this.isVisible = true;
    },
    setImage: function(img)
    {
        this.img = img;
    },
    getImage: function()
    {
        return this.img;
    },
    setVisible: function(bool)
    {
      this.isVisible = bool;
    },
    draw: function($super,graphics){
        if(this.isVisible)
        {
            graphics.save();
            graphics.drawImage(this.img,0,0,this.img.width,this.img.height,this.x,this.y,this.width,this.height);
            graphics.restore();
        }
        if(this.debug)
        {
            $super(graphics);
        }
    }
});

var AnimatedSprite = Class.create(imageSprite,{

    initialize: function($super,x,y,w,h,container,img,frameCount,fps)
    {
        $super(x,y,w,h,img,container);
        this.frameCount = frameCount;
        this.currentFrame = 0;
        this.fps = fps;
        this.playing = true;
        this.loopCount = -1;
        this.date = Date.now();
        this.elapsedTime = 0;
        this.isReversed = false;
        this.frameTime = 1000/fps;
        this.frameWidth = this.img.width/this.frameCount;
    },
    setImg: function(img)
    {
        this.img = img;
    },
    draw: function($super,graphics)
    {
        graphics.save();
        if(this.isVisible) {
            graphics.drawImage(this.img, this.frameWidth * this.currentFrame,0, this.frameWidth, this.img.height, this.x, this.y, this.width, this.height);
        }
        if(this.debug) {
            graphics.lineWidth = 3;
            graphics.strokeStyle = "rgb(0,0,0)";
            graphics.strokeRect(this.x, this.y, this.width, this.height);
        }

        graphics.restore();
    },
    play: function(loopCount)
    {
        this.playing = true;
        this.loopCount = loopCount;
    },
    setReverse: function(r)
    {
        this.isReversed = r;
    },
    update: function(deltaTime)
    {
        this.elapsedTime += deltaTime;
        if(this.playing && this.elapsedTime >= this.frameTime)
        {
            this.elapsedTIme = 0;
            if(this.isReversed)
            {
                this.currentFrame--;
                if(this.currentFrame < 0)
                {
                    this.currentFrame = this.frameCount-1;
                }
            }
            else
            {
                this.currentFrame++;
                this.currentFrame %= this.frameCount;
            }
            if(this.currentFrame == 0 && this.loopCount > 0)
            {
                this.loopCount--;
                if(this.loopCount == 0)
                {
                    this.playing = false;
                }
            }
        }

    },
    pause: function()
    {
        this.playing = false;
    },
    isPlaying: function()
    {
        return this.playing;
    },
    goToFrame: function(frame)
    {
        this.currentFrame = frame % this.frameCount;
    }
});

var Player = Class.create(AnimatedSprite,{

   initialize: function($super,x,y,w,h,container,img,frameCount,fps,stats,health,mana,username)
   {
       $super(x,y,w,h,container,img,frameCount,fps);

       this.inv = [];
       this.stats = stats;
       this.username = username;
       // 0: str 1: def 2: agility 3: exp
       this.alive = true;
       this.maxHealth = health;
       this.nextLevelXP = 500;
       this.level = 1;
       this.currentHealth = health;
       this.maxMana = mana;
       this.currentMana = mana;
       this.canMove = true;
       this.spells = [];
       this.currentWeapon = null;
       this.currentArmor = null;
   },
    setAlive: function(bool)
    {
      this.alive = true;
    },
    canMove: function()
    {
        return this.canMove;
    },
    setMove: function(bool)
    {
      this.canMove = bool;
    },
    getInv: function()
    {
        return this.inv;
    },
    getStats: function()
    {
        return this.stats;
    },
    getUser: function()
    {
      return this.username;
    },
    getCurrentHealth: function()
    {
        return this.currentHealth;
    },
    setCurrentHealth: function(hp)
    {
      this.currentHealth = hp;
    },
    getMaxHealth: function()
    {
      return this.maxHealth;
    },
    setMaxHealth: function(hp)
    {
      this.maxHealth = hp;
    },
    getLevel: function()
    {
      return this.level;
    },
    getTotalDamage: function()
    {
      var str = this.getStats()[0];
        if(this.currentWeapon != null)
        {
            str += this.currentWeapon.getDamage();
        }
        return str;
    },
    getTotalSpd: function()
    {
      var spd = this.getStats()[2];
        if(this.currentWeapon != null)
        {
            spd += this.currentWeapon.getSpd();
        }
        return spd;
    },
    getCurrentMana: function()
    {
        return this.currentMana;
    },
    setCurrentMana: function(mp)
    {
      this.currentMana = mp;
    },
    getMaxMana: function()
    {
      return this.maxMana;
    },
    setMaxMana: function(mp)
    {
      this.maxMana = mp;
    },
    getSpells: function()
    {
        return this.spells;
    },
    addSpell: function(spell)
    {
      this.spells.push(spell);
    },
    getCurrentWeapon: function()
    {
        return this.currentWeapon;
    },
    getCurrentArmor: function()
    {
        return this.currentArmor;
    },
    addItem: function(item)
    {
        this.inv.push(item);
    },
    removeItem: function(itemName)
    {
        for(var i = 0; i < this.inv.length; i++)
        {
            if(itemName.getName() == this.inv[i].getName())
            {
                this.inv.splice(i,1);
            }
        }
    },
    gainXP: function(xp)
    {
      this.stats[3] += xp;
    },
    getMaxExp: function()
    {
        return this.nextLevelXP;
    },
    takeDamage: function(dmg)
    {
        var realDmg = dmg;
        realDmg -= this.getStats()[1];
        if(this.getCurrentArmor() != null)
        {
            realDmg -= this.getCurrentArmor().getDefence();
        }
        if(realDmg <= 0)
        {
            realDmg = 1;
        }

      this.currentHealth -= realDmg;
      if(this.currentHealth <= 0)
      {
          this.currentHealth = 0;
          this.alive = false;
      }
    },
    heal: function(hp)
    {
        this.currentHealth += hp;
        if(this.currentHealth > this.maxHealth)
        {
            this.currentHealth = this.maxHealth;
        }
    },
    useMana: function(dx)
    {
      this.currentMana -= dx;
      if(this.currentMana < 0)
      {
          this.currentMana = 0;
      }
    },
    gainMana: function(dx)
    {
      this.currentMana += dx;
      if(this.currentMana > this.maxMana)
      {
          this.currentMana = this.maxMana;
      }
    },
    levelUp: function()
    {
      this.maxHealth += 50;
      this.currentHealth = this.maxHealth;
      this.maxMana += 10;
      this.currentMana = this.maxMana;
      for(var i = 0; i < 3; i++)
      {
          this.stats[i] += (1 + Math.ceil(this.level/5));
      }
    },
    isAlive: function()
    {
        return this.alive;
    },
    equip: function(item)
    {
      if(item.getType() == "Armor")
      {
          if(this.currentArmor != null)
          {
              this.addItem(this.currentArmor);
              this.currentArmor = item;
          }
          else
          {
              this.currentArmor = item;
          }

      }
      else if(item.getType() == "Weapon")
      {
          if(this.currentWeapon != null)
          {
              this.addItem(this.currentWeapon);
              this.currentWeapon = item;
          }
          else
          {
              this.currentWeapon = item;
          }
      }
      else
      {
          console.log("Not an equip able item");
      }
        this.removeItem(item);
    },
    unEquip: function(type)
    {
      if(type == "Weapon")
      {
          this.addItem(this.currentWeapon);
          this.currentWeapon = null;
      }
      else if(type == "Armor")
      {
          this.addItem(this.currentArmor);
          this.currentArmor = null;
      }
      else
      {
          console.log("Incorrect type to unequip");
      }
    },
    update: function($super,deltaTime)
    {
        $super(deltaTime);

        if(this.stats[3] >= this.nextLevelXP)
        {
            this.level += 1;
            this.levelUp();
            this.nextLevelXP += (500*this.level);
        }
    },
    getSaveWeapons: function()
    {
        var array = [];
      for(var i = 0; i < this.inv.length; i++)
      {
          if(this.inv[i].getType() == "Weapon")
          {
              array.push(this.inv[i].saveWeapon());
          }
      }
      return array;
    },
    getSaveArmors: function()
    {
        var array = [];
        for(var i = 0; i < this.inv.length; i++)
        {
            if(this.inv[i].getType() == "Armor")
            {
                array.push(this.inv[i].saveArmor());
            }
        }
        return array;
    },
    getSaveSpells: function()
    {
      var array = [];
        for(var i = 0; i < this.spells.length; i++)
        {
            array.push(this.spells[i].saveSpell());
        }
        return array;
    },
    saveCharacter: function()
    {
        var info = [this.getActualX(),this.getActualY(),this.getActualWidth(),this.getActualHeight(),gameCanvas,mainCharacterFrontSheet,3,3,this.getStats(),this.getMaxHealth(),this.getMaxMana(),this.getUser(),this.getCurrentHealth(),this.getCurrentMana(),this.getSaveWeapons(),this.getSaveArmors(),this.getSaveSpells()];
        if(this.getCurrentArmor() != null)
        {
            info.push(this.getCurrentArmor().saveArmor());
        }
        if(this.getCurrentWeapon() != null)
        {
            info.push(this.getCurrentWeapon().saveWeapon());
        }
        var data = JSON.stringify(info);

        return data;
    }
});

var Enemy = Class.create(AnimatedSprite,{

    initialize: function($super,x,y,w,h,container,img,frameCount,fps,stats,health,mana,items,xp)
    {
        $super(x,y,w,h,container,img,frameCount,fps);

        this.stats = stats;
        // 0: str 1: def 2: agility 3: exp
        this.alive = true;
        this.maxHealth = health;
        this.currentHealth = health;
        this.maxMana = mana;
        this.currentMana = mana;
        this.spells = [];
        this.items = items;
        this.xp = xp;
    },
    getCurrentHealth: function()
    {
        return this.currentHealth;
    },
    getDamage: function()
    {
      return this.stats[0];
    },
    getCurrentMana: function()
    {
        return this.currentMana;
    },
    getItems: function()
    {
      return this.items;
    },
    getMaxHealth: function()
    {
        return this.maxHealth;
    },
    getMaxMana: function()
    {
        return this.maxMana;
    },
    getXP: function()
    {
      return this.xp;
    },
    setAlive: function(bool)
    {
      this.alive = bool;
    },
    getStats: function()
    {
        return this.stats;
    },
    isAlive: function()
    {
        return this.alive;
    },
    getSpells: function()
    {
        return this.spells;
    },
    takeDamage: function(dx)
    {
        var realDmg = dx;
        realDmg -= this.getStats()[1];
        if(realDmg <= 0)
        {
            realDmg = 1;
        }
        this.currentHealth -= realDmg;
        if(this.currentHealth <= 0)
        {
            this.currentHealth = 0;
            this.alive = false;
        }
    },
    loseMana: function(dx)
    {
        this.currentMana -= dx;
        if(this.currentMana <= 0)
        {
            this.currentMana = 0;
        }
    },
    heal: function(dx)
    {
        this.currentHealth += dx;
        if(this.currentHealth > this.maxHealth)
        {
            this.currentHealth = this.maxHealth;
        }
    }
});
var Npc = Class.create(AnimatedSprite,{

    initialize: function($super,x,y,w,h,container,img,frameCount,fps,msg,itemShop)
    {
        $super(x,y,w,h,container,img,frameCount,fps);

        this.msg = msg;
        this.itemShop = itemShop;
    },
    getItemShop: function()
    {
        return this.itemShop;
    },
    getMessage: function(map)
    {
        if(this.msg.length > 1)
        {
            return this.msg[map];
        }
        else
        {
            return this.msg;
        }
    }
});

var Weapon = Class.create(imageSprite,{

   initialize: function($super,x,y,w,h,img,container,name,spd,damage,price)
   {
       $super(x,y,w,h,img,container);
       this.spd = spd;
       this.damage = damage;
       this.price = price;
       this.name = name;
       this.type = "Weapon";
       this.img1 = img;
   },
    getSpd: function()
    {
        return this.spd;
    },
    setSpd: function(spd)
    {
      this.spd = spd;
    },
    getDamage: function()
    {
        return this.damage;
    },
    setDamage: function(dmg)
    {
      this.damage = dmg;
    },
    getPrice: function()
    {
       return this.price;
    },
    setPrice: function(price)
    {
      this.price = price;
    },
    getName: function()
    {
        return this.name;
    },
    getType: function()
    {
        return this.type;
    },
    setName: function(name)
    {
        this.name = name;
    },
    saveWeapon: function()
    {
        var info = [this.getActualX(),this.getActualY(),this.getActualWidth(),this.getActualHeight(),this.getImage(),this.getName(),this.getSpd(),this.getDamage(),this.getPrice()];
        return info;
    }
});

var Armor = Class.create(imageSprite,{

    initialize: function($super,x,y,w,h,img,container,name,defence,price)
    {
        $super(x,y,w,h,img,container);
        this.defence = defence;
        this.price = price;
        this.name = name;
        this.type = "Armor";
        this.img1 = img;
    },
    getDefence: function()
    {
        return this.defence;
    },
    setDefence: function(def)
    {
      this.defence = def;
    },
    getPrice: function()
    {
        return this.price;
    },
    setPrice: function(price)
    {
      this.price = price;
    },
    getName: function()
    {
        return this.name;
    },
    getType: function()
    {
        return this.type;
    },
    setName: function(name)
    {
        this.name = name;
    },
    saveArmor: function()
    {
        var info = [this.getActualX(),this.getActualY(),this.getActualWidth(),this.getActualHeight(),this.getImage(),this.getName(),this.getDefence(),this.getPrice()];
        return info;
    }
});

var QuestObject = Class.create(imageSprite,{

    initialize: function($super,x,y,w,h,img,container,name,price,sellable)
    {
        $super(x,y,w,h,img,container);
        this.price = price;
        this.name = name;
        this.type = "Object";
        this.sellable = sellable;
    },
    getPrice: function()
    {
        return this.price;
    },
    getName: function()
    {
        return this.name;
    },
    getType: function()
    {
        return this.type;
    },
    setName: function(name)
    {
        this.name = name;
    },
    isSellable: function()
    {
        return this.sellable;
    }
});

var Spell = Class.create(imageSprite,{

    initialize: function($super,x,y,w,h,img,container,name,damage,manaCost)
    {
        $super(x,y,w,h,img,container);
        this.name = name;
        this.type = "Spell";
        this.damage = damage;
        this.manaCost = manaCost;
    },
    getName: function()
    {
        return this.name;
    },
    getType: function()
    {
        return this.type;
    },
    setName: function(name)
    {
        this.name = name;
    },
    getManaCost: function()
    {
        return this.manaCost;
    },
    getDamage: function()
    {
        return this.damage;
    },
    saveSpell: function()
    {
        var info = [this.getActualX(),this.getActualY(),this.getActualWidth(),this.getActualHeight(),this.getImage(),this.getName(),this.getDamage(),this.getManaCost()];
        return info;
    }
});

var Tile = Class.create(imageSprite,{

    initialize: function($super,x,y,w,h,image,container,id)
    {
        $super(x,y,w,h,image,container);
        this.id = id;
    },
    getID: function()
    {
        return this.id;
    },
    setID: function(id)
    {
        this.id = id;
    }
});

var DialogueBox = Class.create(Sprite,{

   initialize: function($super,x,y,w,h,container,message)
   {
       $super(x,y,w,h,container);

       this.message = message;
       this.mLength = message.length;
       this.w = w;
       this.isVisible = true;
       this.percentLength = Math.round(message.length/100*this.container.width);
   },
    setMessage: function(m)
    {
        this.message = m;
    },
    setVisible: function(bool)
    {
      this.isVisible = bool;
    },
    draw: function(ctx)
    {
        if(this.isVisible)
        {
            ctx.save();

            var nMessage = [];

            ctx.strokeRect(this.getX(),this.getY(),this.getWidth(),this.getHeight());

            ctx.font = this.getHeight()/4+"px Arial";
            ctx.textAlign = "center";
            if(this.mLength > this.w)
            {
                nMessage = [this.message.substr(0,this.mLength/2),this.message.substr(this.mLength/2,this.mLength/2)];

            }
            if(nMessage.length > 0)
            {
                ctx.fillText(nMessage[0],this.getX()+this.getWidth()/2,this.getY()+this.getHeight()/2,this.getWidth());
                ctx.fillText(nMessage[1],this.getX()+this.getWidth()/2,(this.getY()+this.getHeight()/2) + this.getHeight()/4,this.getWidth());
            }
            else
            {
                ctx.fillText(this.message,this.getX()+this.getWidth()/2,this.getY()+this.getHeight()/2,this.getWidth());
            }
            ctx.restore();
        }
        }

});

var StateMachine = Class.create({

    initialize: function()
    {
        this.mStates = [];
        this.mStack = [];
    },
    update: function(deltaTime,mX,mY)
    {
        var state = this.mStack[this.mStack.length-1];
        state.update(deltaTime,mX,mY);

    },
    draw: function(graphics)
    {
        var state = this.mStack[this.mStack.length-1];
        state.draw(graphics);
    },
    addState: function(state)
    {
        this.mStates.push(state);
    },
    changeState: function(stateIndex,enemy,message)
    {
        /*if(this.mStack.length > 0)
        {
            var state = this.mStack[this.mStack.length-1];
            state.onExit();
        }*/
        var newState = this.mStates[stateIndex];
        this.mStack.push(newState);
        newState.onEnter(enemy,message);
    },
    revertState: function()
    {
        var oldState = this.mStack.pop();
        oldState.onExit();
    },
    returnToMenu: function()
    {
        var length = this.mStack.length;
            for(var i = 1; i < length; i++)
            {
                this.revertState();
            }
    }
});

var MainMenuState = Class.create({

   initialize: function(canvas,stateMachine,mainCharacter)
   {
       this.canvas = canvas;
       this.stateMachine = stateMachine;
       this.boundingRect = canvas.getBoundingClientRect();
       this.mainCharacter = mainCharacter;
       this.buttons = [];
       this.inPHP = false;
       this.buttonState = false;
       this.title = new DialogueBox(25,5,50,20,canvas,"RealmRPG");
       this.background = new imageSprite(0,0,100,100,menuBackground,canvas);
   },
    onEnter: function()
    {
        var temp = new DialogueBox(35,40,30,8,this.canvas,"New Game");
        var temp1 = new DialogueBox(35,50,30,8,this.canvas,"Load Game");
        var temp2 = new DialogueBox(35,40,30,8,this.canvas,"Start Game");
        this.mainCharacter.setAlive(true);
        this.buttons.push(temp,temp1,temp2);
    },
    onExit: function()
    {

    },
    draw: function(g)
    {
        this.background.draw(g);
        this.title.draw(g);
        if(!this.buttonState)
        {
            for(var i = 0; i < this.buttons.length-1; i++)
            {
                this.buttons[i].draw(g);
            }
        }
        else
        {
            this.buttons[2].draw(g);
        }

    },
    update: function(deltaTime,mX,mY)
    {

        if(!this.inPHP)
        {
            if(this.buttons[0].contains(mX,mY) && this.canvas.mouseDown)
            {
                var section = document.getElementById("phpIncludeSection");
                section.style.display = "block";
                this.inPHP = true;
                $.ajax({
                    url: "php/view/registerGameView.php",
                    cache: false
                }).done(function(html){
                    $("#phpIncludeSection").append(html);
                });

                this.buttonState = true;
            }
            else if(this.buttons[1].contains(mX,mY) && this.canvas.mouseDown)
            {
                var section = document.getElementById("phpIncludeSection");
                section.style.display = "block";
                this.inPHP = true;
                $.ajax({
                    url: "php/view/loadGameView.php",
                    cache: false
                }).done(function(html){
                    $("#phpIncludeSection").append(html);
                });
                this.buttonState = true;
               /* var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function()
                {
                    if(this.readyState == 4 && this.status == 200)
                    {
                        section.innerHTML = this.responseText;
                    }
                };
                xhttp.open("GET","php/control/loadGameController.php",true);
                xhttp.send();*/

            }
        }
        else
        {
            if(this.buttons[2].contains(mX,mY) && this.canvas.mouseDown)
            {
                this.stateMachine.changeState(1,mapDetail);
            }
        }
    }

});
var DialogueState = Class.create({

    initialize: function(container,stateMachine,mainCharacter,message)
    {
        this.container = container;
        this.message = message;
        this.iterater = 0;
        this.map = [];
        this.mainCharacter = mainCharacter;
        this.stateMachine = stateMachine;
        this.currentMessage = new DialogueBox(0,0,0,0,this.container,this.message[this.iterater]);
    },
    onEnter: function(map,message)
    {
    this.map = map;
    this.message = message;
    this.currentMessage = new DialogueBox(0,70,100,30,this.container,this.message[this.iterater]);
    },
    onExit: function()
    {
        this.map = [];
        this.iterater = 0;
    },
    draw: function(g)
    {
        for(var i = 0; i < this.map.length; i++)
        {
            for(var k = 0; k < this.map[i].length; k++)
            {
                this.map[i][k].draw(g);
            }
        }
        this.mainCharacter.draw(g);
        this.currentMessage.draw(g);
    },
    update: function(deltaTime,mX,mY)
    {
        if(this.currentMessage.contains(mX,mY) && this.container.mouseDown)
        {
            if(this.iterater >= this.message.length-1)
            {
                this.stateMachine.revertState();
            }
            else
            {
                this.iterater++;
                this.currentMessage.setMessage(this.message[this.iterater]);
            }
        }
    }
});
var localGameState = Class.create({

    initialize: function(canvas,stateMachine,mainCharacter)
    {
        this.canvas = canvas;
        this.boundingRect = canvas.getBoundingClientRect();
        this.stateMachine = stateMachine;
        this.mainCharacter = mainCharacter;
        this.collideLayer = [];
        this.mapDetails = [];
        this.mapSystem1 = new mapSystem(0,0,this.canvas);
        this.eventFunction = function(e)
        {
            if(this.mainCharacter.canMove)
            {
                switch(e.keyCode) {
                    case 37:
                        mainCharacter.setImg(mainCharacterLeftSheet);
                        mainCharacter.moveX(-2);
                        mainCharacter.play(1);
                        break;
                    case 39:
                        mainCharacter.setImg(mainCharacterRightSheet);
                        mainCharacter.moveX(2);
                        mainCharacter.play(1);
                        break;
                    case 38:
                        mainCharacter.setImg(mainCharacterBackSheet);
                        mainCharacter.moveY(-2);
                        mainCharacter.play(1);
                        break;
                    case 40:
                        mainCharacter.setImg(mainCharacterFrontSheet);
                        mainCharacter.moveY(2);
                        mainCharacter.play(1);
                        break;
                    case 73:
                        stateMachine.changeState(2);
                        mainCharacter.setMove(false);
                        break;
                    case 80:
                        stateMachine.changeState(3,map1);
                        mainCharacter.setMove(false);
            }
                }
        }
    },
    onEnter: function(mapDetails)
    {

        this.mapSystem1 = new mapSystem(0,0,this.canvas);
        this.mapSystem1.generateMap(mapDetails,true);
        this.collideLayer = this.mapSystem1.getCollision();
        this.mapDetails = this.mapSystem1.getMapDetails(0);
        this.mainCharacter.setLoc(this.mapDetails[2],this.mapDetails[3]);
        this.mainCharacter.setMove(true);
         map1 = this.mapDetails;
        this.eventFunction = function(e)
        {
            if(this.mainCharacter.canMove)
            {
                switch(e.keyCode) {
                    case 37:
                        mainCharacter.setImg(mainCharacterLeftSheet);
                        mainCharacter.moveX(-2);
                        mainCharacter.play(1);
                        break;
                    case 39:
                        mainCharacter.setImg(mainCharacterRightSheet);
                        mainCharacter.moveX(2);
                        mainCharacter.play(1);
                        break;
                    case 38:
                        mainCharacter.setImg(mainCharacterBackSheet);
                        mainCharacter.moveY(-2);
                        mainCharacter.play(1);
                        break;
                    case 40:
                        mainCharacter.setImg(mainCharacterFrontSheet);
                        mainCharacter.moveY(2);
                        mainCharacter.play(1);
                        break;
                    case 73:
                        stateMachine.changeState(2);
                        mainCharacter.setMove(false);
                        break;
                    case 80:
                        stateMachine.changeState(3,map1);
                        mainCharacter.setMove(false);
                }
            }
        };
        window.addEventListener("keydown",this.eventFunction);

    },
    onExit: function()
    {
        window.removeEventListener("keydown",this.eventFunction);
        this.collideLayer = [];
        this.mainCharacter.setMove(false);
    },
    draw: function(g)
    {
        var details = this.mapSystem1.getMapDetails(1);

        var camX = clamp(-this.mainCharacter.getX() + this.canvas.width/2, -(details[0]*40-this.canvas.width),0);
        var camY = clamp(-this.mainCharacter.getY() + this.canvas.height/2, -(details[1]*30-this.canvas.height),0);
//  width: 40px height: 30px
        g.translate(camX,camY);

        this.mapSystem1.draw(g);
        this.mainCharacter.draw(g);
    },
    update: function(deltaTime,mX,mY)
    {
        for(var i = 0; i < this.collideLayer.length; i++)
        {
            if(this.collideLayer[i].contains(this.mainCharacter.getX()+16,this.mainCharacter.getY()+24) && this.collideLayer[i].getID() != -1)
            {

                collisionDirection(this.mainCharacter, this.collideLayer[i]);
                if(this.collideLayer[i].getID() == 9)
                {
                    var posXY = this.mapSystem1.changeMap(this.mapDetails[5],true);
                    this.mainCharacter.setLoc(posXY[0],posXY[1]);
                    this.collideLayer = this.mapSystem1.getCollision();
                    this.mapDetails = this.mapSystem1.getMapDetails();
                }
                if(this.collideLayer[i].getID() == 10)
                {
                    var r = [randomNumber(0,5),randomNumber(0,5),randomNumber(0,5),randomNumber(50,100),randomNumber(50,100),randomNumber(1,45),randomNumber(1,15),randomNumber(300,500)];
                    var beholder = new Enemy(0,0,15,15,this.canvas,enemy1,1,1,[r[0],r[1],r[2]],r[3],r[4],new Weapon(0,0,5,5,weaponDagger,this.canvas,r[5],r[6],r[5]+r[6],r[7]),r[7]);
                    this.collideLayer[i].setVisible(false);
                    this.collideLayer[i].setID(-1);
                    this.stateMachine.changeState(4,beholder);
                }
                if(this.collideLayer[i].getID() == 11)
                {
                    var r = [randomNumber(0,5),randomNumber(0,5),randomNumber(0,5),randomNumber(50,100),randomNumber(50,100),randomNumber(1,20),randomNumber(1,15),randomNumber(300,500)];
                    var ghost = new Enemy(0,0,20,20,this.canvas,enemy2,1,1,[r[0],r[1],r[2]],r[3],r[4],new Armor(0,0,5,5,armorLight,this.canvas,r[5],r[6],r[5]+r[6]),r[7]);
                    this.collideLayer[i].setVisible(false);
                    this.collideLayer[i].setID(-1);
                    this.stateMachine.changeState(4,ghost);
                }
                if(this.collideLayer[i].getID() == 12)
                {
                    var r = [randomNumber(150,200),randomNumber(90,150),randomNumber(25,35),randomNumber(150,300),randomNumber(500,1000),randomNumber(45,75),randomNumber(1,5),randomNumber(2000,5000)];
                    var caveFisher = new Enemy(0,0,20,20,this.canvas,document.getElementById("caveFisher"),1,1,[r[0],r[1],r[2]],r[3],r[4],new Weapon(0,0,5,5,weaponSword,this.canvas,r[5],r[6],r[5]+r[6],r[7]),r[7]);
                    this.collideLayer[i].setVisible(false);
                    this.collideLayer[i].setID(-1);
                    this.stateMachine.changeState(4,caveFisher);
                }
                if(this.collideLayer[i].getID() == 13)
                {
                   var jack = new Npc(0,0,20,20,this.canvas,NPC,1,1,[["Woooa there buddy, watch out for that beholder!","Use the 'attack' option to swing your sword or the 'spells' option to cast a spell","Press 'p' to access stats and save and 'i' to access inventory","Good luck!"],["Hey its you again! I've been looking for you","I need you to go through this cave system and defeat the cave fisher for me","He stole my magical lance and i need it back!", "Don't just stand there, GO!!"]]);
                   if(this.mapDetails[6][0] == 0)
                   {
                       this.stateMachine.changeState(6,this.mapSystem1.getCurrentMap(),jack.getMessage(0));
                   }
                   else if(this.mapDetails[6][0] == 2)
                   {
                       this.stateMachine.changeState(6,this.mapSystem1.getCurrentMap(),jack.getMessage(1));
                   }
                }

            }
        }

        map1 = this.mapDetails;
        this.mainCharacter.update(deltaTime);
    }
});

var inventoryState = Class.create({

   initialize: function(canvas,stateMachine,mainCharacter)
   {
       this.canvas = canvas;
       this.boundingRect = canvas.getBoundingClientRect();
       this.stateMachine = stateMachine;
       this.mainCharacter = mainCharacter;
       this.inventory = mainCharacter.getInv();
       this.one = false;
       this.clicked = 0;
       this.heading = new DialogueBox(30,0,30,10,canvas,"Inventory");
       this.equip = new DialogueBox(0,0,10,5,canvas,"Equip");
       this.dropItem = new DialogueBox(0,0,10,5,canvas,"Drop");
       this.stat = new DialogueBox(0,0,10,4,canvas,"");
       this.return = new DialogueBox(75,90,20,7,canvas,"Return");
   },
    onEnter: function()
    {

        this.heading = new DialogueBox(30,0,30,10,this.canvas,"Inventory");
        this.equip = new DialogueBox(0,0,10,5,this.canvas,"Equip");
        this.dropItem = new DialogueBox(0,0,10,5,this.canvas,"Drop");
        this.stat = new DialogueBox(0,0,10,4,this.canvas,"");
        this.return = new DialogueBox(75,90,20,7,this.canvas,"Return");
        this.inventory = mainCharacter.getInv();
        this.one = false;

        this.updateInv();
    },
    updateInv: function()
    {
        var tileColumn = 0;
        var tileRow = 0;

        for(var i = 0; i < this.inventory.length; i++ )
        {
            var pixelPosX = tileColumn * 5;
            var pixelPosY = 10 + tileRow *5;

            this.inventory[i].setLoc(pixelPosX,pixelPosY);

            tileColumn += 2;
            if(tileColumn >= 20)
            {
                tileColumn = 0;
                tileRow += 4;
            }
        }
    },
    onExit: function()
    {
        this.heading = null;
        this.equip = null;
        this.dropItem = null;
        this.stat = null;
        this.return = null;
        this.clicked = 0;
        this.inventory = [];
        mX = -5;
        mY = -5;
    },
    update: function(deltaTime,mX,mY)
    {
        for(var i = 0; i < this.inventory.length; i++)
        {
            if(this.inventory[i].contains(mX,mY) && !this.one && this.canvas.mouseDown)
            {

                this.clicked = this.inventory[i];
                console.log(this.inventory[i]);
                var x = this.inventory[i].getActualX();
                var y = this.inventory[i].getActualY()+5;

                this.equip.setLoc(x,y);
                this.dropItem.setLoc(x,y+5);
                this.stat.setLoc(x,y+10);

                if(this.inventory[i].getType() == "Armor")
                {
                   this.stat.setMessage("Defence: " + this.inventory[i].getDefence());
                }
                else if(this.inventory[i].getType() == "Weapon")
                {
                    this.stat.setMessage("Damage: " + this.inventory[i].getDamage());
                }
                else
                {
                    this.stat.setMessage("Cost: " + this.inventory[i].getPrice());
                }
                this.one = true;
            }
            if(this.clicked != 0 && this.one)
            {
                if(this.equip.contains(mX,mY) && this.canvas.mouseDown)
                {
                    if(this.clicked.getType() == "Armor" || this.clicked.getType() == "Weapon")
                    {
                        this.mainCharacter.equip(this.clicked);
                        this.one = false;
                        this.inventory = this.mainCharacter.getInv();
                        this.clicked = 0;
                        this.updateInv();
                    }
                }
                else if(this.dropItem.contains(mX,mY) && this.canvas.mouseDown)
                {
                    this.mainCharacter.removeItem(this.clicked);
                    this.one = false;
                    this.inventory = this.mainCharacter.getInv();
                    this.clicked = 0;
                    this.updateInv();
                }
                else if(!this.clicked.contains(mX,mY))
                {
                    this.one = false;
                    this.clicked = 0;
                }
            }
        }
        if(this.return.contains(mX,mY))
        {
            this.stateMachine.revertState();
            this.mainCharacter.setMove(true);
        }
    },
    draw: function(g)
    {
        this.heading.draw(g);
        this.return.draw(g);
        for(var i = 0; i < this.inventory.length; i++)
        {
            this.inventory[i].draw(g);
        }
        if(this.one)
        {
            this.equip.draw(g);
            this.dropItem.draw(g);
            this.stat.draw(g);
        }
    }
});

var statsState = Class.create({

    initialize: function(canvas,stateMachine,mainCharacter)
    {
        this.canvas = canvas;
        this.boundingRect = canvas.getBoundingClientRect();
        this.stateMachine = stateMachine;
        this.mainCharacter = mainCharacter;
        this.stats = mainCharacter.getStats();
        this.str = this.stats[0];
        this.def = this.stats[1];
        this.agility = this.stats[2];
        this.exp = this.stats[3];
        this.hp = mainCharacter.getCurrentHealth();
        this.mana = mainCharacter.getCurrentMana();
        this.level = mainCharacter.getLevel();
        this.drawDropDown = false;
        this.clickedItem = 0;
        this.item = 0;
        this.drawables = [];
        this.equip = new DialogueBox(0,0,10,5,this.canvas,"Equip");
        this.stat = new DialogueBox(0,0,10,4,this.canvas,"");
        this.return = new DialogueBox(0,0,10,5,this.canvas,"Return");
        this.quit = new DialogueBox(0,0,10,5,this.canvas,"Exit Game");
        this.staticFrontImage = new imageSprite(0,0,25,30,mainCharacterFrontStatic,this.canvas);
        this.staticWeaponEquip = new imageSprite(0,0,15,20,weaponDagger,this.canvas);
        this.staticArmorEquip = new imageSprite(0,0,15,20,armorLight,this.canvas);
        this.saveButton = new DialogueBox(0,0,10,5,this.canvas,"Save Game");
        this.usernameText = new DialogueBox(0,0,10,5,this.canvas,this.mainCharacter.getUser());
        this.decoration1 = new Sprite(0,0,50,50,this.canvas);
        this.decoration2 = new Sprite(0,0,20,20,this.canvas);
        this.hpText = new DialogueBox(0,0,10,5,this.canvas,"Health: " + this.hp + "/" + this.mainCharacter.getMaxHealth());
        this.manaText = new DialogueBox(0,0,10,5,this.canvas,"Mana: " + this.mana + "/" + this.mainCharacter.getMaxMana());
        this.strText = new DialogueBox(0,0,10,5,this.canvas,"Strength: " + this.str);
        this.defText = new DialogueBox(0,0,10,5,this.canvas,"Defence: " + this.def);
        this.agilityText = new DialogueBox(0,0,10,5,this.canvas,"Agility: " + this.agility);
        this.levelText = new DialogueBox(0,0,10,5,this.canvas,"Level: " + this.level);
        this.expText = new DialogueBox(0,0,10,5,this.canvas,"Experience: " + this.exp + "/" + this.mainCharacter.getMaxExp());
        this.mapDetails = null;

    },
    onEnter: function(mapDetails)
    {
        this.stats = mainCharacter.getStats();
        this.str = this.stats[0];
        this.def = this.stats[1];
        this.agility = this.stats[2];
        this.exp = this.stats[3];
        this.level = mainCharacter.getLevel();
        this.hp = mainCharacter.getCurrentHealth();
        this.mana = mainCharacter.getCurrentMana();
        this.unEquip = new DialogueBox(0,0,10,5,this.canvas,"Unequip");
        this.stat = new DialogueBox(0,0,10,5,this.canvas,"");
        this.return = new DialogueBox(79,89,20,10,this.canvas,"Return");
        this.quit = new DialogueBox(35,89,20,10,this.canvas,"Exit Game");
        this.staticFrontImage = new imageSprite(70,10,25,30,mainCharacterFrontStatic,this.canvas);
        this.staticWeaponEquip = new imageSprite(50,0,15,20,weaponUnequip,this.canvas);
        this.staticArmorEquip = new imageSprite(50,30,15,20,armorUnequip,this.canvas);
        this.saveButton = new DialogueBox(10,89,20,10,this.canvas,"Save Game");
        this.decoration1 = new Sprite(40,0,65,70,this.canvas);
        this.decoration2 = new Sprite(0,0,40,70,this.canvas);
        this.usernameText = new DialogueBox(72,50,20,8,this.canvas,this.mainCharacter.getUser());
        this.hpText = new DialogueBox(0,0,40,10,this.canvas,"Health: " + this.hp + "/" + this.mainCharacter.getMaxHealth());
        this.manaText = new DialogueBox(0,10,40,10,this.canvas,"Mana: " + this.mana + "/" + this.mainCharacter.getMaxMana());
        this.strText = new DialogueBox(0,20,40,10,this.canvas,"Strength: " + this.str);
        this.defText = new DialogueBox(0,30,40,10,this.canvas,"Defence: " + this.def);
        this.agilityText = new DialogueBox(0,40,40,10,this.canvas,"Agility: " + this.agility);
        this.levelText = new DialogueBox(0,50,40,10,this.canvas,"Level: " + this.level);
        this.expText = new DialogueBox(0,60,40,10,this.canvas,"Experience: " + this.exp + "/" + this.mainCharacter.getMaxExp());
        this.drawables.push(this.return,this.quit,this.saveButton,this.decoration1,this.decoration2,this.usernameText,this.hpText,this.strText,this.defText,this.agilityText,this.levelText,this.expText,this.staticFrontImage,this.manaText);
        this.mapDetails = mapDetails;
    },
    onExit: function()
    {
        mX = -5;
        mY = -5;
        this.clickedItem = 0;
        this.item = 0;
        this.drawables = [];
    },
    update: function(deltaTime,mX,mY)
    {
    if(!this.drawDropDown)
    {
        if(this.mainCharacter.getCurrentArmor() != null)
        {
            this.staticArmorEquip.setImage(this.mainCharacter.getCurrentArmor().getImage());
            if(this.staticArmorEquip.contains(mX,mY))
            {
                var x = this.staticArmorEquip.getX()/6;
                var y = this.staticArmorEquip.getY()/4;

                this.unEquip.setLoc(x,y);
                this.stat.setLoc(x,y+5);

                this.stat.setMessage("Defense: " + this.mainCharacter.getCurrentArmor().getDefence());
                this.clickedItem = this.staticArmorEquip;
                this.item = this.mainCharacter.getCurrentArmor();
                this.drawDropDown = true;
            }
        }
        if(this.mainCharacter.getCurrentWeapon() != null)
        {
            this.staticWeaponEquip.setImage(this.mainCharacter.getCurrentWeapon().getImage());
            if(this.staticWeaponEquip.contains(mX,mY))
            {
                x = this.staticWeaponEquip.getX()/6;
                y = this.staticWeaponEquip.getY()/4+5;

                this.unEquip.setLoc(x,y);
                this.stat.setLoc(x,y+5);

                this.stat.setMessage("Damage: " + this.mainCharacter.getCurrentWeapon().getDamage());
                this.clickedItem = this.staticWeaponEquip;
                this.item = this.mainCharacter.getCurrentWeapon();
                this.drawDropDown = true;
            }
        }
    }
        if(this.drawDropDown && this.clickedItem != 0)
        {
            if(this.unEquip.contains(mX,mY))
            {
                if(this.item.getType() == "Armor")
                {
                    this.clickedItem.setImage(armorUnequip);
                }
                else
                {
                    this.clickedItem.setImage(weaponUnequip);
                }
                    this.mainCharacter.unEquip(this.item.getType());
                    this.drawDropDown = false;
            }
            if(!this.clickedItem.contains(mX,mY))
            {
                this.drawDropDown = false;
            }
        }
        if(this.return.contains(mX,mY))
        {
            this.stateMachine.revertState();
            this.mainCharacter.setMove(true);
        }
        if(this.quit.contains(mX,mY))
        {
            $.ajax({
                method: "POST",
                url: "php/control/logoutController.php",
                success: function(data){
                    console.log("successful exit");
                },
                error: function(e)
                {
                    console.log("fatal error: " + e.message);
                }
            });
        this.stateMachine.returnToMenu();
        }
        if(this.saveButton.contains(mX,mY))
        {
            var character = this.mainCharacter.saveCharacter();
            var map = JSON.stringify(this.mapDetails[6]);

            $.ajax({
               method: "POST",
                url: "php/control/saveGameController.php",
                data: {character1: character, map1: map},
                success: function(data){
                    console.log("successful save");
                },
                error: function(e)
                {
                    console.log("fatal error: " + e.message);
                }
            });
        }
    },
    draw: function(g)
    {
        for(var i = 0; i < this.drawables.length; i++)
        {
         this.drawables[i].draw(g);
        }

        this.staticArmorEquip.draw(g);
        this.staticWeaponEquip.draw(g);
        if(this.drawDropDown)
        {
            this.unEquip.draw(g);
            this.stat.draw(g);
        }

    }
});


var mapSystem = Class.create({


    initialize: function(x,y,container)
    {
        this.tiles = [document.getElementById("blank"),document.getElementById("dungeonTileBlack"),document.getElementById("voidTile"),document.getElementById("dungeonWallTile"),document.getElementById("dungWall2Type1"),document.getElementById("dungWall2Type2"),document.getElementById("dungTile2Black"),document.getElementById("dungGate1"),document.getElementById("dungGate2"),document.getElementById("stairsRight"),document.getElementById("enemy1"),document.getElementById("enemy2"),document.getElementById("caveFisher"),document.getElementById("wizardNPC")];
        this.container = container;
        this.boundingRect = container.getBoundingClientRect();
        this.x = x;
        this.y = y;
        this.isLayered = false;
        this.type = -1;
        this.currentMap = [];
        this.currentMapType = [];
        this.collideLayer = [];
        this.maps = [
            [40,10,50,[2,3],2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 2, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 2, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
            [40,10,50,[2,3],0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 13, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [40,70,80,[4,5],4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 4, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 4, 4, 4, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 4, 4, 4, 4, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 4, 4, 4, 4, 4, 4, 6, 6, 6, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 4, 4, 4, 4, 4, 4, 4, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 4, 4, 4, 4, 4, 4, 4, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 4, 4, 4, 4, 4, 4, 4, 4, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 6, 6, 4, 4, 4, 4, 4, 4, 4, 4, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 4, 4, 4, 4, 4, 4, 4, 4, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 4, 4, 4, 4, 4, 4, 4, 4, 6, 6, 4, 6, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 4, 4, 4, 4, 4, 4, 4, 4, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 4, 4, 4, 4, 4, 4, 4, 4, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 4, 4, 4, 4, 4, 4, 4, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 4, 4, 4, 4, 4, 4, 4, 6, 6, 4, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 4, 4, 4, 4, 4, 4, 6, 6, 6, 4, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 4, 4, 4, 4, 4, 6, 6, 6, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 6, 4, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 6, 4, 4, 4, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 4, 4, 4, 4, 4, 4, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
            [40,70,80,[4,5],0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 13, 0, 11, 9, 0, 0, 0, 0, 0, 12, 0, 0, 0, 0, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 0, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 10, 0, 0, 0, 0, 0, 0, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [25,47,50,[0,1],2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 2, 2, 2, 2, 2, 2, 2, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 2, 2, 2, 2, 2, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 2, 2, 2, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 2, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 4, 4, 4, 4, 4, 4, 6, 4, 6, 6, 6, 6, 6, 6, 4, 6, 4, 4, 4, 4, 4, 4, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 4, 4, 4, 4, 4, 4, 6, 4, 6, 6, 6, 6, 6, 6, 4, 6, 4, 4, 4, 4, 4, 4, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 2, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 2, 2, 2, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 2, 2, 2, 2, 2, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 2, 2, 2, 2, 2, 2, 2, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2],
            [25,47,50,[0,1],0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ];
        //0 tutorialLayer1
        //1 tutorialLayer2
        //2 is dung1layer1
        //3 is dung1layer2i
        //4 is finaldunglayer1
        //5 is finaldunglayer2i
    },
    generateMap: function(type,layered)
    {
        this.currentMapType = type;
        if(!layered)
        {
            var tileColumn = 0;
            var tileRow = 0;
            this.type = type;

            for(var i = 4; i < this.maps[type].length; i++ )
            {
                var pixelPosX = this.x + tileColumn * 5;
                var pixelPosY = this.y + tileRow *5;


                var temp = new Tile(pixelPosX,pixelPosY,5,5,this.tiles[this.maps[type][i]],this.container,this.maps[type][i]);
                this.currentMap.push(temp);

                if(this.maps[type][i] == 3 || this.maps[type][i] == 4 || this.maps[type][i] == 5 || this.maps[type][i] == 9 || this.maps[type][i] == 10 || this.maps[type][i] == 11 || this.maps[type][i] == 12 || this.maps[type][i] == 13)
                {
                    this.collideLayer.push(temp);
                }

                tileColumn += 1;
                if(tileColumn >= this.maps[type][0])
                {
                    tileColumn = 0;
                    tileRow += 1;
                }
            }
        }
        else
        {
            this.isLayered = layered;
            this.type = type[0];

            for(i = 0; i < type.length; i++)
            {
                tileColumn = 0;
                tileRow = 0;
                this.currentMap[i] = [];

                for(var k = 4; k < this.maps[type[i]].length; k++)
                {
                 pixelPosX = this.x + tileColumn * 5;
                 pixelPosY = this.y + tileRow * 5;

                     temp = new Tile(pixelPosX,pixelPosY,5,5,this.tiles[this.maps[type[i]][k]],this.container,this.maps[type[i]][k]);

                     this.currentMap[i].push(temp);

                    if(this.maps[type[i]][k] == 3 || this.maps[type[i]][k] == 4 || this.maps[type[i]][k] == 5 || this.maps[type[i]][k] == 9 || this.maps[type[i]][k] == 10 || this.maps[type[i]][k] == 11 || this.maps[type[i]][k] == 12 || this.maps[type[i]][k] == 13)
                    {
                        this.collideLayer.push(temp);
                    }
                     tileColumn += 1;

                     if(tileColumn >= this.maps[type[i]][0])
                     {
                         tileColumn = 0;
                         tileRow += 1;
                     }
                }
            }
        }

    },
    draw: function(g)
    {
        if(!this.isLayered)
        {
            for(var i = 0; i < this.currentMap.length; i++)
            {
                this.currentMap[i].draw(g);
            }
        }
        else
        {
            for(i = 0; i < this.currentMap.length; i++)
            {

                for(var k = 0; k < this.currentMap[i].length; k++)
                {
                    this.currentMap[i][k].draw(g);
                }
            }
        }

    },
    getCollision: function()
    {
        return this.collideLayer;
    },
    getMapDetails: function()
    {
        var mColSize = this.maps[this.type][0];
        var mLength = this.maps[this.type].length;
        var mRowSize = mLength/mColSize;
        var mPlayerPosX = this.maps[this.type][1];
        var mPlayerPosY = this.maps[this.type][2];
        var nextMap = this.maps[this.type][3];
        var currentMap = this.currentMapType;

        return [mColSize,mRowSize,mPlayerPosX,mPlayerPosY,mLength,nextMap,currentMap];
    },
    changeMap: function(type,layered)
    {
            this.collideLayer = [];
            this.currentMap = [];
            this.isLayered = layered;

            if(!layered)
            {
               var playerXY = [this.maps[type][1],this.maps[type][2]];
               this.type = type;
            }
            else
            {
                 playerXY = [this.maps[type[0]][1],this.maps[type[0]][2]];
                 this.type = type[0];
            }
            this.generateMap(type,layered);
            return playerXY;
    },
    getCurrentMap: function()
    {
        return this.currentMap;
    },
    update: function(deltaTime)
    {

    }
});

var battleState = Class.create({

   initialize: function(canvas,stateMachine,mainCharacter)
   {
       this.actions = [];
       this.mainCharacter = mainCharacter;
       this.canvas = canvas;
       this.stateMachine = stateMachine;
       this.battleSystem = new StateMachine();
       this.mBattleStance = new imageSprite(0,0,8,8,mainCharacterBattleStance,canvas);
       this.background = new imageSprite(0,0,100,100,menuBackground,canvas);
       this.actions = mergeSort(this.actions);
       this.battleTicks = 0;
       this.playerCurrentHP = 0;
       this.playerMaxHP = 0;
       this.playerCurrentMP = 0;
       this.playerMaxMP = 0;
       this.enemyCurrentHP = 0;
       this.enemyMaxHP = 0;
       this.enemyCurrentMP = 0;
       this.enemyMaxMP = 0;
   },
    onEnter: function(enemy)
    {
        this.battleSystem = new StateMachine();
        this.enemy = enemy;
        this.enemy.setLoc(20,10);
        this.mBattleStance = new imageSprite(70,50,20,20,mainCharacterBattleStance,this.canvas);
        this.playerCurrentHP = new imageSprite(65,40,(this.mainCharacter.getCurrentHealth()/this.mainCharacter.getMaxHealth())*30,3,redHealth,this.canvas);
        this.playerMaxHP = new Sprite(65,40,30,3,this.canvas);
        this.playerCurrentMP = new imageSprite(65,45,(this.mainCharacter.getCurrentMana()/this.mainCharacter.getMaxMana())*15,3,blueMana,this.canvas);
        this.playerMaxMP = new Sprite(65,45,15,3,this.canvas);
        this.enemyCurrentHP = new imageSprite(15,1,((this.enemy.getCurrentHealth()/this.enemy.getMaxHealth())*30),3,redHealth,this.canvas);
        this.enemyMaxHP = new Sprite(15,1,30,3,this.canvas);
        this.enemyCurrentMP = new imageSprite(15,5,(this.enemy.getCurrentMana()/this.enemy.getMaxMana())*15,3,blueMana,this.canvas);
        this.enemyMaxMP = new Sprite(15,5,15,3,this.canvas);

        var pAction = new PAction(this.mainCharacter,this.enemy,this.canvas);
        this.actions.push(pAction);
        this.actions = mergeSort(this.actions);

        this.battleTicks = new battleTick(this.battleSystem,this.stateMachine,this.mainCharacter,this.enemy,this.canvas,this.actions);

        this.battleSystem.addState(this.battleTicks);
        this.battleSystem.addState(new battleAction(this.battleSystem,this.battleTicks,this.stateMachine,this.canvas));
        this.battleSystem.addState(new winState(this.canvas,this.stateMachine,this.mainCharacter,this.enemy));
        this.battleSystem.changeState(0);
    },
    onExit: function()
    {

    },
    update: function(deltaTime,mX,mY)
    {
        this.battleSystem.update(deltaTime,mX,mY);
        this.playerCurrentHP.setWidth((this.mainCharacter.getCurrentHealth()/this.mainCharacter.getMaxHealth())*30);
        this.enemyCurrentHP.setWidth((this.enemy.getCurrentHealth()/this.enemy.getMaxHealth())*30);
        this.playerCurrentMP.setWidth((this.mainCharacter.getCurrentMana()/this.mainCharacter.getMaxMana())*15);
        this.enemyCurrentMP.setWidth((this.enemy.getCurrentMana()/this.enemy.getMaxMana())*15);
    },
    draw: function(g)
    {
        this.background.draw(g);
        this.playerCurrentHP.draw(g);
        this.playerMaxHP.draw(g);
        this.playerCurrentMP.draw(g);
        this.playerMaxMP.draw(g);
        this.enemyCurrentHP.draw(g);
        this.enemyMaxHP.draw(g);
        this.enemyCurrentMP.draw(g);
        this.enemyMaxMP.draw(g);
        this.mBattleStance.draw(g);
        this.enemy.draw(g);
        this.battleSystem.draw(g);
    }
});

var battleTick = Class.create({

   initialize: function(battleState,stateMachine,mainCharacter,enemy,canvas,actions)
   {
       this.battleSystem = battleState;
       this.actions = actions;
       this.mainCharacter = mainCharacter;
       this.stateMachine = stateMachine;
       this.enemy = enemy;
       this.canvas = canvas;

   },
    onEnter: function()
    {

    },
    onExit: function()
    {

    },
    update: function(deltaTime,mX,mY)
    {
        if(this.actions.length)
        {
            for(var i = 0; i < this.actions.length; i++)
            {
                this.actions[i].update(deltaTime,mX,mY);
            }
            if(this.actions[this.actions.length-1].getReady())
            {
                var action = this.actions.pop();
                this.battleSystem.changeState(1,action);
            }
        }
        if(!this.mainCharacter.isAlive())
        {
            this.stateMachine.changeState(5);
        }
        if(!this.enemy.isAlive())
        {
            this.battleSystem.changeState(2);
        }

    },
    draw: function(g)
    {
        //add in the actions so that you can choose your action with gui
        for(var i = 0; i < this.actions.length; i++)
        {
            this.actions[i].draw(g);
        }
    },
    addAction: function(action)
    {
        this.actions.push(action);
    }
});

var PAction = Class.create({

    initialize: function(mainCharacter,enemy,canvas)
    {
        this.mainCharacter = mainCharacter;
        this.enemy = enemy;
        this.spd = this.mainCharacter.getTotalSpd();
        this.isReady = false;
        this.actionType = -1;
        this.canvas = canvas;
        this.attackButton = new DialogueBox(70,70,15,6,this.canvas,"Attack");
        this.spellButton = new DialogueBox(85,70,15,6,this.canvas,"Spells");
        this.label = new DialogueBox(70,80,25,6,this.canvas,"Insufficient Mana");
        this.label.setVisible(false);
        this.spells = [];
        this.one = false;
        this.type = "player";
    },
    getReady: function()
    {
        return this.isReady;
    },
    getType: function()
    {
      return this.type;
    },
    getSpd: function()
    {
      return this.spd;
    },
    getPlayer: function()
    {
      return this.mainCharacter;
    },
    getEnemy: function()
    {
      return this.enemy;
    },
    getActionType: function()
    {
      return this.actionType;
    },
    updateSpells: function()
    {
        var tileColumn = 0;
        var tileRow = 0;

        for(var i = 0; i < this.spells.length; i++ )
        {
            var pixelPosX = this.spellButton.getActualX() + tileColumn * 5;
            var pixelPosY = this.spellButton.getActualY()+ 10 + tileRow *5;

            this.spells[i].setLoc(pixelPosX,pixelPosY);

            tileColumn += 1;
            if(tileColumn >= 3)
            {
                tileColumn = 0;
                tileRow += 1;
            }
        }
    },
    update: function(deltaTime,mX,mY)
    {
        if(this.attackButton.contains(mX,mY) && !this.one && this.canvas.mouseDown)
        {
            this.actionType = -1;
            this.label.setVisible(false);
            this.isReady = true;
        }
        else if(this.spellButton.contains(mX,mY) && !this.one && this.canvas.mouseDown)
        {
            this.one = true;
            this.spells = this.mainCharacter.getSpells();
            this.updateSpells();
        }
        if(this.spells != [])
        {
            for(var i = 0; i < this.spells.length; i++)
            {
                if(this.spells[i].contains(mX,mY))
                {
                    if(this.spells[i].getManaCost() <= this.mainCharacter.getCurrentMana())
                    {
                        this.actionType = i;
                        this.mainCharacter.useMana(this.spells[i].getManaCost());
                        this.label.setVisible(false);
                        this.isReady = true;
                    }
                    else
                    {
                        this.label.setVisible(true);
                    }
                    console.log("you pressed: " + this.spells[i].getName());
                }
            }
        }
        if(!this.spellButton.contains(mX,mY))
        {
            this.one = false;
            this.spells = [];
        }
    },
    draw: function(g)
    {
        this.attackButton.draw(g);
        this.spellButton.draw(g);
        this.label.draw(g);
        if(this.spells != [])
        {
            for(var i = 0; i < this.spells.length; i++)
            {
                this.spells[i].draw(g);
            }
        }
    }
});

var EAction = Class.create({

    initialize: function(mainCharacter,enemy,canvas)
    {
        this.mainCharacter = mainCharacter;
        this.enemy = enemy;
        this.spd = this.mainCharacter.getTotalSpd();
        this.isReady = false;
        this.actionType = -1;
        this.canvas = canvas;
        this.spells = [];
        this.one = false;
        this.type = "enemy";
    },
    getReady: function()
    {
        return this.isReady;
    },
    getType: function()
    {
        return this.type;
    },
    getSpd: function()
    {
        return this.spd;
    },
    getPlayer: function()
    {
        return this.mainCharacter;
    },
    getEnemy: function()
    {
        return this.enemy;
    },
    getActionType: function()
    {
        return this.actionType;
    },
    update: function(deltaTime,mX,mY)
    {
        this.actionType = -1;
        this.isReady = true;
    },
    draw: function(g)
    {

    }
});

var battleAction = Class.create({

   initialize: function(stateMachine,battleState,mainStateMachine,canvas)
   {
       this.battleSystem = stateMachine;
       this.battleState = battleState;
       this.mainStateMachine = mainStateMachine;
       this.canvas = canvas;
       this.action = 0;
       this.swordSlice = new AnimatedSprite(20,10,20,20,this.canvas,swordAnimation,4,4);
       this.healAnimation = new AnimatedSprite(70,50,20,20,this.canvas,healSpellAnimation,4,4);
       this.explode = new AnimatedSprite(20,10,20,20,this.canvas,explosionAnimation,4,4);
       this.scratch = new AnimatedSprite(70,50,20,20,this.canvas,scratchAnimation,1,1);
       this.spells = [];
   },
    onEnter: function(action)
    {
        this.action = action;
        this.mainCharacter = this.action.getPlayer();
        this.enemy = this.action.getEnemy();
    },
    onExit: function()
    {
        this.action = 0;
        this.spells = [];
    },
    update: function(deltaTime)
    {
        if(this.action.getType() == "player")
        {
            this.spells = this.mainCharacter.getSpells();
            if(this.action.getActionType() == -1)
            {
                this.swordSlice.update(deltaTime);
                this.enemy.takeDamage(this.mainCharacter.getTotalDamage());
                this.battleState.addAction(new EAction(this.mainCharacter,this.enemy,this.canvas));
                this.battleSystem.revertState();
            }
            else
            {
                if(this.spells[this.action.getActionType()].getName() == "Heal")
                {
                    this.healAnimation.update(deltaTime);
                    this.mainCharacter.heal(this.spells[this.action.getActionType()].getDamage());
                    this.battleState.addAction(new EAction(this.mainCharacter,this.enemy,this.canvas));
                    this.battleSystem.revertState();
                }
                else
                {
                    this.explode.update(deltaTime);
                    this.enemy.takeDamage(this.spells[this.action.getActionType()].getDamage());
                    this.battleState.addAction(new EAction(this.mainCharacter,this.enemy,this.canvas));
                    this.battleSystem.revertState();
                }
            }

        }
        else
        {
            this.spells = this.enemy.getSpells();
            if(this.action.getActionType() == -1)
            {
                this.mainCharacter.takeDamage(this.enemy.getDamage());
                if(!this.mainCharacter.isAlive())
                {
                    this.mainStateMachine.changeState(5);
                }
                this.battleState.addAction(new PAction(this.mainCharacter,this.enemy,this.canvas));
                this.battleSystem.revertState();
            }
            else
            {
                if(this.spells[this.action.getActionType()].getName() == "Heal")
                {
                    this.enemy.heal(this.spells[this.action.getActionType()].getDamage());
                    this.battleState.addAction(new PAction(this.mainCharacter,this.enemy,this.canvas));
                    this.battleSystem.revertState();
                }
                else
                {
                    this.mainCharacter.takeDamage(this.spells[this.action.getActionType()].getDamage());
                    if(!this.mainCharacter.isAlive())
                    {
                        this.mainStateMachine.changeState(5);
                    }
                    this.battleState.addAction(new PAction(this.mainCharacter,this.enemy,this.canvas));
                    this.battleSystem.revertState();
                }
            }
        }
    },
    draw: function(g)
    {
        if(this.action.getType() == "player")
        {
            this.spells = this.mainCharacter.getSpells();
            if(this.action.getActionType() == -1)
            {
                this.swordSlice.draw(g);
            }
            else
            {
                if(this.spells[this.action.getActionType()].getName() == "Heal")
                {
                    this.healAnimation.draw(g);
                }
                else
                {
                this.explode.draw(g);
                }
            }

        }
        else
        {

                this.scratch.draw(g);

        }
    }
});

var DeadState = Class.create({

    initialize: function(canvas, stateMachine, mainCharacter)
    {
        this.canvas = canvas;
        this.stateMachine = stateMachine;
        this.mainCharacter = mainCharacter;
        this.gameOver = new DialogueBox(0,0,50,40,this.canvas,"You Have Perished!");
    },
    onEnter: function()
    {
        this.gameOver = new DialogueBox(20,20,50,40,this.canvas,"You Have Perished!");
    },
    onExit: function()
    {

    },
    update: function(deltaTime,mX,mY)
    {
        var timer = setTimeout(function(){
            stateMachine.returnToMenu();
            clearTimeout(timer);
        },2000);
    },
    draw: function(g)
    {
        this.gameOver.draw(g);
    }
});

var winState = Class.create({

   initialize: function(canvas,stateMachine,mainCharacter,enemy)
   {
       this.canvas = canvas;
       this.stateMachine = stateMachine;
       this.mainCharacter = mainCharacter;
       this.enemy = enemy;
       this.rewards = new DialogueBox(0,0,50,40,this.canvas,"You have gained, xp:" + this.enemy.getXP() + " Items: " + this.enemy.getItems().getType());
       this.continue = new DialogueBox(0,0,50,40,this.canvas,"Continue");
   },
    onEnter: function()
    {
        this.rewards = new DialogueBox(10,33,50,40,this.canvas,"You have gained, xp:" + this.enemy.getXP() + " Items: " + this.enemy.getItems().getType());
        this.continue = new DialogueBox(12,55,20,10,this.canvas,"Continue");
    },
    onExit: function()
    {
        mX = -1;
        mY = -1;
    },
    update: function(deltaTime,mX,mY)
    {
        if(this.continue.contains(mX,mY))
        {
            this.mainCharacter.addItem(this.enemy.getItems());
            this.mainCharacter.gainXP(this.enemy.getXP());
            this.stateMachine.revertState();
        }
    },
    draw: function(g)
    {
        this.rewards.draw(g);
        this.continue.draw(g);
    }
});

var Node = Class.create({

    initialize: function(right,left,parent,isRoot)
    {
        this.right = right;
        this.left = left;
        this.parent = parent;
        this.isRoot = isRoot;
    },
    getRight: function()
    {
        return this.right;
    },
    getLeft: function()
    {
        return this.left;
    },
    getParent: function()
    {
        return this.parent;
    },
    isRoot: function()
    {
        return this.isRoot;
    },
    setRight: function(right)
    {
        this.right = right;
    },
    setLeft: function(left)
    {
        this.left = left;
    },
    setRoot: function(root)
    {
        this.isRoot = root;
    },
    setParent: function(parent)
    {
        this.parent = parent;
    }
});

function clamp(value, min, max)
{
  if(value < min)
  {
      return min;
  }
  else if(value > max)
  {
      return max;
  }
  else
  {
      return value;
  }
};
function collisionDirection(character,tile)
{
    if(character.getXSpd() < 0)
    {
        character.moveX(2);
    }
    else if(character.getXSpd() > 0)
    {
        character.moveX(-2);
    }
    else if(character.getYSpd() < 0)
    {
        character.moveY(2);
    }
    else if(character.getYSpd() > 0)
    {
        character.moveY(-2);
    }
    else
    {
        console.log("you found the glitch in the game!");
    }

};
function mergeSort(actions)
{

    if(actions.length < 2)
    {
        return actions;
    }

    var middle = parseInt(actions.length/2);
    var left = actions.slice(0,middle);
    var right = actions.slice(middle,actions.length);

   return merge(mergeSort(left),mergeSort(right));
};
function merge(left,right)
{
    var sortedActions = [];

    while(left.length && right.length)
    {
        if(left[0].getSpd() <= right[0].getSpd())
        {
            sortedActions.push(left.shift());
        }
        else
        {
            sortedActions.push(right.shift());
        }
    }
    while(left.length)
    {
        sortedActions.push(left.shift());
    }
    while(right.length)
    {
        sortedActions.push(right.shift());
    }
    return sortedActions;
};

function randomNumber(start,end)
{
    return Math.floor(Math.random()*end) + start;
}