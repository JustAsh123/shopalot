import { getAuth, signOut } from "firebase/auth";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/useAuth";
import { useCategory } from "../context/useCategory";
import { useEffect } from "react";

export function Navbar() {
  const { currentUser , username, userData, loading: userLoading } = useAuth();
  const { categories, loading: categoriesLoading } = useCategory();

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

  // Check if user data is still loading
  if (userLoading || categoriesLoading) {
    return <div className="navbar bg-slate-900 text-pink-300 shadow-sm">Loading...</div>;
  }

  return (
    <div className="navbar bg-slate-900 text-pink-300 shadow-sm">
      <div className="flex-1">
        <a className="text-2xl cursor-pointer ml-4">Shop-a-Lot</a>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1 text-xl items-center">
          <li>
            <div className="dropdown dropdown-bottom dropdown-end">
              <div tabIndex={0} role="button">
                Categories
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-slate-950 text-xl rounded-box z-1 w-52 shadow-sm"
              >
                {categories.map((cat) => (
                  <li className="p-2 rounded-sm transition-all cursor-pointer hover:bg-slate-800" key={cat.id}>
                    {cat.name}
                  </li>
                ))}
              </ul>
            </div>
          </li>
          {currentUser  ? (
            <>
              <li className="outline outline-pink-500 hover:bg-pink-900 hover:text-white transition-all cursor-pointer rounded-xl w-16 py-1 flex items-center justify-center">
                <a href="/cart">Cart</a>
              </li>
              <li>
                <details className="dropdown">
                  <summary className="cursor-pointer">{username}</summary>
                  <ul className="bg-slate-950 rounded-t-none p-2">
                    <li>
                      <a href="/profile">Profile</a>
                    </li>
                    {userData && userData.isAdmin && (
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
                  className="btn ml-4 outline-pink-500 outline-solid bg-none"
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
