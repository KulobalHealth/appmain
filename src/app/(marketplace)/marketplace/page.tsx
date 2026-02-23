"use client";

import { useEffect } from "react";
import Marketplace from "@/components/marketplace/products";
import { useMarketplaceStore } from "@/store/product";

export default function MarketplacePage() {
  const { fetchAllProducts } = useMarketplaceStore();
  
  useEffect(() => {
    console.log("MarketplacePage: useEffect triggered");
    console.log("MarketplacePage: fetchAllProducts function:", fetchAllProducts);
    // Load all products when the page loads
    fetchAllProducts();
  }, [fetchAllProducts]);
  
  return (
    <div className="">
      <Marketplace/>
    </div>
  );
}
