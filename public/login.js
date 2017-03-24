var model = {
  signIn : function(email,password){
    if (firebase.auth().currentUser)  {
        firebase.auth().signOut();
    }
    else    {
      presenter.hideLoginDiv();
      presenter.showLoadingDiv();
      firebase.auth().signInWithEmailAndPassword(email, password)
           .then(function(firebaseUser)
            {
              console.log("success");
              presenter.signInSuccess();
                  var user_email = firebaseUser.email;   //get current user's email
                  var user_id = firebaseUser.uid; //get current user's id
                  presenter.signInSuccess(user_email,user_id);
                  //isRegistered(user_email,user_id);  //function to check that user is registered or not
            })
           .catch(function(error) {
             return presenter.signInError(error);
           });
    }
     document.getElementById('quickstart-sign-in').disabled = true;

  },

  isRegistered : function (email,id) {
      var user_id=id;
      var user_email=email;
      var database=firebase.database();
      var users = database.ref('Users');
      var match=false;
      users.on('value',  function(snapshot) {
          var user_data = snapshot.val();
          if(user_data=="" || user_data == null)  {
            document.getElementById('user_id').textContent = user_id;
            window.location="user_registration.html";     //  redirect to user regsitration page
            return;
          }
          else   {
                snapshot.forEach(function(childSnapshot)   //To fetch all user_id(key values) under users
                {
                    var uid = childSnapshot.key; // key values under users in database
                    if(uid==user_id) //set a variable match to be true if user is registered or he/she has already entered his/her info.
                    {
                        match=true;
                      }
                    });
                    if(match)  //if user is registered or he/she has already entered his/her info.
                    {
                      window.location="diff.html";
                      document.getElementById('user_email').textContent = email;
                      document.getElementById('quickstart-sign-in').textContent = 'Sign out';
                      return;
                    }
                    if(!match) //if user is not registered.
                    {
                      window.location="user_registration.html"; //  redirects to user regsitration page
                    }
           }
      });
  }


};

var presenter = {
  signIn : function(email,password){
      return model.signIn(email,password);
  },
  signInSuccess : function(user_email,user_id){
      return model.isRegistered(user_email,user_id);
  },
  signInError : function(error)
  {
    return view.signInError(error);
  },
  showLoadingDiv : function(){
    view.showLoadingDiv();
  },
  hideLoginDiv : function(){
    view.hideLoginDiv();
  }

};

var view = {

  init: function()
  {
      var loginButton = document.getElementById("quickstart-sign-in");
      var emailElem = document.getElementById('email');
      var passwordElem = document.getElementById('password');
      var loadingDivElem = $("#loading");
      var loginDivElem = $("#loginDiv");
      $("button#quickstart-sign-in").click(function(){
      var email = emailElem.value;
      var password = passwordElem.value;
      presenter.signIn(email,password);
    });
  },

  showLoadingDiv : function(){
    $("#loginDiv").show();
  },

  hideLoginDiv : function(){
    $("#loginDiv").hide();
  },

  signInError : function(error){
    console.log(error);
  }

}

view.init();

/*
 var login_error = function()
 {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    if(email=="")
    {
        $("#loginError").html("Please enter your email id");
        return;
    }
    else if(password=="")
    {
        $("#loginError").html("Please enter your password");
        return;
    }
    else
    {
      login();
    }
}

 var login = function()
 {

    if (firebase.auth().currentUser)
    {
        firebase.auth().signOut();
    }
     else
     {
       document.getElementById('loginDiv').style.display = "none";
       document.getElementById('loading').style.display = "block";
       var email = document.getElementById('email').value;
       var password = document.getElementById('password').value;
       firebase.auth().signInWithEmailAndPassword(email, password)
            .then(function(firebaseUser)
             {
                   var user_email = firebaseUser.email;   //get current user's email
                   var user_id = firebaseUser.uid; //get current user's id
                   isRegistered(user_email,user_id);  //function to check that user is registered or not
             })
            .catch(function(error) // Handle Errors here.
            {
                    document.getElementById('loginDiv').style.display = "block";
                    document.getElementById('loading').style.display = "none";
                  var errorCode = error.code;
                  var errorMessage = error.message;

                  if (errorCode === 'auth/wrong-password')
                  {
                    $("#loginError").html('Incorrect password');
                  }
                  else
                  {
                    $("#loginError").html("Invalid Username or Password");
                  }
                  console.log(error);
                  document.getElementById('quickstart-sign-in').disabled = false;
            });

     }
      document.getElementById('quickstart-sign-in').disabled = true;
};

loginButton.addEventListener("click", login_error);

function isRegistered(email,id) //function to check user is registered or not only after login
{
    var user_id=id;
    var user_email=email;
    var database=firebase.database();
    var users = database.ref('Users');
    var match=false;

    users.on('value',  function(snapshot)
    {
        var user_data = snapshot.val();

        if(user_data=="" || user_data == null)   //if Users directory does not exist in database
        {
          document.getElementById('user_id').textContent = user_id;
          window.location="user_registration.html";     //  redirect to user regsitration page
          return;
        }
        else   //if Users directory exists in database
        {
              snapshot.forEach(function(childSnapshot)   //To fetch all user_id(key values) under users
              {
                  var uid = childSnapshot.key; // key values under users in database
                  if(uid==user_id) //set a variable match to be true if user is registered or he/she has already entered his/her info.
                  {
                      match=true;
                    }
                  });
                  if(match)  //if user is registered or he/she has already entered his/her info.
                  {
                    window.location="diff.html";
                    document.getElementById('user_email').textContent = email;
                    document.getElementById('quickstart-sign-in').textContent = 'Sign out';
                    return;
                  }
                  if(!match) //if user is not registered.
                  {
                    window.location="user_registration.html"; //  redirects to user regsitration page
                  }
         }
    });
}
*/
