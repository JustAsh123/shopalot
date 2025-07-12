// src/context/AuthContext.js
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase.js";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

// Create context
const AuthContext = createContext();

// Provider component
export function AuthProvider({ children }) {
  const [currentUser , setCurrentUser ] = useState(null);
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [isDark, setIsDark] = useState(() => localStorage.getItem("isDark") === "true");

  const onThemeChange = () => {
    setIsDark(prevIsDark => {
      const newIsDark = !prevIsDark;
      localStorage.setItem("isDark", newIsDark);
      return newIsDark;
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser (user);
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setUsername(snap.data().username);
          setUserData(snap.data());
        } else {
          setUsername(null);
        }
      } else {
        setUsername(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser , username, userData, setUserData, onThemeChange, isDark }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Custom hook
export function useAuth() {
  return useContext(AuthContext);
}
screenX