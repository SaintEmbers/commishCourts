import Store from '../store/games';

export const initialState = Store;

export default function gamesReducer(state = initialState, action) {
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
    case 'TEAMS_RECEIVED': {
      return{
        ...state,
        teams: action.teams || {},
      };
    }
    case 'ALL_PLAYERS': {
      return {
        ...state,
        allPlayers: action.allPlayers || [],
      }
    }
    default:
      return state;
  }
}
