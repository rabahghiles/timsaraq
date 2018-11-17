$(function () {

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
        sendScoreButton = $("#sendScore"),
        getClassementButton = $("#getClassement"),
        rankListe = $("#ranksListe"),
        playerKey = "";

    sendScoreButton.click(sendScore);
    getClassementButton.click(getClassement);


    function sendScore() {
        let ref = database.ref('scores2'),
            time = Date.now(),
            data = {
                name: "djidji",
                score: 100,
                date: time
            };
        let back = ref.push(data);
        playerKey = back.key;
        console.log(playerKey);
        
    }

    function getClassement() {
        let childArray = [],
            ref = database.ref("scores");
        console.log("hello word");

        ref.once('value', function (snapshot) {
            
            
            snapshot.forEach(function (childSnapshot) {
                childArray.push(childSnapshot.val());
            });
            childArray.sort(function (a, b) {
                
                    if (a.score < b.score) {
                        return 1
                    }
                    if (a.score > b.score) {
                        return -1
                    }
                
                return 0;
            });
            childArray.forEach( function( player ){
                console.log("nom :"+player.name);
                console.log("score :"+player.score);
                console.log("--------------------");
            });
        });
    }
    
    // function setRank(obj,rank){
        
    //     let li = $("<li></li>"),
    //         span = $("<span><span>");
    //     span.html("#1");
    //     li.append(span);
    //     li.append("je suis un text");
    //     rankListe.append(li);
    // }


})
