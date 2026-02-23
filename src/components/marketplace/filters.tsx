"use client";

import type React from "react";

import { ChevronDown, ChevronUp, Filter, X } from 'lucide-react';
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function FilterSection({ title, children, defaultOpen = false }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border rounded-lg p-3 md:p-4 bg-white dark:bg-background shadow-sm">
      <div
        className="flex items-center justify-between mb-2 cursor-pointer py-1 -mx-1 px-1 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
      >
        <h4 className="text-sm md:text-base font-medium">{title}</h4>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 md:h-5 md:w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-4 w-4 md:h-5 md:w-5 text-gray-500" />
        )}
      </div>

      {isOpen && (
        <div className="mt-3 space-y-2 animate-in slide-in-from-top-1 duration-200">
          {children}
        </div>
      )}
    </div>
  );
}

const filterData = [
  {
    title: "Sort By",
    type: "radio",
    options: [
      { label: "Price: High - Low", value: "high-low" },
      { label: "Price: Low - High", value: "low-high" },
      { label: "Newest First", value: "newest" },
      { label: "Most Popular", value: "popular" },
    ],
  },
  {
    title: "Price Range (GHC)",
    type: "radio",
    options: [
      { label: "₵0 - ₵100", value: "0-100" },
      { label: "₵100 - ₵200", value: "100-200" },
      { label: "₵200 - ₵300", value: "200-300" },
      { label: "₵300 - ₵400", value: "300-400" },
      { label: "₵400 - ₵500", value: "400-500" },
      { label: "₵500+", value: "500+" },
    ],
    customInputs: true,
  },
  {
    title: "Category",
    type: "checkbox",
    options: [
      "Testing Kits",
      "Vaccines",
      "Antibiotics",
      "Vital Monitoring Devices",
      "Diagnostic Tools",
      "Medications",
      "Sanitation & PPE",
      "Emergency Equipment",
      "Medical Consumables",
      "Rehabilitation Tools",
      "Wearable Tech",
      "First Aid Supplies",
      "Telehealth Devices",
    ].map((label) => ({ label, value: label })),
  },
  {
    title: "Brand",
    type: "checkbox",
    options: [
      "Abbott",
      "Roche Diagnostics",
      "Bio-Rad",
      "Quidel Technologies",
      "Moderna",
      "Johnson & Johnson",
      "Amphaster",
      "Emergent BioSolutions",
      "Garmin",
      "Dexcom",
    ].map((label) => ({ label, value: label })),
  },
];

interface FiltersState {
  selectedCategories: string[];
  selectedBrands: string[];
  selectedPriceRange: string;
  minPrice: string | number;
  maxPrice: string | number;
  sortBy: string;
}

interface MarketplaceFiltersProps {
  onFiltersChange?: (filters: FiltersState) => void;
  initialFilters?: FiltersState;
}

export function MarketplaceFilters({ onFiltersChange }: MarketplaceFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const FiltersContent = () => (
    <div className="space-y-3 md:space-y-4">
      <div className="flex items-center justify-between lg:hidden">
        <h3 className="font-semibold text-lg md:text-xl">Filters</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(false)}
          className="lg:hidden"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="hidden lg:block">
        <h3 className="font-semibold text-xl xl:text-2xl mb-4">Filters</h3>
      </div>

      {filterData.map(({ title, type, options, customInputs }) => (
        <FilterSection
          key={title}
          title={title}
          defaultOpen={title === "Sort By"}
        >
          {customInputs && (
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1">
                <Input 
                  type="number" 
                  placeholder="Min" 
                  className="w-full text-sm h-9 md:h-10" 
                  min="0"
                />
              </div>
              <span className="text-gray-500 text-sm">to</span>
              <div className="flex-1">
                <Input 
                  type="number" 
                  placeholder="Max" 
                  className="w-full text-sm h-9 md:h-10" 
                  min="0"
                />
              </div>
            </div>
          )}
          
          <div className="space-y-2.5 md:space-y-3">
            {type === "radio" ? (
              <RadioGroup defaultValue={options[0].value} className="space-y-2">
                {options.map(({ label, value }) => (
                  <div className="flex items-center space-x-3 py-1" key={value}>
                    <RadioGroupItem 
                      value={value} 
                      id={value} 
                      className="h-4 w-4 md:h-5 md:w-5" 
                    />
                    <Label 
                      htmlFor={value} 
                      className="text-sm md:text-base cursor-pointer flex-1 leading-relaxed"
                    >
                      {label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            ) : (
              <div className="space-y-2">
                {options.map(({ label, value }) => (
                  <div className="flex items-center space-x-3 py-1" key={value}>
                    <Checkbox 
                      id={value} 
                      value={value} 
                      className="h-4 w-4 md:h-5 md:w-5" 
                    />
                    <Label 
                      htmlFor={value} 
                      className="text-sm md:text-base cursor-pointer flex-1 leading-relaxed"
                    >
                      {label}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </FilterSection>
      ))}

      {/* Clear Filters Button */}
      <div className="pt-4 border-t">
        <Button 
          variant="outline" 
          className="w-full text-sm md:text-base py-2 md:py-3"
          onClick={() => {
            // Clear all filters logic here
            onFiltersChange?.({
              selectedCategories: [],
              selectedBrands: [],
              selectedPriceRange: "",
              minPrice: "",
              maxPrice: "",
              sortBy: "default",
            });
          }}
        >
          Clear All Filters
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full justify-center gap-2 py-3">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full sm:w-80 p-4 overflow-y-auto">
            <SheetHeader className="sr-only">
              <SheetTitle>Product Filters</SheetTitle>
            </SheetHeader>
            <FiltersContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Filters Sidebar */}
      <div className="hidden lg:block lg:w-64 xl:w-72">
        <div className="sticky top-4">
          <FiltersContent />
        </div>
      </div>
    </>
  );
}

export default MarketplaceFilters;