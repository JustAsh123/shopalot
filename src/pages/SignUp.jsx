import { Toaster, toast } from "react-hot-toast";
import {
  BookOpen,
  CircleUser,
  Mail,
  Key,
  RotateCcwKey,
  Eye,
  EyeOff,
} from "lucide-react";
import { useState } from "react";
import { auth, db } from "../firebase/firebase.js";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useAuth } from "../context/useAuth.jsx";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [showPw, setShowPw] = useState(false);
  const { isDark } = useAuth();
  const [un, setUn] = useState("");
  const [em, setEm] = useState("");
  const [pw, setPw] = useState("");
  const [cpw, setCpw] = useState("");
  const navigate = useNavigate();

  const validateFormData = async () => {
    if (
      un.trim() === "" ||
      em.trim() === "" ||
      pw.trim() === "" ||
      cpw.trim() === ""
    ) {
      toast.error("Fill all the fields");
      return false;
    }
    if (
      !em.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    ) {
      toast.error("Enter a valid E-mail.");
      return false;
    }
    if (pw !== cpw) {
      toast.error("Passwords do not match");
      return false;
    }

    const q = query(collection(db, "users"), where("username", "==", un));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      toast.error("Username already taken");
      return false;
    }
    return true;
  };

  const createUser = async (e) => {
    e.preventDefault();
    if (!(await validateFormData())) {
      return;
    }
    try {
      const userCred = await createUserWithEmailAndPassword(auth, em, pw);
      await setDoc(doc(db, "users", userCred.user.uid), {
        username: un,
        email: em,
        isAdmin: false,
        phoneNumber: "",
        uid: userCred.user.uid,
      });
      toast.success("Account Created Successfully");
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <>
      <Toaster />
      <div
        className={`flex flex-row justify-center lg:items-center text-center h-screen ${
          isDark ? "bg-gray-900" : ""
        }`}
      >
        <div className="sm:flex-1 flex flex-col items-center text-center justify-center">
          <p
            className={`flex flex-row items-center gap-4 text-4xl ${
              isDark ? "text-pink-300" : "text-lime-800"
            }`}
          >
            <BookOpen size={48} /> Create an Account
          </p>
          <p
            className={`text-md ${
              isDark ? "text-pink-200" : "text-lime-800"
            } mb-6`}
          >
            Join the up and coming shopping platform Shop-a-lot for amazing
            deals and fast deliveries
          </p>

          <div className="flex flex-col gap-2 w-100 items-center">
            <label
              className={`input w-full ${isDark ? "bg-slate-800" : "bg-white"}`}
            >
              <CircleUser />
              <input
                type="text"
                onChange={(e) => setUn(e.target.value)}
                autoComplete="new-username"
                placeholder="Username"
                className={`text-xl ${
                  isDark ? "bg-gray-800 text-white" : "bg-white"
                }`}
              />
            </label>
            <label
              className={`input w-full ${isDark ? "bg-slate-800" : "bg-white"}`}
            >
              {" "}
              <Mail />
              <input
                type="text"
                onChange={(e) => setEm(e.target.value)}
                autoComplete="new-email"
                placeholder="Email"
                className={`text-xl ${isDark ? "bg-gray-800 text-white" : ""}`}
              />
            </label>
            <label
              className={`input w-full ${isDark ? "bg-slate-800" : "bg-white"}`}
            >
              {" "}
              <Key />
              <input
                type={showPw ? "text" : "password"}
                onChange={(e) => setPw(e.target.value)}
                autoComplete="new-password"
                placeholder="Password"
                className={`text-xl ${isDark ? "bg-gray-800 text-white" : ""}`}
              />
              <p
                onClick={() => setShowPw(!showPw)}
                className="hover:cursor-pointer"
              >
                {!showPw ? <Eye /> : <EyeOff />}
              </p>
            </label>
            <label
              className={`input w-full ${isDark ? "bg-slate-800" : "bg-white"}`}
            >
              {" "}
              <RotateCcwKey />
              <input
                type={showPw ? "text" : "password"}
                onChange={(e) => setCpw(e.target.value)}
                autoComplete="new-password"
                placeholder="Confirm Password"
                className={`text-xl ${isDark ? "bg-gray-800 text-white" : ""}`}
              />
              <p
                onClick={() => setShowPw(!showPw)}
                className="hover:cursor-pointer"
              >
                {!showPw ? <Eye /> : <EyeOff />}
              </p>
            </label>

            <button
              onClick={createUser}
              className={`cursor-pointer transition-colors w-60 text-2xl mt-3 py-5 rounded-4xl ${
                isDark ? "bg-pink-700" : "bg-lime-600 border-2 border-black hover:bg-lime-500"
              }`}
            >
              Sign Up
            </button>
            <p>
              Already have an account?{" "}
              <Link
                to="/login"
                className={` underline cursor-pointer ${
                  isDark ? "text-pink-300" : "text-lime-800"
                }`}
              >
                Login
              </Link>
            </p>
          </div>
        </div>
        <div
          className="lg:flex-2 md:flex-1 lg:block sm:hidden h-full"
          style={{ backgroundColor: isDark ? "#4B5563" : "#9D6FAF" }}
        >
          <img src="/assets/form-side.jpg" alt="Signup" />
        </div>
      </div>
    </>
  );
}
