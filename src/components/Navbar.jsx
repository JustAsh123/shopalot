import { getAuth, signOut } from "firebase/auth";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/useAuth";
import { useEffect, useState } from "react";
import { useCart } from "../context/useCart";

export function Navbar() {
  const { currentUser, username, userData } = useAuth();
  const handleSignout = async () => {
    const auth = getAuth();
    await signOut(auth)
      .then(() => {
        toast.success("Signed out Successfully.");
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const [qty, setQty] = useState(0);
  const {cartItems} = useCart(userData.uid);

  useEffect(() => {
    cartItems.forEach((item)=>{
      setQty(qty+item.qty)
    })
  }, [cartItems]);

  return (
    <div className="navbar bg-slate-950 shadow-sm">
      <div className="flex-1">
        <a className="btn btn-ghost text-2xl text-pink-700">Shop-a-Lot</a>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1 text-xl text-pink-700 items-center">
          {currentUser ? (
            <>
              <li className="bg-pink-900 rounded-xl w-16 h-9 text-white flex items-center justify-center">
                Cart
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-lg bg-red-700 text-white flex items-center justify-center text-xs font-bold">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-600 opacity-75"></span>
                  <span className="relative z-10">{qty}</span>{" "}
                  {/* Replace 3 with your number */}
                </span>
              </li>
              <li>
                <details className="dropdown">
                  <summary className="cursor-pointer">{username}</summary>
                  <ul className="bg-slate-950 rounded-t-none p-2">
                    <li>
                      <a>Profile</a>
                    </li>
                    {userData.isAdmin && (
                      <li>
                        <a href="/admin">Admin</a>
                      </li>
                    )}
                    <li>
                      <a onClick={handleSignout}>Logout</a>
                    </li>
                  </ul>
                </details>
              </li>
            </>
          ) : (
            <>
              <li>
                <a href="/signup" className="btn btn-secondary">
                  Signup
                </a>
              </li>
              <li>
                <a
                  href="/login"
                  className="btn ml-4 outline-pink-700 outline-solid bg-none"
                >
                  Login
                </a>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
