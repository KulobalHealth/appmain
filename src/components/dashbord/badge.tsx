import { Badge } from "@/components/ui/badge"

export function AppBadge({type}: {type: string}) {
switch (type) {
    case "Full Payment":
    case "Delivered":
    case "Completed": 
    case "Elevated":   
        return <Badge className="text-green-400 bg-green-100 ">{type}</Badge>
    case "Credit":
    case "Shipped":  
    case "BorderLine High":
        return <Badge className="bg-orange-100 text-red-400">{type}</Badge>
    case "Processing":
        return <Badge  className="text-gray-400 bg-gray-300">{type}</Badge>
    case "Active":
    case "Normal":   
        return <Badge className="text-white bg-black">{type}</Badge>

    case "High":
        return <Badge className="text-red-500 bg-red-100">{type}</Badge>
    default:
        return <Badge>Default</Badge>
}
}
