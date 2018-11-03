import moment from 'moment';
import { Firebase, FirebaseRef } from '../lib/firebase';

export function getGames() {
  if (Firebase === null) return () => new Promise(resolve => resolve());
  const ref = FirebaseRef.child('games');
  return dispatch => ref.on('value', (snapshot) => {
    const games = snapshot.val() || {};
    return dispatch({
      type: 'GAMES_REPLACE',
      games,
    });
  });
}

export function createGame({ location, day, time }) {
  if (Firebase === null) return () => new Promise(resolve => resolve());
  const gamesRef = FirebaseRef.child('games');
  return (dispatch) => {
    gamesRef.push({ day, time, location }).then((res) => {
      const note = {
        note: `New game at ${location} on ${day} ${time}`,
      };
      return addNote(note);
    }).then(res => getGames()).catch((err) => {
      console.log('err', err);
    });
  };
}

export function addNote(note) {
  if (Firebase === null) return () => new Promise(resolve => resolve());
  const notesRef = FirebaseRef.child('notifications');
  console.log('notes ref', notesRef);
  notesRef.push(note).then((res) => {
    console.log('res', { res });
  }).catch((err) => {
    console.log('err', err);
  });
}

export function joinGame({ gameId, playerId, player }) {
  const UID = Firebase.auth().currentUser.uid;
  return async (dispatch) => {
    const hasJoined = await checkIfJoinedGame({ userId: UID, gameId });
    if (hasJoined) {
      return FirebaseRef.child(`games/${gameId}/player-list/${UID}`).remove().then(() => dispatch({
        type: 'GAME_UNRESERVED',
        gameId,
      })).then(() => FirebaseRef.child(`users/${UID}/games/${gameId}`).remove().then(() => getReservedGames({ id: UID })));
    }

    return FirebaseRef.child(`games/${gameId}/player-list`).update({ [UID]: player }).then(() => dispatch({
      type: 'GAME_RESERVED',
      gameId,
    })).then(() => FirebaseRef.child(`users/${UID}/games`).update({ [gameId]: true }).then(() => getReservedGames({ id: UID })));
  };
}


function checkIfJoinedGame({ userId, gameId }) {
  let snap;
  FirebaseRef.child(`games/${gameId}/player-list/${userId}`).once('value', (snapshot) => {
    snap = snapshot.val();
  });
  return snap !== null;
}

export function getReservedGames({ id }) {
  if (Firebase === null) return () => new Promise(resolve => resolve());
  return async dispatch => FirebaseRef.child(`users/${id}/games/`).once('value', (snapshot) => {
    const games = snapshot.val();
    return dispatch({
      type: 'USER_GAMES',
      userGames: games,
    });
  });
}

export function getPlayers({ gameId }) {
  let players;

  FirebaseRef.child(`games/${gameId}/player-list`).once('value', (snapshot) => {
    players = snapshot.val();
  });

  players = Object.keys(players).map((key, idx) => players[key]);
  return dispatch => dispatch({
    type: 'AVAILABLE_PLAYERS',
    players,
  });
}

export function getAllPlayers() {
  let players;
  return async (dispatch) => {
    let players = await FirebaseRef.child('users').once('value', snapshot => snapshot.val());
    console.log('players.val', players.val());
    players = Object.keys(players.val()).map((key, idx) => {
      const playersObj = players.val();
      return playersObj[key];
    });
    // console.log('players', players)
    return dispatch({
      type: 'ALL_PLAYERS',
      allPlayers: players,
    });
  };
}

function loadPlayers(players, cb) {
  Promise.all(players.map(id => FirebaseRef.child(`users/${id}`).once('value')
    .then((snapshot) => {
      console.log('snapshot', snapshot);
      return snapshot;
    }))).then(res => cb(res));
}

export function makeTeams({
  red, black, white, gameId,
}) {
  // send to Firebase and send notification with link to teams
  return async dispatch => FirebaseRef.child(`games/${gameId}/`).update({ teams: { red, black, white } }).then(() => dispatch({
    type: 'TEAMS_CREATED',
  }));
}

export function getTeams({ gameId }) {
  let teams;
  return (dispatch) => {
    FirebaseRef.child(`games/${gameId}/teams`).once('value', snapshot => snapshot.val()).then((teams) => {
      const processedTeams = snapshotToArray(teams);
      return dispatch({
        type: 'TEAMS_RECEIVED',
        teams: processedTeams,
      });
    });
  };
}

function snapshotToArray(snapshot) {
  const returnArr = [];
  snapshot.forEach((childSnapshot) => {
    const item = childSnapshot.val();
    const key = childSnapshot.key;
    returnArr.push({ [key]: item });
  });
  return returnArr;
}

