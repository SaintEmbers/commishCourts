const functions = require('firebase-functions');
const fetch = require('node-fetch');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

exports.sendPushNotification = functions.database.ref('notifications/{id}')
.onCreate((snap, context) => {
  const data = snap.val();
  const {note} = data;
  const firebaseRoot = data.ref.root;
  var messages = [];

  return firebaseRoot.child('/users').once('value').then(function(snapshot){
    snapshot.forEach((childSnapshot) => {
      var expoToken = childSnapshot.val().expoToken
      if(expoToken){
        messages.push({
          "to":expoToken,
          "title": 'New Note',
          "body": note,
        })
      }
    })
    return Promise.all(messages)
  }).then((messages) => {
    return fetch('https://exp.host/--/api/v2/push/send', {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" 
        
      },
      body: JSON.stringify(messages)
    })
  })
})

