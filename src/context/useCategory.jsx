import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";

export function useCategory(){
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false); 

    useEffect(()=>{
        const fetchCategories = async()=>{
            setLoading(true);
            const snapshot = await getDocs(collection(db,'categories'));

            const categoriesData = snapshot.docs.map((doc)=>({
                id:doc.id,
                ...doc.data()
            }))
            setCategories(categoriesData)
            setLoading(false)
        }
        fetchCategories();
    },[])

    return {categories, loading}
}