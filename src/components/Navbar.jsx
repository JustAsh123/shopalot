import { getAuth, signOut } from "firebase/auth";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/useAuth";
import { useCategory } from "../context/useCategory";
import { ThemeSwitcher } from "./ThemeSwitcher";

export function Navbar() {
  const {
    currentUser ,
    username,
    userData,
    loading: userLoading,
    isDark,
    onThemeChange,
  } = useAuth();
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

  if (userLoading || categoriesLoading) {
    return (
      <div className={`navbar ${isDark ? "bg-slate-900 text-pink-300" : ""} shadow-xl px-4 py-3 sm:px-6`}>
        <span className="animate-pulse text-lg">Loading...</span>
      </div>
    );
  }

  return (
    <div
      className={`navbar ${isDark ? "dark:bg-slate-900 dark:text-pink-300" : "bg-gray-300"} shadow-xl px-4 py-3 sm:px-6 relative z-50`}
    >
      {/* Container for Brand Name and Mobile Toggle */}
      <div className="flex w-full items-center justify-between md:hidden">
        {/* Brand Name / Logo - Mobile */}
        <a
          href="/"
          className={`text-2xl font-extrabold tracking-wide ${isDark ? "text-pink-300 hover:text-pink-100" : "text-lime-600"} transition-colors duration-300 ease-in-out whitespace-nowrap`}
        >
          Shop-a-Lot
        </a>
        {/* Mobile Menu (Hamburger Icon) - Visible on small screens */}
        <label
          htmlFor="my-drawer-3"
          aria-label="open sidebar"
          className={`btn btn-square btn-ghost ${isDark ? "text-pink-300 hover:bg-slate-700 hover:text-white" : ""} transition-colors duration-300`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block h-6 w-6 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </label>
      </div>

      {/* Desktop Brand Name & Menu (Hidden on small screens) */}
      <div className="hidden md:flex flex-1 items-center">
        {/* Brand Name / Logo - Desktop */}
        <a
          href="/"
          className={`text-2xl font-extrabold tracking-wide ${isDark ? "text-pink-300 hover:text-pink-100" : "text-lime-600"} transition-colors duration-300 ease-in-out mr-auto`}
        >
          Shop-a-Lot
        </a>
        {/* Desktop Menu */}
        <ul className="menu menu-horizontal px-1 text-lg font-semibold items-center space-x-2">
          {currentUser  ? (
            <>
              <li>
                <label className="swap swap-rotate">
                  <input type="checkbox" checked={isDark} onChange={onThemeChange}/>

                  {/* sun icon */}
                  <svg
                    className="swap-on h-8 w-8 fill-current text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                  </svg>

                  {/* moon icon */}
                  <svg
                    className="swap-off h-8 w-8 fill-current text-black"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                  </svg>
                </label>
              </li>
              <li>
                <a
                  href="/cart"
                  className={`btn btn-outline ${isDark ? "text-pink-300 btn-secondary border-pink-500 hover:bg-pink-700 hover:text-white" : "btn-success text-black hover:border-black hover:bg-lime-600"} transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 px-6 py-2 rounded-full font-bold`}
                >
                  Cart
                </a>
              </li>
              <li>
                <details className="dropdown dropdown-end">
                  <summary className={`btn btn-ghost ${isDark ? "text-pink-300 hover:bg-slate-700 hover:text-white" : "text-black hover:bg-lime-600"} transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 px-4 py-2 rounded-xl`}>
                    {username || "Profile"}
                  </summary>
                  <ul className={`text-base rounded-box p-2 shadow-2xl z-[999] w-40 border ${isDark ? "border-pink-700 bg-slate-800" : "bg-white text-black"} backdrop-blur-sm bg-opacity-90`}>
                    <li>
                      <a
                        href="/profile"
                        className={`block py-2 px-4 ${isDark ? "text-pink-200 hover:bg-pink-800 hover:text-white" : "hover:bg-lime-600"} rounded-lg transition-all duration-200 ease-in-out`}
                      >
                        Profile
                      </a>
                    </li>
                    {userData && userData.isAdmin && (
                      <li>
                        <a
                          href="/admin"
                          className={`block py-2 px-4 ${isDark ? "text-pink-200 hover:bg-pink-800 hover:text-white" : "hover:bg-lime-600"} rounded-lg transition-all duration-200 ease-in-out`}
                        >
                          Admin
                        </a>
                      </li>
                    )}
                    <li>
                      <button
                        onClick={handleSignout}
                        className={`block py-2 px-4 ${isDark ? "text-pink-200 hover:bg-red-700 hover:text-white" : "hover:bg-lime-600"} text-left w-full rounded-lg transition-all duration-200 ease-in-out`}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </details>
              </li>
            </>
          ) : (
            <>
              <li>
                <label className="swap swap-rotate">
                  <input type="checkbox" checked={isDark} onChange={onThemeChange}/>

                  {/* sun icon */}
                  <svg
                    className="swap-on h-8 w-8 fill-current text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                  </svg>

                  {/* moon icon */}
                  <svg
                    className="swap-off h-8 w-8 fill-current text-black"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                  </svg>
                </label>
              </li>
              <li>
                <a
                  href="/signup"
                  className={`btn ${isDark ? "bg-pink-700 btn-secondary hover:bg-pink-600 text-white" : "btn-ghost text-black border-lime-600 border-2 hover:border-black hover:shadow-black hover:bg-lime-600"} transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 px-6 py-2 rounded-full font-bold`}
                >
                  Signup
                </a>
              </li>
              <li>
                <a
                  href="/login"
                  className={`btn ml-4 ${isDark ? "outline-pink-500 text-pink-300 border-2 border-pink-500 bg-transparent hover:bg-pink-900 hover:text-white" : "text-black bg-lime-600"} transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 px-6 py-2 rounded-full font-bold`}
                >
                  Login
                </a>
              </li>
            </>
          )}
        </ul>
      </div>

      {/* Drawer for Mobile Menu */}
      <div className="drawer drawer-end md:hidden">
        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
        <div className="drawer-side z-[1000]">
          <label
            htmlFor="my-drawer-3"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className={`menu ${isDark ? "bg-slate-900 text-pink-300" : "bg-gray-300"} min-h-full w-80 p-4 space-y-3 text-lg font-medium shadow-2xl`}>
            <li>
              <a
                href="/"
                className={`block py-2 px-4 ${isDark ? "hover:bg-slate-700" : "bg-lime-600 border-2"} rounded-lg transition-colors duration-200`}
              >
                Home
              </a>
            </li>
            <div className="divider my-4"></div>
            <ThemeSwitcher />
            {currentUser  ? (
              <>
                <li>
                  <a
                    href="/cart"
                    className={`block py-2 px-4 ${isDark ? "hover:bg-slate-700" : "border-2 border-lime-600 hover:bg-lime-600 hover:border-black"} rounded-lg transition-colors duration-200`}
                  >
                    Cart
                  </a>
                </li>
                <li>
                  <a
                    href="/profile"
                    className={`block py-2 px-4 ${isDark ? "hover:bg-slate-700" : "border-2 border-lime-600 hover:bg-lime-600 hover:border-black"} rounded-lg transition-colors duration-200`}
                  >
                    Profile: {username}
                  </a>
                </li>
                {userData && userData.isAdmin && (
                  <li>
                    <a
                      href="/admin"
                      className={`block py-2 px-4 ${isDark ? "hover:bg-slate-700" : "border-2 border-lime-600 hover:bg-lime-600 hover:border-black"} rounded-lg transition-colors duration-200`}
                    >
                      Admin Dashboard
                    </a>
                  </li>
                )}
                <li>
                  <button
                    onClick={handleSignout}
                    className={`w-full text-left block py-2 px-4 ${isDark ? "hover:bg-red-700" : "border-2 border-lime-600 hover:bg-lime-600 hover:border-black"} rounded-lg transition-colors duration-200`}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <a
                    href="/signup"
                    className={`btn btn-secondary ${isDark ? "bg-pink-700 hover:bg-pink-600 text-white" : "btn-ghost text-black border-lime-600 border-2 hover:border-black hover:shadow-black hover:bg-lime-600"} transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 w-full text-center`}
                  >
                    Signup
                  </a>
                </li>
                <li>
                  <a
                    href="/login"
                    className={`btn mt-2 ${isDark ? "outline-pink-500 text-pink-300 bg-transparent hover:bg-pink-900 hover:text-white" : "text-black bg-lime-600"} transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 w-full text-center`}
                  >
                    Login
                  </a>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
