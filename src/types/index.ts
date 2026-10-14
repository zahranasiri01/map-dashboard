
export type EquipmentStatus= "active" | "inactive" 
export type StatusFilterValue= EquipmentStatus | "all"
export type EquipmentType="truck" | "van" | "machine"
export interface Location {
 latitude: number ,
longitude : number ,
address:string ,
name:string
}
export interface Equipment {
    id : number ,
    name: string ,
   type:EquipmentType,
    status : EquipmentStatus
    origin:Location ,
    destination:Location ,
    location:Location ,
    distanceTraveled:number,
    totalDistance:number
}

