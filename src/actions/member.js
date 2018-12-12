import ErrorMessages from '../constants/errors';
import statusMessage from './status';
import { Firebase, FirebaseRef } from '../lib/firebase';
import { Permissions, Notifications } from 'expo';
import fetch from 'cross-fetch';
/**
  * Sign Up to Firebase
  */

export function signUp(formData) {
  const {
    email,
    password,
    password2,
    firstName,
    lastName,
  } = formData;

  return dispatch => new Promise(async (resolve, reject) => {
    // Validation checks
    if (!firstName) return reject({ message: ErrorMessages.missingFirstName });
    if (!lastName) return reject({ message: ErrorMessages.missingLastName });
    if (!email) return reject({ message: ErrorMessages.missingEmail });
    if (!password) return reject({ message: ErrorMessages.missingPassword });
    if (!password2) return reject({ message: ErrorMessages.missingPassword });
    if (password !== password2) return reject({ message: ErrorMessages.passwordsDontMatch });

    await statusMessage(dispatch, 'loading', true);

    // Go to Firebase
    return Firebase.auth()
      .createUserWithEmailAndPassword(email, password)
      .then((res) => {
        // Send user details to Firebase database
        if (res && res.uid) {
          FirebaseRef.child(`users/${res.uid}`).set({
            firstName,
            lastName,
            signedUp: Firebase.database.ServerValue.TIMESTAMP,
            lastLoggedIn: Firebase.database.ServerValue.TIMESTAMP,
            isCommish: false,
          }).then(() => statusMessage(dispatch, 'loading', false).then(resolve));
        }
      })
      .then(() => {
        const userId = Firebase.auth().currentUser.uid;
        const stripeRef = FirebaseRef.child(`/stripe_customers/${userId}/customer_id`);
      })
      .catch(reject);
  }).catch(async (err) => { await statusMessage(dispatch, 'error', err.message); throw err.message; });
}

/**
  * Get this User's Details
  */
function getUserData(dispatch) {
  const UID = (
    FirebaseRef
    && Firebase
    && Firebase.auth()
    && Firebase.auth().currentUser
    && Firebase.auth().currentUser.uid
  ) ? Firebase.auth().currentUser.uid : null;

  if (!UID) return false;

  const ref = FirebaseRef.child(`users/${UID}`);

  return ref.on('value', (snapshot) => {
    const userData = snapshot.val() || [];
    return dispatch({
      type: 'USER_DETAILS',
      data: userData,
      profile: userData.profile,
    });
  });
}

export function getMemberData() {
  if (Firebase === null) return () => new Promise(resolve => resolve());
  // const storageRef = Firebase.storage().ref();

  // Ensure token is up to date
  return dispatch => new Promise((resolve) => {
    Firebase.auth().onAuthStateChanged((loggedIn) => {
      if (loggedIn) {
        return resolve(getUserData(dispatch));
      }
      return () => new Promise(() => resolve());
    });
  });
}

export function saveMemberPhoto({ image }) {
  return dispatch => new Promise(async (resolve, reject) => {
    const response = await fetch(image);
    const blob = await response.blob();
    const ref = Firebase.storage().ref().child('images/my-image');
    return ref.put(blob);
  });
}

export function getMemberPhoto() {
  const storageRef = Firebase.storage().ref();
  return dispatch => new Promise(async (resolve, reject) => {
    storageRef.child('images/my-image').getDownloadURL().then(url => dispatch({
      type: 'USER_PHOTO',
      profilePhoto: url,
    }));
  });
}


/**
  * Login to Firebase with Email/Password
  */
export function login(formData) {
  const {
    email,
    password,
  } = formData;

  return dispatch => new Promise(async (resolve, reject) => {
    await statusMessage(dispatch, 'loading', true);

    // Validation checks
    if (!email) return reject({ message: ErrorMessages.missingEmail });
    if (!password) return reject({ message: ErrorMessages.missingPassword });

    // Go to Firebase
    return Firebase.auth()
      .setPersistence(Firebase.auth.Auth.Persistence.LOCAL)
      .then(() =>
        Firebase.auth()
          .signInWithEmailAndPassword(email, password)
          .then(async (res) => {
            if (res && res.uid) {
              // Update last logged in data
              FirebaseRef.child(`users/${res.uid}`).update({
                lastLoggedIn: Firebase.database.ServerValue.TIMESTAMP,
              });

              // Send verification Email when email hasn't been verified
              if (res.emailVerified === false) {
                Firebase.auth().currentUser
                  .sendEmailVerification()
                  .catch(() => console.log('Verification email failed to send'));
              }

              // Get User Data
              getUserData(dispatch);
            }

            await statusMessage(dispatch, 'loading', false);

            // Send Login data to Redux
            return resolve(dispatch({
              type: 'USER_LOGIN',
              data: res,
            }));
          }).catch(reject));
  }).catch(async (err) => { await statusMessage(dispatch, 'error', err.message); throw err.message; });
}

/**
  * Reset Password
  */
export function resetPassword(formData) {
  const { email } = formData;

  return dispatch => new Promise(async (resolve, reject) => {
    // Validation checks
    if (!email) return reject({ message: ErrorMessages.missingEmail });

    await statusMessage(dispatch, 'loading', true);

    // Go to Firebase
    return Firebase.auth()
      .sendPasswordResetEmail(email)
      .then(() => statusMessage(dispatch, 'loading', false).then(resolve(dispatch({ type: 'USER_RESET' }))))
      .catch(reject);
  }).catch(async (err) => { await statusMessage(dispatch, 'error', err.message); throw err.message; });
}

/**
  * Update Profile
  */
export function updateProfile(formData) {
  const {
    email,
    password,
    password2,
    firstName,
    lastName,
    changeEmail,
    changePassword,
  } = formData;

  return dispatch => new Promise(async (resolve, reject) => {
    // Are they a user?
    const UID = Firebase.auth().currentUser.uid;
    if (!UID) return reject({ message: ErrorMessages.missingFirstName });

    // Validation checks
    if (!firstName) return reject({ message: ErrorMessages.missingFirstName });
    if (!lastName) return reject({ message: ErrorMessages.missingLastName });
    if (changeEmail) {
      if (!email) return reject({ message: ErrorMessages.missingEmail });
    }
    if (changePassword) {
      if (!password) return reject({ message: ErrorMessages.missingPassword });
      if (!password2) return reject({ message: ErrorMessages.missingPassword });
      if (password !== password2) return reject({ message: ErrorMessages.passwordsDontMatch });
    }

    await statusMessage(dispatch, 'loading', true);

    // Go to Firebase
    return FirebaseRef.child(`users/${UID}`).update({ firstName, lastName })
      .then(async () => {
        // Update Email address
        if (changeEmail) {
          await Firebase.auth().currentUser.updateEmail(email).catch(reject);
        }

        // Change the password
        if (changePassword) {
          await Firebase.auth().currentUser.updatePassword(password).catch(reject);
        }

        // Update Redux
        await getUserData(dispatch);
        await statusMessage(dispatch, 'success', 'Profile Updated');
        resolve();
      }).catch(reject);
  }).catch(async (err) => { await statusMessage(dispatch, 'error', err.message); throw err.message; });
}
/**
  * Buy Credits
  */

export function buyCredits({ numCredits }) {
  return dispatch => new Promise(async (resolve, reject) => {
    statusMessage(dispatch, 'success', 'Credits Added');
    const UID = Firebase.auth().currentUser.uid;
    const amount = 1;

    return FirebaseRef.child(`users/${UID}`).update({ credits: 2 });
  });
}

export function evaluationSubmit({ details }) {
  const UID = Firebase.auth().currentUser.uid;
  return dispatch => new Promise(async (resolve, reject) => {
    await FirebaseRef.child(`users/${UID}`).update({ profile: details });
    return dispatch({
      type: 'EVALUATION_COMPLETE',
    });
  });
}

export function getEvaluationDetails() {
  const UID = Firebase.auth().currentUser.uid;
  return dispatch => new Promise(async (resolve, reject) => {
    const details = await FirebaseRef.child(`users/${UID}/profile`).once('value');
    resolve(dispatch({
      type: 'USER_EVALUATION',
      details,
    }));
  });
}
/**
  * Logout
  */
export function logout() {
  return dispatch => new Promise((resolve, reject) => {
    Firebase.auth().signOut()
      .then(() => {
        dispatch({ type: 'USER_RESET' });
        setTimeout(resolve, 1000); // Resolve after 1s so that user sees a message
      }).catch(reject);
  }).catch(async (err) => { await statusMessage(dispatch, 'error', err.message); throw err.message; });
}

export function addPlayerNote(note, uid) {
  if (Firebase === null) return () => new Promise(resolve => resolve());
  const notesRef = FirebaseRef.child(`users/${uid}/profile/notes`);
  return dispatch => new Promise((resolve, reject) => {
    notesRef.push(note).then((res) => {
      console.log('res', { res });
      return dispatch({
        type: 'USER_NOTE',
      });
    }).catch((err) => {
      console.log('err', err);
    });
  });
}

export function resetNote(note) {
  return dispatch => new Promise((resolve, reject) => dispatch({
    type: 'USER_NOTE_ADDED',
  })).catch((err) => {
    console.log('err', err);
  });
}

export function updateList({ list, uid }) {
  const profileRef = FirebaseRef.child(`users/${uid}/profile/list`);
  return dispatch => new Promise(async (resolve, reject) => {
    await profileRef.update({ list });
    resolve(dispatch({
      type: 'LIST_UPDATE_SUCCESS',
    }));
  });
}

export function addPaymentSource({ token, type }) {
  const UID = Firebase.auth().currentUser.uid;
  const stripeRef = FirebaseRef.child(`/stripe_customers/${UID}/sources/${type}`);

  return dispatch => new Promise(async (resolve, reject) => {
    await stripeRef.push({ token });

    resolve(dispatch({
      type: 'UPDATED_TOKEN',
    }));
  });
}


export function makePayment({ amount }) {
  const UID = Firebase.auth().currentUser.uid;
  const stripeRef = FirebaseRef.child(`/stripe_customers/${UID}/charges/`);
  const charge = amount * 500;
  console.log('charge', { charge, stripeRef });
  return dispatch => new Promise(async (resolve, reject) => {
    await stripeRef.push({ charge });
    resolve(dispatch({
      type: 'SUCCESSFUL_CHARGE',
    }));
  });
}

export function checkPaymentSource() {
  const UID = Firebase.auth().currentUser.uid;
  return dispatch => new Promise(async (resolve, reject) => {
    const stripeRef = await FirebaseRef.child(`/stripe_customers/${UID}/sources/`).once('value');
    console.log('stripe_ref', stripeRef.val() != null);

    const hasPaymentMethod = stripeRef.val() != null;
    console.log('hasPaymentMethod', hasPaymentMethod);
    resolve(dispatch({
      type: 'STORED_CARD',
      hasPaymentMethod,
    }));
  });
}
