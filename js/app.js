$(document).ready(function(){
var config = {
    apiKey: "AIzaSyA1ZiojIQEF-ctL63Xe7GZpUD-unJq5HoA",
    authDomain: "first-project-83217.firebaseapp.com",
    databaseURL: "https://first-project-83217.firebaseio.com",
    projectId: "first-project-83217",
    storageBucket: "first-project-83217.appspot.com",
    messagingSenderId: "21524611408",
    appId: "1:21524611408:web:580c90994622ea5f592c55",
    measurementId: "G-HKBS7HRPW1"
};

firebase.initializeApp(config);

var database = firebase.database();


var name;
var destination;
var firstTrain;
var frequency = 0;

$("#add-btn").on("click", function() {
    event.preventDefault();
    
    name = $("#train-name").val().trim();
    destination = $("#destination").val().trim();
    firstTrain = $("#train-time").val().trim();
    frequency = $("#frequency").val().trim();

    database.ref().push({
        name: name,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
    $("form")[0].reset();
});

database.ref().on("child_added", function(childSnapshot) {
    var minAway;
    var firstTrainNew = moment(childSnapshot.val().firstTrain, "hh:mm").subtract(1, "years");
   
    var diffTime = moment().diff(moment(firstTrainNew), "minutes");
    var remainder = diffTime % childSnapshot.val().frequency;
   
    var minAway = childSnapshot.val().frequency - remainder;
   
    var nextTrain = moment().add(minAway, "minutes");
    nextTrain = moment(nextTrain).format("hh:mm");

    $("#table").append("<tr><td>" + childSnapshot.val().name +
            "</td><td>" + childSnapshot.val().destination +
            "</td><td>" + childSnapshot.val().frequency +
            "</td><td>" + nextTrain + 
            "</td><td>" + minAway + "</td></tr>");

        
    }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
});

database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {
  
    $("#name-display").html(snapshot.val().name);
    $("#email-display").html(snapshot.val().email);
    $("#age-display").html(snapshot.val().age);
    $("#comment-display").html(snapshot.val().comment);
});
});