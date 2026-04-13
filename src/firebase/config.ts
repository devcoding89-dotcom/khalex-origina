
/**
 * TO LINK YOUR APP TO FIREBASE:
 * 
 * 1. Go to Firebase Console (https://console.firebase.google.com/)
 * 2. Click your Project -> Project Settings
 * 3. Scroll down to "Your apps" and click the Web icon (</>)
 * 4. Register the app (e.g. name it "KHALEX Hub")
 * 5. Copy the 'firebaseConfig' object provided by Google.
 * 6. Replace EVERYTHING in the curly braces below with your actual data.
 * 
 * IMPORTANT: If you see "auth/invalid-api-key" errors, it means 
 * you have not replaced the placeholder values below with your real keys.
 */
export const firebaseConfig = {
  apiKey: "api-key-placeholder",
  authDomain: "project-id.firebaseapp.com",
  projectId: "project-id",
  storageBucket: "project-id.appspot.com",
  messagingSenderId: "sender-id",
  appId: "app-id"
};
