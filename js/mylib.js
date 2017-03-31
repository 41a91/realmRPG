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
    },
    moveY: function(dy){
        this.y += Math.round(dy/100*this.container.height);
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

var Map = Class.create({

    initialize: function(list,grass1,grass2,road,container)
    {
        this.list = list;
        this.grass1 = grass1;
        this.grass2 = grass2;
        this.road = road;
        this.container = container;
        this.collideTiles = [];
        this.goalTiles = [];
    },

    draw: function(graphics,num)
    {
        for(var r = 0; r < this.list.length; r++)
        {
            for(var c = 0; c < this.list[r].length; c++)
            {
                if(this.list[r][c] == 0)
                {
                    var temp = new Tile(0,0,20,10,this.road,this.container,0);
                }
                else if(this.list[r][c] == 1)
                {
                    var temp = new Tile(0,0,20,10,this.grass1,this.container,1);
                }
                else if(this.list[r][c] == 2)
                {
                    var temp = new Tile(0,0,20,10,this.grass2,this.container,2);
                    if(this.collideTiles < 11)
                    {
                        this.collideTiles.push(temp);
                    }
                }
                else if(this.list[r][c] == 3)
                {
                    var temp = new Tile(0,0,20,10,this.road,this.container,0);
                    if(this.goalTiles.length < num)
                    {
                        this.goalTiles.push(temp);
                    }
                }


                var y = 9*r;
                var x = 9*c;

                temp.setLoc(x,y);
                temp.draw(graphics);
            }
        }
    },
    getColTiles: function()
    {
        return this.collideTiles;
    },
    getGoalTiles: function()
    {
        return this.goalTiles;
    }
});





