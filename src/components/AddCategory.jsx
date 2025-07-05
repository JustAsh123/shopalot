import { useEffect, useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase/firebase";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

export default function AddCategory(){
    const [n, setN] = useState("")
    const [loading, setLoading] = useState(false)
    const [file, setFile] = useState(null)
    const navigate = useNavigate();

    const handleImageUpload = async (file) => {
      const data = new FormData();
      data.append("file",file);
      data.append("upload_preset","product_uploads")

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dxuf6i2s5/image/upload",
        {
          method:"POST",
          body:data,
        }
      )
      const json = await res.json();
      return json.secure_url;
    }
    
    const addCategory = async (name) =>{
        setLoading(true)
        let image_url = "";
        if(file){
          image_url = await handleImageUpload(file);
        }
        const slug = name.toLowerCase().replace(/\s+/g,'-');
        await addDoc(collection(db,'categories'),{name,slug,image_url})
        setLoading(false)
        toast.success("Category Added successfully.")
        navigate("/")
    };

    return (
    <>
      {/* You can open the modal using document.getElementById('ID').showModal() method */}
      <button
        className="btn outline-success outline-solid"
        onClick={() => document.getElementById("cat_mod").showModal()}
      >
        Add New Category
      </button>
      <dialog id="cat_mod" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Add Category</h3>

          <div className="flex flex-col gap-4 my-5">
            <input
              type="text"
              onChange={(e) => setN(e.target.value)}
              autoComplete="none"
              placeholder="Name"
              className="text-xl outline-white outline-solid"
            />
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              placeholder="Image"
              className="text-xl outline-white outline-solid"
            />
            <button onClick={()=>addCategory(n)} className="btn bg-pink-800 text-white text-2xl" disabled={loading}>{loading?"Adding...":"Add"}</button>
          </div>
        </div>
      </dialog>
    </>
  );
}