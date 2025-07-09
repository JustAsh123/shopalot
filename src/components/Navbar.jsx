import { getAuth, signOut } from "firebase/auth";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/useAuth";
import { useCategory } from "../context/useCategory";

export function Navbar() {
  const { currentUser, username, userData, loading: userLoading } = useAuth();
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
      <div className="navbar bg-slate-900 text-pink-300 shadow-xl px-4 py-3 sm:px-6">
        <span className="animate-pulse text-lg">Loading...</span>
      </div>
    );
  }

  return (
    <div className="navbar bg-slate-900 text-pink-300 shadow-xl px-4 py-3 sm:px-6 relative z-50">
      {/* Container for Brand Name and Mobile Toggle */}
      <div className="flex w-full items-center justify-between md:hidden"> {/* Visible only on mobile */}
        {/* Brand Name / Logo - Mobile */}
        <a
          href="/"
          className="text-2xl font-extrabold tracking-wide text-pink-300 hover:text-pink-100 transition-colors duration-300 ease-in-out whitespace-nowrap"
        >
          Shop-a-Lot
        </a>

        {/* Mobile Menu (Hamburger Icon) - Visible on small screens */}
        <label htmlFor="my-drawer-3" aria-label="open sidebar" className="btn btn-square btn-ghost text-pink-300 hover:bg-slate-700 hover:text-white transition-colors duration-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block h-6 w-6 stroke-current"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </label>
      </div>

      {/* Desktop Brand Name & Menu (Hidden on small screens) */}
      <div className="hidden md:flex flex-1 items-center"> {/* flex-1 to push menu to the right */}
        {/* Brand Name / Logo - Desktop */}
        <a
          href="/"
          className="text-2xl font-extrabold tracking-wide text-pink-300 hover:text-pink-100 transition-colors duration-300 ease-in-out mr-auto" /* mr-auto pushes content to right */
        >
          Shop-a-Lot
        </a>

        {/* Desktop Menu */}
        <ul className="menu menu-horizontal px-1 text-lg font-semibold items-center space-x-6">
          {/* Categories Dropdown */}
          <li>
            <div className="dropdown dropdown-bottom dropdown-end">
              <div tabIndex={0} role="button" className="text-pink-300 hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 px-4 py-1 rounded-xl">
                Categories
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-slate-800 text-base rounded-box w-52 shadow-2xl z-[999] border border-pink-700 backdrop-blur-sm bg-opacity-90"
              >
                {categories.length === 0 ? (
                  <li className="p-3 text-sm text-gray-400 italic">No categories available.</li>
                ) : (
                  categories.map((cat) => (
                    <li key={cat.id}>
                      <a href={`/category/${cat.id}`} className="block py-2 px-4 text-pink-200 hover:bg-pink-800 hover:text-white rounded-lg transition-all duration-200 ease-in-out">
                        {cat.name}
                      </a>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </li>

          {/* Conditional User Links (Desktop) */}
          {currentUser ? (
            <>
              <li>
                <a href="/cart" className="btn btn-outline btn-secondary text-pink-300 border-pink-500 hover:bg-pink-700 hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 px-6 py-2 rounded-full font-bold">
                  Cart
                </a>
              </li>
              <li>
                <details className="dropdown dropdown-end">
                  <summary className="btn btn-ghost text-pink-300 hover:bg-slate-700 hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 px-4 py-2 rounded-xl">
                    {username || "Profile"}
                  </summary>
                  <ul className="bg-slate-800 text-base rounded-box p-2 shadow-2xl z-[999] w-40 border border-pink-700 backdrop-blur-sm bg-opacity-90">
                    <li>
                      <a href="/profile" className="block py-2 px-4 text-pink-200 hover:bg-pink-800 hover:text-white rounded-lg transition-all duration-200 ease-in-out">Profile</a>
                    </li>
                    {userData && userData.isAdmin && (
                      <li>
                        <a href="/admin" className="block py-2 px-4 text-pink-200 hover:bg-pink-800 hover:text-white rounded-lg transition-all duration-200 ease-in-out">Admin</a>
                      </li>
                    )}
                    <li>
                      <button onClick={handleSignout} className="block py-2 px-4 text-pink-200 text-left w-full hover:bg-red-700 hover:text-white rounded-lg transition-all duration-200 ease-in-out">Logout</button>
                    </li>
                  </ul>
                </details>
              </li>
            </>
          ) : (
            <>
              <li>
                <a href="/signup" className="btn btn-secondary bg-pink-700 hover:bg-pink-600 text-white transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 px-6 py-2 rounded-full font-bold">
                  Signup
                </a>
              </li>
              <li>
                <a
                  href="/login"
                  className="btn ml-4 outline outline-2 outline-offset-2 outline-pink-500 text-pink-300 bg-transparent hover:bg-pink-900 hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 px-6 py-2 rounded-full font-bold"
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
          <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
          <ul className="menu bg-slate-900 text-pink-300 min-h-full w-80 p-4 space-y-3 text-lg font-medium shadow-2xl">
            <li>
              <a href="/" className="block py-2 px-4 hover:bg-slate-700 rounded-lg transition-colors duration-200">Home</a>
            </li>
            <li className="menu-title text-gray-400 mt-4 border-t border-gray-700 pt-3">Categories</li>
            {categories.length === 0 ? (
                <li className="p-3 text-sm text-gray-500 italic">No categories available.</li>
            ) : (
                categories.map((cat) => (
                <li key={cat.id}>
                    <a href={`/category/${cat.id}`} className="block py-2 px-4 hover:bg-slate-700 rounded-lg transition-colors duration-200">
                        {cat.name}
                    </a>
                </li>
                ))
            )}
            <div className="divider my-4"></div>

            {currentUser ? (
              <>
                <li>
                  <a href="/cart" className="block py-2 px-4 hover:bg-slate-700 rounded-lg transition-colors duration-200">Cart</a>
                </li>
                <li>
                  <a href="/profile" className="block py-2 px-4 hover:bg-slate-700 rounded-lg transition-colors duration-200">Profile: {username}</a>
                </li>
                {userData && userData.isAdmin && (
                  <li>
                    <a href="/admin" className="block py-2 px-4 hover:bg-slate-700 rounded-lg transition-colors duration-200">Admin Dashboard</a>
                  </li>
                )}
                <li>
                  <button onClick={handleSignout} className="w-full text-left block py-2 px-4 hover:bg-red-700 rounded-lg transition-colors duration-200">Logout</button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <a href="/signup" className="btn btn-secondary bg-pink-700 hover:bg-pink-600 text-white transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 w-full text-center">Signup</a>
                </li>
                <li>
                  <a href="/login" className="btn mt-2 outline outline-2 outline-offset-2 outline-pink-500 text-pink-300 bg-transparent hover:bg-pink-900 hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 w-full text-center">Login</a>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}