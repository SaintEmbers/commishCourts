import moment from 'moment';
import { Firebase, FirebaseRef } from '../lib/firebase';

export function getGames() {
 if (Firebase === null) return () => new Promise(resolve => resolve());

  const ref = FirebaseRef.child(`games`);
  return(dispatch) => {
    return ref.on('value', (snapshot) => {
      const games = snapshot.val() || {};
      return dispatch({
        type: 'GAMES_REPLACE',
        games,
      });
    });
  }
}

export function createGame({location, day, time}) {
 if (Firebase === null) return () => new Promise(resolve => resolve());
  let gamesRef = FirebaseRef.child("games");
  return(dispatch) => {
    gamesRef.push({day, time, location}).then((res) => {
      return getGames();
    })
  }
}

export function joinGame({id, playerId, player}){
  const UID = Firebase.auth().currentUser.uid
  
  //remove from game list
  return FirebaseRef.child(`games/${id}/player-list/${UID}`).remove().then(() => {
    console.log('player removed')
  });

  //rsvp to game list
  // return FirebaseRef.child(`games/${id}/player-list`).update({[UID]: player}).then(() => {
  //   console.log('player removed')
  // });

}
