import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

/* Firebase configuration and get token from firebase 
for the particular user browser to send push noification */

const firebaseConfig = {
  apiKey: "AIzaSyCZ_o6xXiQu7dcJFYk2D7FZTmVzA3A9STY",
  authDomain: "infiniti-ec1f2.firebaseapp.com",
  projectId: "infiniti-ec1f2",
  storageBucket: "infiniti-ec1f2.appspot.com",
  messagingSenderId: "523394247977",
  appId: "1:523394247977:web:6391ba74ce7b6b2dbe9b38",
  measurementId: "G-WNPG5K8FND"
};
/* Initialize Firebase */
const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);
const analytics = getAnalytics(firebaseApp);

// Requesting token from the firebase
export const reqToken = () => {
  return getToken(messaging, {
    vapidKey: 'BHBHN2-y0HM52OJq-SWfzU22HGV-byKm_Q8a5bk3oaN41Hu5Hj9uZ9J9a53iNRZKn7W78GkYlxrr-28ZxPjGcEk'
  })
    .then((currentToken: any) => {
      if (currentToken) {
        console.log('current token for client: ', currentToken);
        // if (!localStorage.getItem('token')) {
        //   localStorage.setItem('token', JSON.stringify(currentToken));
        // }
        return currentToken;
      } else {
        console.log('No registration token available. Request permission to generate one.');
        // shows on the UI that permission is required
        throw new Error('No registration token available.');
      }
    })
    .catch((err: any) => {
      console.log('An error occurred while retrieving token. ', err);
      // catch error while creating client token
      throw err;
    });
};
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
