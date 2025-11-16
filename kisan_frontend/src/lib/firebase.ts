// src/lib/firebase.ts
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

declare global {
  interface Window {
    recaptchaVerifier: any;
    confirmationResult: any;
  }
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();

export const initRecaptcha = () => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "recaptcha-container",
      { size: "invisible" }
    );

    window.recaptchaVerifier.render().catch(() => {});
  }
  return window.recaptchaVerifier;
};

export const sendOtpPhone = (phone: string, verifier: any) => {
  return auth.signInWithPhoneNumber(phone, verifier);
};
