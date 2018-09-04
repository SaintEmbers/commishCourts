import Store from '../store/games';

export const initialState = Store;

export default function gamesReducer(state = initialState, action) {
  console.log('games players list reducers', action.players)
  switch (action.type) {
    case 'GAMES_REPLACE': {
      return {
        ...state,
        games: action.games || [],
      };
    }
    case 'AVAILABLE_PLAYERS': {
      return{
        ...state,
        players: action.players || {},
      };
    }
    default:
      return state;
  }
}
