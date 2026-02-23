"use client";

import { useEffect } from "react";
import Marketplace from "@/components/marketplace/products";
import { useMarketplaceStore } from "@/store/product";

export default function RapidTestPage() {
  const { fetchProductsByType } = useMarketplaceStore();
  
  useEffect(() => {
    // Load rapid test kits when the page loads
    fetchProductsByType("RAPID_TEST_KITS");
  }, [fetchProductsByType]);
  
  return (
    <div className="">
      <Marketplace/>
    </div>
  );
}

