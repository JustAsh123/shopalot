import { useCart } from "../context/useCart";
import { useAuth } from "../context/useAuth";
import { Loader } from "lucide-react";

function ProductCard(props) {
  const { userData } = useAuth();
  const { addToCart, removeFromCart, cartItems, updating } = useCart(userData.uid);
  let quantity = 0;
  cartItems.forEach((item)=>{
    if(item.id = props.prodId){
      quantity = item.qty
    }
  })
  return (
    <div className="card bg-base-200 w-96 shadow-sm shadow-blue-800">
      <figure className="bg-white">
        <img src={props.imageUrl} alt="Shoes" className="h-70" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{props.name}</h2>
        <div className="card-actions justify-between">
          <p className="flex flex-row mt-3 text-xl text-yellow-500">
            ₹{props.price}
          </p>
          {quantity == 0 ? (
            <>
              {!updating?(<button
              onClick={() => addToCart(userData.uid,props.prodId)}
              className="bg-blue-600 px-4 py-2 rounded text-white cursor-pointer"
            >
              Add to cart
            </button>):(<Loader/>)}
            </>
          ) : (
            <>
            {updating?(<Loader/>):(
              <div className="flex items-center gap-2">
              <button
                onClick={() => removeFromCart(userData.uid,props.prodId)}
                className="bg-red-600 px-2 py-1 rounded text-white cursor-pointer"
              >
                -
              </button>
              <span className="text-white font-medium">{quantity}</span>
              <button
                onClick={() => addToCart(userData.uid,props.prodId)}
                className="bg-green-600 px-2 py-1 rounded text-white cursor-pointer"
              >
                +
              </button>
            </div>
            )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
