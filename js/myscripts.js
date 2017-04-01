var gameCanvas;
var graphics;
var mainCharacter;
var mainCharacterRightSheet;
var mainCharacterLeftSheet;
var mainCharacterFrontSheet;
var mainCharacterBackSheet;

var dialogue;

var previousTime;
var timer;






window.onload = function()
{
    gameCanvas = document.getElementById("gameCanvas");
    graphics = gameCanvas.getContext("2d");

    dialogue = new DialogueBox(10,10,10,10,gameCanvas,"This is a huge test that should break it, but i might have fixed it.");

    mainCharacterRightSheet = document.getElementById("mainCharacterRight");
    mainCharacterLeftSheet = document.getElementById("mainCharacterLeft");
    mainCharacterFrontSheet = document.getElementById("mainCharacterFront");
    mainCharacterBackSheet = document.getElementById("mainCharacterBack");
    mainCharacter = new AnimatedSprite(0,0,8,8,gameCanvas,mainCharacterFrontSheet,3,3);
    mainCharacter.play(-1);



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



    previousTime = Date.now();
    timer = setInterval(function(){
        var now = Date.now();
        var deltaTime = now - previousTime;
        graphics.clearRect(0,0,gameCanvas.width,gameCanvas.height);

       mainCharacter.update(deltaTime);
       mainCharacter.draw(graphics);

       dialogue.draw(graphics);







        previousTime = now;
    },100);



};