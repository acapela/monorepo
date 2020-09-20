import admin from 'firebase-admin';
import { FIREBASE_DATABASE_URL } from './config';

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: FIREBASE_DATABASE_URL,
});
