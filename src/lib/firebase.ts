import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const rawApiKey = (import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDFPC2wyrnRlwdjFseELpMb94XlmfL93_Q').trim();
const rawProjectId = (import.meta.env.VITE_FIREBASE_PROJECT_ID || 'wata-f93c4').trim();
const rawAuthDomain = (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'wata-f93c4.firebaseapp.com').trim();
const rawStorageBucket = (import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'wata-f93c4.firebasestorage.app').trim();
const rawMessagingSenderId = (import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '742957262082').trim();
const rawAppId = (import.meta.env.VITE_FIREBASE_APP_ID || '1:742957262082:web:c9bbfd93e914066aff8e1b').trim();

// Check if valid Firebase configuration is present
export const isFirebaseConfigured = Boolean(
  rawApiKey &&
  rawApiKey !== '' &&
  rawApiKey !== 'undefined' &&
  rawApiKey !== 'null' &&
  rawProjectId &&
  rawProjectId !== '' &&
  rawProjectId !== 'undefined' &&
  rawProjectId !== 'null'
);

const firebaseConfig = {
  apiKey: rawApiKey,
  authDomain: rawAuthDomain,
  projectId: rawProjectId,
  storageBucket: rawStorageBucket,
  messagingSenderId: rawMessagingSenderId,
  appId: rawAppId,
};

let appInstance: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;
let storageInstance: FirebaseStorage | null = null;

if (isFirebaseConfigured) {
  try {
    appInstance = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    authInstance = getAuth(appInstance);
    dbInstance = getFirestore(appInstance);
    storageInstance = getStorage(appInstance);
  } catch (error) {
    console.warn('[Firebase] Initialization skipped or encountered an error:', error);
  }
}

// Export instances or null if unconfigured
export const app = appInstance as FirebaseApp;
export const auth = authInstance as Auth;
export const db = dbInstance as Firestore;
export const storage = storageInstance as FirebaseStorage;

export default app;
