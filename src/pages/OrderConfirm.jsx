import { useParams } from "react-router";
import { useNavigate } from "react-router";
import { useAuth } from "../context/useAuth"; // Import useAuth for isDark state

export function OrderConfirm() {
    const navigate = useNavigate();
    const { orderId } = useParams();
    const { isDark } = useAuth(); // Get isDark state

    return (
        <div className={`flex flex-col m-8 justify-center items-center text-center gap-4 ${isDark ? ' text-white' :  'text-black'}`}>
            <p className="text-6xl text-lime-600">Thank You!</p>
            <p className="flex flex-col text-xl">
                <p>Your Order ID: <span className="text-primary">#{orderId.substring(0, 8)}</span></p>
                <p>Your items will be delivered in <span className="text-primary">18-30 Hrs</span></p>
            </p>
            <p className="flex flex-row gap-2">
                <button className={`btn border-2 text-l text-black ${isDark ? 'bg-yellow-600' : 'bg-yellow-500'}`} onClick={() => navigate('/')}>Continue Shopping</button>
                <button className={`btn border-2 btn-ghost text-l ${isDark ? '' : 'border-2 border-lime-600 hover:bg-lime-600 hover:border-black'}`} onClick={() => navigate('/profile')}>Your Profile</button>
            </p>
        </div>
    );
}
