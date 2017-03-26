var model = {

   isLoggedIn : function(){
          firebase.auth().onAuthStateChanged(function(user){
                    if(user){
                      presenter.loggedIn(user.email);
                    }
                    else{
                      presenter.notLoggedIn();
                    }
          });
  },

  register : function(name,contactNumber,rollNo,image){

                  var user = firebase.auth().currentUser;
                  var id = user.uid;
                  var user_email = user.email;
                  var storage = firebase.storage().ref(id);
                  var task=storage.child(id).put(image);

                  task.on('state_changed', function(snapshot)
                  {
                      progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                      absoluteProgress = parseInt(progress)+"%";
                      presenter.updateProgressBar(absoluteProgress);
                  },
                  function(error) {
                      presenter.registerError(error.message);
                  },
                  function()
                  {
                        var postKey = firebase.database().ref().child('Users'+id).push().key;
                        var downloadURL = task.snapshot.downloadURL;
                        var updates = {};
                        var postData =
                        {
                            name:name ,
                            email:user_email ,
                            contact_number:contactNumber ,
                            roll_no:rollNo,
                            imager_url:downloadURL
                        };
                      updates['/Users/' + id] = postData;
                      firebase.database().ref().update(updates).then(function()
                      {
                            presenter.registerSuccess();
                      });

                  });
                }
};

var presenter = {
          isLoggedIn : function(){
             model.isLoggedIn();
          },

          loggedIn : function(email){
             view.init();
             view.setEmailInHeaderStrip(email);
             view.setLoginLogoutButtonInHeaderStrip();
          },

          notLoggedIn : function(){
              window.location = "index.html";
          },

          register  : function(name,contactNumber,rollNo,image,validContactNo){
                            if(name=="" || name==null)
                            {
                                view.showError("Please enter your name");
                                return;
                            }
                            else if(contactNumber=="")
                            {
                                view.showError("Please enter your contact number");
                                return;
                            }
                            else if(!contactNumber.match(validContactNo) || contactNumber.length!=10)
                            {
                                view.showError("Invalid contact number");
                                return;
                            }
                            else if(rollNo=="")
                            {
                                view.showError("Please enter your roll number");
                                return;
                            }
                            else if (image==undefined) {
                                view.showError("Upload your photo");
                                return;
                            }
                            else
                            {
                                view.showLoading();
                                model.register(name,contactNumber,rollNo,image);
                            }
                },

                registerError    : function(error){
                            view.showError(error);
                },

                registerSuccess  : function(){
                            window.location="main.html";
                },

                updateProgressBar: function(progress){
                            console.log(progress);
                            view.updateProgressBar(progress);
                }
};

var view = {

      init: function(){
             registrationDiv = document.getElementById('registrationDiv');
             errorElements = document.getElementById('registrationError');
             loadingElement = document.getElementById('loading');
             progressElement = document.getElementById('progressBar');
             userEmailElement = document.getElementById('user_email');
             loginLogoutButtonElement = document.getElementById('quickstart-sign-in');
             nameBox = document.getElementById('name');
             contactNumberBox = document.getElementById('contactNumber');
             rollNoBox = document.getElementById('rollNo');
             imageBox = document.getElementById("image");
             registerButton = document.getElementById('registerButton');
             validContactNo = /^[0-9]+$/;

            registerButton.addEventListener('click',function(){
              presenter.register(nameBox.value,contactNumberBox.value,rollNoBox.value,imageBox.files[0],validContactNo);
            })
          },

          showError  : function(error){
                  registrationDiv.style.display = "block";
                  progressElement.style.display = "none";
                  errorElements.style.display = "block";
                  errorElements.innerHTML = error;
                  loadingElement.style.display ="none";
          },

          updateProgressBar : function(progress){
                progressElement.style.display ="block";
                progressElement.style.width = progress;
                progressElement.innerText = progress;
                loadingElement.style.display = "none";
          },

          setEmailInHeaderStrip : function(email){
                userEmailElement.innerText = email;
                loadingElement.style.display = "none";
          },

          setLoginLogoutButtonInHeaderStrip : function(){
                loginLogoutButtonElement.innerHTML = 'Sign Out'
          },

          showLoading : function(){
                loadingElement.style.display ="block";
                registrationDiv.style.display ="none";
                errorElements.style.display = "none";
          }
};

presenter.isLoggedIn();
