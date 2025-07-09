import { useEffect, useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase/firebase";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

export default function AddCategory() {
  const [n, setN] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const addCategory = async (name) => {
    setLoading(true);
    const slug = name
      .toLowerCase()
      .replace(/&/g, "and") // Replace & with 'and'
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/[^a-z0-9-]/g, "") // Remove all non-alphanumeric and non-hyphen characters
      .replace(/-+/g, "-") // Collapse multiple hyphens
      .replace(/^-+|-+$/g, ""); // Trim leading/trailing hyphens

    await addDoc(collection(db, "categories"), { name, slug });
    setLoading(false);
    toast.success("Category Added successfully.");
    navigate("/");
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
            <button
              onClick={() => addCategory(n)}
              className="btn bg-pink-800 text-white text-2xl"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add"}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
