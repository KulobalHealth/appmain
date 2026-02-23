import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface SelectProps {
  data?: [];
  placeholder: string;
}

const SelectComponent = ({ placeholder }: SelectProps) => {
  const names = [
    "Isaac Desi Amare",
    "Mary",
    "Nasir Obel",
    "Martha",
    "Isaac",
    "James",
    "John",
    "Philip",
    "George",
  ];

  const [selected, setSelected] = useState("");

  return (
    <label className="text-sm block space-y-1">
      {placeholder}
      <Select value={selected} onValueChange={setSelected}>
        <SelectTrigger>
          <SelectValue placeholder="Select patient" />
        </SelectTrigger>
        <SelectContent className="w-72">
          <Command>
            <CommandInput placeholder="Search patient..." />
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandList>
              {names.map((name) => (
                <CommandItem
                  key={name}
                  value={name}
                  onSelect={() => setSelected(name)}
                >
                  {name}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </SelectContent>
      </Select>
    </label>
  );
};

export default SelectComponent;
