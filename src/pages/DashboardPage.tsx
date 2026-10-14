import { useState } from "react"
import EquipmentList from "../components/EquipmentList"
import { equipmentList } from "../data/mockEquipment"
import SearchBox from "../components/SearchBox"
import StatusFilter from "../components/StatusFilter"
import type {StatusFilterValue } from "../types"
import MapView from "../components/MapView"
export default function DashboardPage() {
  const [searchTerm,setSearchTerm]=useState('')
  const [statusFilter,setStatusFilter]=useState <StatusFilterValue>('all')
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<number | null>(null);
  const filterItems=equipmentList.filter((item)=>
            item.name.toLowerCase().includes(searchTerm.toLowerCase() )
            && 
            (item.status===statusFilter || statusFilter==="all")
        )

  return(
   <div className="min-h-screen bg-gray-100 px-3 py-4  sm:px-4 sm:py-6 lg:px-6">
  <div className="mx-auto w-full max-w-[1600px]">

    {/* Header */}
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900">
        Equipment Dashboard
      </h1>

      <p className="mt-1 text-sm text-gray-500">
        Monitor and track your equipment
      </p>
    </div>

    {/* Search & Filters */}
   <div className="mb-6 flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm sm:flex-row sm:items-end">
  <div className="flex-1">
    <SearchBox
      value={searchTerm}
      onChange={setSearchTerm}
    />
  </div>

  <div className="sm:w-48">
    <StatusFilter
      value={statusFilter}
      onChange={setStatusFilter}
    />
  </div>
</div>

    {/* Main Content */}
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

      {/* Equipment List */}
      <div className="lg:col-span-1">
        <EquipmentList equipmentList={filterItems}  
        selectedEquipmentId={selectedEquipmentId} 
        onSelectEquipment={(equipment)=> setSelectedEquipmentId(equipment.id)}/>
      </div>

      {/* Map */}
      <div className="lg:col-span-2">
         <MapView  mockEquipment={filterItems}
         selectedEquipmentId={selectedEquipmentId}/>
      </div>

    </div>

  </div>
</div>
   
    
    

  )
 
  
}
