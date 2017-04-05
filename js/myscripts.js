var gameCanvas;
var graphics;
var canvasRect;

var mainCharacter;
var mainCharacterRightSheet;
var mainCharacterLeftSheet;
var mainCharacterFrontSheet;
var mainCharacterBackSheet;
var armorLight;
var weaponDagger;

var dialogue;
var stateMachine;

var mX;
var mY;

var previousTime;
var timer;

var testArmor;
var testSword;






window.onload = function()
{
    mX = 10;
    mY = 10;

    gameCanvas = document.getElementById("gameCanvas");
    canvasRect = gameCanvas.getBoundingClientRect();
    graphics = gameCanvas.getContext("2d");
    gameCanvas.mouseDown = false;


    mainCharacterFrontSheet = document.getElementById("mainCharacterFront");
    mainCharacterRightSheet = document.getElementById("mainCharacterRight");
    mainCharacterLeftSheet = document.getElementById("mainCharacterLeft");
    mainCharacterBackSheet = document.getElementById("mainCharacterBack");
    armorLight = document.getElementById("ArmorLight");
    weaponDagger = document.getElementById("WeaponDagger");


    mainCharacter = new Player(5,5,5,5,gameCanvas,mainCharacterFrontSheet,3,3,[1,1,1],100,100);
    mainCharacter.play(-1);

    stateMachine = new StateMachine();
    stateMachine.addState(new MainMenuState(gameCanvas,stateMachine,mainCharacter));
    stateMachine.addState(new localGameState(gameCanvas,stateMachine,mainCharacter));
    stateMachine.addState(new inventoryState(gameCanvas,stateMachine,mainCharacter));
    stateMachine.changeState(0);

    testArmor = new Armor(0,0,5,5,armorLight,gameCanvas,"Leather Armor",3,20);
    testSword = new Weapon(0,0,5,5,weaponDagger,gameCanvas,"Dagger",6,2,10);
    mainCharacter.addItem(testArmor);
    mainCharacter.addItem(testSword);

    /*window.addEventListener("keydown",function(e){
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
    });*/

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