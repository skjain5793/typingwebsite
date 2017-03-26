var config = {
    apiKey: "AIzaSyBXmt_HuSOO7Nh62QgaSlguVIZLBaaEcPk",
    authDomain: "typingtest-18077.firebaseapp.com",
    databaseURL: "https://typingtest-18077.firebaseio.com",
    storageBucket: "typingtest-18077.appspot.com",
    messagingSenderId: "864003751108"
  };
firebase.initializeApp(config);

var isLoggedIn = function(){
        firebase.auth().onAuthStateChanged(function(user){
                  if(user){
                     return result = true;
                  }
                  else{
                  return result = false;
                }

        });
};





/*
function usigned(bool) {
  if (bool) {
    $("#hlogp").css("display", "none");
    $("button#in").css("display", "none");
    $("button#out").css("display", "inline-block");
  } else {
    $("button#out").css("display", "none");
    $("#hlogp").css("display", "block");
    $("button#in").css("display", "block");
  }
}

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    usigned(true);
  } else {
    usigned(false);
  }
});*/
