
'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore, initializeFirestore, terminate } from 'firebase/firestore';
import { firebaseConfig } from './config';

/**
 * Initializes Firebase with specific settings for maximum connectivity.
 * We use Long Polling to bypass firewall restrictions on mobile networks.
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
    // Force Long Polling to prevent "Could not reach backend" errors on mobile data.
    // This ensures data travels from your phone to the cloud reliably.
    db = initializeFirestore(app, {
      experimentalForceLongPolling: true,
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
