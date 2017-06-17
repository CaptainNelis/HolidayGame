const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.setplayerposition = functions.database.ref('/players/{uid}')
  .onWrite(event => {
    if (!event.data.previous.exists() && event.data.exists()) {
      const positionRef = event.data.ref.child('position');
      const playersRef = event.data.ref.parent;
      return playersRef.once('value')
        .then(playersData => positionRef.set(playersData.numChildren()));
    }
  });

exports.removePlayer = functions.database.ref('/players/{uid}/position')
  .onWrite(event => {
    if (event.data.previous.exists() && !event.data.exists()) {
      const removedPosition = event.data.previous.val();
      console.log('removedPosition', removedPosition);
      const playersRef = event.data.ref.parent.parent;
      playersRef.orderByChild('position').startAt(removedPosition + 1).once('value', function (snapshot) {
        snapshot.forEach(function (data) {
          playersRef.child(data.key).update({'position': data.val().position - 1});
        });
      });
    }
  });

exports.lockChallenger = functions.database.ref('/challenges/{challenge}/challenger')
  .onWrite(event => {
    if (!event.data.previous.exists() && event.data.exists()) {
      return admin.database().ref('/players/' + event.data.val())
        .update({
          isLocked: true
        });
    }
  });

exports.unLockChallenger = functions.database.ref('/challenges/{challenge}/challenger')
  .onWrite(event => {
    if (event.data.previous.exists() && !event.data.exists()) {
      return admin.database().ref('/players/' + event.data.previous.val())
        .update({
          isLocked: false
        });
    }
  });

exports.lockChallengee = functions.database.ref('/challenges/{challenge}/challengee')
  .onWrite(event => {
    if (!event.data.previous.exists() && event.data.exists()) {
      return admin.database().ref('/players/' + event.data.val())
        .update({
          isLocked: true
        });
    }
  });

exports.unLockChallengee = functions.database.ref('/challenges/{challenge}/challengee')
  .onWrite(event => {
    if (event.data.previous.exists() && !event.data.exists()) {
      return admin.database().ref('/players/' + event.data.previous.val())
        .update({
          isLocked: false
        });
    }
  });
