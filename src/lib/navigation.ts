import {
  LayoutGrid,
  Users,
  //   Vial,
  PenSquare,
  UserCircle,
  Package,
  CreditCard,
  Bookmark,
} from "lucide-react";

export const sidebarNavItems = [
  {
    title: "Dashboard",
    icon: LayoutGrid,
    href: "/marketplace/dashboard",
  },
  {
    title: "Patients",
    icon: Users,
    href: "/marketplace/patients",
  },
  {
    title: "Rapid Test",
    // icon: Vial,
    icon: Users,
    href: "/marketplace/rapid-test",
  },
  {
    title: "DDI",
    icon: PenSquare,
    href: "/marketplace/ddi",
  },
  {
    title: "My Account",
    icon: UserCircle,
    href: "/marketplace/account",
  },
  {
    title: "Orders",
    icon: Package,
    href: "/marketplace/orders",
  },
  {
    title: "Payments",
    icon: CreditCard,
    href: "/marketplace/payments",
  },
  {
    title: "Subscriptions",
    icon: Bookmark,
    href: "/marketplace/subscriptions",
  },
];
