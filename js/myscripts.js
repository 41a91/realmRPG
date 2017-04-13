var gameCanvas;
var graphics;
var canvasRect;

var beholder;
var enemy1;

var mainCharacter;
var mainCharacterRightSheet;
var mainCharacterLeftSheet;
var mainCharacterFrontSheet;
var mainCharacterBackSheet;
var mainCharacterFrontStatic;
var mainCharacterBattleStance;

var redHealth;

var armorLight;
var weaponDagger;
var weaponUnequip;
var armorUnequip;

var fireSpell;
var healSpell;

var stateMachine;

var mX;
var mY;

var previousTime;
var timer;

var testArmor;
var testSword;
var testSword1;






window.onload = function()
{
    mX = 10;
    mY = 10;

    gameCanvas = document.getElementById("gameCanvas");
    canvasRect = gameCanvas.getBoundingClientRect();
    graphics = gameCanvas.getContext("2d");
    gameCanvas.mouseDown = false;

    enemy1 = document.getElementById("enemy1");
    beholder = new Enemy(0,0,20,20,gameCanvas,enemy1,1,0,[5,8,2,0],200,100);

    mainCharacterFrontSheet = document.getElementById("mainCharacterFront");
    mainCharacterRightSheet = document.getElementById("mainCharacterRight");
    mainCharacterLeftSheet = document.getElementById("mainCharacterLeft");
    mainCharacterBackSheet = document.getElementById("mainCharacterBack");
    mainCharacterFrontStatic = document.getElementById("mainCharacterFrontStatic");
    mainCharacterBattleStance = document.getElementById("mainCharacterBattleStance");

    redHealth = document.getElementById("redHealth");

    armorLight = document.getElementById("ArmorLight");
    weaponDagger = document.getElementById("WeaponDagger");
    weaponUnequip = document.getElementById("weaponUnequip");
    armorUnequip = document.getElementById("armorUnequip");

    fireSpell = document.getElementById("fireSpell");
    healSpell = document.getElementById("healSpell");

    mainCharacter = new Player(5,5,5,5,gameCanvas,mainCharacterFrontSheet,3,3,[1,1,1,0],100,100,"41a91");
    mainCharacter.play(-1);

    mainCharacter.addSpell(new Spell(0,0,5,5,fireSpell,gameCanvas,"Fire Ball",8,30));
    mainCharacter.addSpell(new Spell(0,0,5,5,healSpell,gameCanvas,"Heal", 50,50));



    stateMachine = new StateMachine();
    stateMachine.addState(new MainMenuState(gameCanvas,stateMachine,mainCharacter));
    stateMachine.addState(new localGameState(gameCanvas,stateMachine,mainCharacter));
    stateMachine.addState(new inventoryState(gameCanvas,stateMachine,mainCharacter));
    stateMachine.addState(new statsState(gameCanvas,stateMachine,mainCharacter));
    stateMachine.addState(new battleState(gameCanvas,stateMachine,mainCharacter));
    stateMachine.changeState(0);

    testArmor = new Armor(0,0,8,8,armorLight,gameCanvas,"Leather Armor",3,20);
    testSword = new Weapon(0,0,8,8,weaponDagger,gameCanvas,"Dagger",6,2,10);
    testSword1 = new Weapon(0,0,8,8,mainCharacterFrontSheet,gameCanvas,"Iron Sword",3,10,20);
    mainCharacter.addItem(testArmor);
    mainCharacter.addItem(testSword);
    mainCharacter.addItem(testSword1);

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

        stateMachine.update(deltaTime,mX,mY);
        stateMachine.draw(graphics);

        previousTime = now;
    },100);



};