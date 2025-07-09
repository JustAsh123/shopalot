import { useState } from "react";
import { useNavigate } from "react-router";
import { useCategory } from "../context/useCategory";

export default function AddCategory() {
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState(""); // For subcategories
  const [isParent, setIsParent] = useState(true);
  const { addCategory, loading, categories } = useCategory();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const categoryId = await addCategory(
      name,
      isParent ? null : parentId // Only pass parentId for subcategories
    );
    
    if (categoryId) {
      setName("");
      setParentId("");
    }
  };

  return (
    <>
      <button
        className="btn outline-success outline-solid"
        onClick={() => document.getElementById("cat_mod").showModal()}
      >
        Add New Category
      </button>
      
      <dialog id="cat_mod" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          
          <h3 className="font-bold text-lg">Add Category</h3>

          <div className="flex flex-col gap-4 my-5">
            {/* Category type toggle */}
            <div className="flex gap-4">
              <label className="cursor-pointer label">
                <input
                  type="radio"
                  name="categoryType"
                  className="radio"
                  checked={isParent}
                  onChange={() => setIsParent(true)}
                />
                <span className="label-text ml-2">Parent Category</span>
              </label>
              
              <label className="cursor-pointer label">
                <input
                  type="radio"
                  name="categoryType"
                  className="radio"
                  checked={!isParent}
                  onChange={() => setIsParent(false)}
                />
                <span className="label-text ml-2">Subcategory</span>
              </label>
            </div>

            {/* Category name input */}
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={`${isParent ? 'Category' : 'Subcategory'} name`}
              className="input input-bordered w-full"
            />

            {/* Parent category selector (shown only for subcategories) */}
            {!isParent && (
              <select
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                className="select select-bordered w-full"
              >
                <option value="">Select parent category</option>
                {categories
                  .filter(cat => !cat.parentId) // Only show parent categories
                  .map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
              </select>
            )}

            <button
              onClick={handleSubmit}
              className="btn btn-primary"
              disabled={loading || !name || (!isParent && !parentId)}
            >
              {loading ? "Adding..." : "Add Category"}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
