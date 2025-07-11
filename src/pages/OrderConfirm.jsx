import { useParams } from "react-router"
import { useNavigate } from "react-router";

export function OrderConfirm(){
    const navigate = useNavigate();
    const {orderId} = useParams();
    return(
        <div className="flex flex-col m-8 justify-center items-center text-center gap-4">
            <p className="text-6xl text-success">Thank You!</p>
            <p className="flex flex-col text-xl">
                <p>Your Order ID : <span className="text-primary">#{orderId.substring(0,8)}</span> </p>
                <p>Your items will be deliverd in <span className="text-primary">18-30 Hrs</span></p>
            </p>
            <p className="flex flex-row gap-2">
                <button className="btn btn-outline btn-warning text-l" onClick={()=>navigate('/')}>Continue Shopping</button>
                <button className="btn btn-outline btn-secondary text-l" onClick={()=>navigate('/profile')}>Your Profile</button>
            </p>
        </div>
    )
}