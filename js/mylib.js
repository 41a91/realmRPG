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
        this.image = img;
    },
    getImage: function()
    {
        return 5;
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

   initialize: function(canvas,stateMachine)
   {
       this.canvas = canvas;
       this.stateMachine = stateMachine;
       this.boundingRect = canvas.getBoundingClientRect();
       this.buttons = [];
       this.title = new DialogueBox(35,10,30,10,canvas,"Welcome to my game! Currently it is still under construction.");
   },
    onEnter: function()
    {
        var temp = new Sprite(35,50,30,5,this.canvas);
        this.buttons.push(temp);
    },
    onExit: function()
    {
        console.log("menu is exiting");
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
        for(var i = 0; i < this.buttons.length; i++)
        {
            if(this.buttons[i].contains(mX,mY) && this.canvas.mouseDown)
            {
                console.log("click");
                this.stateMachine.changeState(1);
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
        this.mapSystem1 = new mapSystem(0,0,this.canvas);
        this.eventFunction = function(e)
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
                }
        }
    },
    onEnter: function()
    {
        var mainCharacterRightSheet = document.getElementById("mainCharacterRight");
        var mainCharacterLeftSheet = document.getElementById("mainCharacterLeft");
        var mainCharacterFrontSheet = document.getElementById("mainCharacterFront");
        var mainCharacterBackSheet = document.getElementById("mainCharacterBack");

        this.mapSystem1.generateMap(0,0,false);
        this.collideLayer = this.mapSystem1.getCollision();

        window.addEventListener("keydown",this.eventFunction);

    },
    onExit: function()
    {
        //this.mainCharacter = null;
        window.removeEventListener("keydown",this.eventFunction);
    },
    draw: function(g)
    {
        var details = this.mapSystem1.getMapDetails(0);

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
            }
        }


        this.mainCharacter.update(deltaTime);
    }
});

var mapSystem = Class.create({


    initialize: function(x,y,container)
    {
        this.tiles = [0,document.getElementById("dungeonTileBlack"),document.getElementById("voidTile"),document.getElementById("dungeonWallTile")];
        this.container = container;
        this.boundingRect = container.getBoundingClientRect();
        this.x = x;
        this.y = y;
        this.currentMap = [];
        this.collideLayer = [];
        this.maps = [[40,3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 3, 3, 3, 3, 3, 1, 1, 3, 3, 3, 1, 1, 1, 3, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 1, 1, 1, 1, 1, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 3, 2, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 3, 3, 3, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 3, 2, 2, 2, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 3, 2, 2, 2, 2, 2, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 1, 1, 1, 1, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 1, 1, 1, 1, 1, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
        ];
        //0 is test map
    },
    generateMap: function(type,layered)
    {
        if(!layered)
        {
            var tileColumn = 0;
            var tileRow = 0;

            for(var i = 1; i < this.maps[type].length; i++ )
            {
                var pixelPosX = this.x + tileColumn * 5;
                var pixelPosY = this.y + tileRow *5;
                //console.log("i: " + i + " x: " + pixelPosX + " y: " + pixelPosY);

                var temp = new Tile(pixelPosX,pixelPosY,5,5,this.tiles[this.maps[type][i]],this.container,this.maps[type][i]);
                this.currentMap.push(temp);

                if(this.maps[type][i] == 3)
                {
                    this.collideLayer.push(temp);
                }

                tileColumn += 1;
                //20 is perfect size so do it greater for camera viewport
                if(tileColumn >= this.maps[type][0])
                {
                    tileColumn = 0;
                    tileRow += 1;
                }
            }
        }
        else
        {
            console.log("work in progress");
        }

    },
    draw: function(g)
    {
        for(var i = 0; i < this.currentMap.length; i++)
        {

            this.currentMap[i].draw(g);
        }
    },
    getCollision: function()
    {
        return this.collideLayer;
    },
    getMapDetails: function(type)
    {
        var mColSize = this.maps[type][0];
        var mLength = this.maps[type].length;
        var mRowSize = mLength/mColSize;

        return [mColSize,mRowSize,mLength];
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
    var charBottom = character.getY() + character.getHeight();
    var charRight = character.getX() + character.getWidth();
    var tileBottom = tile.getY() + tile.getHeight();
    var tileRight = tile.getX() + tile.getWidth();

    var bottomColl = tileBottom - character.getY();
    var topColl = charBottom - tile.getY();
    var leftColl = tileRight - character.getX();
    var rightColl = charRight - tile.getX();

    if(topColl <= bottomColl && topColl <= leftColl && topColl <= rightColl && character.getYSpd() > 0)
    {
        character.moveY(-2);
    }
    else if(bottomColl <= topColl && bottomColl <= leftColl && bottomColl <= rightColl && character.getYSpd() < 0)
    {
        character.moveY(2);
    }
    else if(leftColl <= rightColl && leftColl <= topColl && leftColl <= bottomColl && character.getXSpd() < 0)
    {
        character.moveX(2);
    }
    else if(rightColl <= leftColl && rightColl <= topColl && rightColl <= bottomColl && character.getXSpd() > 0)
    {
        character.moveX(-2);
    }
    else if(character.getXSpd() < 0)
    {
        character.moveX(2);
    }
    else if(character.getXSpd() > 0)
    {
        character.moveX(-2);
    }
    else if(character.getYSpd() < 0)
    {
        character.moveY(1);
    }
    else if(character.getYSpd() > 0)
    {
        character.moveY(-1);
    }
    else
    {
        console.log("you found the glitch in the game!");
    }
    console.log("topCall: " + topColl + " bottColl: " + bottomColl + " rightColl: " + rightColl + " leftColl: " + leftColl);
};

//Phaser

