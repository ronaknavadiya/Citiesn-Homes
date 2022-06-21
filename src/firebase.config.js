import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_VLM_9YEY94ybAYdqXdP3bg9W7rfzD28",
  authDomain: "citiesn-homes.firebaseapp.com",
  projectId: "citiesn-homes",
  storageBucket: "citiesn-homes.appspot.com",
  messagingSenderId: "214638441709",
  appId: "1:214638441709:web:6abac2b49e552792ef08e4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getFirestore();
