
import type { Equipment } from "../types";
import EquipmentItem from "./EquipmentItem";

interface EquipmentListProps {
  equipmentList: Equipment[];
  selectedEquipmentId:number | null ;
  onSelectEquipment: (equipment:Equipment)=> void;
}

export default function EquipmentList({
  equipmentList,
  selectedEquipmentId ,
  onSelectEquipment
}: EquipmentListProps) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm lg:h-[500px] lg:overflow-y-auto">
      <div className="sticky top-0 mb-4 bg-white pb-2">
  <h2 className="text-lg font-semibold text-gray-900">
        Equipment List
      </h2>
</div>
      <div className="space-y-3">
        {equipmentList.map((item) => (
          <EquipmentItem
            equipment={item}
            key={item.id}
            isSelected={selectedEquipmentId===item.id}
            onSelect={()=>onSelectEquipment(item)}
          />
        ))}
      </div>
    </div>
  );
}

