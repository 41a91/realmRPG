
window.onload = function()
{

    console.log("Save_Load has loaded in");


$(function(){
   $("#submit").bind("click",function(evt){
       evt.preventDefault();

       $.ajax({
          type: "POST",
           url: "php/control/registerGameController.php",
           data: $("#newSave").serialize(),
           success: function(){
               console.log("the form was submitted");
           }
       });
   });
});
};