import {Toaster, toast} from "react-hot-toast"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useAuth } from "./context/useAuth.jsx"
import Signup from "./pages/SignUp"
import Login from "./pages/Login.jsx"
import { Navbar } from "./components/Navbar.jsx"
import Admin from "./pages/Admin.jsx"
import Homepage from "./pages/Homepage.jsx"

function App() {
  const {currentUser, username} = useAuth();

  return (
    <>
    <Toaster />
    <Navbar username={username}/>
    <BrowserRouter>
      <Routes>
        <Route index element={<Homepage />} />
        <Route path="/signup" element={<Signup />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/admin" element={<Admin></Admin>}/>
        <Route path="*" element={<h1>No Page Found</h1>}/>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
