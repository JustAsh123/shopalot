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
                console.log(ProductList)
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