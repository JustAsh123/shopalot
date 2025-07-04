function ProductCard(props){
    const product = props.product;
    const page = props.page;
    return (
        <div className="card bg-base-200 w-96 shadow-sm shadow-blue-800">
  <figure className="bg-white">
    <img
      src={props.imageUrl}
      alt="Shoes"
      className="h-70" />
  </figure>
  <div className="card-body">
    <h2 className="card-title">{props.name}</h2>
    <div className="card-actions justify-between">
      <p className="flex flex-row mt-3 text-xl text-yellow-500">₹{props.price}</p>
      <button className="btn btn-secondary">Add to Cart</button>
    </div>
  </div>
</div>
    )
}

export default ProductCard