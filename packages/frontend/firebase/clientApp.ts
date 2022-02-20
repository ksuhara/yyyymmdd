import { initializeApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
export const createFirebaseApp = () => {
  const clientCredentials = {
    apiKey: "AIzaSyAKbJIu0kjND_cS7sad0OoFEuRVmaLbBSI",
    authDomain: "yyyymmdd-dev.firebaseapp.com",
    projectId: "yyyymmdd-dev",
    storageBucket: "yyyymmdd-dev.appspot.com",
    messagingSenderId: "447739318866",
    appId: "1:447739318866:web:70b51b6a39e95af992058b",
  };

  if (getApps().length <= 0) {
    const app = initializeApp(clientCredentials);
    // Check that `window` is in scope for the analytics module!
    if (typeof window !== "undefined") {
      // Enable analytics. https://firebase.google.com/docs/analytics/get-started
      if ("measurementId" in clientCredentials) {
        getAnalytics();
      }
    }
    return app;
  }
};
