import {Challenge} from "../../src/models/challenge";
import {getChallengeService} from "./challenge/challenge";
// import {getPlayerService} from "./player/player";

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const challengeService = getChallengeService(admin);
// const playerService = getPlayerService(admin);


exports.setplayerposition = functions.database.ref('/players/{uid}')
  .onCreate(event => {
    const positionRef = event.data.ref.child('position');
    const playersRef = event.data.ref.parent;
    return playersRef.once('value')
      .then(playersData => positionRef.set(playersData.numChildren()));
  });

exports.removePlayer = functions.database.ref('/players/{uid}/position')
  .onDelete(event => {
    const removedPosition = event.data.previous.val();
    console.log('removedPosition', removedPosition);
    const playersRef = event.data.ref.parent.parent;
    return playersRef.orderByChild('position').startAt(removedPosition + 1).once('value', function (snapshot) {
      snapshot.forEach(function (data) {
        return playersRef.child(data.key).update({'position': data.val().position - 1});
      });
    });
  });

exports.lockPlayersInChallenge = functions.database.ref('/challenges/{challengeKey}')
  .onCreate(event => {
    const challenge: Challenge = event.data.val();
    admin.database().ref(`players/${challenge.challenger}/isLocked`).set(true)
      .then(() => console.log(`Successfully locked player ${challenge.challenger}`))
      .catch(error => console.error(`Failed to lock player ${challenge.challenger}`, error));
    admin.database().ref(`players/${challenge.challengee}/isLocked`).set(true)
      .then(() => console.log(`Successfully locked player ${challenge.challengee}`))
      .catch(error => console.error(`Failed to lock player ${challenge.challengee}`, error))
  });

exports.unlockPlayersInChallenge = functions.database.ref('/challenges/{challengeKey}')
  .onDelete(event => {
    const challenge: Challenge = event.data.previous.val();
    admin.database().ref(`players/${challenge.challenger}/isLocked`).set(false)
      .then(() => console.log(`Successfully unlocked player ${challenge.challenger}`))
      .catch(error => console.error(`Failed to unlock player ${challenge.challenger}`, error));
    admin.database().ref(`players/${challenge.challengee}/isLocked`).set(false)
      .then(() => console.log(`Successfully unlocked player ${challenge.challengee}`))
      .catch(error => console.error(`Failed to unlock player ${challenge.challengee}`, error))
  });

exports.createCreatedAtForChallenge = functions.database.ref('/challenges/{challengeKey}')
  .onCreate(event => {
    const challengeKey = event.params.challengeKey;
    event.data.ref.child('createdAt').set(admin.database.ServerValue.TIMESTAMP)
      .then(() => console.log(`Successfully created createdAt timestamp for ${challengeKey}`))
      .catch(error => console.error(`Failed to create createdAt timestamp for ${challengeKey}`, error))
  });

exports.createChallengeReferences = functions.database.ref('/challenges/{challengeKey}')
  .onCreate(event => {
    const challengeKey = event.params.challengeKey;
    const challenge: Challenge = event.data.val();
    admin.database().ref(`/players/${challenge.challengee}/challenge`).set(challengeKey)
      .then(() => console.log(`Successfully created challenge reference for ${challenge.challengee}`))
      .catch(error => console.error(`Failed to create challenge reference for ${challenge.challengee}`, error));
    admin.database().ref(`/players/${challenge.challenger}/challenge`).set(challengeKey)
      .then(() => console.log(`Successfully created challenge reference for ${challenge.challenger}`))
      .catch(error => console.error(`Failed to create challenge reference for ${challenge.challenger}`, error))
  });

exports.deleteChallengeReferences = functions.database.ref('/challenges/{challengeKey}')
  .onDelete(event => {
    const challenge: Challenge = event.data.previous.val();
    admin.database().ref(`/players/${challenge.challengee}/challenge`).remove()
      .then(() => console.log(`Successfully deleted challenge reference for ${challenge.challengee}`))
      .catch(error => console.error(`Failed to delete challenge reference for ${challenge.challengee}`, error));
    admin.database().ref(`/players/${challenge.challenger}/challenge`).remove()
      .then(() => console.log(`Successfully deleted challenge reference for ${challenge.challenger}`))
      .catch(error => console.error(`Failed to delete challenge reference for ${challenge.challenger}`, error))
  });

exports.resolveChallengeAfterNotAccepting = functions.database.ref('/challenges/{challengeKey}/accepted')
  .onCreate(event => {
    console.log('accepted value: ', event.data.val());
    if (event.data.val() === false) {
      return event.data.ref.parent.once('value')
        .then((dataSnapshot) => {
          let challenge: Challenge;
          challenge = dataSnapshot.val();
          challenge.$key = dataSnapshot.key;
          return challengeService.getChallenge(challenge.$key)
        })
    }
  });
