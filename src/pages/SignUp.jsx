import { Toaster,toast } from "react-hot-toast"
import { BookOpen, CircleUser, Mail , Key, RotateCcwKey, Eye, EyeOff, UserRoundPlus} from "lucide-react"
import { useState } from "react"

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

import { useNavigate, Link } from "react-router-dom";

export default function Signup(){
    const [showPw, setShowPw] = useState(false);

    const [un, setUn] = useState("");
    const [em, setEm] = useState("");
    const [pw, setPw] = useState("");
    const [cpw, setCpw] = useState("");

    const navigate = useNavigate();

    const validateFormData = async ()=>{
        if(un.trim()=="" || em.trim()=="" || pw.trim()=="" || cpw.trim()==""){
            toast.error("Fill all the fields")
            return false;
        }
        if(!em.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )){
            toast.error("Enter a valid E-mail.")
            return false;
        }
        if(pw!=cpw){
            toast.error("Passwords do not match")
            return false;
        }

        const q = query(
            collection(db,"users"),
            where("username","==",un)
        )
        const snapshot = await getDocs(q);
        if(!snapshot.empty){
            return toast.error("Username already taken")
        }
        return true;
    }

    const createUser = async (e)=>{
        e.preventDefault();
        if(!validateFormData){
            return;
        }
        try{
            const userCred = await createUserWithEmailAndPassword(auth, em, pw);
            await setDoc(doc(db, "users", userCred.user.uid),{
                username:un,
                email:em,
                address:"",
                isAdmin:false,
                phoneNumber:"",
                uid:userCred.user.uid
            })
            toast.success("Account Created Successfully")
            navigate("/");
        }catch(error){
            console.log(error);
            toast.error(error.message)
        }
    }

    return(
        <>
        <Toaster />
        <div className="flex flex-row justify-center lg:items-center text-center h-screen">
            <div className="sm:flex-1 flex flex-col items-center text-center justify-center">
                <p className="flex flex-row items-center gap-4 text-4xl text-pink-500"><BookOpen size={48}/>Create an Account</p>
                <p className="text-md text-pink-200 mb-6">Join the up and coming shopping platform Shop-a-lot for amazing deals and fast deliveries</p>
                
                <div className="flex flex-col gap-2 w-100 items-center">
                    <label className="input w-full">
                        <CircleUser />
                        <input type="text" onChange={(e)=>setUn(e.target.value)} autoComplete="new-username" placeholder="Username" className="text-xl"/>
                    </label>
                    <label className="input w-full">
                        <Mail />
                        <input type="text" onChange={(e)=>setEm(e.target.value)}  autoComplete="new-email" placeholder="Email" className="text-xl"/>
                    </label>
                    <label className="input w-full">
                        <Key />
                        <input type={showPw?"text":"password"} onChange={(e)=>setPw(e.target.value)} autoComplete="new-password"  placeholder="Password" className="text-xl"/>
                        <p onClick={()=>setShowPw(!showPw)} className="hover:cursor-pointer">{!showPw?<Eye/>:<EyeOff/>}</p>
                    </label>
                    <label className="input w-full">
                        <RotateCcwKey />
                        <input type={showPw?"text":"password"} onChange={(e)=>setCpw(e.target.value)} autoComplete="new-password"  placeholder="Password" className="text-xl"/>
                        <p onClick={()=>setShowPw(!showPw)} className="hover:cursor-pointer">{!showPw?<Eye/>:<EyeOff/>}</p>
                    </label>

                    <button onClick={createUser} className="bg-pink-600 hover:bg-pink-800 cursor-pointer transition-colors w-60 text-2xl mt-3 py-5 rounded-4xl">Sign Up</button>
                    <p>Already have an account? <a className="text-pink-500 underline cursor-pointer hover:text-pink-800">Login</a></p>
                </div>

            </div>
            <div className="lg:flex-2 md:flex-1 lg:block sm:hidden h-full" style={{backgroundColor:"#9D6FAF"}}><img src="/assets/form-side.jpg"/></div>
        </div>
        </>
    )
}