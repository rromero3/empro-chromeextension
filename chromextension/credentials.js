// TODO(DEVELOPER): Change the values below using values from the initialization snippet: Firebase Console > Overview > Add Firebase to your web app.
// Initialize Firebase
var config = {
  apiKey: 'AIzaSyDjJ9lqByhCB8KFn3o1Hd73_bMZhYZBjEU',
  databaseURL: 'https://empro-app.firebaseio.com',
  storageBucket: 'empro-app.appspot.com',
  authDomain: "empro-app.firebaseapp.com",  
  projectId: "empro-app",
};
firebase.initializeApp(config);

window.onload = function() {
      initApp();
    };

function initApp() {
              firebase.auth().getRedirectResult().then(function(result) {
                // The signed-in user info.
               var user2 = result.user;

              if (result.credential) {
                // This gives you a Google Access Token.
                var token2 = result.credential.accessToken;

               

               var credential2 = firebase.auth.GoogleAuthProvider.credential(user2.id, token);

                console.log("credentials **2**");
                console.log(credential2);

               // Save it using the Chrome extension storage API.
                chrome.storage.sync.set({'google-credential': credential2}, function() {
                  // Notify that we saved.
                  console.log('Google Settings saved');

                });

                document.getElementById('quickstart-account-details').textContent = JSON.stringify(user2, null, '  ');

              }
              
                document.getElementById('quickstart-current-user').textContent =  user2.id;

              
            });
};

/**
 * initApp handles setting up the Firebase context and registering
 * callbacks for the auth status.
 *
 * The core initialization is in firebase.App - this is the glue class
 * which stores configuration. We provide an app name here to allow
 * distinguishing multiple app instances.
 *
 * This method also registers a listener with firebase.auth().onAuthStateChanged.
 * This listener is called when the user is signed in or out, and that
 * is where we update the UI.
 *
 * When signed in, we also authenticate to the Firebase Realtime Database.
 */
function initApp() {
  // Listen for auth state changes.
  // [START authstatelistener]
  firebase.auth().onAuthStateChanged(function(user) {

    console.log("auth changed state")

    if (user) {
      // User is signed in.
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var isAnonymous = user.isAnonymous;
      var uid = user.uid;
      var providerData = user.providerData;
      // [START_EXCLUDE]
      document.getElementById('quickstart-button').textContent = 'Sign out';
      document.getElementById('quickstart-sign-in-status').textContent = 'Signed in';
      document.getElementById('quickstart-account-details').textContent = JSON.stringify(user, null, '  ');
      // [END_EXCLUDE]
    } else {
      // Let's try to get a Google auth token programmatically.
      // [START_EXCLUDE]
      document.getElementById('quickstart-button').textContent = 'Sign-in with Google';
      document.getElementById('quickstart-sign-in-status').textContent = 'Signed out';
      document.getElementById('quickstart-account-details').textContent = 'null';
      // [END_EXCLUDE]
    }
    document.getElementById('quickstart-button').disabled = false;
  });
  // [END authstatelistener]

  document.getElementById('quickstart-button').addEventListener('click', startSignIn, false);
}

/**
 * Start the auth flow and authorizes to Firebase.
 * @param{boolean} interactive True if the OAuth flow should request with an interactive mode.
 */
function startAuth(interactive) {
  // Request an OAuth token from the Chrome Identity API.
  chrome.identity.getAuthToken({interactive: !!interactive}, function(token) {
    if (chrome.runtime.lastError && !interactive) {
      console.log('It was not possible to get a token programmatically.');
    } else if(chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
    } else if (token) {
      // Authrorize Firebase with the OAuth Access Token.
      var credential = firebase.auth.GoogleAuthProvider.credential(null, token);
    


      firebase.auth().signInWithCredential(credential).catch(function(error) {
        // The OAuth token might have been invalidated. Lets' remove it from cache.
        if (error.code === 'auth/invalid-credential') {
          chrome.identity.removeCachedAuthToken({token: token}, function() {
            startAuth(interactive);
          });
        }

        // Save it using the Chrome extension storage API.
        chrome.storage.sync.set({'google-credential': credential}, function() {
          // Notify that we saved.
          console.log('Google Settings saved');

        });


      });
    } else {
      console.error('The OAuth Token was null');
    }
  });
}

/**
 * Starts the sign-in process.
 */
function startSignIn() {
 

 // Start a sign in process for an unauthenticated user.
            var provider2 = new firebase.auth.GoogleAuthProvider();
            provider2.addScope('profile');
            provider2.addScope('email');
            provider2.addScope('https://www.googleapis.com/auth/plus.login');
            firebase.auth().signInWithRedirect(provider2);

  // document.getElementById('quickstart-button').disabled = true;
  if (firebase.auth().currentUser) {
    firebase.auth().signOut();
  } else {
    console.log("startAuth");
    // startAuth(true);
  }

  chrome.identity.getProfileUserInfo(function(userInfo) {
 /* Use userInfo.email, or better (for privacy) userInfo.id
 They will be empty if user is not signed in in Chrome */
     interactive = false;
     document.getElementById('ece-username').textContent = userInfo.email + ' ' + userInfo.id;


   chrome.identity.getAuthToken(null, function(tokena) {
    if (chrome.runtime.lastError && !interactive) {
      console.log('It was not possible to get a token programmatically.');
    } else if(chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
    } else if (tokena) {

        // Authrorize Firebase with the OAuth Access Token.
         var credential = firebase.auth.GoogleAuthProvider.credential(null, tokena);

        console.log("credentials ****");
        console.log(credential);

        firebase.auth().signInWithCredential(credential).then( function(a){

          // Save it using the Chrome extension storage API.
          chrome.storage.sync.set({'google-credential': credential}, function() {
            // Notify that we saved.
            console.log('Google Settings saved');

          });
        }

          ).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // The email of the user's account used.
          var email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          var credential = error.credential;
          if (errorCode === 'auth/account-exists-with-different-credential') {
            alert('Email already associated with another account.');
            // Handle account linking here, if using.
          } 
          if (error.code === 'auth/invalid-credential') {
            chrome.identity.removeCachedAuthToken({token: tokena}, function() {
              startAuth(false);
            });
          }
          else  
          {
              console.error(error);


             
          }


         });
      } else {
        console.error('The OAuth Token was null');
      }
    });



   

    


});

}

window.onload = function() {
 

  initApp();
};
