import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router";
import { Pencil, X, Check, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import toast from "react-hot-toast";
import { AddAddress } from "../components/AddAddress";

export function Profile() {
  const { currentUser, userData, username, setUserData } = useAuth(); // Get setUser Data from context
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [newPhone, setNewPhone] = useState("");
  const [phoneValid, setPhoneValid] = useState(false);
  const [updatingPhone, setUpdatingPhone] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(newPhone);
    setPhoneValid(newPhone.length === 10);
  }, [newPhone]);

  if (!currentUser) navigate("/login");

  const handleEditPhone = async () => {
    if (!phoneValid) return toast.error("Enter a valid Phone Number.");
    setUpdatingPhone(true);
    const userDoc = doc(db, "users", userData.uid);
    try {
      await updateDoc(userDoc, {
        phoneNumber: newPhone,
      });
      // Update local userData state
      setUserData((prevData) => ({
        ...prevData,
        phoneNumber: newPhone,
      }));
      toast.success("Phone number updated.");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsEditingPhone(false);
      setUpdatingPhone(false);
    }
  };

  return (
    <>
      <div className="flex flex-col ml-5 mt-5">
        <h1 className="text-4xl">Hello, {username}</h1>
        <hr className="my-8 h-0.5 border-t-0 bg-neutral-100 dark:bg-white/10" />
        <p className="text-2xl flex flex-row gap-2">
          Phone Number:{" "}
          {isEditingPhone ? (
            <>
              {!updatingPhone ? (
                <>
                  <input
                    type="text"
                    className={
                      phoneValid ? "input input-success" : "input input-error"
                    }
                    onChange={(e) => setNewPhone(e.target.value)}
                  />
                  <button className="btn btn-success" onClick={handleEditPhone}>
                    <Check size={18} />
                  </button>
                  <button
                    className="btn btn-error"
                    onClick={() => setIsEditingPhone(false)}
                  >
                    <X size={18} />
                  </button>
                </>
              ) : (
                <Loader className="animate-spin" size={18} />
              )}
            </>
          ) : (
            <>
              <p className="font-bold">
                {userData.phoneNumber === ""
                  ? " Not Set"
                  : userData.phoneNumber}
              </p>
              <button
                className="btn btn-ghost"
                onClick={() => setIsEditingPhone(true)}
              >
                <Pencil size={18} />
              </button>
            </>
          )}
        </p>
        <div className="text-2xl flex flex-col gap-2">
          <p>My Addresses : </p>
          <div className="ml-8 flex flex-col gap-2">
            {userData.address.length === 0 ? (
              <p className="text-red-700">You don't have any addresses.</p>
            ) : (
              "Wait"
            )}
            <div className="flex flex-row gap-4">
                <AddAddress />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
