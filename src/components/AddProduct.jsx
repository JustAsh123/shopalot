import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { db } from "../firebase/firebase";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

export default function AddProduct() {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState(0);
  const [imageFile, setImageFile] = useState(null);
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState(0);
  const navigate = useNavigate();

  const handleImageUpload = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "product_uploads");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dxuf6i2s5/image/upload",
      {
        method: "POST",
        body: data,
      }
    );

    const json = await res.json();
    return json.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
        let imageUrl = "";
        if(imageFile){
            imageUrl = await handleImageUpload(imageFile);
        }
        await addDoc(collection(db,"products"),{
            name,
            desc,
            price,
            imageUrl,
            category,
            stock
        })
        toast.success("Successfully added the product.")
        navigate('/')
    } catch(err){
        toast.error(err.message)
    }

  };

  return (
    <>
      {/* You can open the modal using document.getElementById('ID').showModal() method */}
      <button
        className="btn outline-success outline-solid"
        onClick={() => document.getElementById("my_modal_3").showModal()}
      >
        Add New Product
      </button>
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Add Product</h3>

          <div className="flex flex-col gap-4 my-5">
            <input
              type="text"
              onChange={(e) => setName(e.target.value)}
              autoComplete="none"
              placeholder="Name"
              className="text-xl outline-white outline-solid"
            />
            <input
              type="text"
              onChange={(e) => setDesc(e.target.value)}
              autoComplete="none"
              placeholder="Description"
              className="text-xl outline-white outline-solid"
            />
            <input
              type="number"
              onChange={(e) => setPrice(e.target.value)}
              autoComplete="none"
              placeholder="Price"
              className="text-xl outline-white outline-solid"
            />
            <input
              type="file"
              onChange={(e) => setImageFile(e.target.files[0])}
              autoComplete="none"
              placeholder="Image"
              className="text-xl outline-white outline-solid"
            />
            <input
              type="text"
              onChange={(e) => setCategory(e.target.value)}
              autoComplete="none"
              placeholder="Category"
              className="text-xl outline-white outline-solid"
            />
            <input
              type="number"
              onChange={(e) => setStock(e.target.value)}
              autoComplete="none"
              placeholder="Stock"
              className="text-xl outline-white outline-solid"
            />

            <button onClick={handleSubmit} className="btn bg-pink-800 text-white text-2xl">Add</button>
          </div>
        </div>
      </dialog>
    </>
  );
}
