import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface TableHeaderProps {
    title: string;
    text: string;
    component: React.ReactNode;
    handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClick?: () => void;
}

export default function  TableHeaderComponent ({ handleSearch , title , text, component ,}: TableHeaderProps) {
    return (
        <>
            <div className="flex justify-between items-center mb-4 flex-wrap sm:flex-nowrap">
                <div>
                    <h1 className="text-2xl font-bold">{title}</h1>
                    <small className="text-gray-500"> {text}</small>
                </div>
                {component  }
            </div>
            <div className="relative w-full max-w-md mb-4 ">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 placeholder:text-gray-400"
                    onChange={handleSearch}
                />
            </div>
        </>
    )
}
  