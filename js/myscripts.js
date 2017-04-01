var gameCanvas;
var graphics;
var canvasRect;

var mainCharacter;
var mainCharacterRightSheet;
var mainCharacterLeftSheet;
var mainCharacterFrontSheet;
var mainCharacterBackSheet;

var dialogue;
var stateMachine;

var mX;
var mY;

var previousTime;
var timer;






window.onload = function()
{
    mX = 10;
    mY = 10;

    gameCanvas = document.getElementById("gameCanvas");
    canvasRect = gameCanvas.getBoundingClientRect();
    graphics = gameCanvas.getContext("2d");
    gameCanvas.mouseDown = false;

    dialogue = new DialogueBox(10,10,10,10,gameCanvas,"This is a huge test that should break it, but i might have fixed it.");

    mainCharacterRightSheet = document.getElementById("mainCharacterRight");
    mainCharacterLeftSheet = document.getElementById("mainCharacterLeft");
    mainCharacterFrontSheet = document.getElementById("mainCharacterFront");
    mainCharacterBackSheet = document.getElementById("mainCharacterBack");
    mainCharacter = new AnimatedSprite(0,0,5,5,gameCanvas,mainCharacterFrontSheet,3,3);
    mainCharacter.play(-1);

    stateMachine = new StateMachine();
    stateMachine.addState(new MainMenuState(gameCanvas,stateMachine));
    stateMachine.addState(new localGameState(gameCanvas,stateMachine));
    stateMachine.changeState(0);

    window.addEventListener("keydown",function(e){
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
    });

    gameCanvas.addEventListener("mousedown",function()
    {
       gameCanvas.mouseDown = true;
         mX = event.clientX-Math.floor(canvasRect.left);
         mY = event.clientY-Math.floor(canvasRect.top);
    });
    gameCanvas.addEventListener("mouseup",function()
    {
       gameCanvas.mouseDown = false;
    });


    previousTime = Date.now();
    timer = setInterval(function(evt){
        var now = Date.now();
        var deltaTime = now - previousTime;
        graphics.setTransform(1,0,0,1,0,0);
        graphics.clearRect(0,0,gameCanvas.width,gameCanvas.height);

       //mainCharacter.update(deltaTime);
       //mainCharacter.draw(graphics);

       //dialogue.draw(graphics);


        stateMachine.update(deltaTime,mX,mY);
        stateMachine.draw(graphics);




        previousTime = now;
    },100);



};