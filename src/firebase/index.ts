'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';
import { firebaseConfig } from './config';

/**
 * Initializes Firebase with specific settings for cross-device real-time sync.
 * We use experimentalForceLongPolling to bypass mobile network restrictions.
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
    // Force Long Polling to prevent connectivity issues on restricted networks.
    // This ensures data travels from one phone to the cloud and then to the other phone reliably.
    db = initializeFirestore(app, {
      experimentalForceLongPolling: true,
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager()
      })
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
