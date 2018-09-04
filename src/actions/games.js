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
      const note = {
        note: `New game at ${location} on ${day} ${time}`
      }
      return addNote(note)
    }).then((res) => {
      console.log('add note finished')
      return getGames();
    }).catch((err) => {
      console.log('err', err)
    })
  }
}

export function addNote(note){
  console.log('addNote', note)
  if (Firebase === null) return () => new Promise(resolve => resolve());
  let notesRef = FirebaseRef.child("notifications");
  console.log('notes ref', notesRef);
  notesRef.push(note).then((res) => {
    console.log('res', {res})
    return;
  }).catch((err) => {
    console.log('err', err)
  })
}

export function joinGame({gameId, playerId, player}){
  const UID = Firebase.auth().currentUser.uid;
  return async(dispatch) => {
    const hasJoined = await checkIfJoinedGame({userId: UID, gameId});
    if(hasJoined){
      return FirebaseRef.child(`games/${gameId}/player-list/${UID}`).remove().then(() => {
        return dispatch({
          type: 'GAME_UNRESERVED',
          gameId,
        })
      }).then(() => {
        return FirebaseRef.child(`users/${UID}/games/${gameId}`).remove().then(() => {
          return getReservedGames({id: UID});
        })
      });
    }

    return  FirebaseRef.child(`games/${gameId}/player-list`).update({[UID]: player}).then(() => {
      return dispatch({
        type: 'GAME_RESERVED',
        gameId,
      })
    }).then(() => {
        return FirebaseRef.child(`users/${UID}/games`).update({[gameId]: true}).then(() => {
          return getReservedGames({id: UID});
        })
      });
  }
}


function checkIfJoinedGame({userId, gameId}){
  let snap;
  FirebaseRef.child(`games/${gameId}/player-list/${userId}`).once('value', (snapshot) => {
    snap = snapshot.val();
  });
  return snap !== null;
}

export function getReservedGames({id}){
 if (Firebase === null) return () => new Promise(resolve => resolve());
  return async(dispatch) => {
    return FirebaseRef.child(`users/${id}/games/`).once('value', (snapshot) => {
      const games = snapshot.val();
      return dispatch({
        type: 'USER_GAMES',
        userGames: games
      })
    });
  }
}

export function getPlayers({gameId}){
  let players;

  FirebaseRef.child(`games/${gameId}/player-list`).once('value', (snapshot) => {
    players = snapshot.val();
  });

  players = Object.keys(players).map((key, idx) => {
    return players[key];
  })
  return (dispatch) => {
    return dispatch({
      type: 'AVAILABLE_PLAYERS',
      players,
    })
  }
}

export function getAllPlayers(){
  let players;

  FirebaseRef.child(`users`).once('value', (snapshot) => {
    players = snapshot.val();
  });

  players = Object.keys(players).map((key, idx) => {
    return players[key];
  })
  return (dispatch) => {
    return dispatch({
      type: 'ALL_PLAYERS',
      allPlayers,
    })
  }
}

function loadPlayers(players, cb) {
  Promise.all(
    players.map(id => {
      return FirebaseRef.child(`users/${id}`).once('value')
      .then(snapshot => {
        console.log('snapshot', snapshot)
        return snapshot
      })
    })
  ).then(res => cb(res));
}
