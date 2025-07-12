import { Toaster, toast } from "react-hot-toast";
import { BookOpen, Mail, Key, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useAuth } from "../context/useAuth.jsx"; // Import useAuth to access isDark

export default function Login() {
  const [showPw, setShowPw] = useState(false);
  const { isDark } = useAuth(); // Get the isDark state
  const [em, setEm] = useState("");
  const [pw, setPw] = useState("");
  const navigate = useNavigate();

  const validateForm = () => {
    if (em.trim() === "" || pw.trim() === "") {
      toast.error("Please fill every field.");
      return false; // Return false to indicate validation failure
    }
    return true; // Return true if validation passes
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, em, pw)
        .then((userCredential) => {
          toast.success("Successfully Logged in.");
          navigate("/");
        })
        .catch((err) => {
          toast.error(err.message);
        });
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
              isDark ? "text-pink-300" : "text-lime-700"
            }`}
          >
            <BookOpen size={48} /> Login to your Account
          </p>
          <p
            className={`text-md ${
              isDark ? "text-pink-200" : "text-lime-700"
            } mb-6`}
          >
            Continue shopping on Shop-a-lot for amazing deals and quick service
          </p>

          <div className="flex flex-col gap-2 w-100 items-center">
            <label
              className={`input w-full ${isDark ? "bg-slate-800" : "bg-white text-black"}`}
            >
              {" "}
              <Mail />
              <input
                type="text"
                onChange={(e) => setEm(e.target.value)}
                autoComplete="email"
                placeholder="Email"
                className={`text-xl ${isDark ? "bg-gray-800 text-white" : "text-black"}`}
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
                autoComplete="password"
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

            <button
              onClick={handleLogin}
              className={`cursor-pointer transition-colors w-60 text-2xl mt-3 py-5 rounded-4xl ${
                isDark ? "bg-pink-700" : "bg-lime-600 border-2 border-black"
              }`}
            >
              Log In
            </button>
            <p>
              Don't have an account?{" "}
              <a
                className={`underline cursor-pointer  ${
                  isDark ? "text-pink-300" : "text-lime-700"
                }`}
              >
                Signup.
              </a>
            </p>
          </div>
        </div>
        <div
          className="lg:flex-2 md:flex-1 lg:block sm:hidden h-full"
          style={{ backgroundColor: isDark ? "#4B5563" : "#9D6FAF" }}
        >
          <img src="/assets/form-side.jpg" alt="Login" />
        </div>
      </div>
    </>
  );
}
