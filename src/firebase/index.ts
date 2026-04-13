'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore, initializeFirestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

/**
 * Initializes Firebase with specific settings for robustness.
 * experimentalForceLongPolling: true is enabled to bypass network restrictions 
 * that often cause "Could not reach Cloud Firestore backend" errors on many mobile networks.
 */
export function initializeFirebase(): { app: FirebaseApp; auth: Auth; db: Firestore } {
  let app: FirebaseApp;
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  
  const auth = getAuth(app);
  
  let db: Firestore;
  try {
    // Force Long Polling to prevent "Could not reach backend" errors on restricted networks
    // This is critical for cross-device visibility on mobile data/WiFi.
    db = initializeFirestore(app, {
      experimentalForceLongPolling: true,
      useFetchStreams: false 
    });
  } catch (e) {
    db = getFirestore(app);
  }

  return { app, auth, db };
}

export * from './provider';
export * from './auth/use-user';
export * from './firestore/use-collection';
export * from './firestore/use-doc';