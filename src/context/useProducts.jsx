// useProducts (no changes needed here, just ensure your data in Firestore has categoryId)
import { useEffect, useState } from "react"
import { db } from "../firebase/firebase"
import { getDocs, collection } from "firebase/firestore"

export const useProducts = () => {
    const [prods, setProds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(()=>{
        const getProducts = async()=>{
            try{
                setLoading(true)
                const qS = await getDocs(collection(db,"products"))
                const ProductList = qS.docs.map((doc)=>({
                    id:doc.id,
                    ...doc.data()
                }))
                // console.log(ProductList) // Can be noisy, uncomment for debugging
                setProds(ProductList)
            }catch(err){
                setError(err)
                console.log(err.message)
            }finally{
                setLoading(false)
            }
        }
        getProducts();
    },[])
    return {prods, loading, error}
}