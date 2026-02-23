import { Button } from "@/components/ui/button";
import { sidebarNavItems } from "@/lib/navigation";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-full md:w-64 p-4 md:p-8 space-y-4">
      <div className="space-y-1 border rounded-xl shadow py-[30px] px-4">
        {sidebarNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Button
              key={item.href}
              variant="ghost"
              className={`w-full justify-start ${
                isActive ? "text-white bg-primary-600" : ""
              }`}
              asChild
            >
              <Link href={item.href}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </Link>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
