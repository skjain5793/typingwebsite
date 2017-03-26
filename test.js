var clock = $('.clock').FlipClock(900, {
      clockFace: 'MinuteCounter',
      countdown: true,
      autoStart: false,
      callbacks: {
        start: function() {
          presenter.enableSubmiTestButton();
        },
        stop: function(){
          presenter.afterClockStopped();
          depressionsGauge.update(b.textContent.length);
          speedGauge.update(Math.ceil((b.textContent.length/(900-clock.getTime().time))*900));
          presenter.changed();
        }
      }
  });



var model = {
        getAllPassages : function(){

          var passagesQuery = firebase.database().ref("Passages");
          passagesQuery.on('value', function(snapshot)
          {
                var createClickHandler = function(arg)
                {
                  return function()
                  {
                        presenter.showTest(arg);
                  };
                }

               snapshot.forEach(function(childSnapshot)
               {
                 presenter.fetchPassagesSuccess();
/*                   var passage = childSnapshot.val().PassageString;
                   div.onclick = createClickHandler(passage);
                   var passagecode = childSnapshot.val().Code;
                   div.innerHTML='<div style="background-color:#00BFA5;color:white">'+passagecode+'<span style="float:right;">Start Typing</div>'+'</div>'+passage;
                   passagesElement.appendChild(div);
                   console.log(div); */
               })

          },function(errorObject){
               presenter.fetchPassagesError(errorObject.code);
          }
        );

        }
};

var presenter = {
    fetchPassages : function(){
        view.passageLoaderShow();
        model.getAllPassages();
    },
    fetchPassagesSuccess : function(){
         view.passageLoaderHide();
    },
    fetchPassagesError : function(error){
        view.showError(error);
    },
    showTest : function(test){
        view.showTest(test);
    },
    startTest : function(){
            clock.start();
    },
    enableSubmiTestButton : function(){
            model.enableSubmiTestButton();
    },
    afterClockStopped : function(){
      model.disableSubmiTestButton();
      console.log("Elapsed Time "+(900-clock.getTime().time)+" seconds");
      console.log("Depressions : "+b.textContent.length);
      view.showResult();
    },
    changed : function(){
                            var diff = JsDiff[window.diffType](a.textContent, b.textContent);
                            console.log("Total Components : "+diff.length);
                            var errorCount = 0;
                            var insCount = 0;
                            var normalCount = 0;
                            var fragment = document.createDocumentFragment();
                            for (var i=0; i < diff.length; i++) {
                                if (diff[i].added && diff[i + 1] && diff[i + 1].removed) {
                                              var swap = diff[i];
                                              diff[i] = diff[i + 1];
                                              diff[i + 1] = swap;
                                  }
                                  var node;
                                  if (diff[i].removed) {
                                        node = document.createElement('del');
                                        node.appendChild(document.createTextNode(diff[i].value));
                                        console.log("Missing words "+diff[i].value+" Length "+wordLength(diff[i].value));
                                        errorCount += wordLength(diff[i].value);
                                  }
                                  else if (diff[i].added) {
                                        node = document.createElement('ins');
                                        node.appendChild(document.createTextNode(diff[i].value));
                                        insCount += wordLength(diff[i].value) ;
                                  }
                                  else {
                                        node = document.createTextNode(diff[i].value);
                                        normalCount += wordLength(diff[i].value);
                                  }
                            fragment.appendChild(node);
                            }
                            console.log("Missing Words Count : "+errorCount);
                            console.log("Extra words count : "+insCount);
                            console.log("Correct Components : "+normalCount);
                            console.log("Error Percentage : "+((errorCount+insCount)/(errorCount+insCount+normalCount))*100);
                            console.log("Accuracy : "+((normalCount)/(errorCount+insCount+normalCount))*100);
                            accuracyGauge.update(((normalCount)/(errorCount+insCount+normalCount))*100);
                            errorGauge.update(((errorCount+insCount)/(errorCount+insCount+normalCount))*100);
                            result.textContent = '';
                            result.appendChild(fragment);
    }

};

var view = {
          init : function(){

                   a = document.getElementById('a');
                   b = document.getElementById('b');
                   result = document.getElementById('result');
                   navigationElem = document.getElementById('navigation');
                   instructionElem = document.getElementById('instructions');
                   practiceElem = document.getElementById('practice');
                   outputElem = document.getElementById('output');
                   passageLoaderElem = document.getElementById('loaderPassage');
                   submitTestButtonElem = document.getElementById("submitTest");
                   passageElem = document.getElementById('passage');
                   passagesElement = document.getElementById('passages');
                   div = document.createElement('div');
                   div.className = 'row passage';

                   presenter.fetchPassages();
                   b.addEventListener("keydown", presenter.startTest);

          },
          showPassage : function(){
                  navigationElem.style.display="block";
                  practiceElem.style.display="none";
                  outputElem.style.display="none";
          },
          passageLoaderShow : function(){
                  passageLoaderElem.style.display="block";
          },
          passageLoaderHide : function(){
                  passageLoaderElem.style.display="none";
          },
          showInstruction : function(){
                  navigationElem.style.display="none";
                  practiceElem.style.display="none";
                  outputElem.style.display="none";
          },
          showTest : function(test){
                  a.innerHTML = test;
                  b.textContent='';
                //  resetTest();
                  navigationElem.style.display="none";
                  practiceElem.style.display="block";
                  outputElem.style.display="none";
          },
          showResult : function(){
                  navigationElem.style.display="none";
                  practiceElem.style.display="none";
                  outputElem.style.display="block";
          },
          showError : function(error){
            console.log(error);
          },
          enableSubmiTestButton : function(){
              submitTestButtonElem.disabled = false;
          },
          disableSubmiTestButton : function(){
              submitTestButtonElem.disabled = true;
          }

};

view.init();
