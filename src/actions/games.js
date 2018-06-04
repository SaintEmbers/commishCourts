import { Firebase, FirebaseRef } from '../lib/firebase';

/**
  * Get this User's Favourite Recipes
  */
export function getGames() {
 if (Firebase === null) return () => new Promise(resolve => resolve());

  // const UID = Firebase.auth().currentUser.uid;
  // if (!UID) return false;
  // console.log('dispatch', dispatch)

  const ref = FirebaseRef.child(`games`);
  return(dispatch) => {
    return ref.on('value', (snapshot) => {
      const games = snapshot.val() || {};
      console.log('games', games)
      return dispatch({
        type: 'GAMES_REPLACE',
        games,
      });
    });

  }
}

/**
  * Reset a User's Favourite Recipes in Redux (eg for logou)
  */
// export function resetFavourites(dispatch) {
//   return dispatch({
//     type: 'FAVOURITES_REPLACE',
//     data: [],
//   });
// }

/**
  * Update My Favourites Recipes
  */
// export function replaceFavourites(newFavourites) {
//   if (Firebase === null) return () => new Promise(resolve => resolve());

//   const UID = Firebase.auth().currentUser.uid;
//   if (!UID) return false;

//   return () => FirebaseRef.child(`favourites/${UID}`).set(newFavourites);
// }

// *
//   * Get Meals
  
// export function getMeals() {
//   if (Firebase === null) return () => new Promise(resolve => resolve());

//   return dispatch => new Promise((resolve, reject) => FirebaseRef
//     .child('meals').once('value')
//     .then((snapshot) => {
//       const meals = snapshot.val() || {};

//       return resolve(dispatch({
//         type: 'MEALS_REPLACE',
//         data: meals,
//       }));
//     }).catch(reject)).catch(e => console.log(e));
// }

/**
  * Set an Error Message
  */
// export function setError(message) {
//   return dispatch => new Promise(resolve => resolve(dispatch({
//     type: 'RECIPES_ERROR',
//     data: message,
//   })));
// }

/**
  * Get Recipes
  */
// export function getRecipes() {
//   if (Firebase === null) return () => new Promise(resolve => resolve());

//   return dispatch => new Promise(resolve => FirebaseRef.child('recipes')
//     .on('value', (snapshot) => {
//       const recipes = snapshot.val() || {};

//       return resolve(dispatch({
//         type: 'RECIPES_REPLACE',
//         data: recipes,
//       }));
//     })).catch(e => console.log(e));
// }
