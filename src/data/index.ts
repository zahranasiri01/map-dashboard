
export type EquipmentStatus= "active" | "inactive"
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

export const equipmentList:Equipment[]=[{
    id:1,name:'my',type:'truck',status:'active',origin:{latitude:120,longitude:180,address:'tehran-khaje abdollah',name:'mehran'},
    destination:{latitude:360,longitude:250,address:'qom-khaje abdollah',name:'hafez'},
    location:{latitude:180,longitude:220,address:'tehran-eslam shahr',name:'rey'},distanceTraveled:150,totalDistance:200},
    {id:2,name:'you',type:'truck',status:'active',origin:{latitude:120,longitude:180,address:'tehran-khaje abdollah',name:'mehran'},
    destination:{latitude:360,longitude:250,address:'qom-khaje abdollah',name:'hafez'},
    location:{latitude:180,longitude:220,address:'tehran-eslam shahr',name:'rey'},distanceTraveled:150,totalDistance:200},
    {id:3,name:'she',type:'truck',status:'active',origin:{latitude:120,longitude:180,address:'tehran-khaje abdollah',name:'mehran'},
    destination:{latitude:360,longitude:250,address:'qom-khaje abdollah',name:'hafez'},
    location:{latitude:180,longitude:220,address:'tehran-eslam shahr',name:'rey'},distanceTraveled:150,totalDistance:200}
]