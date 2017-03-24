
// Initialize Firebase
var config = {
    apiKey: "AIzaSyCAdOcZJa8hRUTPJ8qAWDKyYLjf_cilI50",
    authDomain: "pinnacleapp-f8448.firebaseapp.com",
    databaseURL: "https://pinnacleapp-f8448.firebaseio.com",
    storageBucket: "pinnacleapp-f8448.appspot.com",
    messagingSenderId: "843834262520"
};
firebase.initializeApp(config);

/*var loginButton = document.getElementById("quickstart-sign-in");

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

function forget()
{
          var auth = firebase.auth();
          var emailAddress = document.getElementById('email').value;
          auth.sendPasswordResetEmail(emailAddress).then(function() {
              $("#loginError").html('Please check inbox of your email id.');
          }, function(error) {
              $("#loginError").html('Sorry something went wrong '+error);
          });
}

function push_users_info_error(id,email)   //function to handle errors of user registration
{
    var name = document.getElementById('user_name').value;
    var contact_number = document.getElementById('contact_number').value;
    var roll_no = document.getElementById('roll_no').value;
    var image = document.getElementById("image").files[0];
    var num = /^[0-9]+$/;

    if(name=="" || name==null)
    {
        $("#registrationError").html("Please enter your name");
    //    $("#user_name_error").html("Please enter your name").slideUp("slow");
        return;
    }
    else if(contact_number=="")
    {
        $("#registrationError").html("Please enter your contact number");
        return;
    }
    else if(!contact_number.match(num) || contact_number.length!=10)
    {
        $("#registrationError").html("Invalid contact number");
        return;
    }
    else if(roll_no=="")
    {
        $("#registrationError").html("Please enter your roll number");
        return;
    }
    else if(document.getElementById("image").value=="")
    {
        $("#registrationError").html("Please Upload your photo");
        return;
    }
    else
    {
        push_users_info(id,email,name,contact_number,roll_no,image);   //passes values to the function which pushes values in database
    }

}

function push_users_info(id,email,name,contact_number,roll_no,image)  //function to push values in database
{
    var storage = firebase.storage().ref(id);
    var task=storage.child(id).put(image);
    task.on('state_changed', function(snapshot)
    {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        document.getElementById("progress").style.display = "block";
        document.getElementById("bar").style.width = parseInt(progress)+"%";
        document.getElementById("bar").innerText = parseInt(progress)+"%";
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state)
        {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;

            case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
            break;

        }
    },
    function(error) {  $("#registrationError").html("Sorry something went wrong ! Try again");  },
    function()
    {
          var postKey = firebase.database().ref().child('Users'+id).push().key;
          var downloadURL = task.snapshot.downloadURL;
          var updates = {};
          var postData =
          {
              name:name ,
              email:email ,
              contact_number:contact_number ,
              roll_no:roll_no,
              imager_url:downloadURL
          };
        updates['/Users/' + id] = postData;
        firebase.database().ref().update(updates).then(function()
        {
          window.location="diff.html";
        });

    });
}

function checkLoginStatus() //function to check that a user a logged in :O
{
    firebase.auth().onAuthStateChanged(function(user)
    {
        if (user)
        {
            var email = user.email;
            var photoURL = user.photoURL;
            var uid = user.uid;
            var providerData = user.providerData;
            //alert("logged in");
            console.log("logged in");
            document.getElementById('user_email').textContent = email;
            document.getElementById('user_id').textContent = uid;
            document.getElementById('quickstart-sign-in').textContent = 'Sign out';
        }
        else
        {
           window.location="index.html";
           document.getElementById('quickstart-sign-in').textContent = 'Sign in';
        }
        document.getElementById('quickstart-sign-in').disabled = false;
   });
    document.getElementById('quickstart-sign-in').addEventListener('click', login, false);
}

function checkLoginAndRegisterStatus() //function to check that a user a logged in and registered :P
{
    firebase.auth().onAuthStateChanged(function(user)
    {
        if (user)      //if user is signed in then
        {
            var user_email = user.email;
            var user_id = user.uid;
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
                            document.getElementById('user_email').textContent = user_email;
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
        else
        {
           //alert('Signed out');
           console.log('Signed out');
           window.location="index.html";
           document.getElementById('quickstart-sign-in').textContent = 'Sign in';
        }
        document.getElementById('quickstart-sign-in').disabled = false;
   });
  document.getElementById('quickstart-sign-in').addEventListener('click', login, false);
}

function passagesFromDatabase()   //to fetch all passages from database
{
   passageLoaderShow();
   var passagesQuery = firebase.database().ref("Passages");
   passagesQuery.on('value', function(snapshot)
   {
         passageLoaderHide();
         var createClickHandler = function(arg)
         {
           return function()
           {
             document.getElementById('a').innerHTML = arg;
             showTest();
           };
         }

        snapshot.forEach(function(childSnapshot)
        {
            var div = document.createElement('div');
            div.className = 'row passage';
            var passage = childSnapshot.val().PassageString;
            div.onclick = createClickHandler(passage);
            var passagecode = childSnapshot.val().Code;
            div.innerHTML='<div style="background-color:#00BFA5;color:white">'+passagecode+'<span style="float:right;">Start Typing</div>'+'</div>'+passage;
            $("#passages").append(div);
        })

   },function(errorObject){
        console.log("Retry Error Fetching Data : "+errorObject.code);
   }
 );
}
*/
