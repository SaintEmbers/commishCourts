import Store from '../store/member';

export const initialState = Store;

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case 'USER_LOGIN': {
      if (action.data) {
        return {
          ...state,
          loading: false,
          error: null,
          uid: action.data.uid,
          email: action.data.email,
          emailVerified: action.data.emailVerified,
        };
      }
      return initialState;
    }
    case 'USER_DETAILS': {
      if (action.data) {
        return {
          ...state,
          loading: false,
          error: null,
          firstName: action.data.firstName,
          lastName: action.data.lastName,
          signedUp: action.data.signedUp,
          role: action.data.role,
          isCommish: action.data.isCommish,
          profile: action.profile,
        };
      }
      return initialState;
    }
    case 'ALL_USERS': {
      return {
        ...state,
        allPlayers: actions.users
      }
    }
    case 'USER_PHOTO': {
      return {
        ...state,
        profilePhoto: action.profilePhoto,
      }
    }
    case 'USER_ERROR': {
      if (action.data) {
        return {
          ...state,
          loading: false,
          error: action.data,
        };
      }
      return initialState;
    }
    case 'USER_RESET': {
      return initialState;
    }
    case 'EVALUATION_COMPLETE':{
      return {
        ...state,
        evalComplete: true,
      }
    }
    case 'USER_NOTE':{
      return{
        ...state,
        noteAdded: true,
      }
    }
    case 'USER_NOTE_ADDED':{
      return{
        ...state,
        noteAdded: false,
      }
    }
    default:
      return state;
  }
}
