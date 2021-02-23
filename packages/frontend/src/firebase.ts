import firebase from "firebase/app";
import "firebase/auth";

if (firebase.apps.length === 0) {
  firebase.initializeApp({
    apiKey: "AIzaSyBcQ4ThxNMRHlZ_x7qp5_emSShsD_TOJNs",
    authDomain: "meetnomoreapp.firebaseapp.com",
    databaseURL: "https://meetnomoreapp.firebaseio.com",
    projectId: "meetnomoreapp",
    storageBucket: "meetnomoreapp.appspot.com",
    messagingSenderId: "382181601047",
    appId: "1:382181601047:web:23351ce1daa720b06f1152",
  });
}

export default firebase;
