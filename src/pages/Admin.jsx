import AddProduct from "../components/AddProduct";
import AddCategory from "../components/AddCategory";
import { useAuth } from "../context/useAuth";
import CategoryManager from "../components/CategoryManager";
import ProductGrid from "../components/ProductGrid"

export default function Admin(){
    const {currentUser, userData} = useAuth();

    if(!currentUser || !userData.isAdmin) return <p className="text-3xl text-red-500">SOMETHING WENT WRONG.</p>

    return (
        <>
            <CategoryManager />
            <div className="flex flex-row justify-center items-center gap-4 my-8">
                <AddProduct></AddProduct>
            <AddCategory></AddCategory>
            </div>
            <ProductGrid></ProductGrid>
        </>
    )
}