import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDEGZqxK0I24sMEGE7Fzjum2xYWOvnlQNk",
  authDomain: "final-project-telerik-2fe39.firebaseapp.com",
  projectId: "final-project-telerik-2fe39",
  storageBucket: "final-project-telerik-2fe39.appspot.com",
  messagingSenderId: "549608777847",
  appId: "1:549608777847:web:2c743addf41e9974ebfe72",
  databaseURL: "https://final-project-telerik-2fe39-default-rtdb.europe-west1.firebasedatabase.app/",
};


export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getDatabase(app);

export const storage = getStorage(app);