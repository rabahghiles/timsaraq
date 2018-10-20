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
        ref = database.ref('scores'),
        containerNbrQuestion = $("#nbr_question"),
        containerTotalQuestion = $("#nbr_total_question"),
        containerLoader = $("#loader"),
        containerQuestion = $("#quizz_body_question"),
        containerAuthorQuestion = $("#author_question"),
        containerRespense = $("#container_respense"),
        hoverLoader = $("#hover"),
        bloc1 = $("#bloc1"),
        bloc2 = $("#bloc2"),
        bloc3 = $("#bloc3"),
        bloc0 = $("#bloc0"),
        
        inputName = $("#name"),
        inputMail = $("#mail"),
        
        containerNamePlayer = $("#playername"),
        finalScore = $("#finalscore"),
        parentLastScore = $("#c_rejouer"),
        containerLastScore = $("#lastescore"),
        
        containerWords = $("#words"),
        
        nbrCurrentQuestion = 0,
        nbrTotalQuesqtions = 60,
        
        score = 0,
        lastScore = 0,
        namePlayer = "",
        guestName = "Amsedrid "+generateNumber();
        
        question = {},
        countDown = 0,
        form = "",
        riddles = [],
        difficultsWord = [];

    // Chargement de la liste des devinettes
    $.getJSON( "js/riddle.json", function( data ) {
        riddles = data;
        nbrTotalQuesqtions = riddles.length;
        containerTotalQuestion.html(nbrTotalQuesqtions);
        hoverLoader.removeClass("hover_actif");
    });
    
    // Initialisation des devinettes et de la logique du quizz
    function init(){
        let mNbrQuestion = nbrCurrentQuestion + 1;
        countDown = 60;
        containerLoader.html(countDown);
        question = riddles[nbrCurrentQuestion];
        containerNbrQuestion.html(mNbrQuestion);
        containerQuestion.html(question.corp);
        containerAuthorQuestion.html(question.author);
        difficultsWord = question.words;
        if ( difficultsWord.length > 0 ){
            containerWords.html(creatWords(difficultsWord));
            containerWords.addClass("words_actif");
        }
        creatRespenses(question.answres);
        countDownFunction();
        setEventListner();
        hoverLoader.removeClass("hover_actif");
    };
    
    // creation des blocks qui contiennent les repenses
    function creatRespenses(respenses){
        containerRespense.empty();
        let reps = '<label>'+respenses[0]+'<input type="radio" name="respense" class="respense" value="'+respenses[0]+'"></label>'
                +'<label>'+respenses[1]+' <input type="radio" name="respense" class="respense" value="'+respenses[1]+'"></label>'
                +'<label>'+respenses[2]+' <input type="radio" name="respense" class="respense" value="'+respenses[2]+'"></label>'
                +'<label>'+respenses[3]+' <input type="radio" name="respense" class="respense" value="'+respenses[3]+'"></label>';
        containerRespense.html(reps);
    }
    
    // Creation des blocks qui contiennent les mot difficiles et leur traduction
    function creatWords(words){
        let cWords = "";
        words.forEach(function(word,index){
            cWords += '<li class="word">'+word.kWord+' : '+word.fWord+'</li>'
        })
        return cWords;
    }
    
    // Function pour le timer (count down)
    function countDownFunction(){
        interval = setInterval(function(){
            countDown--;
            containerLoader.html(countDown);
            if ( parseInt(countDown) === 0 ){
                nextQuestion();
            }
        },1000);
    };
    
    // Calcule des points à attribuer aprés chaque repense
    function calculScore(){
        let mScore = 0;
        
        if( countDown <= 60 && countDown > 50 ){
            mScore = 10;
        }else if( countDown <= 50 && countDown > 40 ){
            mScore = 6;
        }else if( countDown <= 40 && countDown > 30 ){
            mScore = 4;
        }else if( countDown <= 30 && countDown > 20 ){
            mScore = 3;
        }else if( countDown <= 20 && countDown > 10 ){
            mScore = 2;
        }else if( countDown <= 10 && countDown > 0 ){
            mScore = 1;
        }
        
        return mScore;
    }
    
    // fonction question suivante
    function nextQuestion(){
        clearInterval(interval);
        nbrCurrentQuestion++;
        hoverLoader.addClass("hover_actif");
        containerWords.removeClass("words_actif");
        setTimeout(function(){
            if ( nbrCurrentQuestion >= nbrTotalQuesqtions ){
                
                hoverLoader.removeClass("hover_actif");
                bloc1.css("display","none");
                bloc2.css("display","block");
                
            }else{
                init();
            }
        },800);
    }
    
    // Lancer le jeux
    $(".start").click(function(){
        score = 0;
        nbrCurrentQuestion = 0;
        hoverLoader.addClass("hover_actif");
        setTimeout(function(){
            bloc0.css("display","none");
            bloc3.css("display","none");
            bloc1.css("display","block");
            containerLastScore.removeClass("c_lastscore_actif");
            hoverLoader.removeClass("hover_actif");
            init();
        },800);
    })
    
    // Valider une répense
    $("#quizz_form").submit(function(e){
        e.preventDefault();
        let respense = $(".respense:checked").val(),
            gRespense = question.rAnswer;
        if ( respense === gRespense ){
            score = score + calculScore();
        };
        nextQuestion();
    });
    
    // Rentrez son nom
    $("#information_form").submit(function(e){
        e.preventDefault();
        namePlayer = inputName.val();
        mailPlayer = inputMail.val();
        setFinalScore();
    })
    
    // Afficher le score final
    function setFinalScore(){
        hoverLoader.addClass("hover_actif");
        containerNamePlayer.html(namePlayer);
        finalScore.html(score);
        if ( lastScore > 0 ){
            containerLastScore.html(lastScore);
            parentLastScore.addClass("c_lastscore_actif");
        }
        lastScore = score;
        insertToDatabase(guestName,namePlayer,score);
        setTimeout(function(){
            hoverLoader.removeClass("hover_actif");
            bloc2.css("display","none");
            bloc3.css("display","block");
        },1300);
    }

    // Envoyer le score sur firebase
    function insertToDatabase(guest,name,score){
        let data = {
                    guest : guest,
                    name : name,
                    score : score
            }
        ref.push(data);
    };
    
    // mettre les écouteurs d'événement sur les buttons des reponses
    function setEventListner(){
        $(".respense").change(function(){
            $(this).parent().siblings().removeClass("label_actif");
            $(this).parent().addClass("label_actif");    
        })
    }

    // Générer un nombre aléatoir
    function generateNumber(){
        return Math.round(Math.random()*1000000);
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
})