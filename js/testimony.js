$(function(){
    
    // Initialiser firebase
    var config = {
        apiKey: "AIzaSyDI2KGE0fWk-FkPfAQXa_Zpajz9ByTt1aA",
        authDomain: "kabylie-quizz.firebaseapp.com",
        databaseURL: "https://kabylie-quizz.firebaseio.com",
        projectId: "kabylie-quizz",
        storageBucket: "kabylie-quizz.appspot.com",
        messagingSenderId: "196927959551"
    };
    firebase.initializeApp(config);
    
    // Déclaration des variables
    let database = firebase.database(),
        ref = database.ref('testimonies'),
        tForm = $("#testimony_form"),
        cName = $("#testimony_name"),
        cText = $("#testimony_text"),
        cTanmirt = $("#tanmirt2"),
        guestName = "Amsebrid"+generateNumber(),
        timeout;
    
    // Information envoyées
    tForm.submit(function(e){
        e.preventDefault();
        cText.removeClass("error");
        if ( cText.val().length <= 0 ){
            cText.addClass("error");
            return false;
        }
        insertToDatabase(guestName,cName.val(),cText.val());
    })
    
    
    // Envoyer les information sur firebase
    function insertToDatabase(guest,name,text){
        cTanmirt.fadeOut(0);
        clearTimeout(timeout)
        let data = {
                    guest : guest,
                    name : name,
                    text : text
            }
        ref.push(data);
        
        cTanmirt.fadeIn(800,function(){
            timeout = setTimeout(function(){
                cTanmirt.fadeOut(800);
            },3000);
        })
        cText.val("");
    };
    
    
    // Générer un nombre aléatoir
    function generateNumber(){
        return Math.round(Math.random()*1000000);
    }
    
    
    
})