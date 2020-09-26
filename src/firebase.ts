import admin from 'firebase-admin';
import config from 'config';

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: config.get('firebase.databaseUrl'),
});
