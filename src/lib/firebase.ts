import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const rawApiKey = (import.meta.env.VITE_FIREBASE_API_KEY || '').trim();
const rawProjectId = (import.meta.env.VITE_FIREBASE_PROJECT_ID || '').trim();
const rawAuthDomain = (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '').trim();
const rawStorageBucket = (import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '').trim();
const rawMessagingSenderId = (import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '').trim();
const rawAppId = (import.meta.env.VITE_FIREBASE_APP_ID || '').trim();

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
