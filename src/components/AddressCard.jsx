import { MapPin, Trash2 } from "lucide-react";
import { useAuth } from "../context/useAuth"; // Adjust the path as necessary

export function AddressCard({ houseNo, street, locality, pincode, city, state, onDelete, showDelete, showRadio, onRadio }) {
  const { isDark } = useAuth(); // Get isDark state

  return (
    <div className={`card ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-black text-black'} shadow-md hover:shadow-lg transition-shadow flex flex-row items-center`}>
      {showRadio && <input type="radio" name="deliver" className="ml-2 radio radio-info radio-md" onClick={onRadio} />}
      <div className={`card-body p-4 md:p-6 ${isDark ? 'text-white' : 'text-black'}`}>
        <div className="flex items-start gap-4">
          <div className={` p-2 rounded-full ${isDark?"bg-primary/10":"bg-blue-600/20"}`}>
            <MapPin className="text-primary" size={20} />
          </div>

          <div className="flex-1 space-y-1 ">
            <h3 className="font-medium text-lg">
              {houseNo}, {street}
            </h3>
            <p className={`text-base-content/80 font-bold ${isDark?"text-white":"text-black"}`}>{locality}</p>
            <p className={`text-base-content/80 ${isDark?"text-white":"text-black"}`}>
              {city}, {state} - {pincode}
            </p>
          </div>

          {showDelete && (
            <div className="flex gap-1">
              <button className="btn bg-red-600/30 border-0 hover:bg-red-500/40 btn-xs p-1 rounded-full" onClick={onDelete}>
                <Trash2 size={16} className="text-error" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
