import moment from 'moment';
import { Firebase, FirebaseRef } from '../lib/firebase';

/**
  * Get this User's Favourite Recipes
  */
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

export function joinGame(){
  console.log('join game')
}
