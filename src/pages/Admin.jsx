import AddProduct from "../components/AddProduct";
import AddCategory from "../components/AddCategory";
import { useAuth } from "../context/useAuth";

export default function Admin(){
    const {currentUser, userData} = useAuth();

    if(!currentUser || !userData.isAdmin) return <p className="text-3xl text-red-500">SOMETHING WENT WRONG.</p>

    return (
        <>
            <AddProduct></AddProduct>
            <AddCategory></AddCategory>
        </>
    )
}