/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/9.13.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.13.0/firebase-analytics-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.13.0/firebase-messaging-compat.js');
// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyCZ_o6xXiQu7dcJFYk2D7FZTmVzA3A9STY",
  authDomain: "infiniti-ec1f2.firebaseapp.com",
  projectId: "infiniti-ec1f2",
  storageBucket: "infiniti-ec1f2.appspot.com",
  messagingSenderId: "523394247977",
  appId: "1:523394247977:web:6391ba74ce7b6b2dbe9b38",
  measurementId: "G-WNPG5K8FND"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
firebase.analytics.isSupported().then((isSupported) => {
  if (isSupported) {
    const analytics = firebase.analytics();
  }
});
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body
  };

  window.self.registration.showNotification(notificationTitle, notificationOptions);
});
