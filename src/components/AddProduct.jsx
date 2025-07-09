import { addDoc, collection } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useCategory } from "../context/useCategory";

export default function AddProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(""); // Changed to empty string for consistent reset
  const [imageFile, setImageFile] = useState(null);
  const { categories } = useCategory(); // Assuming 'categories' here is the structured tree
  const [stock, setStock] = useState(""); // Changed to empty string for consistent reset
  const navigate = useNavigate();
  const [category, setCategory] = useState(""); // Holds selected category ID
  const [subcategory, setSubcategory] = useState(""); // Holds selected subcategory ID
  const [loading, setLoading] = useState(false);

  // Function to reset all form fields
  const resetForm = () => {
    setName("");
    setPrice("");
    setImageFile(null);
    setStock("");
    setCategory(""); // Reset category dropdown
    setSubcategory(""); // Reset subcategory dropdown
    // Manually reset file input value if needed (though setting imageFile to null usually suffices)
    const fileInput = document.getElementById("productImageInput");
    if (fileInput) {
      fileInput.value = "";
    }
  };

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
    setLoading(true);
    try {
      let imageUrl = "";
      if (imageFile) {
        imageUrl = await handleImageUpload(imageFile);
      }

      // Basic validation: ensure category and subcategory are selected if applicable
      if (!name || price <= 0 || stock < 0 || !category || (category && !subcategory)) {
          toast.error("Please fill all required fields and ensure valid price/stock.");
          setLoading(false);
          return;
      }

      await addDoc(collection(db, "products"), {
        name,
        price: Number(price), // Ensure price is stored as a number
        imageUrl,
        categoryId: category,
        subcategoryId: subcategory,
        stock: Number(stock), // Ensure stock is stored as a number
      });
      toast.success("Successfully added the product.");

      // Close the modal
      document.getElementById("my_modal_3").close();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
      resetForm(); // Reset form fields after submission attempt
      navigate("/admin"); // Navigate after resetting
    }
  };

  // Filter subcategories based on the selected main category
  const selectedCategory = categories.find(cat => cat.id === category);
  const subcategoriesToShow = selectedCategory ? selectedCategory.subcategories : [];

  return (
    <>
      <button
        className="btn outline-success outline-solid"
        onClick={() => {
          document.getElementById("my_modal_3").showModal();
          resetForm(); // Reset form when modal is opened
        }}
      >
        Add new Product
      </button>
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={resetForm} // Reset form when closing with X button
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Add Product</h3>

          <div className="flex flex-col gap-4 my-5">
            <input
              type="text"
              value={name} // Bind value to state
              onChange={(e) => setName(e.target.value)}
              autoComplete="off" // Use "off" for better control
              placeholder="Name"
              className="input input-bordered w-full" // Added Tailwind/DaisyUI input styles
            />
            <input
              type="number"
              value={price} // Bind value to state
              onChange={(e) => setPrice(e.target.value)}
              autoComplete="off"
              placeholder="Price"
              className="input input-bordered w-full"
            />
            <input
              type="file"
              id="productImageInput" // Added ID for manual reset
              onChange={(e) => setImageFile(e.target.files[0])}
              autoComplete="off"
              className="file-input file-input-bordered w-full" // Added Tailwind/DaisyUI file input styles
            />
            <select
              value={category} // Bind value to state
              onChange={(e) => {
                setCategory(e.target.value);
                setSubcategory(""); // Reset subcategory when main category changes
              }}
              className="select select-bordered w-full"
            >
              <option value="" disabled>
                Pick a Category
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <select
              value={subcategory} // Bind value to state
              onChange={(e) => setSubcategory(e.target.value)}
              className="select select-bordered w-full"
              disabled={!category || subcategoriesToShow.length === 0} // Disable if no main category or no subcategories
            >
              <option value="" disabled>
                Pick a Subcategory
              </option>
              {subcategoriesToShow.map((subcat) => (
                <option key={subcat.id} value={subcat.id}>
                  {subcat.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={stock} // Bind value to state
              onChange={(e) => setStock(e.target.value)}
              autoComplete="off"
              placeholder="Stock"
              className="input input-bordered w-full"
            />

            <button
              onClick={handleSubmit}
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