import ProductCard from "./ProductCard";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useEffect, useState } from "react";
import { useProducts } from "../context/useProducts";
import { useCart } from "../context/useCart";
import { useAuth } from "../context/useAuth";

function ProductGrid({subId}){
    const {prods, loading, error} = useProducts();
    const [products, setProducts] = useState([]);
    useEffect(()=>{
        const p = prods.filter((prod)=>prod.subcategoryId===subId)
        setProducts(p)
    },[prods])

    if(loading) return <h1 className="text-3xl text-white">Loading...</h1>
    
    return(
        <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-8 place-items-center mt-5">
            {products.map((doc)=>{
                return(
                    <ProductCard key={doc.id} prodId={doc.id} name={doc.name} desc={doc.desc} price={doc.price} imageUrl={doc.imageUrl} category={doc.subcategoryId} stock={doc.stock}/>
                )
            })}
        </div>
    )
}

export default ProductGrid;