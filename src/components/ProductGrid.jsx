import ProductCard from "./ProductCard";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useEffect, useState } from "react";
import { useProducts } from "../context/useProducts";

function ProductGrid(props){
    const {prods, loading, error} = useProducts();

    if(loading) return <h1 className="text-3xl text-white">Loading...</h1>
    
    return(
        <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 place-items-center mt-5">
            {prods.map((doc)=>{
                return(
                    <ProductCard name={doc.name} desc={doc.desc} price={doc.price} imageUrl={doc.imageUrl} category={doc.category} stock={doc.stock}/>
                )
            })}
        </div>
    )
}

export default ProductGrid;