var gameCanvas;
var graphics;
var canvasRect;

var enemy2;
var enemy1;

var mainCharacter;
var mainCharacterRightSheet;
var mainCharacterLeftSheet;
var mainCharacterFrontSheet;
var mainCharacterBackSheet;
var mainCharacterFrontStatic;
var mainCharacterBattleStance;

var redHealth;
var blueMana;

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

var loggedIn;
var character;
var username;
var mapDetail;
var map1;



window.onload = function()
{

    loggedIn = document.getElementById("loggedIn").value;
    username = document.getElementById("username").value;
    character = document.getElementById("character").value;
    mapDetail = document.getElementById("mapDetail").value;
    mX = 10;
    mY = 10;

    gameCanvas = document.getElementById("gameCanvas");
    canvasRect = gameCanvas.getBoundingClientRect();
    graphics = gameCanvas.getContext("2d");
    gameCanvas.mouseDown = false;

    enemy1 = document.getElementById("enemy1");
    enemy2 = document.getElementById("enemy2");

    mainCharacterFrontSheet = document.getElementById("mainCharacterFront");
    mainCharacterRightSheet = document.getElementById("mainCharacterRight");
    mainCharacterLeftSheet = document.getElementById("mainCharacterLeft");
    mainCharacterBackSheet = document.getElementById("mainCharacterBack");
    mainCharacterFrontStatic = document.getElementById("mainCharacterFrontStatic");
    mainCharacterBattleStance = document.getElementById("mainCharacterBattleStance");

    redHealth = document.getElementById("redHealth");
    blueMana = document.getElementById("blueMana");

    armorLight = document.getElementById("ArmorLight");
    weaponDagger = document.getElementById("WeaponDagger");
    weaponUnequip = document.getElementById("weaponUnequip");
    armorUnequip = document.getElementById("armorUnequip");

    fireSpell = document.getElementById("fireSpell");
    healSpell = document.getElementById("healSpell");

    testArmor = new Armor(0,0,8,8,armorLight,gameCanvas,"Leather Armor",3,20);
    testSword = new Weapon(0,0,8,8,weaponDagger,gameCanvas,"Dagger",6,2,10);
    testSword1 = new Weapon(0,0,8,8,mainCharacterFrontSheet,gameCanvas,"Iron Sword",3,10,20);



    /*console.log(mainCharacter.getJSONCharacter());

    var main2 = JSON.parse(mainCharacter.getJSONCharacter());
    console.log(main2);*/
    if(character != "")
    {
        console.log("tried making a false hope");
        var charObj = JSON.parse(character);
        mainCharacter = new Player(charObj[0],charObj[1],charObj[2],charObj[3],gameCanvas,mainCharacterFrontSheet,charObj[6],charObj[7],charObj[8],charObj[9],charObj[10],charObj[11]);
        mainCharacter.setCurrentHealth(charObj[12]);
        mainCharacter.setCurrentMana(charObj[13]);
        for(var i = 0; i < charObj[14].length; i++)
        {
            mainCharacter.addItem(new Weapon(charObj[14][i][0],charObj[14][i][1],charObj[14][i][2],charObj[14][i][3],weaponDagger,gameCanvas,charObj[14][i][5],charObj[14][i][6],charObj[14][i][7],charObj[14][i][8]));
        }
        for(i = 0; i < charObj[15].length; i++)
        {
            mainCharacter.addItem(new Armor(charObj[15][i][0],charObj[15][i][1],charObj[15][i][2],charObj[15][i][3],armorLight,gameCanvas,charObj[15][i][5],charObj[15][i][6],charObj[15][i][7]));
        }
        for(i = 0; i < charObj[16].length; i++)
        {
            if(charObj[16][i][5] == "Heal")
            {
                var image = healSpell;
            }
            else
            {
                image = fireSpell;
            }

            mainCharacter.addSpell(new Spell(charObj[16][i][0],charObj[16][i][1],charObj[16][i][2],charObj[16][i][3],image,gameCanvas,charObj[16][i][5],charObj[16][i][6],charObj[16][i][7]));
        }
        mainCharacter.equip(new Weapon(charObj[17][0],charObj[17][1],charObj[17][2],charObj[17][3],weaponDagger,gameCanvas,charObj[17][5],charObj[17][6],charObj[17][7],charObj[17][8]));
        mainCharacter.equip(new Armor(charObj[18][0],charObj[18][1],charObj[18][2],charObj[18][3],armorLight,gameCanvas,charObj[18][5],charObj[18][6],charObj[18][7]));
        //use the to json for the main character so i can get all of the functions that are used for the character
    }
    else
    {
        mainCharacter = new Player(5,5,5,5,gameCanvas,mainCharacterFrontSheet,3,3,[1,1,1,0],100,100,username);
        mainCharacter.play(-1);

        mainCharacter.addSpell(new Spell(0,0,5,5,fireSpell,gameCanvas,"Fire Ball",8,30));
        mainCharacter.addSpell(new Spell(0,0,5,5,healSpell,gameCanvas,"Heal", 50,50));
        mainCharacter.addItem(testArmor);
        mainCharacter.addItem(testSword);
        mainCharacter.addItem(testSword1);
    }

    stateMachine = new StateMachine();
    stateMachine.addState(new MainMenuState(gameCanvas,stateMachine,mainCharacter));
    stateMachine.addState(new localGameState(gameCanvas,stateMachine,mainCharacter));
    stateMachine.addState(new inventoryState(gameCanvas,stateMachine,mainCharacter));
    stateMachine.addState(new statsState(gameCanvas,stateMachine,mainCharacter));
    stateMachine.addState(new battleState(gameCanvas,stateMachine,mainCharacter));
    stateMachine.addState(new DeadState(gameCanvas,stateMachine,mainCharacter));
    stateMachine.addState(new DialogueState(gameCanvas,stateMachine,mainCharacter,["This is a test","Hopfully it works","If not i will fix it"]));
    stateMachine.changeState(0);




    if(loggedIn)
    {
        stateMachine.changeState(1,JSON.parse(mapDetail));
        //working on doing the map stuff for load
    }

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