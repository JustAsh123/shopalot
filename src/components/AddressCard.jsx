import { MapPin, Edit, Trash2 } from "lucide-react";

export function AddressCard({ houseNo, street, locality, pincode, city, state }) {
  return (
    <div className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="card-body p-4 md:p-6">
        <div className="flex items-start gap-4">
          <div className="bg-primary/10 p-2 rounded-full">
            <MapPin className="text-primary" size={20} />
          </div>

          <div className="flex-1 space-y-1">
            <h3 className="font-medium text-lg">
              {houseNo}, {street}
            </h3>
            <p className="text-base-content/80">{locality}</p>
            <p className="text-base-content/80">
              {city}, {state} - {pincode}
            </p>
          </div>

          <div className="flex gap-1">
            <button className="btn btn-ghost btn-xs p-1">
              <Edit size={16} className="text-base-content/70" />
            </button>
            <button className="btn btn-ghost btn-xs p-1">
              <Trash2 size={16} className="text-error" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
