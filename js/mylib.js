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

   initialize: function($super,x,y,w,h,container,img,frameCount,fps,stats,health,mana)
   {
       $super(x,y,w,h,container,img,frameCount,fps);

       this.inv = [];
       this.stats = stats;
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
    getCurrentHealth: function()
    {
        return this.currentHealth;
    },
    getMaxHealth: function()
    {
      return this.maxHealth;
    },
    getMana: function()
    {
        return this.currentMana;
    },
    getSpells: function()
    {
        return this.spells;
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
      this.currentHealth -= dmg;
      if(this.currentHealth <= 0)
      {
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
            this.level++;
            this.levelUp();
            this.nextLevelXP += (500*this.level);
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
   },
    getSpd: function()
    {
        return this.spd;
    },
    getDamage: function()
    {
        return this.damage;
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
    },
    getDefence: function()
    {
        return this.defence;
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
       this.percentLength = Math.round(message.length/100*this.container.width);
   },
    setMessage: function(m)
    {
        this.message = m;
    },
    draw: function(ctx)
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
    changeState: function(stateIndex)
    {
        /*if(this.mStack.length > 0)
        {
            var state = this.mStack[this.mStack.length-1];
            state.onExit();
        }*/
        var newState = this.mStates[stateIndex];
        this.mStack.push(newState);
        newState.onEnter();
    },
    revertState: function()
    {
        var oldState = this.mStack.pop();
        oldState.onExit();
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
       this.title = new DialogueBox(25,5,50,20,canvas,"RealmRPG");
   },
    onEnter: function()
    {
        var temp = new DialogueBox(35,40,30,8,this.canvas,"New Game");
        var temp1 = new DialogueBox(35,50,30,8,this.canvas,"Load Game");
        this.buttons.push(temp,temp1);
    },
    onExit: function()
    {

    },
    draw: function(g)
    {
        this.title.draw(g);
        for(var i = 0; i < this.buttons.length; i++)
        {
            this.buttons[i].draw(g);
        }
    },
    update: function(deltaTime,mX,mY)
    {

        if(!this.inPHP)
        {
            if(this.buttons[0].contains(mX,mY) && this.canvas.mouseDown)
            {
                this.stateMachine.changeState(1);
            }
            else if(this.buttons[1].contains(mX,mY) && this.canvas.mouseDown)
            {
                var section = document.getElementById("phpIncludeSection");
                section.style.display = "block";
                this.inPHP = true;
                $.ajax({
                    url: "php/view/createNewSave.php?inv='fire'",
                    cache: false
                }).done(function(html){
                    $("#phpIncludeSection").append(html);
                });
            }
        }


    }

});
var DialogueState = Class.create({

    initialize: function(x,y,w,h,container,message)
    {

    },
    onEnter: function()
    {

    },
    onExit: function()
    {

    },
    draw: function(g)
    {

    },
    update: function(deltaTime,mX,mY)
    {


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
                        stateMachine.changeState(3);
                        mainCharacter.setMove(false);
            }
                }
        }
    },
    onEnter: function()
    {
        this.mapSystem1.generateMap([1,2],true);
        this.collideLayer = this.mapSystem1.getCollision();
        var mapDetails = this.mapSystem1.getMapDetails(1);
        this.mainCharacter.setLoc(mapDetails[2],mapDetails[3]);

        window.addEventListener("keydown",this.eventFunction);

    },
    onExit: function()
    {
        //this.mainCharacter = null;
        window.removeEventListener("keydown",this.eventFunction);
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
        //console.log(this.collideLayer[0].getY()+this.collideLayer[0].getHeight());
        //console.log((this.mainCharacter.getX()+16) + " " + (this.mainCharacter.getY()+24) + " ");
        for(var i = 0; i < this.collideLayer.length; i++)
        {
            if(this.collideLayer[i].contains(this.mainCharacter.getX()+16,this.mainCharacter.getY()+24))
            {
                //console.log("hit: " + this.collideLayer[i].getX() + " " + this.collideLayer[i].getY());
                //console.log("Player: " + this.mainCharacter.getX() + " " + this.mainCharacter.getY());
                collisionDirection(this.mainCharacter, this.collideLayer[i]);
                if(this.collideLayer[i].getID() == 9)
                {
                    var posXY = this.mapSystem1.changeMap(0,false);
                    this.mainCharacter.setLoc(posXY[0],posXY[1]);
                    this.collideLayer = this.mapSystem1.getCollision();
                }
            }
        }


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
                tileRow += 1;
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
            if(this.inventory[i].contains(mX,mY) && !this.one)
            {

                this.clicked = this.inventory[i];
                var x = this.inventory[i].getX()/5;
                var y = this.inventory[i].getY()/4;

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
                if(this.equip.contains(mX,mY))
                {
                    if(this.clicked.getType() == "Armor" || this.clicked.getType() == "Weapon")
                    {
                        this.mainCharacter.equip(this.clicked);
                        this.one = false;
                        this.inventory = this.mainCharacter.getInv();
                        this.updateInv();
                    }
                }
                else if(this.dropItem.contains(mX,mY))
                {
                    this.mainCharacter.removeItem(this.clicked);
                    this.one = false;
                    this.inventory = this.mainCharacter.getInv();
                    this.updateInv();
                }
                if(!this.clicked.contains(mX,mY))
                {
                    this.one = false;
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
        this.drawDropDown = false;
        this.clickedItem = 0;
        this.item = 0;
        this.equip = new DialogueBox(0,0,10,5,this.canvas,"Equip");
        this.stat = new DialogueBox(0,0,10,4,this.canvas,"");
        this.return = new DialogueBox(0,0,10,5,this.canvas,"Return");
        this.staticFrontImage = new imageSprite(0,0,25,30,mainCharacterFrontStatic,this.canvas);
        this.staticWeaponEquip = new imageSprite(0,0,15,20,weaponDagger,this.canvas);
        this.staticArmorEquip = new imageSprite(0,0,15,20,armorLight,this.canvas);
        this.decoration1 = new Sprite(0,0,50,50,this.canvas);
        this.decoration2 = new Sprite(0,0,20,20,this.canvas);
        this.hpText = new DialogueBox(0,0,10,5,this.canvas,"Health: " + this.hp + "/" + this.mainCharacter.getMaxHealth());
        this.strText = new DialogueBox(0,0,10,5,this.canvas,"Strength: " + this.str);
        this.defText = new DialogueBox(0,0,10,5,this.canvas,"Defence: " + this.def);
        this.agilityText = new DialogueBox(0,0,10,5,this.canvas,"Agility: " + this.agility);
        this.expText = new DialogueBox(0,0,10,5,this.canvas,"Experience: " + this.exp + "/" + this.mainCharacter.getMaxExp());

    },
    onEnter: function()
    {
        this.stats = mainCharacter.getStats();
        this.str = this.stats[0];
        this.def = this.stats[1];
        this.agility = this.stats[2];
        this.exp = this.stats[3];
        this.hp = mainCharacter.getCurrentHealth();
        this.unEquip = new DialogueBox(0,0,10,5,this.canvas,"Unequip");
        this.stat = new DialogueBox(0,0,10,5,this.canvas,"");
        this.return = new DialogueBox(79,89,20,10,this.canvas,"Return");
        this.staticFrontImage = new imageSprite(70,10,25,30,mainCharacterFrontStatic,this.canvas);
        this.staticWeaponEquip = new imageSprite(50,0,15,20,weaponUnequip,this.canvas);
        this.staticArmorEquip = new imageSprite(50,30,15,20,armorUnequip,this.canvas);
        this.decoration1 = new Sprite(40,0,65,70,this.canvas);
        this.decoration2 = new Sprite(0,0,40,70,this.canvas);
        this.hpText = new DialogueBox(0,0,40,15,this.canvas,"Health: " + this.hp + "/" + this.mainCharacter.getMaxHealth());
        this.strText = new DialogueBox(0,15,40,15,this.canvas,"Strength: " + this.str);
        this.defText = new DialogueBox(0,30,40,15,this.canvas,"Defence: " + this.def);
        this.agilityText = new DialogueBox(0,45,40,15,this.canvas,"Agility: " + this.agility);
        this.expText = new DialogueBox(0,60,40,15,this.canvas,"Experience: " + this.exp + "/" + this.mainCharacter.getMaxExp());
    },
    onExit: function()
    {
        mX = -5;
        mY = -5;
        this.clickedItem = 0;
        this.item = 0;
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
    },
    draw: function(g)
    {
        this.staticFrontImage.draw(g);
        this.return.draw(g);
        this.staticArmorEquip.draw(g);
        this.staticWeaponEquip.draw(g);
        this.decoration1.draw(g);
        this.decoration2.draw(g);
        this.hpText.draw(g);
        this.strText.draw(g);
        this.defText.draw(g);
        this.agilityText.draw(g);
        this.expText.draw(g);

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
        this.tiles = [document.getElementById("blank"),document.getElementById("dungeonTileBlack"),document.getElementById("voidTile"),document.getElementById("dungeonWallTile"),document.getElementById("dungWall2Type1"),document.getElementById("dungWall2Type2"),document.getElementById("dungTile2Black"),document.getElementById("dungGate1"),document.getElementById("dungGate2"),document.getElementById("stairsRight")];
        this.container = container;
        this.boundingRect = container.getBoundingClientRect();
        this.x = x;
        this.y = y;
        this.isLayered = false;
        this.type = -1;
        this.currentMap = [];
        this.collideLayer = [];
        this.maps = [[40,10,10,3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 3, 3, 3, 3, 3, 1, 1, 3, 3, 3, 1, 1, 1, 3, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 1, 1, 1, 1, 1, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 3, 2, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 3, 3, 3, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 3, 2, 2, 2, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 3, 2, 2, 2, 2, 2, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 1, 1, 1, 1, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 1, 1, 1, 1, 1, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
            [40,70,80,4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 4, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 4, 4, 4, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 4, 4, 4, 4, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 4, 4, 4, 4, 4, 4, 6, 6, 6, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 4, 4, 4, 4, 4, 4, 4, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 4, 4, 4, 4, 4, 4, 4, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 4, 4, 4, 4, 4, 4, 4, 4, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 6, 6, 4, 4, 4, 4, 4, 4, 4, 4, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 4, 4, 4, 4, 4, 4, 4, 4, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 4, 4, 4, 4, 4, 4, 4, 4, 6, 6, 4, 6, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 4, 4, 4, 4, 4, 4, 4, 4, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 4, 4, 4, 4, 4, 4, 4, 4, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 4, 4, 4, 4, 4, 4, 4, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 4, 4, 4, 4, 4, 4, 4, 6, 6, 4, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 4, 4, 4, 4, 4, 4, 6, 6, 6, 4, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 4, 4, 4, 4, 4, 6, 6, 6, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 6, 4, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 6, 4, 4, 4, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 4, 4, 4, 4, 4, 4, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
            [40,70,80,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ];
        //0 is test map
        //1 is dung1layer1
        //2 is dung1layer2
    },
    generateMap: function(type,layered)
    {
        if(!layered)
        {
            var tileColumn = 0;
            var tileRow = 0;
            this.type = type;

            for(var i = 3; i < this.maps[type].length; i++ )
            {
                var pixelPosX = this.x + tileColumn * 5;
                var pixelPosY = this.y + tileRow *5;
                //console.log("i: " + i + " x: " + pixelPosX + " y: " + pixelPosY);

                var temp = new Tile(pixelPosX,pixelPosY,5,5,this.tiles[this.maps[type][i]],this.container,this.maps[type][i]);
                this.currentMap.push(temp);

                if(this.maps[type][i] == 3 || this.maps[type][i] == 4 || this.maps[type][i] == 5 || this.maps[type][i] == 9)
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

                for(var k = 3; k < this.maps[type[i]].length; k++)
                {
                 pixelPosX = this.x + tileColumn * 5;
                 pixelPosY = this.y + tileRow * 5;

                     temp = new Tile(pixelPosX,pixelPosY,5,5,this.tiles[this.maps[type[i]][k]],this.container,this.maps[type[i]][k]);

                     this.currentMap[i].push(temp);

                    if(this.maps[type[i]][k] == 3 || this.maps[type[i]][k] == 4 || this.maps[type[i]][k] == 5 || this.maps[type[i]][k] == 9)
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

        return [mColSize,mRowSize,mPlayerPosX,mPlayerPosY,mLength];
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
    //console.log("topCall: " + topColl + " bottColl: " + bottomColl + " rightColl: " + rightColl + " leftColl: " + leftColl);
    //console.log("x: " + character.getXSpd() + " y: " + character.getYSpd());
};

//Phaser

