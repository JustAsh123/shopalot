import { useParams } from "react-router"
import ProductGrid from "../components/ProductGrid";
export function ProdPage(){
    const {subId} = useParams();
    return(
        <ProductGrid subId={subId}/>
    )
}