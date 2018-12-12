

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fetch = require('node-fetch');
const stripe = require('stripe')(functions.config().stripe.token);
const logging = require('@google-cloud/logging')();

const currency = functions.config().stripe.currency || 'USD';

admin.initializeApp(functions.config().firebase);

/**
  * Listens for updates to /users/:userId and creates an
  * full name attribute based on the first and last names
  */

// exports.buyGames = functions.database.ref('users/{id}').onChange(())

exports.sendPushNotification = functions.database.ref('users/{id}').onCreate((event) => {
  const { root } = event.data.ref;
  const messages = [];

  return root.child('/users').once('value').then((snapshot) => {
    snapshot.forEach((childSnapshot) => {
      const { expoToken } = childSnapshot.val();

      if (expoToken) {
        messages.push({
          to: expoToken,
          title: 'YO',
          body: 'this is a message bru',
        });
      }
      return Promise.all(messages);
    });
  }).then((notifications) => {
    fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notifications),
    });
  });
});

exports.cleanUserData = functions.database.ref('/users/{userId}').onWrite((event) => {
  console.log('Making Full Name for UserID:', event.params.userId);

  // Get the first and last names
  const firstName = event.data._newData.firstName || '';
  const lastName = event.data._newData.lastName || '';

  const userData = {
    fullName: `${firstName} ${lastName}`,
  };

  // Add Role if it doesn't already exist
  if (event && event.data && event.data._data && !event.data._newData.role) {
    userData.role = 'user';
  }

  return event.data.ref.update(userData);
});

/**
  * Listens for user deletion and
  * - deletes the user's reference in the database
  */
exports.deleteUserData = functions.auth.user().onDelete((event) => {
  const uid = event.data.uid;
  return admin.database().ref(`/users/${uid}`).remove();
});

// function getCardToken(UID) {
//   return admin.database().ref(`/stripe_customers/${UID}/sources/credit-card`)
//     .once('value').then((snapshot) => {
//       snapshot.forEach((childSnapshot) => {
//         const key = childSnapshot.key;
//         const childData = childSnapshot.val();
//         console.log('keys', { key, childData });
//         return childData.token;
//       });
//     });
// }

// [START chargecustomer]
// Charge the Stripe customer whenever an amount is written to the Realtime database
exports.createStripeCharge = functions.database.ref('/stripe_customers/{userId}/charges/{id}')
  .onCreate((snap, context) => {
    const chargeAmount = snap.val();
    // Look up the Stripe customer id written in createStripeCustomer
    return admin.database().ref(`/stripe_customers/${context.params.userId}/sources/credit-card`)
      .once('value')
      .then((snapshot) => {
        let creditToken;
        snapshot.forEach((childSnapshot) => {
          const { key } = childSnapshot;
          const childData = childSnapshot.val();
          creditToken = childData.token;
        });
        return { chargeAmount, creditToken };
      })
      .then((payload) => {
        const customer = admin.database().ref(`/stripe_customers/${context.params.userId}/customer_id`)
          .once('value').then((snapshot) => {
            const { chargeAmount, creditToken } = payload;
            const customerId = snapshot.val();
            return { chargeAmount, creditToken, customerId };
          });
        return customer;
      })
      .then((payload) => {
        const { chargeAmount, customerId, creditToken } = payload;
        const idempotencyKey = context.params.id;
        const charge = {
          customer: customerId, amount: chargeAmount.charge, currency,
        };

        return stripe.charges.create(charge, { idempotency_key: idempotencyKey });
      })
      .then((response) => {
        // If the result is successful, write it back to the database
        snap.ref.set(response);
      })
      .catch(error =>
      // We want to capture errors and render them in a user-friendly way, while
      // still logging an exception with StackDriver
        snap.ref.child('error').set(userFacingMessage(error)))
      .then(() => reportError(error, { user: context.params.userId }));
  });
// [END chargecustomer]]

// When a user is created, register them with Stripe
exports.createStripeCustomer = functions.auth.user().onCreate(user => stripe.customers.create({
  email: user.email,
}).then(customer => admin.database().ref(`/stripe_customers/${user.uid}/customer_id`).set(customer.id)));

// Add a payment source (card) for a user by writing a stripe payment source token to Realtime database
exports.addPaymentSource = functions.database
  .ref('/stripe_customers/{userId}/sources/credit-card/{pushId}/token').onWrite((change, context) => {
    const source = change.after.val();
    console.log('add payment source2', source);

    if (source === null) {
      return null;
    }
    return admin.database().ref(`/stripe_customers/${context.params.userId}/customer_id`)
      .once('value').then(snapshot => snapshot.val())
      .then((customer) => {
        console.log('customer', customer);
        return stripe.customers.createSource(customer, { source: 'tok_visa' });
      })
      .then((response) => {
        console.log('create source response', response);
        return stripe.customers.listCards(customer);
      })
      .then(response => change.after.ref.parent.set(response), error => change.after.ref.parent.child('error').set(userFacingMessage(error)))
      .then(() => reportError(error, { user: context.params.userId }));
  });

// When a user deletes their account, clean up after them
exports.cleanupUser = functions.auth.user().onDelete(user => admin.database().ref(`/stripe_customers/${user.uid}`).once('value').then(snapshot => snapshot.val())
  .then(customer => stripe.customers.del(customer.customer_id))
  .then(() => admin.database().ref(`/stripe_customers/${user.uid}`).remove()));

// To keep on top of errors, we should raise a verbose error report with Stackdriver rather
// than simply relying on console.error. This will calculate users affected + send you email
// alerts, if you've opted into receiving them.
// [START reporterror]
function reportError(err, context = {}) {
  // This is the name of the StackDriver log stream that will receive the log
  // entry. This name can be any valid log stream name, but must contain "err"
  // in order for the error to be picked up by StackDriver Error Reporting.
  const logName = 'errors';
  const log = logging.log(logName);

  // https://cloud.google.com/logging/docs/api/ref_v2beta1/rest/v2beta1/MonitoredResource
  const metadata = {
    resource: {
      type: 'cloud_function',
      labels: { function_name: process.env.FUNCTION_NAME },
    },
  };

  // https://cloud.google.com/error-reporting/reference/rest/v1beta1/ErrorEvent
  const errorEvent = {
    message: err.stack,
    serviceContext: {
      service: process.env.FUNCTION_NAME,
      resourceType: 'cloud_function',
    },
    context,
  };

  // Write the error log entry
  return new Promise((resolve, reject) => {
    log.write(log.entry(metadata, errorEvent), (error) => {
      if (error) {
        return reject(error);
      }
      return resolve();
    });
  });
}
// [END reporterror]

// Sanitize the error message for the user
function userFacingMessage(error) {
  return error.type ? error.message : 'An error occurred, developers have been alerted';
}

