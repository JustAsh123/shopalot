import {Toaster, toast} from "react-hot-toast"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useAuth } from "./context/useAuth.jsx"
import Signup from "./pages/SignUp"
import Login from "./pages/Login.jsx"
import { Navbar } from "./components/Navbar.jsx"
import Admin from "./pages/Admin.jsx"
import Homepage from "./pages/Homepage.jsx"
import Cart from "./pages/Cart.jsx"
import { Checkout } from "./pages/Checkout.jsx"
import { Profile } from "./pages/Profile.jsx"
function App() {
  const {currentUser, username, userData} = useAuth();

  return (
    <>
    <Toaster />
    <Navbar username={username}/>
    <BrowserRouter>
      <Routes>
        <Route index element={<Homepage />} />
        <Route path="/signup" element={<Signup />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/admin" element={<Admin />}/>
        <Route path="/cart" element={<Cart isOnCheckout={false}/>}/>
        <Route path="/checkout" element={<Checkout/>}/>
        <Route path="/profile" element={<Profile></Profile>}></Route>
        <Route path="*" element={<h1>No Page Found</h1>}/>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
