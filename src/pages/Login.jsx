import { Toaster,toast } from "react-hot-toast"
import { BookOpen, CircleUser, Mail , Key, RotateCcwKey, Eye, EyeOff, UserRoundPlus} from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export default function Login(){
    const [showPw, setShowPw] = useState(false);

    const [em, setEm] = useState("");
    const [pw, setPw] = useState("");

    const navigate = useNavigate();

    const validateForm = ()=>{
        if(em.trim()=="" || pw.trim()==""){
            return toast.error("Please fill every field.")
        }
        return true;
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        if(validateForm){
            const auth = getAuth();
            await signInWithEmailAndPassword(auth, em, pw).then((userCredential)=>{
                toast.success("Succesfully Logged in.")
                navigate("/")
            }).catch((err)=>{
                toast.error(err.message)
            })
        }
    }

    return(
        <>
        <Toaster />
        <div className="flex flex-row justify-center lg:items-center text-center h-screen">
            <div className="sm:flex-1 flex flex-col items-center text-center justify-center">
                <p className="flex flex-row items-center gap-4 text-4xl text-pink-500"><BookOpen size={48}/>Login to your Account</p>
                <p className="text-md text-pink-200 mb-6">Continue shopping on Shop-a-lot for amazing deals and quick service</p>
                
                <div className="flex flex-col gap-2 w-100 items-center">
                    <label className="input w-full">
                        <Mail />
                        <input type="text" onChange={(e)=>setEm(e.target.value)}  autoComplete="email" placeholder="Email" className="text-xl"/>
                    </label>
                    <label className="input w-full">
                        <Key />
                        <input type={showPw?"text":"password"} onChange={(e)=>setPw(e.target.value)} autoComplete="password"  placeholder="Password" className="text-xl"/>
                        <p onClick={()=>setShowPw(!showPw)} className="hover:cursor-pointer">{!showPw?<Eye/>:<EyeOff/>}</p>
                    </label>

                    <button onClick={handleLogin} className="bg-pink-600 hover:bg-pink-800 cursor-pointer transition-colors w-60 text-2xl mt-3 py-5 rounded-4xl">Log In</button>
                    <p>Don't have an account? <a className="text-pink-500 underline cursor-pointer hover:text-pink-800">Signup.</a></p>
                </div>

            </div>
            <div className="lg:flex-2 md:flex-1 lg:block sm:hidden h-full" style={{backgroundColor:"#9D6FAF"}}><img src="/assets/form-side.jpg"/></div>
        </div>
        </>
    )
}