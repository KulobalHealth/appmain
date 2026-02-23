'use client';

import Footer from '@/components/footer';
import { Navbar } from '@/components/navbar';

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="flex min-h-screen flex-col py-8">
      <header>
        <Navbar />
      </header>


        <main className=" min-h-screen flex-1">{children}</main>
  
      <Footer />
    </div>
  );
}
