import type { Equipment } from "../types";

interface EquipmentItemProps {
  equipment: Equipment;
  isSelected:boolean;
  onSelect:()=>void;
}

export default function EquipmentItem({ equipment  , isSelected ,onSelect}: EquipmentItemProps) {
  const progress =
    equipment.totalDistance > 0
      ? Math.round(
          (equipment.distanceTraveled / equipment.totalDistance) * 100
        )
      : 0;

  return (
    <button type="button" onClick={onSelect} className={`w-full cursor-pointer rounded-xl border p-4 text-left shadow-sm transition hover:shadow-md ${
    isSelected
      ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
      : "border-gray-200 bg-white hover:border-gray-300"
  }`}>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="truncate font-semibold text-gray-900">
          {equipment.name}
        </h3>

        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
            equipment.status === "active"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {equipment.status}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between gap-4">
          <span className="text-gray-500">Type</span>
          <span className="font-medium capitalize text-gray-800">
            {equipment.type}
          </span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="shrink-0 text-gray-500">Location</span>
          <span className="truncate font-medium text-gray-800">
            {equipment.location.name}
          </span>
        </div>
      </div>

      {/* Distance */}
      <div className="mt-4 border-t border-gray-100 pt-3">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-gray-500">Distance</span>

          <span className="font-medium text-gray-800">
            {equipment.distanceTraveled} / {equipment.totalDistance} km
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-blue-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </button>
  );
}


